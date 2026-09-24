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
const ALLOW_REMOTE=String(process.env.ALLOW_REMOTE||'false').toLowerCase()==='true';
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
const MAX_JSON_BODY_BYTES=256*1024;
const MAX_UPSTREAM_JSON_BYTES=16*1024*1024;
const MAX_TOKEN_LENGTH=2048;
const MAX_QUERY_PARAMS=40;
const apiCache=new Map();
const fallbackSearchCache=new Map();
const inflight=new Map();
const corruptJsonBackups=new Set();
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
    internal:'Внутренняя ошибка сервера',
    forbiddenWrite:'Запрос отклонён: изменение данных разрешено только из этого интерфейса.',
    jsonRequired:'Ожидается JSON-запрос.',
    bodyTooLarge:'Запрос слишком большой.',
    invalidJson:'Некорректный JSON.',
    tokenInvalid:'Некорректный API-ключ.'
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
    internal:'Internal server error',
    forbiddenWrite:'Request rejected: data changes are allowed only from this interface.',
    jsonRequired:'A JSON request is required.',
    bodyTooLarge:'The request body is too large.',
    invalidJson:'Invalid JSON.',
    tokenInvalid:'Invalid API key.'
  }
};
const log=(level,message,meta={})=>{
  const kind=String(level||'').toLowerCase();
  if(kind!=='warn'&&kind!=='error')return;
  const label=kind==='error'?'ERROR':'WARN';
  const method=kind==='error'?console.error:console.warn;
  method(`[${label}] ${message}${Object.keys(meta).length?' '+JSON.stringify(meta):''}`);
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
const readJson=(name,fallback)=>{
  const file=ensureJson(name,fallback);
  try{return JSON.parse(fs.readFileSync(file,'utf8'))}
  catch(error){
    let backup=null;
    if(!corruptJsonBackups.has(file)){
      corruptJsonBackups.add(file);
      const stamp=new Date().toISOString().replace(/[:.]/g,'-');
      backup=`${file}.corrupt-${stamp}.bak`;
      try{fs.copyFileSync(file,backup)}catch(backupError){log('error','Corrupt JSON backup failed',{name,error:backupError.message});backup=null}
    }
    log('error','JSON read failed',{name,error:error.message,backup:backup?path.basename(backup):undefined});
    return fallback;
  }
};
const token=()=>process.env.CIVITAI_API_TOKEN||'';
const maskToken=value=>value?`••••••${String(value).slice(-4)}`:'';
const status=()=>({ok:true,version:APP_VERSION,host:HOST,remoteAccess:ALLOW_REMOTE,apiBase:API_BASE,apiFallback:API_FALLBACK,apiTokenConfigured:!!token(),apiTokenPersistent:true,apiTokenStorage:'.env',maskedToken:maskToken(token()),retryCount:RETRY_COUNT,searchMinLength:SEARCH_MIN_LENGTH,remoteSearchMinLength:REMOTE_SEARCH_MIN_LENGTH,cacheTtlMs:CACHE_TTL_MS,modelDetailCacheMs:MODEL_DETAIL_CACHE_MS,time:new Date().toISOString()});
function isLoopbackHost(value){
  const host=String(value||'').trim().toLowerCase();
  return host==='127.0.0.1'||host==='localhost'||host==='::1'||host==='[::1]';
}
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
function cleanText(value,max=300){return String(value??'').trim().slice(0,max)}
function safeRemoteUrl(value,max=4096){
  const raw=cleanText(value,max);
  if(!raw)return '';
  try{
    const parsed=new URL(raw,API_BASE);
    if(parsed.protocol!=='http:'&&parsed.protocol!=='https:')return '';
    return parsed.toString().slice(0,max);
  }catch{return ''}
}
function mediaSummary(media){
  if(!media||typeof media!=='object')return null;
  const url=safeRemoteUrl(media.url||media.src);
  if(!url)return null;
  const rawType=cleanText(media.type||media.mimeType||media.meta?.type,80).toLowerCase();
  const clean=url.split('?')[0].toLowerCase();
  const isVideo=rawType.includes('video')||/\.(mp4|webm|mov|m4v|m3u8)$/.test(clean)||/\b(transcode|video)=true\b/i.test(url);
  const poster=safeRemoteUrl(media.meta?.thumbnailUrl||media.thumbnailUrl||media.poster);
  const width=Number(media.width),height=Number(media.height);
  return {
    url,
    type:isVideo?'video':'image',
    ...(poster?{poster}:{}),
    ...(Number.isFinite(width)&&width>0&&width<=50000?{width:Math.round(width)}:{}),
    ...(Number.isFinite(height)&&height>0&&height<=50000?{height:Math.round(height)}:{})
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
  for(const value of model?.baseModels||[])if(cleanText(value,120))values.push(cleanText(value,120));
  for(const version of model?.modelVersions||[]){
    const value=cleanText(version?.baseModel,120);
    if(value&&!values.includes(value))values.push(value);
  }
  const directBase=cleanText(model?.baseModel,120);
  if(directBase&&!values.includes(directBase))values.unshift(directBase);
  return values.slice(0,4);
}
function compactCatalogModel(model){
  if(!model||typeof model!=='object')return null;
  const id=Number(model.id);
  if(!Number.isSafeInteger(id)||id<=0)return null;
  const bases=baseModelsFor(model);
  const preview=pickFavoritePreview(model);
  const username=cleanText(model.creator?.username||model.author,120);
  const downloadCount=Number(model.stats?.downloadCount??model.downloads);
  const favoriteCount=Number(model.stats?.favoriteCount);
  const thumbsUpCount=Number(model.stats?.thumbsUpCount??model.likes);
  const stats={};
  if(Number.isFinite(downloadCount))stats.downloadCount=downloadCount;
  if(Number.isFinite(favoriteCount))stats.favoriteCount=favoriteCount;
  if(Number.isFinite(thumbsUpCount))stats.thumbsUpCount=thumbsUpCount;
  return {
    id,
    name:cleanText(model.name||`Model ${id}`,300)||`Model ${id}`,
    type:cleanText(model.type||'Model',80)||'Model',
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
    savedAt:cleanText(savedAtOverride||model?.savedAt||new Date().toISOString(),64)
  };
}
function loadFavorites({persistMigration=true}={}){
  const raw=readJson('favorites.json',{items:[]});
  const source=Array.isArray(raw?.items)?raw.items:[];
  const items=source.map(item=>compactFavorite(item,item?.id,item?.savedAt)).filter(Boolean).slice(0,1000);
  const db={items};
  if(persistMigration){
    try{
      if(JSON.stringify(raw)!==JSON.stringify(db)){
        const sourceFile=path.join(DATA,'favorites.json');
        const stamp=new Date().toISOString().replace(/[:.]/g,'-');
        const backup=`${sourceFile}.migration-${stamp}.bak`;
        if(fs.existsSync(sourceFile))fs.copyFileSync(sourceFile,backup);
        writeJson('favorites.json',db);
        log('warn','favorites.json migrated; backup created',{backup:path.basename(backup)});
      }
    }catch(error){log('warn','favorites.json migration failed',{error:error.message})}
  }
  return db;
}
function compactCatalogBody(body){
  const data=JSON.parse(body);
  if(!Array.isArray(data?.items))throw Object.assign(new Error('invalid upstream catalog'),{code:'INVALID_UPSTREAM_JSON'});
  data.items=data.items.map(compactCatalogModel).filter(Boolean);
  if(data.metadata&&typeof data.metadata==='object'){
    const meta={};
    for(const key of ['nextCursor','nextPage','currentPage','pageSize','totalItems'])if(data.metadata[key]!=null)meta[key]=typeof data.metadata[key]==='string'?cleanText(data.metadata[key],2048):data.metadata[key];
    data.metadata=meta;
  }
  return JSON.stringify(data);
}
function plainDescription(value){return String(value||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'\"').replace(/&#39;/gi,"'").replace(/\s+/g,' ').trim().slice(0,4000)}
function positiveId(value){const id=Number(value);return Number.isSafeInteger(id)&&id>0?id:null}
function compactModelDetailBody(body,expectedId=null){
  const model=JSON.parse(body);
  const modelId=positiveId(expectedId)??positiveId(model.id);
  if(!modelId)throw Object.assign(new Error('invalid upstream model id'),{code:'INVALID_UPSTREAM_JSON'});
  let mediaLeft=12;
  const versions=[];
  for(const version of Array.isArray(model.modelVersions)?model.modelVersions.slice(0,100):[]){
    const versionId=positiveId(version?.id);
    if(!versionId)continue;
    const files=[];
    for(const file of Array.isArray(version?.files)?version.files.slice(0,100):[]){
      const fileId=positiveId(file?.id);
      if(!fileId)continue;
      const sizeKB=Number(file?.sizeKB);
      const format=cleanText(file?.metadata?.format,80);
      files.push({id:fileId,name:cleanText(file?.name,260)||`File ${fileId}`,...(Number.isFinite(sizeKB)&&sizeKB>=0?{sizeKB:Math.min(sizeKB,1e12)}:{}),...(format?{metadata:{format}}:{})});
    }
    const images=[];
    if(mediaLeft>0){
      for(const item of Array.isArray(version?.images)?version.images:[]){
        if(mediaLeft<=0)break;
        const media=mediaSummary(item);
        if(media){images.push(media);mediaLeft--}
      }
    }
    versions.push({id:versionId,name:cleanText(version?.name,300),baseModel:cleanText(version?.baseModel,120),publishedAt:cleanText(version?.publishedAt,64),files,images});
  }
  const creator=cleanText(model.creator?.username,120);
  return JSON.stringify({
    id:modelId,
    name:cleanText(model.name,300)||`Model ${modelId}`,
    type:cleanText(model.type,80)||'Model',
    description:plainDescription(model.description),
    creator:creator?{username:creator}:null,
    modelVersions:versions
  });
}

function normalizeToken(value){
  const clean=String(value??'').trim();
  if(!clean)return '';
  if(clean.length>MAX_TOKEN_LENGTH||/[\u0000-\u001f\u007f]/.test(clean))throw Object.assign(new Error('invalid token'),{code:'INVALID_TOKEN'});
  return clean;
}
function writeEnvToken(value){
  const clean=normalizeToken(value);
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
  for(const key of [...apiCache.keys()])removeCacheEntry(key);
  fallbackSearchCache.clear();
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
async function readTextLimited(response,maxBytes=MAX_UPSTREAM_JSON_BYTES){
  const declared=Number(response.headers.get('content-length'));
  if(Number.isFinite(declared)&&declared>maxBytes)throw Object.assign(new Error('upstream response too large'),{code:'UPSTREAM_TOO_LARGE'});
  if(!response.body)return '';
  const reader=response.body.getReader();
  const chunks=[];
  let total=0;
  try{
    while(true){
      const {done,value}=await reader.read();
      if(done)break;
      total+=value.byteLength;
      if(total>maxBytes){await reader.cancel();throw Object.assign(new Error('upstream response too large'),{code:'UPSTREAM_TOO_LARGE'})}
      chunks.push(Buffer.from(value));
    }
    return Buffer.concat(chunks,total).toString('utf8');
  }finally{try{reader.releaseLock()}catch{}}
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
    return fallbackResponse.ok||!primaryResponse?fallbackResponse:primaryResponse;
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
      const body=await readTextLimited(response);
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
function text(res,code,body,type='text/plain; charset=utf-8'){body=String(body);res.writeHead(code,{'Content-Type':type,'Content-Length':Buffer.byteLength(body),'Cache-Control':'no-store'});res.end(body)}
function setSecurityHeaders(res){
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('X-Frame-Options','DENY');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  res.setHeader('Cross-Origin-Opener-Policy','same-origin');
  res.setHeader('X-Permitted-Cross-Domain-Policies','none');
  res.setHeader('Content-Security-Policy',"default-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://civitai.com https://*.civitai.com https://civitai.red https://*.civitai.red; media-src 'self' blob: https://civitai.com https://*.civitai.com https://civitai.red https://*.civitai.red; connect-src 'self'; font-src 'self' data:");
}
function readBody(req,limit=MAX_JSON_BODY_BYTES){
  return new Promise((resolve,reject)=>{
    let size=0,buffer='',tooLarge=false,settled=false;
    const fail=error=>{if(settled)return;settled=true;reject(error)};
    req.on('data',chunk=>{
      size+=chunk.length;
      if(tooLarge)return;
      if(size>limit){tooLarge=true;buffer='';return}
      buffer+=chunk;
    });
    req.on('end',()=>{
      if(settled)return;
      if(tooLarge)return fail(Object.assign(new Error('body too large'),{code:'BODY_TOO_LARGE'}));
      try{const data=buffer?JSON.parse(buffer):{};settled=true;resolve(data)}catch{fail(Object.assign(new Error('invalid json'),{code:'INVALID_JSON'}))}
    });
    req.on('error',fail);
    req.on('aborted',()=>fail(Object.assign(new Error('request aborted'),{code:'REQUEST_ABORTED'})));
  });
}
function requestIsJson(req){return /^application\/json(?:\s*;|$)/i.test(String(req.headers['content-type']||''))}
function trustedWriteRequest(req){
  if(String(req.headers['sec-fetch-site']||'').toLowerCase()==='cross-site')return false;
  const origin=String(req.headers.origin||'').trim();
  if(!origin)return true;
  try{return new URL(origin).host===String(req.headers.host||'')}catch{return false}
}
function hostName(value){try{return new URL(`http://${value}`).hostname.replace(/^\[|\]$/g,'').replace(/\.$/,'').toLowerCase()}catch{return ''}}
function trustedHost(req){
  const configured=String(HOST).replace(/^\[|\]$/g,'').toLowerCase();
  const loopback=['127.0.0.1','localhost','::1'].includes(configured);
  if(!loopback)return true;
  return ['127.0.0.1','localhost','::1',configured].includes(hostName(req.headers.host||''));
}
function bodyError(req,res,error){
  if(error?.code==='BODY_TOO_LARGE')return json(res,413,{error:message(req,'bodyTooLarge'),code:error.code});
  if(error?.code==='INVALID_JSON')return json(res,400,{error:message(req,'invalidJson'),code:error.code});
  return json(res,400,{error:message(req,'internal'),code:error?.code||'BAD_REQUEST'});
}
function safeFile(urlPath){
  let relative;
  try{relative=decodeURIComponent(urlPath.split('?')[0])}catch{return null}
  if(relative.includes('\0'))return null;
  if(relative==='/')relative='/index.html';
  const full=path.resolve(PUBLIC,`.${relative}`);
  return full===PUBLIC||full.startsWith(`${PUBLIC}${path.sep}`)?full:null;
}
function mime(file){const ext=path.extname(file).toLowerCase();return ({'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'}[ext]||'application/octet-stream')}
function sanitizeQuery(params){
  const allow=new Set(['limit','page','cursor','query','ids','tag','username','types','baseModels','checkpointType','sort','period','nsfw','supportsGeneration','fromPlatform','earlyAccess','primaryFileOnly','favorites','hidden']);
  const out=new URLSearchParams();
  let accepted=0;
  for(const [key,raw] of params.entries()){
    if(!allow.has(key)||accepted>=MAX_QUERY_PARAMS)continue;
    const value=String(raw);
    if(value.length>300)continue;
    out.append(key,value);accepted++;
  }
  const limit=Math.min(100,Math.max(1,Number.parseInt(out.get('limit')||'24',10)||24));out.set('limit',String(limit));
  if(out.has('page')){const page=Math.min(100000,Math.max(1,Number.parseInt(out.get('page'),10)||1));out.set('page',String(page))}
  if(out.has('query'))out.set('query',out.get('query').trim().slice(0,200));
  const boolKeys=['nsfw','supportsGeneration','fromPlatform','earlyAccess','primaryFileOnly','favorites','hidden'];
  for(const key of boolKeys)if(out.has(key)&&!['true','false'].includes(out.get(key)))out.delete(key);
  if(!out.has('nsfw'))out.set('nsfw','true');
  if(out.has('sort')&&!['Highest Rated','Most Downloaded','Newest'].includes(out.get('sort')))out.delete('sort');
  if(out.has('period')&&!['AllTime','Year','Month','Week','Day'].includes(out.get('period')))out.delete('period');
  if(out.has('query')&&out.has('page')){out.delete('page');if(DEBUG)log('warn','Ignoring page for text search because cursor pagination is required')}
  if(params.has('browsingLevel')&&DEBUG)log('warn','Ignoring obsolete browsingLevel query parameter',{value:params.get('browsingLevel')});
  return out;
}
async function handleApi(req,res,url){
  if(String(req.headers['sec-fetch-site']||'').toLowerCase()==='cross-site')return json(res,403,{error:message(req,'forbiddenWrite'),code:'CROSS_SITE_BLOCKED'});
  if(req.method==='GET'&&url.pathname==='/api/status')return json(res,200,status());
  if(req.method==='GET'&&url.pathname==='/api/settings')return json(res,200,readJson('settings.json',{}));
  if(req.method==='POST'&&url.pathname==='/api/settings'){
    if(!trustedWriteRequest(req))return json(res,403,{error:message(req,'forbiddenWrite'),code:'FORBIDDEN_ORIGIN'});
    if(!requestIsJson(req))return json(res,415,{error:message(req,'jsonRequired'),code:'JSON_REQUIRED'});
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
      const nextToken=typeof body.apiToken==='string'&&body.apiToken.trim()?normalizeToken(body.apiToken):'';
      writeJson('settings.json',next);
      if(nextToken)writeEnvToken(nextToken);
      return json(res,200,{settings:next,status:status()});
    }catch(error){
      if(error?.code==='BODY_TOO_LARGE'||error?.code==='INVALID_JSON')return bodyError(req,res,error);
      if(error?.code==='INVALID_TOKEN')return json(res,400,{error:message(req,'tokenInvalid'),code:error.code});
      return json(res,400,{error:message(req,'settingsSave',DEBUG?error.message:'ошибка'),code:'SETTINGS_SAVE_FAILED'});
    }
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
          const body=await readTextLimited(response);
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
      const body=await readTextLimited(response);
      if(!response.ok)return json(res,response.status,{error:message(req,'modelHttp',response.status)});
      const compactBody=compactModelDetailBody(body,modelId);
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
    if(!trustedWriteRequest(req))return json(res,403,{error:message(req,'forbiddenWrite'),code:'FORBIDDEN_ORIGIN'});
    if(!requestIsJson(req))return json(res,415,{error:message(req,'jsonRequired'),code:'JSON_REQUIRED'});
    try{
      const body=await readBody(req);
      const id=Number(body.modelId);
      if(!Number.isSafeInteger(id)||id<=0)return json(res,400,{error:message(req,'invalidId')});
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
    }catch(error){
      if(error?.code==='BODY_TOO_LARGE'||error?.code==='INVALID_JSON')return bodyError(req,res,error);
      return json(res,400,{error:message(req,'internal'),code:error?.code||'FAVORITES_SAVE_FAILED'});
    }
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
      const rawDisposition=String(response.headers.get('content-disposition')||'').replace(/[\r\n]/g,'').slice(0,512);
      const disposition=/^attachment(?:;|$)/i.test(rawDisposition)?rawDisposition:`attachment; filename="civitai-${versionId}.bin"`;
      const headers={'Content-Type':response.headers.get('content-type')||'application/octet-stream','Content-Disposition':disposition};
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
  setSecurityHeaders(res);
  try{
    if(!trustedHost(req))return text(res,421,'Недопустимый Host');
    const url=new URL(req.url,'http://local.invalid');
    if(url.pathname.startsWith('/api/'))return await handleApi(req,res,url);
    if(req.method!=='GET'&&req.method!=='HEAD')return text(res,405,'Метод не поддерживается');
    const file=safeFile(url.pathname);
    if(file&&fs.existsSync(file)&&fs.statSync(file).isFile()){
      const ext=path.extname(file).toLowerCase();
      const headers={'Content-Type':mime(file),'Cache-Control':['.html','.js','.css'].includes(ext)?'no-cache':'public, max-age=3600'};
      res.writeHead(200,headers);
      if(req.method==='HEAD')return res.end();
      return fs.createReadStream(file).pipe(res);
    }
    return text(res,404,'Файл не найден');
  }catch(error){
    log('error','Unhandled server error',{error:error.message,stack:DEBUG?error.stack:undefined});
    if(!res.headersSent)return json(res,500,{error:message(req,'internal')});
    res.end();
  }
});
server.requestTimeout=30000;
server.headersTimeout=10000;
server.keepAliveTimeout=5000;
server.maxHeadersCount=100;
server.maxRequestsPerSocket=100;
server.on('clientError',(error,socket)=>{
  const code=String(error?.code||'');
  const errorMessage=String(error?.message||'');
  const timedOut=code==='ERR_HTTP_REQUEST_TIMEOUT'||errorMessage==='Request timeout';
  const disconnected=code==='ECONNRESET'||code==='EPIPE'||code==='HPE_INVALID_EOF_STATE';
  if(timedOut){
    const meta={code:code||undefined,remote:socket.remoteAddress||undefined};
    if(ALLOW_REMOTE)log('warn','HTTP request timed out',meta);
    else if(DEBUG)console.debug(`[DEBUG] HTTP request timed out ${JSON.stringify(meta)}`);
    if(socket.writable)return socket.end('HTTP/1.1 408 Request Timeout\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');
    return socket.destroy();
  }
  if(disconnected){
    if(DEBUG)console.debug(`[DEBUG] HTTP client disconnected ${JSON.stringify({code:code||undefined,remote:socket.remoteAddress||undefined})}`);
    return socket.destroy();
  }
  log('warn','HTTP client error',{code:code||undefined,error:errorMessage});
  if(socket.writable)return socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\nContent-Length: 0\r\n\r\n');
  socket.destroy();
});
server.on('error',error=>{log('error','Server failed to start',{code:error.code,error:error.message});process.exitCode=1});
try{loadFavorites()}catch(error){log('warn','favorites.json migration failed',{error:error.message})}
if(!isLoopbackHost(HOST)&&!ALLOW_REMOTE){
  log('error','Remote binding is blocked for security. Use HOST=127.0.0.1 or explicitly set ALLOW_REMOTE=true',{host:HOST});
  process.exitCode=1;
}else{
  if(!isLoopbackHost(HOST))log('warn','Remote access is enabled; anyone who can reach this host may use the local API',{host:HOST});
  server.listen(PORT,HOST,()=>{ready();if(!token())log('warn','CIVITAI_API_TOKEN is not configured; open Settings in the UI and save your API key')});
}

