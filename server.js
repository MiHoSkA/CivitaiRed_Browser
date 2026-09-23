'use strict';
const http=require('http');
const fs=require('fs');
const path=require('path');
const dns=require('dns');
const {Readable}=require('stream');
try{dns.setDefaultResultOrder('ipv4first')}catch{}
const APP_VERSION='1.3.1';
const ROOT=__dirname;
const DATA=path.join(ROOT,'data');
const PUBLIC=path.join(ROOT,'public');
const ENV_FILE=path.join(ROOT,'.env');
function loadEnv(){
  if(!fs.existsSync(ENV_FILE))return;
  for(const raw of fs.readFileSync(ENV_FILE,'utf8').split(/\r?\n/)){
    const line=raw.trim();
    if(!line||line.startsWith('#'))continue;
    const i=line.indexOf('=');
    if(i<1)continue;
    const key=line.slice(0,i).trim();
    const value=line.slice(i+1).trim();
    if(process.env[key]===undefined)process.env[key]=value;
  }
}
loadEnv();
const PORT=Number(process.env.PORT||3210);
const HOST=process.env.HOST||'127.0.0.1';
const API_BASE=(process.env.CIVITAI_API_BASE||'https://civitai.red').replace(/\/$/,'');
const API_FALLBACK=(process.env.CIVITAI_API_FALLBACK||'https://civitai.com').replace(/\/$/,'');
const TIMEOUT=Math.max(3000,Number(process.env.REQUEST_TIMEOUT_MS||20000));
const RETRY_COUNT=Math.min(3,Math.max(0,Number(process.env.CIVITAI_RETRY_COUNT||1)));
const RETRY_BASE_MS=Math.min(10000,Math.max(250,Number(process.env.CIVITAI_RETRY_BASE_MS||1200)));
const SEARCH_MIN_LENGTH=Math.min(10,Math.max(1,Number(process.env.SEARCH_MIN_LENGTH||2)));
const REMOTE_SEARCH_MIN_LENGTH=Math.min(20,Math.max(SEARCH_MIN_LENGTH,Number(process.env.REMOTE_SEARCH_MIN_LENGTH||3)));
const FALLBACK_SEARCH_SCAN_PAGES=Math.min(10,Math.max(1,Number(process.env.FALLBACK_SEARCH_SCAN_PAGES||5)));
const FALLBACK_SEARCH_CACHE_MS=Math.min(600000,Math.max(15000,Number(process.env.FALLBACK_SEARCH_CACHE_MS||120000)));
const CACHE_TTL_MS=Math.min(120000,Math.max(0,Number(process.env.API_CACHE_TTL_MS||10000)));
const STALE_CACHE_MS=Math.min(3600000,Math.max(CACHE_TTL_MS,Number(process.env.API_STALE_CACHE_MS||600000)));
const MODEL_DETAIL_CACHE_MS=Math.min(3600000,Math.max(30000,Number(process.env.MODEL_DETAIL_CACHE_MS||300000)));
const DEBUG=String(process.env.DEBUG||'true').toLowerCase()==='true';
const MAX_API_CACHE_BYTES=24*1024*1024;
const MAX_API_CACHE_ENTRIES=64;
const MAX_FALLBACK_CACHES=8;
const apiCache=new Map();
const fallbackSearchCache=new Map();
const inflight=new Map();
let apiCacheBytes=0;
const serverText={
  ru:{
    searchTooShort:n=>`Для поиска введи минимум ${n} символа.`,
    settingsSave:e=>`Не удалось сохранить настройки: ${e}`,
    overloaded:'Поиск Civitai временно перегружен.',
    limited:'Civitai временно ограничил частоту запросов.',
    timeout:'Civitai не ответил вовремя',
    connection:c=>`Ошибка связи с Civitai${c?` (${c})`:''}`,
    modelHttp:s=>`Civitai вернул HTTP ${s}`,
    modelFailed:c=>`Не удалось получить модель${c?` (${c})`:''}`,
    invalidId:'Некорректный ID',
    favoriteMissing:'Не удалось сохранить модель: данные карточки отсутствуют',
    favoritePrepare:'Не удалось подготовить компактную запись избранного',
    downloadHttp:s=>`Civitai вернул HTTP ${s}`,
    downloadFailed:c=>`Ошибка загрузки файла${c?` (${c})`:''}`,
    apiNotFound:'API endpoint не найден',
    internal:'Внутренняя ошибка сервера'
  },
  en:{
    searchTooShort:n=>`Enter at least ${n} characters to search.`,
    settingsSave:e=>`Failed to save settings: ${e}`,
    overloaded:'Civitai search is temporarily overloaded.',
    limited:'Civitai temporarily rate-limited requests.',
    timeout:'Civitai did not respond in time',
    connection:c=>`Civitai connection error${c?` (${c})`:''}`,
    modelHttp:s=>`Civitai returned HTTP ${s}`,
    modelFailed:c=>`Failed to load the model${c?` (${c})`:''}`,
    invalidId:'Invalid ID',
    favoriteMissing:'Cannot save the model: card data is missing',
    favoritePrepare:'Failed to prepare the compact favorite record',
    downloadHttp:s=>`Civitai returned HTTP ${s}`,
    downloadFailed:c=>`File download failed${c?` (${c})`:''}`,
    apiNotFound:'API endpoint not found',
    internal:'Internal server error'
  }
};
const log=(level,message,meta={})=>{
  const kind=String(level||'').toLowerCase();
  if(kind!=='warn'&&kind!=='error')return;
  console.warn(`[WARN] ${message}${Object.keys(meta).length?' '+JSON.stringify(meta):''}`);
};
const ready=()=>console.log(`[READY] Civitai Red Browser v${APP_VERSION} running at http://${HOST}:${PORT}`);
const writeJson=(name,data)=>{
  fs.mkdirSync(DATA,{recursive:true});
  const file=path.join(DATA,name);
  const tmp=`${file}.tmp`;
  fs.writeFileSync(tmp,JSON.stringify(data,null,2)+'\n','utf8');
  fs.renameSync(tmp,file);
};
const ensureJson=(name,fallback)=>{const file=path.join(DATA,name);if(!fs.existsSync(file))writeJson(name,fallback);return file};
const readJson=(name,fallback)=>{try{return JSON.parse(fs.readFileSync(ensureJson(name,fallback),'utf8'))}catch(error){log('error','JSON read failed',{name,error:error.message});return fallback}};
const token=()=>process.env.CIVITAI_API_TOKEN||'';
const maskToken=value=>value?`${value.slice(0,4)}••••••${value.slice(-4)}`:'';
const status=()=>({ok:true,version:APP_VERSION,host:HOST,apiBase:API_BASE,apiFallback:API_FALLBACK,apiTokenConfigured:!!token(),apiTokenPersistent:true,apiTokenStorage:'.env',maskedToken:maskToken(token()),retryCount:RETRY_COUNT,searchMinLength:SEARCH_MIN_LENGTH,remoteSearchMinLength:REMOTE_SEARCH_MIN_LENGTH,cacheTtlMs:CACHE_TTL_MS,modelDetailCacheMs:MODEL_DETAIL_CACHE_MS,time:new Date().toISOString()});
function requestLanguage(req){
  const header=String(req.headers['x-ui-language']||'').toLowerCase();
  if(header==='en'||header==='ru')return header;
  const saved=String(readJson('settings.json',{}).language||'ru').toLowerCase();
  return saved==='en'?'en':'ru';
}
function message(req,key,...args){
  const table=serverText[requestLanguage(req)]||serverText.ru;
  const value=table[key]??serverText.ru[key]??key;
  return typeof value==='function'?value(...args):value;
}
function mediaSummary(media){
  if(!media||typeof media!=='object')return null;
  const url=String(media.url||media.src||'').trim();
  if(!url)return null;
  const rawType=String(media.type||media.mimeType||media.meta?.type||'').toLowerCase();
  const clean=url.split('?')[0].toLowerCase();
  const isVideo=rawType.includes('video')||/\.(mp4|webm|mov|m4v|m3u8)$/.test(clean)||/\b(transcode|video)=true\b/i.test(url);
  const poster=media.meta?.thumbnailUrl||media.thumbnailUrl||media.poster||'';
  return {
    url,
    type:isVideo?'video':'image',
    ...(poster?{poster:String(poster)}:{}),
    ...(Number(media.width)>0?{width:Number(media.width)}:{}),
    ...(Number(media.height)>0?{height:Number(media.height)}:{})
  };
}
function pickFavoritePreview(model){
  if(model?.preview?.url)return mediaSummary(model.preview);
  for(const version of model?.modelVersions||[]){
    for(const media of version?.images||[]){
      const preview=mediaSummary(media);
      if(preview)return preview;
    }
  }
  return null;
}
function baseModelsFor(model){
  const values=[];
  for(const value of model?.baseModels||[])if(String(value||'').trim())values.push(String(value).trim());
  for(const version of model?.modelVersions||[]){
    const value=String(version?.baseModel||'').trim();
    if(value&&!values.includes(value))values.push(value);
  }
  if(model?.baseModel&&!values.includes(String(model.baseModel)))values.unshift(String(model.baseModel));
  return values.slice(0,4);
}
function compactCatalogModel(model){
  if(!model||typeof model!=='object')return null;
  const id=Number(model.id);
  if(!Number.isFinite(id))return null;
  const bases=baseModelsFor(model);
  const preview=pickFavoritePreview(model);
  const username=String(model.creator?.username||model.author||'').trim();
  const downloadCount=Number(model.stats?.downloadCount??model.downloads);
  const favoriteCount=Number(model.stats?.favoriteCount);
  const thumbsUpCount=Number(model.stats?.thumbsUpCount??model.likes);
  const stats={};
  if(Number.isFinite(downloadCount))stats.downloadCount=downloadCount;
  if(Number.isFinite(favoriteCount))stats.favoriteCount=favoriteCount;
  if(Number.isFinite(thumbsUpCount))stats.thumbsUpCount=thumbsUpCount;
  return {
    id,
    name:String(model.name||`Model ${id}`),
    type:String(model.type||'Model'),
    ...(bases.length?{baseModels:bases}:{}),
    ...(username?{creator:{username}}:{}),
    ...(Object.keys(stats).length?{stats}:{}),
    ...(preview?{preview}:{})
  };
}
function compactFavorite(model,idOverride=null,savedAtOverride=null){
  const compact=compactCatalogModel({...model,id:idOverride??model?.id});
  if(!compact)return null;
  const preview=compact.preview||pickFavoritePreview(model);
  const baseModel=compact.baseModels?.[0]||'';
  const author=compact.creator?.username||'';
  const downloads=Number(compact.stats?.downloadCount);
  const likes=Number(compact.stats?.favoriteCount??compact.stats?.thumbsUpCount);
  return {
    id:compact.id,
    name:compact.name,
    type:compact.type,
    ...(baseModel?{baseModel}:{}),
    ...(author?{author}:{}),
    ...(preview?{preview}:{}),
    ...(Number.isFinite(downloads)?{downloads}:{}),
    ...(Number.isFinite(likes)?{likes}:{}),
    savedAt:String(savedAtOverride||model?.savedAt||new Date().toISOString())
  };
}
function loadFavorites({persistMigration=true}={}){
  const raw=readJson('favorites.json',{items:[]});
  const source=Array.isArray(raw?.items)?raw.items:[];
  const items=source.map(item=>compactFavorite(item,item?.id,item?.savedAt)).filter(Boolean).slice(0,1000);
  const db={items};
  if(persistMigration){
    try{if(JSON.stringify(raw)!==JSON.stringify(db))writeJson('favorites.json',db)}catch(error){log('warn','favorites.json migration failed',{error:error.message})}
  }
  return db;
}
function compactCatalogBody(body){
  try{
    const data=JSON.parse(body);
    if(!Array.isArray(data?.items))return body;
    data.items=data.items.map(compactCatalogModel).filter(Boolean);
    return JSON.stringify(data);
  }catch{return body}
}
function plainDescription(value){return String(value||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'\"').replace(/&#39;/gi,"'").replace(/\s+/g,' ').trim().slice(0,4000)}
function compactModelDetailBody(body){
  try{
    const model=JSON.parse(body);
    let mediaLeft=12;
    const versions=(model.modelVersions||[]).map(version=>{
      const files=(version.files||[]).map(file=>({
        id:file.id,
        name:file.name,
        sizeKB:file.sizeKB,
        ...(file.metadata?.format?{metadata:{format:file.metadata.format}}:{})
      }));
      const images=[];
      if(mediaLeft>0){
        for(const item of version.images||[]){
          if(mediaLeft<=0)break;
          const media=mediaSummary(item);
          if(media){images.push(media);mediaLeft--}
        }
      }
      return {
        id:version.id,
        name:version.name,
        baseModel:version.baseModel,
        publishedAt:version.publishedAt,
        files,
        images
      };
    });
    return JSON.stringify({
      id:model.id,
      name:model.name,
      type:model.type,
      description:plainDescription(model.description),
      creator:model.creator?.username?{username:model.creator.username}:null,
      modelVersions:versions
    });
  }catch{return body}
}
function writeEnvToken(value){
  const clean=String(value).replace(/\r?\n/g,'').trim();
  if(!clean)return false;
  const raw=fs.existsSync(ENV_FILE)?fs.readFileSync(ENV_FILE,'utf8'):'';
  const line=`CIVITAI_API_TOKEN=${clean}`;
  const next=/^CIVITAI_API_TOKEN=.*$/m.test(raw)?raw.replace(/^CIVITAI_API_TOKEN=.*$/m,line):`${raw.trimEnd()}\n${line}\n`;
  const tmp=`${ENV_FILE}.tmp`;
  fs.writeFileSync(tmp,next,'utf8');
  try{fs.chmodSync(tmp,0o600)}catch{}
  fs.renameSync(tmp,ENV_FILE);
  try{fs.chmodSync(ENV_FILE,0o600)}catch{}
  process.env.CIVITAI_API_TOKEN=clean;
  return true;
}
function apiHeaders(binary=false,useAuth=false){
  const headers={'Accept':binary?'application/octet-stream':'application/json','User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36','Referer':'https://civitai.red/'};
  if(useAuth&&token())headers.Authorization=`Bearer ${token()}`;
  return headers;
}
function errorInfo(error){
  const cause=error?.cause||null;
  return {name:error?.name||'Error',message:error?.message||String(error),code:cause?.code||error?.code||null,errno:cause?.errno||error?.errno||null,syscall:cause?.syscall||error?.syscall||null,hostname:cause?.hostname||error?.hostname||null,cause:cause?.message||null};
}
function isRetryableStatus(status){return [408,425,429,500,502,503,504,520,521,522,523,524].includes(Number(status))}
function buildFallbackUrl(url){
  try{
    const current=new URL(url);
    const primary=new URL(API_BASE);
    if(current.origin!==primary.origin||!API_FALLBACK||API_FALLBACK===API_BASE)return null;
    const fallback=new URL(API_FALLBACK);
    fallback.pathname=current.pathname;
    fallback.search=current.search;
    return fallback.toString();
  }catch{return null}
}
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function retryAfterMs(response,attempt){
  const raw=response?.headers?.get?.('retry-after');
  if(raw){
    const seconds=Number(raw);
    if(Number.isFinite(seconds))return Math.min(15000,Math.max(250,seconds*1000));
    const date=Date.parse(raw);
    if(Number.isFinite(date))return Math.min(15000,Math.max(250,date-Date.now()));
  }
  return Math.min(8000,RETRY_BASE_MS*Math.pow(2,attempt));
}
async function fetchOnce(url,{binary=false,useAuth=false}={}){
  const ctl=new AbortController();
  const timer=setTimeout(()=>ctl.abort(),TIMEOUT);
  try{return await fetch(url,{headers:apiHeaders(binary,useAuth),signal:ctl.signal,redirect:'follow'})}finally{clearTimeout(timer)}
}
async function retryEndpoint(url,options={},label='Civitai'){
  let response;
  for(let attempt=0;attempt<=RETRY_COUNT;attempt++){
    response=await fetchOnce(url,options);
    if(!isRetryableStatus(response.status)||attempt>=RETRY_COUNT)return response;
    const wait=retryAfterMs(response,attempt);
    log('warn','Civitai endpoint temporarily unavailable; retry scheduled',{endpoint:label,status:response.status,attempt:attempt+1,maxRetries:RETRY_COUNT,waitMs:wait});
    try{await response.arrayBuffer()}catch{}
    await sleep(wait);
  }
  return response;
}
async function civFetch(url,options={}){
  const binary=!!options.binary;
  const useAuth=!!options.useAuth;
  const fallbackUrl=buildFallbackUrl(url);
  let primaryResponse=null;
  try{
    primaryResponse=await fetchOnce(url,{binary,useAuth});
    if(!fallbackUrl||!isRetryableStatus(primaryResponse.status))return primaryResponse;
    log('warn','Primary Civitai endpoint returned retryable status',{status:primaryResponse.status});
  }catch(primaryError){
    log('warn','Primary Civitai network error',errorInfo(primaryError));
    if(!fallbackUrl)throw primaryError;
  }
  try{
    const fallbackResponse=await retryEndpoint(fallbackUrl,{binary,useAuth},'fallback');
    if(!fallbackResponse.ok)log('warn','Civitai fallback endpoint returned an error',{status:fallbackResponse.status});
    return fallbackResponse.ok||!primaryResponse?fallbackResponse:fallbackResponse;
  }catch(fallbackError){
    const info=errorInfo(fallbackError);
    log('error','Civitai fallback network error',info);
    if(primaryResponse)return primaryResponse;
    const combined=new Error(`Primary and fallback Civitai endpoints are unavailable (${info.code||info.message})`);
    combined.name=fallbackError.name||'TypeError';
    combined.cause=fallbackError.cause||fallbackError;
    throw combined;
  }
}
async function civFetchFallback(url,options={}){
  const fallbackUrl=buildFallbackUrl(url);
  if(!fallbackUrl)return civFetch(url,options);
  return retryEndpoint(fallbackUrl,{binary:!!options.binary,useAuth:!!options.useAuth},'forced-fallback');
}
function removeCacheEntry(key){
  const hit=apiCache.get(key);
  if(!hit)return;
  apiCacheBytes=Math.max(0,apiCacheBytes-hit.size);
  apiCache.delete(key);
}
function cacheGet(key,maxAge=CACHE_TTL_MS){
  const hit=apiCache.get(key);
  if(!hit||Date.now()-hit.time>maxAge)return null;
  apiCache.delete(key);
  apiCache.set(key,hit);
  return hit;
}
function cacheSet(key,body){
  const value=String(body||'');
  const size=Buffer.byteLength(value);
  if(size>MAX_API_CACHE_BYTES/2)return;
  removeCacheEntry(key);
  apiCache.set(key,{body:value,time:Date.now(),size});
  apiCacheBytes+=size;
  while(apiCache.size>MAX_API_CACHE_ENTRIES||apiCacheBytes>MAX_API_CACHE_BYTES){
    const oldest=apiCache.keys().next().value;
    if(oldest===undefined)break;
    removeCacheEntry(oldest);
  }
}
function normalizeSearchText(value=''){return String(value).toLocaleLowerCase('en-US').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim()}
function modelSearchScore(model,needle){
  const name=normalizeSearchText(model?.name);
  const creator=normalizeSearchText(model?.creator?.username);
  const tags=(model?.tags||[]).map(normalizeSearchText).join(' ');
  const versions=(model?.modelVersions||[]).map(version=>`${normalizeSearchText(version?.name)} ${normalizeSearchText(version?.baseModel)}`).join(' ');
  if(!needle)return 0;
  let score=0;
  if(name===needle)score+=1000;else if(name.startsWith(needle))score+=500;else if(name.includes(needle))score+=250;
  if(creator===needle)score+=200;else if(creator.includes(needle))score+=90;
  if(tags.includes(needle))score+=60;
  if(versions.includes(needle))score+=30;
  return score;
}
function fallbackSearchKey(query){const value=new URLSearchParams(query);value.delete('cursor');value.delete('page');value.delete('limit');return `fallback-search:${value.toString()}`}
function localCursorOffset(value){const match=String(value||'').match(/^local:(\d+)$/);return match?Math.max(0,Number(match[1])||0):0}
async function buildFallbackSearch(query,reason='upstream-overloaded'){
  const search=(query.get('query')||'').trim();
  const needle=normalizeSearchText(search);
  const limit=Math.min(100,Math.max(1,Number(query.get('limit')||24)));
  const offset=localCursorOffset(query.get('cursor'));
  const key=fallbackSearchKey(query);
  let cached=fallbackSearchCache.get(key);
  if(!cached||Date.now()-cached.time>FALLBACK_SEARCH_CACHE_MS){
    const scanParams=new URLSearchParams(query);
    scanParams.delete('query');scanParams.delete('cursor');scanParams.delete('page');scanParams.set('limit','100');
    const found=new Map();
    let cursor='';
    let scanned=0;
    let pages=0;
    for(let page=0;page<FALLBACK_SEARCH_SCAN_PAGES;page++){
      if(cursor)scanParams.set('cursor',cursor);else scanParams.delete('cursor');
      const response=await civFetch(`${API_BASE}/api/v1/models?${scanParams}`,{useAuth:false});
      const body=await response.text();
      if(!response.ok){log('warn','Fallback catalog scan stopped',{status:response.status,page:page+1});break}
      let data;
      try{data=JSON.parse(body)}catch{break}
      pages++;
      const items=Array.isArray(data?.items)?data.items:[];
      scanned+=items.length;
      for(const model of items){
        const score=modelSearchScore(model,needle);
        if(score>0&&!found.has(model.id))found.set(model.id,{model:compactCatalogModel(model),score,order:scanned});
      }
      cursor=String(data?.metadata?.nextCursor||'');
      if(!cursor||items.length===0)break;
    }
    const matches=[...found.values()].filter(item=>item.model).sort((a,b)=>b.score-a.score||a.order-b.order).map(item=>item.model);
    cached={time:Date.now(),items:matches,scanned,pages};
    fallbackSearchCache.delete(key);
    fallbackSearchCache.set(key,cached);
    while(fallbackSearchCache.size>MAX_FALLBACK_CACHES)fallbackSearchCache.delete(fallbackSearchCache.keys().next().value);
  }
  const items=cached.items.slice(offset,offset+limit);
  const nextOffset=offset+items.length;
  return {items,metadata:{nextCursor:nextOffset<cached.items.length?`local:${nextOffset}`:null,nextPage:null,totalItems:cached.items.length,pageSize:limit,searchFallback:true,fallbackReason:reason,scannedItems:cached.scanned,scannedPages:cached.pages,fallbackLimited:cached.pages>=FALLBACK_SEARCH_SCAN_PAGES}};
}
function upstreamMessage(body,statusCode){
  try{
    const data=JSON.parse(body);
    if(typeof data?.error==='string')return data.error;
    if(typeof data?.message==='string')return data.message;
    if(typeof data?.error?.message==='string')return data.error.message;
  }catch{}
  return `Civitai HTTP ${statusCode}`;
}
function json(res,code,data){const body=JSON.stringify(data);res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Content-Length':Buffer.byteLength(body),'Cache-Control':'no-store'});res.end(body)}
function text(res,code,body,type='text/plain; charset=utf-8'){res.writeHead(code,{'Content-Type':type,'Content-Length':Buffer.byteLength(body)});res.end(body)}
function readBody(req,limit=262144){
  return new Promise((resolve,reject)=>{
    let size=0;
    let buffer='';
    req.on('data',chunk=>{size+=chunk.length;if(size>limit){reject(new Error('body too large'));return}buffer+=chunk});
    req.on('end',()=>{try{resolve(buffer?JSON.parse(buffer):{})}catch{reject(new Error('invalid json'))}});
    req.on('error',reject);
  });
}
function safeFile(urlPath){
  let relative=decodeURIComponent(urlPath.split('?')[0]);
  if(relative==='/')relative='/index.html';
  const full=path.resolve(PUBLIC,`.${relative}`);
  return full===PUBLIC||full.startsWith(`${PUBLIC}${path.sep}`)?full:null;
}
function mime(file){const ext=path.extname(file).toLowerCase();return ({'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'}[ext]||'application/octet-stream')}
function sanitizeQuery(params){
  const allow=new Set(['limit','page','cursor','query','ids','tag','username','types','baseModels','checkpointType','sort','period','nsfw','supportsGeneration','fromPlatform','earlyAccess','primaryFileOnly','favorites','hidden']);
  const out=new URLSearchParams();
  for(const [key,value] of params.entries())if(allow.has(key)&&value.length<300)out.append(key,value);
  if(!out.has('nsfw'))out.set('nsfw','true');
  if(out.has('query')&&out.has('page')){out.delete('page');if(DEBUG)log('warn','Ignoring page for text search because cursor pagination is required')}
  if(params.has('browsingLevel')&&DEBUG)log('warn','Ignoring obsolete browsingLevel query parameter',{value:params.get('browsingLevel')});
  return out;
}
async function handleApi(req,res,url){
  if(req.method==='GET'&&url.pathname==='/api/status')return json(res,200,status());
  if(req.method==='GET'&&url.pathname==='/api/settings')return json(res,200,readJson('settings.json',{}));
  if(req.method==='POST'&&url.pathname==='/api/settings'){
    try{
      const body=await readBody(req);
      const current=readJson('settings.json',{});
      const next={...current};
      if(Number.isFinite(body.pageSize))next.pageSize=Math.min(100,Math.max(1,body.pageSize));
      if(typeof body.defaultType==='string')next.defaultType=body.defaultType.slice(0,80);
      if(typeof body.defaultBaseModel==='string')next.defaultBaseModel=body.defaultBaseModel.slice(0,120);
      if(typeof body.defaultSort==='string'&&['Highest Rated','Most Downloaded','Newest'].includes(body.defaultSort))next.defaultSort=body.defaultSort;
      if(typeof body.defaultPeriod==='string'&&['AllTime','Year','Month','Week','Day'].includes(body.defaultPeriod))next.defaultPeriod=body.defaultPeriod;
      if(typeof body.language==='string'&&['ru','en'].includes(body.language))next.language=body.language;
      delete next.liveRefresh;delete next.liveRefreshMs;
      writeJson('settings.json',next);
      if(typeof body.apiToken==='string'&&body.apiToken.trim())writeEnvToken(body.apiToken);
      return json(res,200,{settings:next,status:status()});
    }catch(error){return json(res,400,{error:message(req,'settingsSave',error.message),code:'SETTINGS_SAVE_FAILED'})}
  }
  if(req.method==='GET'&&url.pathname==='/api/models'){
    try{
      const forceFallback=url.searchParams.get('_source')==='fallback';
      const query=sanitizeQuery(url.searchParams);
      const search=(query.get('query')||'').trim();
      if(search&&search.length<SEARCH_MIN_LENGTH)return json(res,400,{error:message(req,'searchTooShort',SEARCH_MIN_LENGTH),code:'SEARCH_TOO_SHORT'});
      if(search)query.set('query',search);
      if(search&&(search.length<REMOTE_SEARCH_MIN_LENGTH||String(query.get('cursor')||'').startsWith('local:'))){
        const data=await buildFallbackSearch(query,search.length<REMOTE_SEARCH_MIN_LENGTH?'short-query':'local-cursor');
        res.setHeader('X-Civitai-Search-Mode','local-fallback');
        return json(res,200,data);
      }
      const upstreamUrl=`${API_BASE}/api/v1/models?${query}`;
      const cacheKey=`models:${forceFallback?'fallback':'auto'}:${query.toString()}`;
      const fresh=cacheGet(cacheKey);
      if(fresh){res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Civitai-Proxy-Cache':'fresh','X-Civitai-Proxy-Source':forceFallback?'fallback':'auto'});return res.end(fresh.body)}
      const requiresAuth=query.has('favorites')||query.has('hidden');
      let job=inflight.get(cacheKey);
      if(!job){
        job=(async()=>{
          const fetchPage=useAuth=>forceFallback?civFetchFallback(upstreamUrl,{useAuth}):civFetch(upstreamUrl,{useAuth});
          let response=await fetchPage(requiresAuth);
          if((response.status===401||response.status===403)&&!requiresAuth&&token())response=await fetchPage(true);
          const body=await response.text();
          return {response,body};
        })().finally(()=>inflight.delete(cacheKey));
        inflight.set(cacheKey,job);
      }
      const {response,body}=await job;
      if(!response.ok){
        const stale=cacheGet(cacheKey,STALE_CACHE_MS);
        if(stale&&isRetryableStatus(response.status)){
          log('warn','Serving stale model catalog cache',{status:response.status,cacheAgeMs:Date.now()-stale.time});
          res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Civitai-Proxy-Cache':'stale','X-Civitai-Upstream-Status':String(response.status),'X-Civitai-Proxy-Source':forceFallback?'fallback':'auto'});
          return res.end(stale.body);
        }
        const upstream=upstreamMessage(body,response.status);
        log('warn','Civitai models error',{status:response.status,body:body.slice(0,240)});
        if(search&&isRetryableStatus(response.status)){
          try{
            const data=await buildFallbackSearch(query,`http-${response.status}`);
            res.setHeader('X-Civitai-Upstream-Status',String(response.status));
            res.setHeader('X-Civitai-Search-Mode','local-fallback');
            return json(res,200,data);
          }catch(fallbackError){log('error','Local fallback search failed',errorInfo(fallbackError))}
        }
        const friendly=response.status===503?message(req,'overloaded'):response.status===429?message(req,'limited'):upstream;
        return json(res,response.status,{error:friendly,upstream:DEBUG?upstream:undefined,retryable:isRetryableStatus(response.status)});
      }
      const compactBody=compactCatalogBody(body);
      cacheSet(cacheKey,compactBody);
      res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Civitai-Proxy-Cache':'miss','X-Civitai-Proxy-Source':forceFallback?'fallback':'auto'});
      return res.end(compactBody);
    }catch(error){
      const info=errorInfo(error);
      log('error','Models proxy failed',info);
      const timeout=error.name==='AbortError'||info.code==='UND_ERR_CONNECT_TIMEOUT';
      return json(res,timeout?504:502,{error:timeout?message(req,'timeout'):message(req,'connection',info.code),detail:DEBUG?info:undefined});
    }
  }
  const modelMatch=url.pathname.match(/^\/api\/models\/(\d+)$/);
  if(req.method==='GET'&&modelMatch){
    const modelId=modelMatch[1];
    const cacheKey=`model-detail:${modelId}`;
    try{
      const cached=cacheGet(cacheKey,MODEL_DETAIL_CACHE_MS);
      if(cached){res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, max-age=60','X-Local-Cache':'HIT'});return res.end(cached.body)}
      const response=await civFetch(`${API_BASE}/api/v1/models/${modelId}`);
      const body=await response.text();
      if(!response.ok)return json(res,response.status,{error:message(req,'modelHttp',response.status)});
      const compactBody=compactModelDetailBody(body);
      cacheSet(cacheKey,compactBody);
      res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, max-age=60','X-Local-Cache':'MISS'});
      return res.end(compactBody);
    }catch(error){
      const info=errorInfo(error);
      log('error','Model proxy failed',{modelId,...info});
      return json(res,502,{error:message(req,'modelFailed',info.code),detail:DEBUG?info:undefined});
    }
  }
  if(req.method==='GET'&&url.pathname==='/api/favorites')return json(res,200,loadFavorites());
  if(req.method==='POST'&&url.pathname==='/api/favorites'){
    try{
      const body=await readBody(req);
      const id=Number(body.modelId);
      if(!Number.isFinite(id))return json(res,400,{error:message(req,'invalidId')});
      const db=loadFavorites();
      const exists=db.items.some(item=>Number(item.id)===id);
      if(exists)db.items=db.items.filter(item=>Number(item.id)!==id);
      else{
        const model=body.model&&typeof body.model==='object'?body.model:null;
        if(!model)return json(res,400,{error:message(req,'favoriteMissing')});
        const compact=compactFavorite(model,id,new Date().toISOString());
        if(!compact)return json(res,400,{error:message(req,'favoritePrepare')});
        db.items=[compact,...db.items].slice(0,1000);
      }
      writeJson('favorites.json',db);
      return json(res,200,db);
    }catch(error){return json(res,400,{error:error.message})}
  }
  const download=url.pathname.match(/^\/api\/download\/(\d+)$/);
  if(req.method==='GET'&&download){
    const versionId=download[1];
    const fileId=url.searchParams.get('fileId')||'';
    const query=new URLSearchParams();
    if(/^\d+$/.test(fileId))query.set('fileId',fileId);
    const upstream=`${API_BASE}/api/download/models/${versionId}${query.size?`?${query}`:''}`;
    try{
      const response=await civFetch(upstream,{binary:true,useAuth:true});
      if(!response.ok)return text(res,response.status,message(req,'downloadHttp',response.status));
      if(!response.body)return text(res,502,message(req,'downloadFailed','EMPTY_BODY'));
      const headers={'Content-Type':response.headers.get('content-type')||'application/octet-stream','Content-Disposition':response.headers.get('content-disposition')||`attachment; filename="civitai-${versionId}.bin"`};
      const length=response.headers.get('content-length');
      if(length)headers['Content-Length']=length;
      res.writeHead(200,headers);
      const stream=Readable.fromWeb(response.body);
      stream.on('error',error=>res.destroy(error));
      return stream.pipe(res);
    }catch(error){
      const info=errorInfo(error);
      log('error','Download proxy failed',{versionId,...info});
      if(!res.headersSent)return text(res,502,message(req,'downloadFailed',info.code));
      return res.end();
    }
  }
  return json(res,404,{error:message(req,'apiNotFound')});
}
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,`http://${req.headers.host||HOST}`);
    if(url.pathname.startsWith('/api/'))return await handleApi(req,res,url);
    const file=safeFile(url.pathname);
    if(file&&fs.existsSync(file)&&fs.statSync(file).isFile()){
      const ext=path.extname(file).toLowerCase();
      res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':['.html','.js','.css'].includes(ext)?'no-cache':'public, max-age=3600'});
      return fs.createReadStream(file).pipe(res);
    }
    res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'});
    return fs.createReadStream(path.join(PUBLIC,'index.html')).pipe(res);
  }catch(error){
    log('error','Unhandled server error',{error:error.message,stack:DEBUG?error.stack:undefined});
    if(!res.headersSent)return json(res,500,{error:message(req,'internal')});
    res.end();
  }
});
server.on('clientError',(error,socket)=>{log('warn','HTTP client error',{error:error.message});if(socket.writable)socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')});
function removeObsoleteFileuer{for(const file of [path.join(ROOT,'README.md'),path.join(DATA,'README.txt'),path.join(DATA,'history.json'),path.join(DATA,'downloads.json')]){try{if(fs.existsSync(file))fs.unlinkSync(file)}catch(error){log('warn','Failed to remove obsolete file',{file:path.relative(ROOT,file),error:error.message})}}}
server.on('error',error=>{log('error','Server failed to start',{code:error.code,error:error.message});process.exitCode=1});
removeObsoleteFileuer;
try{loadFavorites()}catch(error){log('warn','favorites.json migration failed',{error:error.message})}
server.listen(PORT,HOST,()=>{ready();if(!token())log('warn','CIVITAI_API_TOKEN is not configured; open Settings in the UI and save your API key')});
