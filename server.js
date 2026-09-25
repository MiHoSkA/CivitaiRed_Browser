'use strict';
const http=require('http');
const https=require('https');
const crypto=require('crypto');
const fs=require('fs');
const path=require('path');
const dns=require('dns');
const net=require('net');
const {Readable,pipeline}=require('stream');
try{dns.setDefaultResultOrder('ipv4first')}catch{}
const APP_VERSION='1.8.0';
const ROOT=__dirname;
const PUBLIC=path.join(ROOT,'public');
const ENV_FILE=path.resolve(ROOT,process.env.CIVITAI_ENV_FILE||'.env');
function loadEnv(){
  if(!fs.existsSync(ENV_FILE))return;
  for(const raw of fs.readFileSync(ENV_FILE,'utf8').split(/\r?\n/)){
    const line=raw.trim();
    if(!line||line.startsWith('#'))continue;
    const i=line.indexOf('=');
    if(i<1)continue;
    const key=line.slice(0,i).trim();
    let value=line.slice(i+1).trim();
    if(value.length>=2&&(value[0]==='"'||value[0]==="'")&&value.endsWith(value[0]))value=value.slice(1,-1);
    if(process.env[key]===undefined)process.env[key]=value;
  }
}
loadEnv();
const DATA=path.resolve(ROOT,process.env.DATA_DIR||'data');
const PORT=Number(process.env.PORT??3210);
const HOST=process.env.HOST||'127.0.0.1';
const REMOTE_ACCESS=!isLoopbackHost(HOST);
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
    tokenInvalid:'Некорректный API-ключ.',
    lockedMode:'Включён приватный режим. Введи пароль в настройках, чтобы открыть этот раздел.',
    lockedNsfw:'В приватном режиме эта модель недоступна.',
    lockWrongPassword:'Неверный пароль.',
    lockTooManyAttempts:n=>`Слишком много попыток. Повтори через ${n} с.`,
    lockPasswordRules:'Пароль должен быть от 4 до 200 символов.',
    accountNoToken:'API-ключ не задан. Сохрани его в настройках.',
    accountNoPermission:'У API-ключа нет разрешения на эти данные.',
    accountFailed:c=>`Не удалось получить данные аккаунта${c?` (${c})`:''}`,
    uploadType:'Неподдерживаемый тип файла. Можно PNG, JPEG, WebP, GIF, AVIF, MP4, WebM, MOV.',
    uploadLength:'Не указан размер файла.',
    uploadTooLarge:n=>`Файл слишком большой (максимум ${n} МБ).`,
    uploadFailed:c=>`Не удалось загрузить файл${c?` (${c})`:''}`,
    postNoMedia:'Добавь хотя бы один файл.',
    civitaiRejected:m=>`Civitai отклонил запрос: ${m}`,
    contentMissing:'Контент не найден или уже удалён.',
    collectionNameRequired:'Укажи название коллекции (до 30 символов).'
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
    tokenInvalid:'Invalid API key.',
    lockedMode:'Private mode is on. Enter the password in Settings to open this section.',
    lockedNsfw:'This model is not available in private mode.',
    lockWrongPassword:'Wrong password.',
    lockTooManyAttempts:n=>`Too many attempts. Retry in ${n}s.`,
    lockPasswordRules:'The password must be 4 to 200 characters long.',
    accountNoToken:'API key is not configured. Save it in Settings.',
    accountNoPermission:'The API key has no permission for this data.',
    accountFailed:c=>`Failed to load account data${c?` (${c})`:''}`,
    uploadType:'Unsupported file type. Allowed: PNG, JPEG, WebP, GIF, AVIF, MP4, WebM, MOV.',
    uploadLength:'File size is missing.',
    uploadTooLarge:n=>`The file is too large (max ${n} MB).`,
    uploadFailed:c=>`File upload failed${c?` (${c})`:''}`,
    postNoMedia:'Add at least one file.',
    civitaiRejected:m=>`Civitai rejected the request: ${m}`,
    contentMissing:'The content was not found or is already deleted.',
    collectionNameRequired:'Enter a collection name (up to 30 characters).'
  }
};
const log=(level,message,meta={})=>{
  const kind=String(level||'').toLowerCase();
  if(kind!=='warn'&&kind!=='error')return;
  const label=kind==='error'?'ERROR':'WARN';
  const method=kind==='error'?console.error:console.warn;
  method(`[${label}] ${message}${Object.keys(meta).length?' '+JSON.stringify(meta):''}`);
};
const ready=()=>{const port=server.address()?.port??PORT;const shownHost=HOST.includes(':')?`[${HOST}]`:HOST;console.log(`[READY] Civitai Red Browser v${APP_VERSION} running at http://${shownHost}:${port}`)};
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
const LOCK_COOKIE='crb_unlock';
const LOCK_SESSION_MS=12*60*60*1000;
const LOCK_MAX_SESSIONS=50;
const unlockSessions=new Map();
const unlockFailures=new Map();
function securityConfig(){const data=readJson('security.json',{});return data&&typeof data==='object'?data:{}}
function lockEnabled(){const config=securityConfig();return typeof config.passwordHash==='string'&&typeof config.salt==='string'&&config.passwordHash.length>0}
function hashPassword(password,salt){return crypto.scryptSync(String(password).normalize('NFKC'),Buffer.from(salt,'hex'),64,{N:16384,r:8,p:1}).toString('hex')}
function verifyPassword(password){
  const config=securityConfig();
  if(!config.passwordHash||!config.salt)return false;
  const expected=Buffer.from(config.passwordHash,'hex');
  const actual=Buffer.from(hashPassword(password,config.salt),'hex');
  return expected.length===actual.length&&crypto.timingSafeEqual(expected,actual);
}
function storePassword(password){
  const salt=crypto.randomBytes(16).toString('hex');
  writeJson('security.json',{version:1,algorithm:'scrypt',salt,passwordHash:hashPassword(password,salt),updatedAt:new Date().toISOString()});
}
function readCookie(req,name){
  for(const part of String(req.headers.cookie||'').split(';')){
    const index=part.indexOf('=');
    if(index<0)continue;
    if(part.slice(0,index).trim()===name)return part.slice(index+1).trim();
  }
  return '';
}
function sessionTokenHash(value){return crypto.createHash('sha256').update(String(value)).digest('hex')}
function hasUnlockSession(req){
  const raw=readCookie(req,LOCK_COOKIE);
  if(!/^[a-f0-9]{64}$/.test(raw))return false;
  const key=sessionTokenHash(raw);
  const session=unlockSessions.get(key);
  if(!session)return false;
  if(Date.now()>session.expires){unlockSessions.delete(key);return false}
  session.expires=Date.now()+LOCK_SESSION_MS;
  return true;
}
function lockState(req){const enabled=lockEnabled();return {enabled,unlocked:!enabled||hasUnlockSession(req)}}
function isLockedRequest(req){const state=lockState(req);return state.enabled&&!state.unlocked}
function createUnlockSession(res){
  const raw=crypto.randomBytes(32).toString('hex');
  unlockSessions.set(sessionTokenHash(raw),{expires:Date.now()+LOCK_SESSION_MS});
  while(unlockSessions.size>LOCK_MAX_SESSIONS)unlockSessions.delete(unlockSessions.keys().next().value);
  res.setHeader('Set-Cookie',`${LOCK_COOKIE}=${raw}; HttpOnly; SameSite=Strict; Path=/`);
}
function clearUnlockSession(req,res){
  const raw=readCookie(req,LOCK_COOKIE);
  if(raw)unlockSessions.delete(sessionTokenHash(raw));
  res.setHeader('Set-Cookie',`${LOCK_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`);
}
function clientKey(req){return String(req.socket?.remoteAddress||'local')}
function unlockDelayMs(req){
  const entry=unlockFailures.get(clientKey(req));
  if(!entry)return 0;
  return Math.max(0,entry.until-Date.now());
}
function noteUnlockFailure(req){
  const key=clientKey(req);
  const entry=unlockFailures.get(key)||{count:0,until:0};
  entry.count++;
  entry.until=entry.count>=5?Date.now()+Math.min(300000,15000*Math.pow(2,entry.count-5)):0;
  unlockFailures.set(key,entry);
}
function validNewPassword(value){return typeof value==='string'&&value.length>=4&&value.length<=200&&!/[\u0000-\u001f\u007f]/.test(value)}
const status=(req=null)=>({...baseStatus(req&&isLockedRequest(req)),lock:req?lockState(req):{enabled:lockEnabled(),unlocked:!lockEnabled()}});
const baseStatus=(locked=false)=>({ok:true,version:APP_VERSION,host:HOST,remoteAccess:REMOTE_ACCESS,apiBase:API_BASE,apiFallback:API_FALLBACK,apiTokenConfigured:!!token(),apiTokenPersistent:true,apiTokenStorage:'.env',maskedToken:locked?'':maskToken(token()),retryCount:RETRY_COUNT,searchMinLength:SEARCH_MIN_LENGTH,remoteSearchMinLength:REMOTE_SEARCH_MIN_LENGTH,cacheTtlMs:CACHE_TTL_MS,modelDetailCacheMs:MODEL_DETAIL_CACHE_MS,time:new Date().toISOString()});
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
function isSafeMedia(media){const level=Number(media?.nsfwLevel);return level===1||level===2}
function pickFavoritePreview(model,{safe=false}={}){
  if(model?.preview?.url&&!safe)return mediaSummary(model.preview);
  for(const version of model?.modelVersions||[]){
    for(const media of version?.images||[]){
      if(safe&&!isSafeMedia(media))continue;
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
function compactCatalogModel(model,options={}){
  if(!model||typeof model!=='object')return null;
  const safe=options?.safe===true;
  if(safe&&model.nsfw!==false)return null;
  const id=Number(model.id);
  if(!Number.isSafeInteger(id)||id<=0)return null;
  const bases=baseModelsFor(model);
  const preview=pickFavoritePreview(model,{safe});
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
function compactCatalogBody(body,{safe=false}={}){
  const data=JSON.parse(body);
  if(!Array.isArray(data?.items))throw Object.assign(new Error('invalid upstream catalog'),{code:'INVALID_UPSTREAM_JSON'});
  data.items=data.items.map(model=>compactCatalogModel(model,{safe})).filter(Boolean);
  if(data.metadata&&typeof data.metadata==='object'){
    const meta={};
    for(const key of ['nextCursor','nextPage','currentPage','pageSize','totalItems'])if(data.metadata[key]!=null)meta[key]=typeof data.metadata[key]==='string'?cleanText(data.metadata[key],2048):data.metadata[key];
    data.metadata=meta;
  }
  return JSON.stringify(data);
}
function plainDescription(value){return String(value||'').replace(/<[^>]*>/g,' ').replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>').replace(/&quot;/gi,'\"').replace(/&#39;/gi,"'").replace(/\s+/g,' ').trim().slice(0,4000)}
function positiveId(value){const id=Number(value);return Number.isSafeInteger(id)&&id>0?id:null}
function compactModelDetailBody(body,expectedId=null,{safe=false}={}){
  const model=JSON.parse(body);
  const modelId=positiveId(expectedId)??positiveId(model.id);
  if(!modelId)throw Object.assign(new Error('invalid upstream model id'),{code:'INVALID_UPSTREAM_JSON'});
  if(safe&&model.nsfw!==false)throw Object.assign(new Error('nsfw model hidden'),{code:'LOCKED_NSFW'});
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
        if(safe&&!isSafeMedia(item))continue;
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
function writeEnvToken(value,{clear=false}={}){
  const clean=clear?'':normalizeToken(value);
  if(!clean&&!clear)return false;
  const raw=fs.existsSync(ENV_FILE)?fs.readFileSync(ENV_FILE,'utf8'):'';
  const line=`CIVITAI_API_TOKEN=${clean}`;
  const pattern=/^[ \t]*CIVITAI_API_TOKEN[ \t]*=.*$/m;
  const next=pattern.test(raw)?raw.replace(pattern,()=>line):`${raw.trimEnd()?`${raw.trimEnd()}\n`:''}${line}\n`;
  const tmp=`${ENV_FILE}.tmp`;
  fs.writeFileSync(tmp,next,'utf8');
  try{fs.chmodSync(tmp,0o600)}catch{}
  fs.renameSync(tmp,ENV_FILE);
  try{fs.chmodSync(ENV_FILE,0o600)}catch{}
  process.env.CIVITAI_API_TOKEN=clean;
  for(const key of [...apiCache.keys()])removeCacheEntry(key);
  inflight.clear();
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
  let timer=null;
  const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>{reader.cancel().catch(()=>{});reject(Object.assign(new Error('upstream body timeout'),{name:'AbortError',code:'UPSTREAM_BODY_TIMEOUT'}))},TIMEOUT)});
  timeout.catch(()=>{});
  try{
    while(true){
      const {done,value}=await Promise.race([reader.read(),timeout]);
      if(done)break;
      total+=value.byteLength;
      if(total>maxBytes){await reader.cancel();throw Object.assign(new Error('upstream response too large'),{code:'UPSTREAM_TOO_LARGE'})}
      chunks.push(Buffer.from(value));
    }
    return Buffer.concat(chunks,total).toString('utf8');
  }finally{clearTimeout(timer);try{reader.releaseLock()}catch{}}
}
let rateLimitedUntil=0;
function rateLimitRemainingMs(){return Math.max(0,rateLimitedUntil-Date.now())}
function noteRateLimit(response){
  const raw=response?.headers?.get?.('retry-after');
  let wait=10000;
  if(raw){const seconds=Number(raw);if(Number.isFinite(seconds))wait=seconds*1000;else{const date=Date.parse(raw);if(Number.isFinite(date))wait=date-Date.now()}}
  wait=Math.min(60000,Math.max(3000,wait));
  const wasLimited=rateLimitRemainingMs()>0;
  rateLimitedUntil=Math.max(rateLimitedUntil,Date.now()+wait);
  if(!wasLimited&&DEBUG)console.debug(`[DEBUG] Civitai rate limit reached; pausing upstream requests for ${Math.ceil(wait/1000)}s`);
}
function rateLimitedResponse(){
  const seconds=Math.max(1,Math.ceil(rateLimitRemainingMs()/1000));
  return new Response(JSON.stringify({error:'Rate limited'}),{status:429,headers:{'content-type':'application/json','retry-after':String(seconds),'x-local-rate-limit':'1'}});
}
async function retryEndpoint(url,options={},label='Civitai'){
  let response;
  for(let attempt=0;attempt<=RETRY_COUNT;attempt++){
    if(rateLimitRemainingMs()>0)return rateLimitedResponse();
    response=await fetchOnce(url,options);
    if(response.status===429){noteRateLimit(response);return response}
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
  if(rateLimitRemainingMs()>0)return rateLimitedResponse();
  try{
    primaryResponse=await fetchOnce(url,{binary,useAuth});
    if(primaryResponse.status===429){noteRateLimit(primaryResponse);return primaryResponse}
    if(!fallbackUrl||!isRetryableStatus(primaryResponse.status))return primaryResponse;
    log('warn','Primary Civitai endpoint returned retryable status',{status:primaryResponse.status});
  }catch(primaryError){
    log('warn','Primary Civitai network error',errorInfo(primaryError));
    if(!fallbackUrl)throw primaryError;
  }
  try{
    const fallbackResponse=await retryEndpoint(fallbackUrl,{binary,useAuth},'fallback');
    if(!fallbackResponse.ok)log('warn','Civitai fallback endpoint returned an error',{status:fallbackResponse.status});
    const useFallback=fallbackResponse.ok||!primaryResponse;
    discardBody(useFallback?primaryResponse:fallbackResponse);
    return useFallback?fallbackResponse:primaryResponse;
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
function discardBody(response){try{response?.body?.cancel?.().catch(()=>{})}catch{}}
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
    const scanKey=`scan:${key}`;
    let scan=inflight.get(scanKey);
    if(!scan){
      scan=scanFallbackCatalog(query,needle,key).finally(()=>inflight.delete(scanKey));
      inflight.set(scanKey,scan);
    }
    cached=await scan;
  }
  const items=cached.items.slice(offset,offset+limit);
  const nextOffset=offset+items.length;
  return {items,metadata:{nextCursor:nextOffset<cached.items.length?`local:${nextOffset}`:null,nextPage:null,totalItems:cached.items.length,pageSize:limit,searchFallback:true,fallbackReason:reason,scannedItems:cached.scanned,scannedPages:cached.pages,fallbackLimited:cached.pages>=FALLBACK_SEARCH_SCAN_PAGES}};
}
async function scanFallbackCatalog(query,needle,key){
  {
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
        if(score>0&&!found.has(model.id))found.set(model.id,{model:compactCatalogModel(model,{safe:scanParams.get('nsfw')==='false'}),score,order:scanned});
      }
      cursor=String(data?.metadata?.nextCursor||'');
      if(!cursor||items.length===0)break;
    }
    const matches=[...found.values()].filter(item=>item.model).sort((a,b)=>b.score-a.score||a.order-b.order).map(item=>item.model);
    const cached={time:Date.now(),items:matches,scanned,pages};
    fallbackSearchCache.delete(key);
    fallbackSearchCache.set(key,cached);
    while(fallbackSearchCache.size>MAX_FALLBACK_CACHES)fallbackSearchCache.delete(fallbackSearchCache.keys().next().value);
    return cached;
  }
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
    let size=0,chunks=[],tooLarge=false,settled=false;
    const fail=error=>{if(settled)return;settled=true;reject(error)};
    req.on('data',chunk=>{
      size+=chunk.length;
      if(tooLarge)return;
      if(size>limit){tooLarge=true;chunks=[];return}
      chunks.push(chunk);
    });
    req.on('end',()=>{
      if(settled)return;
      if(tooLarge)return fail(Object.assign(new Error('body too large'),{code:'BODY_TOO_LARGE'}));
      const buffer=Buffer.concat(chunks).toString('utf8');
      try{const data=buffer?JSON.parse(buffer):{};if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('not an object');settled=true;resolve(data)}catch{fail(Object.assign(new Error('invalid json'),{code:'INVALID_JSON'}))}
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
  const requested=hostName(req.headers.host||'');
  if(!requested)return false;
  const loopbackHosts=['127.0.0.1','localhost','::1'];
  if(loopbackHosts.includes(configured))return loopbackHosts.includes(requested)||requested===configured;
  if(configured==='0.0.0.0'||configured==='::')return loopbackHosts.includes(requested)||net.isIP(requested)!==0;
  return loopbackHosts.includes(requested)||requested===configured||net.isIP(requested)!==0;
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
const CIVITAI_IMAGE_EDGE='https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA';
const ACCOUNT_CACHE_MS=20000;
const ACCOUNT_BROWSING_LEVEL=31;
const COLLECTION_TYPES=['Model','Image','Post','Article'];
const TOKEN_SCOPE={MediaRead:32,MediaWrite:64,MediaDelete:128,BuzzRead:65536,CollectionsRead:131072,CollectionsWrite:262144};
const COLLECTION_ITEM_KEYS={Model:'modelId',Image:'imageId',Post:'postId',Article:'articleId'};
function collectionItemRef(type,id){const key=COLLECTION_ITEM_KEYS[type];const itemId=positiveId(id);return key&&itemId?{type,key,itemId}:null}
function invalidateCollections(){for(const key of [...apiCache.keys()])if(key.startsWith('account:collection'))removeCacheEntry(key)}
function unflattenDevalue(values){
  if(!Array.isArray(values))return values;
  const cache=new Map();
  const special={'-1':undefined,'-2':undefined,'-3':NaN,'-4':Infinity,'-5':-Infinity,'-6':-0};
  const read=index=>{
    if(index<0)return special[index];
    if(cache.has(index))return cache.get(index);
    const value=values[index];
    if(value===null||typeof value!=='object'){cache.set(index,value);return value}
    if(Array.isArray(value)){
      if(typeof value[0]==='string'){
        const [kind,...rest]=value;
        if(kind==='Date'||kind==='BigInt'||kind==='Object'){const out=kind==='BigInt'?Number(rest[0]):rest[0];cache.set(index,out);return out}
        if(kind==='Set'){const out=[];cache.set(index,out);for(const item of rest)out.push(read(item));return out}
        if(kind==='Map'||kind==='null'){const out={};cache.set(index,out);for(let i=0;i<rest.length;i+=2)out[kind==='Map'?read(rest[i]):rest[i]]=read(rest[i+1]);return out}
      }
      const out=[];cache.set(index,out);for(const item of value)out.push(read(item));return out;
    }
    const out={};cache.set(index,out);for(const [key,item] of Object.entries(value))out[key]=read(item);return out;
  };
  return read(0);
}
function decodeTrpcBody(body){
  const parsed=JSON.parse(body);
  const envelope=Array.isArray(parsed)?parsed[0]:parsed;
  if(envelope?.error){
    const info=envelope.error.json||envelope.error;
    throw Object.assign(new Error(cleanText(info?.message||'tRPC error',300)),{code:'TRPC_ERROR',trpcCode:info?.data?.code||null,status:Number(info?.data?.httpStatus)||null});
  }
  const data=envelope?.result?.data;
  if(typeof data==='string')return unflattenDevalue(JSON.parse(data));
  return data&&typeof data==='object'&&'json' in data?data.json:data;
}
async function civTrpc(procedure,input){
  const url=`${API_BASE}/api/trpc/${procedure}?input=${encodeURIComponent(JSON.stringify({json:input}))}`;
  const response=await civFetch(url,{useAuth:true});
  const body=await readTextLimited(response);
  if(response.status===401||response.status===403)throw Object.assign(new Error('forbidden'),{code:'NO_PERMISSION',status:response.status});
  let data;
  try{data=decodeTrpcBody(body)}
  catch(error){
    if(error.trpcCode==='UNAUTHORIZED'||error.trpcCode==='FORBIDDEN')throw Object.assign(error,{code:'NO_PERMISSION'});
    if(!response.ok||error.code==='TRPC_ERROR')throw Object.assign(error,{status:error.status||response.status});
    throw Object.assign(new Error('invalid upstream json'),{code:'INVALID_UPSTREAM_JSON',status:502});
  }
  if(!response.ok)throw Object.assign(new Error(`HTTP ${response.status}`),{code:'UPSTREAM_HTTP',status:response.status});
  return data;
}
async function civPostJson(pathname,payload,timeoutMs=60000){
  if(rateLimitRemainingMs()>0)throw Object.assign(new Error('rate limited'),{code:'RATE_LIMITED',status:429});
  const ctl=new AbortController();
  const timer=setTimeout(()=>ctl.abort(),timeoutMs);
  try{
    const response=await fetch(`${API_BASE}${pathname}`,{method:'POST',headers:{...apiHeaders(false,true),'Content-Type':'application/json'},body:JSON.stringify(payload),signal:ctl.signal,redirect:'follow'});
    if(response.status===429)noteRateLimit(response);
    const body=await readTextLimited(response);
    return {response,body};
  }finally{clearTimeout(timer)}
}
async function civTrpcMutation(procedure,input){
  const {response,body}=await civPostJson(`/api/trpc/${procedure}`,{json:input});
  if(response.status===401||response.status===403)throw Object.assign(new Error('forbidden'),{code:'NO_PERMISSION',status:response.status});
  let data;
  try{data=decodeTrpcBody(body)}
  catch(error){
    if(error.trpcCode==='UNAUTHORIZED'||error.trpcCode==='FORBIDDEN')throw Object.assign(error,{code:'NO_PERMISSION'});
    if(error.code==='TRPC_ERROR')throw Object.assign(error,{status:error.status||(response.ok?400:response.status),upstreamMessage:error.message});
    throw Object.assign(new Error(`HTTP ${response.status}`),{code:'UPSTREAM_HTTP',status:response.ok?502:response.status});
  }
  if(!response.ok)throw Object.assign(new Error(`HTTP ${response.status}`),{code:'UPSTREAM_HTTP',status:response.status});
  return data;
}
function invalidateAccountContent(){
  for(const key of [...apiCache.keys()])if(/^account:(images|posts|collection|profile)/.test(key))removeCacheEntry(key);
}
const UPLOAD_TYPES={'image/png':'image','image/jpeg':'image','image/webp':'image','image/gif':'image','image/avif':'image','video/mp4':'video','video/webm':'video','video/quicktime':'video'};
const MAX_UPLOAD_IMAGE_BYTES=50*1024*1024;
const MAX_UPLOAD_VIDEO_BYTES=750*1024*1024;
function putToPresignedUrl(uploadUrl,req,{contentType,length}){
  return new Promise((resolve,reject)=>{
    let target;
    try{target=new URL(uploadUrl)}catch{return reject(Object.assign(new Error('invalid upload url'),{code:'UPLOAD_URL_INVALID'}))}
    if(target.protocol!=='https:')return reject(Object.assign(new Error('insecure upload url'),{code:'UPLOAD_URL_INVALID'}));
    let received=0,settled=false;
    const finish=(error,value)=>{if(settled)return;settled=true;error?reject(error):resolve(value)};
    const upstream=https.request(target,{method:'PUT',headers:{'Content-Type':contentType,'Content-Length':length},timeout:120000},response=>{
      const parts=[];
      response.on('data',chunk=>{if(parts.length<64)parts.push(chunk)});
      response.on('end',()=>{
        if(response.statusCode>=200&&response.statusCode<300)return finish(null,true);
        finish(Object.assign(new Error(`storage HTTP ${response.statusCode}: ${Buffer.concat(parts).toString('utf8').slice(0,200)}`),{code:'UPLOAD_STORAGE_FAILED',status:502}));
      });
      response.on('error',error=>finish(error));
    });
    upstream.on('timeout',()=>upstream.destroy(Object.assign(new Error('storage timeout'),{code:'UPLOAD_TIMEOUT'})));
    upstream.on('error',error=>finish(Object.assign(error,{code:error.code||'UPLOAD_STORAGE_FAILED',status:502})));
    req.on('data',chunk=>{received+=chunk.length;if(received>length){req.unpipe(upstream);upstream.destroy();finish(Object.assign(new Error('body larger than declared'),{code:'UPLOAD_SIZE_MISMATCH',status:400}))}});
    req.on('aborted',()=>{upstream.destroy();finish(Object.assign(new Error('client aborted'),{code:'REQUEST_ABORTED',status:499}))});
    req.on('end',()=>{if(received!==length){upstream.destroy();finish(Object.assign(new Error('body shorter than declared'),{code:'UPLOAD_SIZE_MISMATCH',status:400}))}});
    req.pipe(upstream);
  });
}
async function handleUpload(req,res){
  const contentType=String(req.headers['content-type']||'').split(';')[0].trim().toLowerCase();
  const kind=UPLOAD_TYPES[contentType];
  if(!kind)return json(res,415,{error:message(req,'uploadType'),code:'UPLOAD_TYPE'});
  const length=Number(req.headers['content-length']);
  if(!Number.isSafeInteger(length)||length<=0)return json(res,411,{error:message(req,'uploadLength'),code:'UPLOAD_LENGTH'});
  const max=kind==='video'?MAX_UPLOAD_VIDEO_BYTES:MAX_UPLOAD_IMAGE_BYTES;
  if(length>max)return json(res,413,{error:message(req,'uploadTooLarge',Math.round(max/1024/1024)),code:'UPLOAD_TOO_LARGE'});
  let fileName='upload';
  try{fileName=decodeURIComponent(String(req.headers['x-file-name']||'upload'))}catch{}
  fileName=cleanText(fileName.replace(/[\\/\u0000-\u001f]/g,'_'),200)||'upload';
  try{
    const {response,body}=await civPostJson('/api/v1/image-upload',{filename:encodeURIComponent(fileName),metadata:{}},30000);
    if(response.status===401||response.status===403)throw Object.assign(new Error('forbidden'),{code:'NO_PERMISSION',status:response.status});
    if(!response.ok)throw Object.assign(new Error(upstreamMessage(body,response.status)),{code:'UPSTREAM_HTTP',status:response.status});
    let data;
    try{data=JSON.parse(body)}catch{throw Object.assign(new Error('invalid upstream json'),{code:'INVALID_UPSTREAM_JSON',status:502})}
    const uuid=cleanText(data?.id,80);
    if(!/^[0-9a-f-]{36}$/i.test(uuid)||!data?.uploadURL)throw Object.assign(new Error('upload slot missing'),{code:'UPLOAD_SLOT_INVALID',status:502});
    await putToPresignedUrl(data.uploadURL,req,{contentType,length});
    return json(res,200,{uuid,type:kind,mimeType:contentType,sizeKB:Math.max(1,Math.round(length/1024)),name:fileName});
  }catch(error){
    if(!req.complete)req.resume();
    if(error?.code==='REQUEST_ABORTED')return res.destroy();
    log('warn','Upload failed',{code:error?.code,status:error?.status,message:error?.message});
    if(error?.code==='UPLOAD_SIZE_MISMATCH')return json(res,400,{error:message(req,'uploadFailed',error.code),code:error.code});
    return accountError(req,res,error);
  }
}
function cleanUploadMeta(meta){
  if(!meta||typeof meta!=='object'||Array.isArray(meta))return null;
  const out={};
  const text=(key,max)=>{const value=cleanText(meta[key],max);if(value)out[key]=value};
  text('prompt',20000);text('negativePrompt',20000);text('sampler',120);text('Model',200);text('Size',40);text('Model hash',40);text('Clip skip',10);text('scheduler',60);
  for(const key of ['steps','cfgScale','seed','clipSkip']){const value=Number(meta[key]);if(Number.isFinite(value))out[key]=value}
  return Object.keys(out).length?out:null;
}
function cleanUploadImage(image,index){
  const uuid=cleanText(image?.uuid,80);
  if(!/^[0-9a-f-]{36}$/i.test(uuid))return null;
  const type=image?.type==='video'?'video':'image';
  const mimeType=UPLOAD_TYPES[String(image?.mimeType||'')]?String(image.mimeType):undefined;
  const width=Math.round(Number(image?.width)),height=Math.round(Number(image?.height));
  const sizeKB=Math.round(Number(image?.sizeKB));
  const out={url:uuid,name:cleanText(image?.name,200)||`upload-${index+1}`,type,index};
  if(mimeType)out.mimeType=mimeType;
  if(Number.isSafeInteger(width)&&width>0&&width<=20000)out.width=width;
  if(Number.isSafeInteger(height)&&height>0&&height<=20000)out.height=height;
  if(Number.isSafeInteger(sizeKB)&&sizeKB>0)out.sizeKB=sizeKB;
  const meta=type==='image'?cleanUploadMeta(image?.meta):null;
  if(meta)out.meta=meta;
  if(type==='video'){
    const duration=Number(image?.duration);
    if(Number.isFinite(duration)&&duration>0)out.metadata={duration:Math.round(duration*1000)/1000,...(out.width?{width:out.width}:{}),...(out.height?{height:out.height}:{})};
  }
  return out;
}
async function handleAccountWrite(req,res,url){
  if(!trustedWriteRequest(req))return json(res,403,{error:message(req,'forbiddenWrite'),code:'FORBIDDEN_ORIGIN'});
  if(!token())return json(res,401,{error:message(req,'accountNoToken'),code:'NO_TOKEN'});
  const pathname=url.pathname;
  if(pathname==='/api/account/upload'){
    if(!req.headers['x-file-name'])return json(res,400,{error:message(req,'uploadType'),code:'UPLOAD_HEADER'});
    return handleUpload(req,res);
  }
  if(!requestIsJson(req))return json(res,415,{error:message(req,'jsonRequired'),code:'JSON_REQUIRED'});
  let body;
  try{body=await readBody(req)}catch(error){return bodyError(req,res,error)}
  try{
    if(pathname==='/api/account/posts'){
      const images=(Array.isArray(body.images)?body.images:[]).slice(0,20).map(cleanUploadImage).filter(Boolean);
      if(!images.length)return json(res,400,{error:message(req,'postNoMedia'),code:'POST_NO_MEDIA'});
      const title=cleanText(body.title,255);
      const detail=cleanText(body.detail,5000);
      const input={images,publish:body.publish!==false};
      if(title)input.title=title;
      if(detail)input.detail=detail;
      const post=await civTrpcMutation('post.createWithImages',input);
      invalidateAccountContent();
      return json(res,200,{id:positiveId(post?.id),publishedAt:post?.publishedAt||null,imageIds:(Array.isArray(post?.imageIds)?post.imageIds:[]).map(positiveId).filter(Boolean)});
    }
    if(pathname==='/api/account/collections/items'){
      const ref=collectionItemRef(body.type,body.id);
      const collectionId=positiveId(body.collectionId);
      if(!ref||!collectionId)return json(res,400,{error:message(req,'invalidId'),code:'INVALID_ID'});
      const action=body.action==='remove'?'remove':'add';
      if(action==='add')await civTrpcMutation('collection.saveItem',{type:ref.type,[ref.key]:ref.itemId,collections:[{collectionId}]});
      else await civTrpcMutation('collection.removeFromCollection',{collectionId,itemId:ref.itemId});
      invalidateCollections();
      return json(res,200,{ok:true,action,collectionId,type:ref.type,id:ref.itemId});
    }
    if(pathname==='/api/account/collections/create'){
      const name=cleanText(body.name,30);
      if(!name)return json(res,400,{error:message(req,'collectionNameRequired'),code:'NAME_REQUIRED'});
      const type=COLLECTION_TYPES.includes(body.type)?body.type:'Model';
      const read=['Private','Public','Unlisted'].includes(body.read)?body.read:'Private';
      const input={name,type,read,write:'Private'};
      const ref=body.itemId!=null?collectionItemRef(type,body.itemId):null;
      if(ref)input[ref.key]=ref.itemId;
      const created=await civTrpcMutation('collection.upsert',input);
      invalidateCollections();
      return json(res,200,{id:positiveId(created?.id),name:cleanText(created?.name,200)||name,type:COLLECTION_TYPES.includes(created?.type)?created.type:type,read:cleanText(created?.read,40)||read,mode:cleanText(created?.mode,40)||null,description:'',isOwner:true,cover:null,itemAdded:!!ref});
    }
    const postDelete=pathname.match(/^\/api\/account\/posts\/(\d+)\/delete$/);
    if(postDelete){
      const id=positiveId(postDelete[1]);
      if(!id)return json(res,400,{error:message(req,'invalidId'),code:'INVALID_ID'});
      await civTrpcMutation('post.delete',{id});
      invalidateAccountContent();
      return json(res,200,{ok:true,id});
    }
    const imageDelete=pathname.match(/^\/api\/account\/images\/(\d+)\/delete$/);
    if(imageDelete){
      const id=positiveId(imageDelete[1]);
      if(!id)return json(res,400,{error:message(req,'invalidId'),code:'INVALID_ID'});
      await civTrpcMutation('image.delete',{id});
      invalidateAccountContent();
      return json(res,200,{ok:true,id});
    }
    return json(res,404,{error:message(req,'apiNotFound')});
  }catch(error){
    if(error?.code==='NO_PERMISSION'&&/\/delete$/.test(pathname)){
      const scope=await accountIdentity().then(identity=>identity.tokenScope).catch(()=>null);
      if(Number.isSafeInteger(scope)&&(scope&TOKEN_SCOPE.MediaDelete))return json(res,404,{error:message(req,'contentMissing'),code:'NOT_FOUND'});
    }
    if(error?.code==='TRPC_ERROR'&&error.status&&error.status<500&&error.status!==429)return json(res,error.status===404?404:400,{error:message(req,'civitaiRejected',cleanText(error.upstreamMessage||error.message,300)),code:'CIVITAI_REJECTED'});
    return accountError(req,res,error);
  }
}
async function civRestAuth(pathname){
  const response=await civFetch(`${API_BASE}${pathname}`,{useAuth:true});
  const body=await readTextLimited(response);
  if(response.status===401||response.status===403)throw Object.assign(new Error('forbidden'),{code:'NO_PERMISSION',status:response.status});
  if(!response.ok)throw Object.assign(new Error(upstreamMessage(body,response.status)),{code:'UPSTREAM_HTTP',status:response.status});
  return JSON.parse(body);
}
async function cachedAccount(key,loader,maxAge=ACCOUNT_CACHE_MS){
  const cacheKey=`account:${key}`;
  const hit=cacheGet(cacheKey,maxAge);
  if(hit)return JSON.parse(hit.body);
  let job=inflight.get(cacheKey);
  if(!job){
    job=loader().then(data=>{cacheSet(cacheKey,JSON.stringify(data));return data}).finally(()=>inflight.delete(cacheKey));
    inflight.set(cacheKey,job);
  }
  return job;
}
function civitaiMediaFromUuid(media){
  const raw=cleanText(media?.url,600);
  if(!raw)return '';
  if(/^https?:\/\//i.test(raw))return safeRemoteUrl(raw);
  if(!/^[a-z0-9-]{8,80}$/i.test(raw))return '';
  const id=positiveId(media?.id);
  const isVideo=String(media?.type||'').toLowerCase()==='video';
  return `${CIVITAI_IMAGE_EDGE}/${raw}/original=true/${id||'media'}.${isVideo?'mp4':'jpeg'}`;
}
function accountMedia(media){
  if(!media||typeof media!=='object')return null;
  const url=civitaiMediaFromUuid(media);
  if(!url)return null;
  const width=Number(media.width),height=Number(media.height);
  return {
    url,
    type:String(media.type||'').toLowerCase()==='video'?'video':'image',
    ...(Number.isFinite(width)&&width>0?{width:Math.round(width)}:{}),
    ...(Number.isFinite(height)&&height>0?{height:Math.round(height)}:{})
  };
}
function sumStats(stats,keys){let total=0;for(const key of keys){const value=Number(stats?.[key]);if(Number.isFinite(value))total+=value}return total}
function accountImage(image){
  const id=positiveId(image?.id);
  const media=accountMedia(image);
  if(!id||!media)return null;
  const stats=image.stats||{};
  return {
    id,
    ...media,
    kind:'image',
    name:cleanText(image.name,260),
    postId:positiveId(image.postId),
    nsfwLevel:Number(image.nsfwLevel)||0,
    createdAt:cleanText(image.createdAt||image.publishedAt,64),
    publishedAt:cleanText(image.publishedAt,64),
    author:cleanText(image.user?.username,120),
    reactions:sumStats(stats,['likeCountAllTime','heartCountAllTime','laughCountAllTime','cryCountAllTime']),
    comments:Number(stats.commentCountAllTime)||0
  };
}
function accountPost(post){
  const id=positiveId(post?.id);
  if(!id)return null;
  const images=(Array.isArray(post.images)?post.images:[]).map(image=>accountImage({...image,user:post.user,postId:id,publishedAt:image.publishedAt||post.publishedAt})).filter(Boolean).slice(0,50);
  const stats=post.stats||{};
  return {
    id,
    kind:'post',
    title:cleanText(post.title,300),
    publishedAt:cleanText(post.publishedAt,64),
    imageCount:Number(post.imageCount)||images.length,
    author:cleanText(post.user?.username,120),
    reactions:sumStats(stats,['likeCount','heartCount','laughCount','cryCount']),
    comments:Number(stats.commentCount)||0,
    cover:images[0]||null,
    images
  };
}
function accountArticle(article){
  const id=positiveId(article?.id);
  if(!id)return null;
  const cover=accountMedia(article.coverImage||(article.cover?{url:article.cover,type:'image',id}:null));
  return {id,kind:'article',title:cleanText(article.title,300),author:cleanText(article.user?.username,120),publishedAt:cleanText(article.publishedAt,64),...(cover?{cover}:{})};
}
function accountModel(model){
  if(!model||typeof model!=='object')return null;
  const images=(Array.isArray(model.images)?model.images:[]).map(accountMedia).filter(Boolean);
  const rank=model.rank||{};
  return compactCatalogModel({
    id:model.id,
    name:model.name,
    type:model.type,
    baseModels:model.baseModels||(model.version?.baseModel?[model.version.baseModel]:[]),
    creator:{username:model.user?.username},
    stats:{downloadCount:rank.downloadCount,favoriteCount:rank.collectedCount,thumbsUpCount:rank.thumbsUpCount},
    preview:images[0]||null
  });
}
function accountCursor(value){
  const raw=cleanText(value,200);
  if(!raw)return undefined;
  if(/^\d{1,15}$/.test(raw))return Number(raw);
  return raw;
}
function pageResult(data,mapper){
  const items=(Array.isArray(data?.items)?data.items:[]).map(mapper).filter(Boolean);
  const next=data?.nextCursor;
  return {items,nextCursor:next===undefined||next===null||next===''?null:String(next)};
}
async function accountIdentity(){
  return cachedAccount('identity',async()=>{
    const me=await civRestAuth('/api/v1/me');
    let avatar='';
    try{
      const creator=await civTrpc('user.getCreator',{id:Number(me.id)});
      avatar=creator?.profilePicture?civitaiMediaFromUuid({...creator.profilePicture,type:'image'}):cleanText(creator?.image,600);
      if(avatar&&!/^https:\/\//i.test(avatar))avatar='';
    }catch{}
    return {
      id:positiveId(me.id),
      username:cleanText(me.username,120),
      status:cleanText(me.status,40),
      isMember:!!me.isMember,
      tokenScope:Number.isSafeInteger(me.tokenScope)?me.tokenScope:null,
      avatar
    };
  },600000);
}
async function accountProfile(){
  return cachedAccount('profile',async()=>{
    const identity=await accountIdentity();
    let buzz=null,buzzError=null;
    try{
      const accounts=await civTrpc('buzz.getBuzzAccount',{});
      if(accounts&&typeof accounts==='object'){
        const parts={};
        for(const [key,value] of Object.entries(accounts)){const amount=Number(value);if(Number.isFinite(amount)&&/^[a-z]{1,20}$/i.test(key))parts[key.toLowerCase()]=amount}
        buzz={...parts,total:Object.values(parts).reduce((sum,value)=>sum+value,0)};
      }
    }catch(error){
      if(error?.status===429)throw error;
      buzzError=error.code==='NO_PERMISSION'?'NO_PERMISSION':(error.code||'FAILED');
    }
    return {...identity,buzz,buzzError};
  },15000);
}
function accountError(req,res,error){
  if(error?.code==='NO_PERMISSION')return json(res,403,{error:message(req,'accountNoPermission'),code:'NO_PERMISSION'});
  if(Number(error?.status)===429){
    const retryAfter=Math.max(1,Math.ceil(rateLimitRemainingMs()/1000));
    res.setHeader('Retry-After',String(retryAfter));
    return json(res,429,{error:message(req,'limited'),code:'RATE_LIMITED',retryable:true,retryAfter});
  }
  const info=errorInfo(error);
  log('warn','Account request failed',{code:info.code,status:error?.status,message:info.message});
  const status=Number(error?.status);
  const code=status>=400&&status<600?status:502;
  return json(res,code,{error:message(req,'accountFailed',error?.code||status||info.code),code:error?.code||'ACCOUNT_FAILED',retryable:isRetryableStatus(code)});
}
async function handleAccountApi(req,res,url){
  if(req.method==='POST')return handleAccountWrite(req,res,url);
  if(req.method!=='GET')return json(res,405,{error:message(req,'apiNotFound')});
  if(!token())return json(res,401,{error:message(req,'accountNoToken'),code:'NO_TOKEN'});
  const pathname=url.pathname;
  const cursor=accountCursor(url.searchParams.get('cursor'));
  const limit=Math.min(100,Math.max(1,Number.parseInt(url.searchParams.get('limit')||'40',10)||40));
  try{
    if(pathname==='/api/account'){
      if(url.searchParams.get('fresh')==='1')removeCacheEntry('account:profile');
      return json(res,200,await accountProfile());
    }
    if(pathname==='/api/account/collections'){
      const list=await cachedAccount('collections',()=>civTrpc('collection.getAllUser',{}));
      const items=(Array.isArray(list)?list:[]).map(item=>{
        const id=positiveId(item?.id);
        if(!id)return null;
        const type=COLLECTION_TYPES.includes(item.type)?item.type:'Model';
        return {id,name:cleanText(item.name,200)||`#${id}`,description:cleanText(item.description,500),type,mode:cleanText(item.mode,40)||null,read:cleanText(item.read,40),isOwner:item.isOwner!==false,cover:accountMedia(item.image)};
      }).filter(Boolean);
      return json(res,200,{items});
    }
    if(pathname==='/api/account/collections/for-item'){
      const ref=collectionItemRef(url.searchParams.get('type'),url.searchParams.get('id'));
      if(!ref)return json(res,400,{error:message(req,'invalidId'),code:'INVALID_ID'});
      const rows=await civTrpc('collection.getUserCollectionItemsByItem',{[ref.key]:ref.itemId,type:ref.type});
      const items=(Array.isArray(rows)?rows:[]).map(row=>({collectionId:positiveId(row?.collectionId),canRemove:row?.canRemoveItem!==false})).filter(row=>row.collectionId);
      return json(res,200,{type:ref.type,id:ref.itemId,items});
    }
    const collectionMatch=pathname.match(/^\/api\/account\/collections\/(\d+)$/);
    if(collectionMatch){
      const collectionId=positiveId(collectionMatch[1]);
      if(!collectionId)return json(res,400,{error:message(req,'invalidId'),code:'INVALID_ID'});
      const type=COLLECTION_TYPES.includes(url.searchParams.get('type'))?url.searchParams.get('type'):'Model';
      const base={collectionId,limit,cursor,browsingLevel:ACCOUNT_BROWSING_LEVEL,period:'AllTime'};
      const bookmark=type==='Model'&&url.searchParams.get('mode')==='Bookmark';
      const key=`collection:${collectionId}:${type}:${bookmark?'bookmark':''}:${limit}:${cursor??''}`;
      const page=await cachedAccount(key,async()=>{
        if(bookmark){
          const query=new URLSearchParams({favorites:'true',nsfw:'true',limit:String(limit)});
          if(cursor!==undefined)query.set('cursor',String(cursor));
          const data=await civRestAuth(`/api/v1/models?${query}`);
          const next=cleanText(data?.metadata?.nextCursor,300);
          return {kind:'model',items:(Array.isArray(data?.items)?data.items:[]).map(compactCatalogModel).filter(Boolean),nextCursor:next||null};
        }
        if(type==='Image')return {kind:'image',...pageResult(await civTrpc('image.getInfinite',{...base,sort:'Newest',withMeta:false}),accountImage)};
        if(type==='Post')return {kind:'post',...pageResult(await civTrpc('post.getInfinite',{...base,sort:'Newest'}),accountPost)};
        if(type==='Article')return {kind:'article',...pageResult(await civTrpc('article.getInfinite',{...base,sort:'Newest'}),accountArticle)};
        return {kind:'model',...pageResult(await civTrpc('model.getAll',{...base,sort:'Newest'}),accountModel)};
      });
      return json(res,200,page);
    }
    if(pathname==='/api/account/images'||pathname==='/api/account/posts'){
      const profile=await accountProfile();
      if(!profile.id||!profile.username)return json(res,502,{error:message(req,'accountFailed','NO_PROFILE'),code:'NO_PROFILE'});
      const images=pathname==='/api/account/images';
      const key=`${images?'images':'posts'}:${profile.id}:${limit}:${cursor??''}`;
      const page=await cachedAccount(key,async()=>images
        ?{kind:'image',...pageResult(await civTrpc('image.getInfinite',{userId:profile.id,username:profile.username,limit,cursor,sort:'Newest',period:'AllTime',browsingLevel:ACCOUNT_BROWSING_LEVEL,withMeta:false}),accountImage)}
        :{kind:'post',...pageResult(await civTrpc('post.getInfinite',{username:profile.username,limit,cursor,sort:'Newest',period:'AllTime',browsingLevel:ACCOUNT_BROWSING_LEVEL}),accountPost)});
      return json(res,200,page);
    }
    const imageMatch=pathname.match(/^\/api\/account\/images\/(\d+)$/);
    if(imageMatch){
      const imageId=positiveId(imageMatch[1]);
      if(!imageId)return json(res,400,{error:message(req,'invalidId'),code:'INVALID_ID'});
      const data=await cachedAccount(`image-info:${imageId}`,async()=>{
        const info=await civTrpc('image.getGenerationData',{id:imageId});
        const meta=info?.meta&&typeof info.meta==='object'?info.meta:{};
        const pick=key=>cleanText(meta[key],key==='prompt'||key==='negativePrompt'?6000:120);
        return {
          id:imageId,
          prompt:pick('prompt'),
          negativePrompt:pick('negativePrompt'),
          sampler:pick('sampler'),
          steps:pick('steps'),
          cfgScale:pick('cfgScale'),
          seed:pick('seed'),
          size:pick('Size'),
          techniques:(Array.isArray(info?.techniques)?info.techniques:[]).map(item=>cleanText(item?.name,60)).filter(Boolean).slice(0,10),
          resources:(Array.isArray(info?.resources)?info.resources:[]).map(item=>({modelId:positiveId(item?.modelId),modelName:cleanText(item?.modelName,200),modelType:cleanText(item?.modelType,60),versionName:cleanText(item?.versionName,120),baseModel:cleanText(item?.baseModel,120),strength:Number.isFinite(Number(item?.strength))&&item?.strength!==null?Number(item.strength):null})).filter(item=>item.modelId||item.modelName).slice(0,30)
        };
      },MODEL_DETAIL_CACHE_MS);
      return json(res,200,data);
    }
    return json(res,404,{error:message(req,'apiNotFound')});
  }catch(error){return accountError(req,res,error)}
}
async function handleLockApi(req,res,url){
  if(req.method!=='POST')return json(res,405,{error:message(req,'apiNotFound')});
  if(!trustedWriteRequest(req))return json(res,403,{error:message(req,'forbiddenWrite'),code:'FORBIDDEN_ORIGIN'});
  if(!requestIsJson(req))return json(res,415,{error:message(req,'jsonRequired'),code:'JSON_REQUIRED'});
  let body;
  try{body=await readBody(req)}catch(error){return bodyError(req,res,error)}
  const pathname=url.pathname;
  if(pathname==='/api/lock/unlock'){
    if(!lockEnabled())return json(res,200,{ok:true,status:status(req)});
    const wait=unlockDelayMs(req);
    if(wait>0){res.setHeader('Retry-After',String(Math.ceil(wait/1000)));return json(res,429,{error:message(req,'lockTooManyAttempts',Math.ceil(wait/1000)),code:'LOCK_THROTTLED',retryAfter:Math.ceil(wait/1000)})}
    if(typeof body.password!=='string'||!verifyPassword(body.password)){noteUnlockFailure(req);return json(res,401,{error:message(req,'lockWrongPassword'),code:'WRONG_PASSWORD'})}
    unlockFailures.delete(clientKey(req));
    createUnlockSession(res);
    return json(res,200,{ok:true,status:{...status(req),lock:{enabled:true,unlocked:true},maskedToken:maskToken(token())}});
  }
  if(pathname==='/api/lock/lock'){
    clearUnlockSession(req,res);
    return json(res,200,{ok:true,status:{...baseStatus(lockEnabled()),lock:{enabled:lockEnabled(),unlocked:!lockEnabled()}}});
  }
  if(isLockedRequest(req))return json(res,423,{error:message(req,'lockedMode'),code:'LOCKED'});
  if(pathname==='/api/lock/password'){
    if(lockEnabled()){
      if(typeof body.currentPassword!=='string'||!verifyPassword(body.currentPassword)){noteUnlockFailure(req);return json(res,401,{error:message(req,'lockWrongPassword'),code:'WRONG_PASSWORD'})}
    }
    if(!validNewPassword(body.newPassword))return json(res,400,{error:message(req,'lockPasswordRules'),code:'PASSWORD_RULES'});
    storePassword(body.newPassword);
    unlockSessions.clear();
    createUnlockSession(res);
    return json(res,200,{ok:true,status:{...status(req),lock:{enabled:true,unlocked:true}}});
  }
  if(pathname==='/api/lock/remove'){
    if(!lockEnabled())return json(res,200,{ok:true,status:status(req)});
    if(typeof body.currentPassword!=='string'||!verifyPassword(body.currentPassword)){noteUnlockFailure(req);return json(res,401,{error:message(req,'lockWrongPassword'),code:'WRONG_PASSWORD'})}
    try{fs.unlinkSync(path.join(DATA,'security.json'))}catch(error){if(error.code!=='ENOENT')throw error}
    unlockSessions.clear();
    clearUnlockSession(req,res);
    return json(res,200,{ok:true,status:{...status(req),lock:{enabled:false,unlocked:true}}});
  }
  return json(res,404,{error:message(req,'apiNotFound')});
}
function lockedRouteAllowed(req,url){
  const pathname=url.pathname;
  if(req.method==='GET'&&(pathname==='/api/status'||pathname==='/api/settings'||pathname==='/api/models'))return true;
  if(req.method==='GET'&&/^\/api\/models\/\d+$/.test(pathname))return true;
  if(req.method==='GET'&&/^\/api\/download\/\d+$/.test(pathname))return true;
  if(req.method==='POST'&&pathname==='/api/settings')return true;
  return false;
}
const versionSafety=new Map();
async function modelVersionIsSafe(versionId){
  const hit=versionSafety.get(versionId);
  if(hit&&Date.now()-hit.time<3600000)return hit.safe;
  const response=await civFetch(`${API_BASE}/api/v1/model-versions/${versionId}`);
  const body=await readTextLimited(response);
  if(!response.ok)throw Object.assign(new Error(`HTTP ${response.status}`),{code:'VERSION_LOOKUP_FAILED',status:response.status});
  const data=JSON.parse(body);
  const safe=data?.model?.nsfw===false;
  versionSafety.set(versionId,{safe,time:Date.now()});
  while(versionSafety.size>500)versionSafety.delete(versionSafety.keys().next().value);
  return safe;
}
async function handleApi(req,res,url){
  if(String(req.headers['sec-fetch-site']||'').toLowerCase()==='cross-site')return json(res,403,{error:message(req,'forbiddenWrite'),code:'CROSS_SITE_BLOCKED'});
  if(url.pathname.startsWith('/api/lock/'))return handleLockApi(req,res,url);
  const locked=isLockedRequest(req);
  if(locked&&!lockedRouteAllowed(req,url))return json(res,423,{error:message(req,'lockedMode'),code:'LOCKED'});
  if(req.method==='GET'&&url.pathname==='/api/status')return json(res,200,status(req));
  if(url.pathname==='/api/account'||url.pathname.startsWith('/api/account/'))return handleAccountApi(req,res,url);
  if(req.method==='GET'&&url.pathname==='/api/settings')return json(res,200,readJson('settings.json',{}));
  if(req.method==='POST'&&url.pathname==='/api/settings'){
    if(!trustedWriteRequest(req))return json(res,403,{error:message(req,'forbiddenWrite'),code:'FORBIDDEN_ORIGIN'});
    if(!requestIsJson(req))return json(res,415,{error:message(req,'jsonRequired'),code:'JSON_REQUIRED'});
    try{
      const body=await readBody(req);
      const current=readJson('settings.json',{});
      const next={...current};
      if(Number.isFinite(body.pageSize))next.pageSize=Math.min(100,Math.max(1,Math.round(body.pageSize)));
      if(typeof body.defaultType==='string')next.defaultType=body.defaultType.slice(0,80);
      if(typeof body.defaultBaseModel==='string')next.defaultBaseModel=body.defaultBaseModel.slice(0,120);
      if(typeof body.defaultSort==='string'&&['Highest Rated','Most Downloaded','Newest'].includes(body.defaultSort))next.defaultSort=body.defaultSort;
      if(typeof body.defaultPeriod==='string'&&['AllTime','Year','Month','Week','Day'].includes(body.defaultPeriod))next.defaultPeriod=body.defaultPeriod;
      if(typeof body.language==='string'&&['ru','en'].includes(body.language))next.language=body.language;
      delete next.liveRefresh;delete next.liveRefreshMs;
      if(locked&&((typeof body.apiToken==='string'&&body.apiToken.trim())||body.clearApiToken===true))return json(res,423,{error:message(req,'lockedMode'),code:'LOCKED'});
      const nextToken=typeof body.apiToken==='string'&&body.apiToken.trim()?normalizeToken(body.apiToken):'';
      writeJson('settings.json',next);
      if(nextToken)writeEnvToken(nextToken);
      else if(body.clearApiToken===true&&token())writeEnvToken('',{clear:true});
      return json(res,200,{settings:next,status:status(req)});
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
      if(locked){query.set('nsfw','false');query.delete('favorites');query.delete('hidden')}
      const search=(query.get('query')||'').trim();
      if(search&&search.length<SEARCH_MIN_LENGTH)return json(res,400,{error:message(req,'searchTooShort',SEARCH_MIN_LENGTH),code:'SEARCH_TOO_SHORT'});
      if(search)query.set('query',search);
      if(search&&(search.length<REMOTE_SEARCH_MIN_LENGTH||String(query.get('cursor')||'').startsWith('local:'))){
        const data=await buildFallbackSearch(query,search.length<REMOTE_SEARCH_MIN_LENGTH?'short-query':'local-cursor');
        res.setHeader('X-Civitai-Search-Mode','local-fallback');
        return json(res,200,data);
      }
      const upstreamUrl=`${API_BASE}/api/v1/models?${query}`;
      const cacheKey=`models:${locked?'safe':'full'}:${forceFallback?'fallback':'auto'}:${query.toString()}`;
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
        if(response.status!==429)log('warn','Civitai models error',{status:response.status,body:body.slice(0,240)});
        if(search&&isRetryableStatus(response.status)){
          try{
            const data=await buildFallbackSearch(query,`http-${response.status}`);
            res.setHeader('X-Civitai-Upstream-Status',String(response.status));
            res.setHeader('X-Civitai-Search-Mode','local-fallback');
            return json(res,200,data);
          }catch(fallbackError){log('error','Local fallback search failed',errorInfo(fallbackError))}
        }
        const friendly=response.status===503?message(req,'overloaded'):response.status===429?message(req,'limited'):upstream;
        const retryAfter=response.status===429?Math.max(1,Math.ceil(rateLimitRemainingMs()/1000)):undefined;
        if(retryAfter)res.setHeader('Retry-After',String(retryAfter));
        return json(res,response.status,{error:friendly,upstream:DEBUG?upstream:undefined,retryable:isRetryableStatus(response.status),retryAfter});
      }
      const compactBody=compactCatalogBody(body,{safe:locked});
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
    const modelId=positiveId(modelMatch[1]);
    if(!modelId)return json(res,400,{error:message(req,'invalidId'),code:'INVALID_ID'});
    const cacheKey=`model-detail:${locked?'safe':'full'}:${modelId}`;
    const fetchKey=`model-fetch:${modelId}`;
    try{
      const cached=cacheGet(cacheKey,MODEL_DETAIL_CACHE_MS);
      if(cached){res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, max-age=60','X-Local-Cache':'HIT'});return res.end(cached.body)}
      let job=inflight.get(fetchKey);
      if(!job){
        job=(async()=>{
          const upstreamUrl=`${API_BASE}/api/v1/models/${modelId}`;
          let response=await civFetch(upstreamUrl);
          if((response.status===401||response.status===403||response.status===404)&&token()){discardBody(response);response=await civFetch(upstreamUrl,{useAuth:true})}
          const body=await readTextLimited(response);
          return {response,body};
        })().finally(()=>inflight.delete(fetchKey));
        inflight.set(fetchKey,job);
      }
      const {response,body}=await job;
      if(!response.ok){
        const stale=cacheGet(cacheKey,STALE_CACHE_MS+MODEL_DETAIL_CACHE_MS);
        if(stale&&isRetryableStatus(response.status)){
          res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Local-Cache':'STALE','X-Civitai-Upstream-Status':String(response.status)});
          return res.end(stale.body);
        }
        return json(res,response.status,{error:message(req,'modelHttp',response.status),retryable:isRetryableStatus(response.status)});
      }
      let compactBody;
      try{compactBody=compactModelDetailBody(body,modelId,{safe:locked})}
      catch(error){if(error?.code==='LOCKED_NSFW')return json(res,423,{error:message(req,'lockedNsfw'),code:'LOCKED_NSFW'});throw error}
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
    const versionId=positiveId(download[1]);
    if(!versionId)return text(res,400,message(req,'invalidId'));
    const fileId=positiveId(url.searchParams.get('fileId'));
    const query=new URLSearchParams();
    if(fileId)query.set('fileId',String(fileId));
    const upstream=`${API_BASE}/api/download/models/${versionId}${query.size?`?${query}`:''}`;
    try{
      if(locked&&!(await modelVersionIsSafe(versionId).catch(()=>false)))return text(res,423,message(req,'lockedNsfw'));
      const response=await civFetch(upstream,{binary:true,useAuth:true});
      if(!response.ok){discardBody(response);return text(res,response.status,message(req,'downloadHttp',response.status))}
      if(!response.body)return text(res,502,message(req,'downloadFailed','EMPTY_BODY'));
      const rawDisposition=String(response.headers.get('content-disposition')||'').replace(/[\r\n]/g,'').slice(0,512);
      const disposition=/^attachment(?:;|$)/i.test(rawDisposition)?rawDisposition:`attachment; filename="civitai-${versionId}.bin"`;
      const headers={'Content-Type':response.headers.get('content-type')||'application/octet-stream','Content-Disposition':disposition,'Cache-Control':'no-store'};
      const length=response.headers.get('content-length');
      const encoding=String(response.headers.get('content-encoding')||'identity').toLowerCase();
      if(length&&/^\d+$/.test(length)&&encoding==='identity')headers['Content-Length']=length;
      res.writeHead(200,headers);
      return pipeline(Readable.fromWeb(response.body),res,error=>{if(error&&error.code!=='ERR_STREAM_PREMATURE_CLOSE')log('warn','Download stream interrupted',{versionId,code:error.code||error.name})});
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
    const stat=file?fs.statSync(file,{throwIfNoEntry:false}):null;
    if(stat?.isFile()){
      const ext=path.extname(file).toLowerCase();
      const etag=`W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
      const headers={'Content-Type':mime(file),'Cache-Control':['.html','.js','.css'].includes(ext)?'no-cache':'public, max-age=3600','ETag':etag,'Last-Modified':stat.mtime.toUTCString()};
      if(String(req.headers['if-none-match']||'')===etag){res.writeHead(304,headers);return res.end()}
      headers['Content-Length']=stat.size;
      res.writeHead(200,headers);
      if(req.method==='HEAD')return res.end();
      return pipeline(fs.createReadStream(file),res,error=>{if(error&&error.code!=='ERR_STREAM_PREMATURE_CLOSE')log('warn','Static file stream failed',{file:path.basename(file),code:error.code})});
    }
    return text(res,404,'Файл не найден');
  }catch(error){
    log('error','Unhandled server error',{error:error.message,stack:DEBUG?error.stack:undefined});
    if(!res.headersSent)return json(res,500,{error:message(req,'internal')});
    res.end();
  }
});
server.requestTimeout=3600000;
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
    if(REMOTE_ACCESS)log('warn','HTTP request timed out',meta);
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
if(REMOTE_ACCESS)log('warn','Remote access is enabled; anyone who can reach this host may use the local API',{host:HOST});
server.listen(PORT,HOST,()=>{ready();if(!token())log('warn','CIVITAI_API_TOKEN is not configured; open Settings in the UI and save your API key')});
let shuttingDown=false;
function shutdown(signal){
  if(shuttingDown)return;
  shuttingDown=true;
  console.log(`[STOP] ${signal} received, closing server`);
  server.close(()=>process.exit(0));
  server.closeIdleConnections?.();
  setTimeout(()=>{server.closeAllConnections?.();process.exit(0)},3000).unref();
}
for(const signal of ['SIGINT','SIGTERM','SIGBREAK'])try{process.on(signal,()=>shutdown(signal))}catch{}

