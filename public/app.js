const $=selector=>document.querySelector(selector);
const I18N={
  ru:{
    home:'Главная',search:'Поиск',settings:'Настройки',modelDetails:'Подробности модели',showToken:'Показать API-ключ',hideToken:'Скрыть API-ключ',openModel:'Открыть модель {name}',navigation:'Навигация',discover:'Обзор',favorites:'Избранное',filters:'Фильтры',modelType:'Тип модели',allTypes:'Все типы',baseModel:'Базовая модель',allBaseModels:'Все базовые модели',groupSdxl:'SDXL-экосистема',groupFlux:'Flux и новые',groupVideo:'Видео',other:'Другое',sorting:'Сортировка',sortRated:'Самые высоко оценённые',sortDownloaded:'Самые скачиваемые',sortNewest:'Самые новые',period:'Период',periodAll:'За всё время',periodYear:'За год',periodMonth:'За месяц',periodWeek:'За неделю',periodDay:'За день',resetFilters:'Сбросить фильтры',apiChecking:'Проверка API…',serverConnected:'Сервер подключён',catalog:'КАТАЛОГ',results:'результатов',refresh:'Обновить',loading:'Получаем данные Civitai…',emptyTitle:'Здесь пока пусто',emptyText:'Попробуй изменить запрос или фильтры.',loadMore:'Показать ещё',system:'СИСТЕМА',tokenDescription:'API-ключ хранится постоянно на сервере в .env, не имеет таймера удаления и не передаётся интерфейсу.',apiToken:'API-ключ Civitai',tokenPlaceholder:'Введите API key',saveSettings:'Сохранить настройки',discoverTitle:'Популярные модели',discoverSubtitle:'Обновляется только вручную',favoritesTitle:'Избранное',favoritesSubtitle:'Сохранённые модели',image:'ИЗОБРАЖЕНИЕ',video:'ВИДЕО',unknownAuthor:'Неизвестный автор',baseModelTitle:'Базовая модель: {value}',addedFavorite:'Добавлено в избранное',removedFavorite:'Удалено из избранного',favoriteError:'Не удалось изменить избранное: {error}',filtersSaveError:'Не удалось сохранить фильтры',fallbackNotice:'Поиск Civitai сейчас перегружен — включён резервный поиск. Проверено моделей: {scanned}, найдено совпадений: {total}.',noMoreModels:'Новых моделей больше нет.',repeatedModels:'Civitai сейчас повторяет одну и ту же выдачу. Новые карточки не добавлены.',retrying:'{error} Автоматический повтор через 5 секунд…',loadModelsError:'Не удалось получить модели: {error}',author:'Автор',descriptionMissing:'Описание отсутствует',versionsFiles:'Версии и файлы',modelFile:'Файл модели',download:'Скачать',noFiles:'Нет доступных файлов',downloadStarted:'Загрузка началась',loadingModel:'Загрузка модели…',modelOpenError:'Не удалось открыть модель: {error}',modelDetailsError:'Не удалось загрузить подробности модели: {error}',apiConfigured:'API-ключ настроен',apiMissing:'API-ключ не задан',serverOnline:'Сервер онлайн · {host}{version}',tokenSaved:'Сохранён постоянно в .env: {token}',tokenMissing:'Ключ пока не сохранён',searchPlaceholder:'Найти модель, LoRA, checkpoint… (от {min} симв.)',searchTooShort:'Для поиска введи минимум {min} символа.',settingsSaved:'✓ Настройки сохранены',settingsToast:'Настройки сохранены',settingsError:'Ошибка: {error}',initializationError:'Ошибка запуска интерфейса: {error}',mediaLabel:'Медиа {number}',showAllVersions:'Показать все версии ({count})',showLessVersions:'Свернуть список версий',openOnCivitai:'Открыть на Civitai',switchLanguage:'Switch to English',byteB:'Б',byteKB:'КБ',byteMB:'МБ',byteGB:'ГБ'
  },
  en:{
    home:'Home',search:'Search',settings:'Settings',modelDetails:'Model details',showToken:'Show API key',hideToken:'Hide API key',openModel:'Open model {name}',navigation:'Navigation',discover:'Discover',favorites:'Favorites',filters:'Filters',modelType:'Model type',allTypes:'All types',baseModel:'Base model',allBaseModels:'All base models',groupSdxl:'SDXL ecosystem',groupFlux:'Flux and newer',groupVideo:'Video',other:'Other',sorting:'Sort',sortRated:'Highest rated',sortDownloaded:'Most downloaded',sortNewest:'Newest',period:'Period',periodAll:'All time',periodYear:'Year',periodMonth:'Month',periodWeek:'Week',periodDay:'Day',resetFilters:'Reset filters',apiChecking:'Checking API…',serverConnected:'Server connected',catalog:'CATALOG',results:'results',refresh:'Refresh',loading:'Loading Civitai data…',emptyTitle:'Nothing here yet',emptyText:'Try changing your search or filters.',loadMore:'Show more',system:'SYSTEM',tokenDescription:'The API key is stored permanently on the server in .env, has no deletion timer, and is never exposed to the interface.',apiToken:'Civitai API key',tokenPlaceholder:'Enter API key',saveSettings:'Save settings',discoverTitle:'Popular models',discoverSubtitle:'Updates only when requested',favoritesTitle:'Favorites',favoritesSubtitle:'Saved models',image:'IMAGE',video:'VIDEO',unknownAuthor:'Unknown author',baseModelTitle:'Base model: {value}',addedFavorite:'Added to favorites',removedFavorite:'Removed from favorites',favoriteError:'Failed to update favorites: {error}',filtersSaveError:'Failed to save filters',fallbackNotice:'Civitai search is overloaded, so fallback search is active. Scanned: {scanned}, matches: {total}.',noMoreModels:'There are no more new models.',repeatedModels:'Civitai is repeating the same results. No new cards were added.',retrying:'{error} Retrying automatically in 5 seconds…',loadModelsError:'Failed to load models: {error}',author:'Author',descriptionMissing:'No description available',versionsFiles:'Versions and files',modelFile:'Model file',download:'Download',noFiles:'No files available',downloadStarted:'Download started',loadingModel:'Loading model…',modelOpenError:'Failed to open model: {error}',modelDetailsError:'Failed to load model details: {error}',apiConfigured:'API key configured',apiMissing:'API key not configured',serverOnline:'Server online · {host}{version}',tokenSaved:'Stored permanently in .env: {token}',tokenMissing:'The key has not been saved yet',searchPlaceholder:'Find a model, LoRA, checkpoint… ({min}+ chars)',searchTooShort:'Enter at least {min} characters to search.',settingsSaved:'✓ Settings saved',settingsToast:'Settings saved',settingsError:'Error: {error}',initializationError:'Interface startup error: {error}',mediaLabel:'Media {number}',showAllVersions:'Show all versions ({count})',showLessVersions:'Show fewer versions',openOnCivitai:'Open on Civitai',switchLanguage:'Переключить на русский',byteB:'B',byteKB:'KB',byteMB:'MB',byteGB:'GB'
  }
};
const storedLocale=localStorage.getItem('civitai.language');
const state={view:'discover',items:[],meta:null,page:1,loading:false,settings:null,retryTimer:null,activeSearch:'',searchMinLength:2,favorites:new Set(),favoriteItems:[],usedPagination:new Set(),paginationSource:'auto',modelDetails:new Map(),modelDetailPromises:new Map(),locale:storedLocale==='en'?'en':'ru',openModelId:null,modalRequest:0,showAllVersions:false,catalogSeq:0,catalogAbort:null,favoriteBusy:new Set()};
const dbg=(type,...args)=>{if(type!=='warn'&&type!=='error')return;console.warn('[CivitaiRed:WARN]',...args)};
window.addEventListener('error',event=>dbg('error','UI error',event.message,event.error));
window.addEventListener('unhandledrejection',event=>dbg('error','Unhandled promise',event.reason));
function t(key,vars={}){let value=I18N[state.locale]?.[key]??I18N.ru[key]??key;for(const [name,replacement] of Object.entries(vars))value=String(value).replaceAll(`{${name}}`,String(replacement));return value}
function localeName(){return state.locale==='en'?'en-US':'ru-RU'}
function applyTranslations(){
  document.documentElement.lang=state.locale;
  document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n)});
  document.querySelectorAll('[data-i18n-title]').forEach(el=>{el.title=t(el.dataset.i18nTitle)});
  document.querySelectorAll('[data-i18n-aria]').forEach(el=>{el.setAttribute('aria-label',t(el.dataset.i18nAria))});
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{el.placeholder=t(el.dataset.i18nPlaceholder)});
  $('#languageBtn').textContent=state.locale==='ru'?'EN':'RU';
  $('#languageBtn').title=t('switchLanguage');
  $('#languageBtn').setAttribute('aria-label',t('switchLanguage'));
  $('#modalClose').setAttribute('aria-label',state.locale==='ru'?'Закрыть':'Close');
  $('#settingsClose').setAttribute('aria-label',state.locale==='ru'?'Закрыть':'Close');
  $('#toggleToken').setAttribute('aria-label',t($('#apiToken').type==='password'?'showToken':'hideToken'));
  refreshSelectLabels();
  applyStatusText();
  updateViewText();
}
function toast(message,type='ok'){const el=document.createElement('div');el.className=`toast ${type}`;el.textContent=message;$('#toasts').append(el);setTimeout(()=>el.remove(),3500)}
let activeDialog=null;
let dialogReturnFocus=null;
function focusableIn(dialog){return [...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>!el.closest('.hidden')&&el.offsetParent!==null)}
function showDialog(dialog,preferredSelector){
  if(!dialog)return;
  if(dialog.classList.contains('hidden'))dialogReturnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
  dialog.classList.remove('hidden');dialog.setAttribute('aria-hidden','false');activeDialog=dialog;document.body.classList.add('modal-open');
  requestAnimationFrame(()=>{const preferred=preferredSelector?dialog.querySelector(preferredSelector):null;(preferred||focusableIn(dialog)[0])?.focus()});
}
function hideDialog(dialog){
  if(!dialog)return;
  dialog.classList.add('hidden');dialog.setAttribute('aria-hidden','true');
  if(activeDialog===dialog)activeDialog=null;
  if(!document.querySelector('.modal:not(.hidden)'))document.body.classList.remove('modal-open');
  const restore=dialogReturnFocus;dialogReturnFocus=null;if(restore?.isConnected)restore.focus();
}
function trapDialogTab(event){
  if(!activeDialog||event.key!=='Tab')return;
  const focusable=focusableIn(activeDialog);if(!focusable.length){event.preventDefault();return}
  const first=focusable[0],last=focusable[focusable.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
}
function fmt(value){if(!Number.isFinite(Number(value)))return '—';return Intl.NumberFormat(localeName(),{notation:'compact',maximumFractionDigits:1}).format(Number(value))}
function formatBytes(bytes){const value=Number(bytes);if(!Number.isFinite(value)||value<=0)return '';const units=[t('byteB'),t('byteKB'),t('byteMB'),t('byteGB')];let n=value;let i=0;while(n>=1024&&i<units.length-1){n/=1024;i++}return `${Intl.NumberFormat(localeName(),{maximumFractionDigits:n>=100?0:n>=10?1:2}).format(n)} ${units[i]}`}
function esc(value=''){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))}
function modelTypeLabel(type=''){return type||'Model'}
function modelBaseModel(model){return String(model?.baseModel||model?.baseModels?.[0]||(model?.modelVersions||[]).find(version=>String(version?.baseModel||'').trim())?.baseModel||'')}
function plainText(value=''){return String(value??'').replace(/\s+/g,' ').trim()}
async function api(url,opt={}){
  try{
    const headers=new Headers(opt.headers||{});
    headers.set('x-ui-language',state.locale);
    const response=await fetch(url,{...opt,headers});
    let data;
    try{data=await response.json()}catch{data={error:`HTTP ${response.status}`}}
    if(!response.ok){
      dbg('error','Local API request failed',{url,status:response.status,error:data.error,detail:data.detail,upstream:data.upstream,retryable:data.retryable});
      const error=new Error(data.error||data.message||`HTTP ${response.status}`);
      error.status=response.status;error.detail=data.detail;error.code=data.code;error.upstream=data.upstream;error.retryable=!!data.retryable;
      throw error;
    }
    return data;
  }catch(error){if(error?.name==='AbortError')throw error;if(!error.status)dbg('error','Local API network error',{url,error});throw error}
}
function modelMedia(model){
  const out=[];
  const seen=new Set();
  if(model?.preview?.url){const preview=model.preview;seen.add(preview.url);out.push({url:preview.url,kind:String(preview.type||'image').toLowerCase().includes('video')?'video':'image',poster:preview.poster||'',width:Number(preview.width)||0,height:Number(preview.height)||0})}
  for(const version of model?.modelVersions||[]){
    for(const item of version?.images||[]){
      const url=item?.url||item?.src||'';
      if(!url||seen.has(url))continue;
      seen.add(url);
      const rawType=String(item?.type||item?.mimeType||item?.meta?.type||'').toLowerCase();
      const clean=url.split('?')[0].toLowerCase();
      const isVideo=rawType.includes('video')||/\.(mp4|webm|mov|m4v|m3u8)$/.test(clean)||/\b(transcode|video)=true\b/i.test(url);
      const poster=item?.meta?.thumbnailUrl||item?.thumbnailUrl||item?.poster||'';
      out.push({url,kind:isVideo?'video':'image',poster,width:Number(item?.width)||0,height:Number(item?.height)||0});
    }
  }
  return out;
}
function cover(model){return modelMedia(model)[0]||null}
const CARD_IMAGE_WIDTH=360;
const MAX_IMAGE_LOADS=3;
const MAX_PLAYING_VIDEOS=2;
const MAX_CLIENT_MODEL_DETAILS=12;
let mediaObserver=null;
let activeImageLoads=0;
const imageQueue=[];
const visibleCardVideos=new Set();
function optimizedImageUrl(url,width=CARD_IMAGE_WIDTH,quality=82){
  const value=String(url||'');
  if(!value||!/image\.civitai\.(com|red)/i.test(value))return value;
  try{
    const parsed=new URL(value,location.href);
    const parts=parsed.pathname.split('/').filter(Boolean);
    if(parts.length<2)return value;
    const targetWidth=Math.max(96,Math.min(900,Math.round(Number(width)||CARD_IMAGE_WIDTH)));
    const targetQuality=Math.max(55,Math.min(92,Math.round(Number(quality)||82)));
    const transformIndex=parts.length-2;
    if(/(?:^|,)(?:width|original|quality|optimized|anim)=/i.test(parts[transformIndex]||'')){
      const options=parts[transformIndex].split(',').filter(Boolean).filter(option=>!/^(?:width|original|quality|optimized)=/i.test(option));
      options.push(`width=${targetWidth}`,`quality=${targetQuality}`,'optimized=true');
      parts[transformIndex]=options.join(',');
    }else parts.splice(parts.length-1,0,`width=${targetWidth},quality=${targetQuality},optimized=true`);
    parsed.pathname=`/${parts.join('/')}`;
    return parsed.toString();
  }catch{return value}
}
function mediaHtml(media,{className='',autoplay=false,label=true,card=false,thumbnail=false}={}){
  if(!media)return '<div class="media-placeholder">◇</div>';
  if(thumbnail){
    if(media.kind==='video'){
      const poster=optimizedImageUrl(media.poster,112,72);
      return poster?`<img loading="lazy" decoding="async" fetchpriority="low" src="${esc(poster)}" alt=""><span class="media-mini-video">▶</span>`:'<div class="media-placeholder media-placeholder-small">▶</div>';
    }
    return `<img loading="lazy" decoding="async" fetchpriority="low" src="${esc(optimizedImageUrl(media.url,112,72))}" alt="">`;
  }
  if(media.kind==='video'){
    const poster=optimizedImageUrl(media.poster,card?CARD_IMAGE_WIDTH:480,78);
    if(card)return `<video class="${esc(className)} js-media-video js-card-video" muted loop playsinline preload="none" disablepictureinpicture disableremoteplayback controlslist="nodownload nofullscreen noremoteplayback noplaybackrate" tabindex="-1" aria-hidden="true" data-src="${esc(media.url)}" ${poster?`data-poster="${esc(poster)}"`:''}></video>${label?`<span class="media-type video">▶ ${t('video')}</span>`:''}`;
    return `<video class="${esc(className)} js-media-video" muted loop playsinline preload="metadata" disablepictureinpicture disableremoteplayback controlslist="nodownload nofullscreen noremoteplayback noplaybackrate" tabindex="-1" aria-hidden="true" src="${esc(media.url)}" ${poster?`poster="${esc(poster)}"`:''} ${autoplay?'data-autoplay="1"':''}></video>${label?`<span class="media-type video">▶ ${t('video')}</span>`:''}`;
  }
  if(card)return `<img class="${esc(className)} js-lazy-cover" decoding="async" fetchpriority="low" data-src="${esc(optimizedImageUrl(media.url,CARD_IMAGE_WIDTH,78))}" alt="">${label?`<span class="media-type">▧ ${t('image')}</span>`:''}`;
  const preview=optimizedImageUrl(media.url,CARD_IMAGE_WIDTH,78);
  const full=optimizedImageUrl(media.url,720,84);
  return `<img class="${esc(className)} js-progressive-image" decoding="async" fetchpriority="high" src="${esc(preview)}" data-full="${esc(full)}" alt="">${label?`<span class="media-type">▧ ${t('image')}</span>`:''}`;
}
function bindProgressiveImages(root=document){
  root.querySelectorAll('img.js-progressive-image[data-full]').forEach(img=>{
    if(img.dataset.upgrading==='1'||img.dataset.upgraded==='1')return;
    const upgrade=()=>{
      const full=img.dataset.full;
      if(!full||full===img.src){img.dataset.upgraded='1';return}
      img.dataset.upgrading='1';
      const pre=new Image();
      pre.decoding='async';
      pre.src=full;
      pre.onload=()=>{if(img.isConnected){img.src=full;img.dataset.upgraded='1';img.classList.add('is-full')}delete img.dataset.upgrading};
      pre.onerror=()=>{delete img.dataset.upgrading};
    };
    if(img.complete)setTimeout(upgrade,100);else img.addEventListener('load',()=>setTimeout(upgrade,100),{once:true});
  });
}
function pumpImageQueue(){
  while(activeImageLoads<MAX_IMAGE_LOADS&&imageQueue.length){
    const img=imageQueue.shift();
    if(!img?.isConnected||img.dataset.loaded==='1')continue;
    const src=img.dataset.src;
    if(!src)continue;
    img.dataset.loaded='1';
    activeImageLoads++;
    const done=()=>{activeImageLoads=Math.max(0,activeImageLoads-1);img.onload=null;img.onerror=null;pumpImageQueue()};
    img.onload=done;img.onerror=done;img.src=src;
  }
}
function queueImage(img){if(!img||img.dataset.loaded==='1'||img.dataset.queued==='1')return;img.dataset.queued='1';imageQueue.push(img);pumpImageQueue()}
function unloadVideo(video){
  if(!(video instanceof HTMLVideoElement))return;
  try{video.pause()}catch{}
  if(video.src){video.removeAttribute('src');try{video.load()}catch{}}
}
function lockVideo(video){
  if(!(video instanceof HTMLVideoElement))return;
  video.controls=false;video.disablePictureInPicture=true;video.removeAttribute('controls');video.setAttribute('disablepictureinpicture','');video.setAttribute('disableremoteplayback','');video.setAttribute('controlslist','nodownload nofullscreen noremoteplayback noplaybackrate');video.tabIndex=-1;
}
function syncVisibleVideos(){
  let playing=0;
  for(const video of [...visibleCardVideos]){
    if(!video.isConnected){visibleCardVideos.delete(video);continue}
    lockVideo(video);
    if(playing<MAX_PLAYING_VIDEOS){
      if(video.dataset.poster&&!video.poster)video.poster=video.dataset.poster;
      if(!video.src&&video.dataset.src){video.src=video.dataset.src;video.load()}
      const promise=video.play();if(promise?.catch)promise.catch(()=>{});playing++;
    }else video.pause();
  }
}
function suppressBrowserVideoOverlays(){
  document.querySelectorAll('#detach-button-host,[id*="detach-button"],[id*="video-popout"],[id*="video-popout-button"]').forEach(el=>{el.style.setProperty('display','none','important');el.style.setProperty('pointer-events','none','important')});
}
function bindMediaPlayback(root=document){
  const lazy=[...root.querySelectorAll('.js-lazy-cover, video.js-card-video')];
  if(!('IntersectionObserver'in window)){
    lazy.forEach(el=>el.tagName==='IMG'?queueImage(el):visibleCardVideos.add(el));syncVisibleVideos();
  }else{
    if(!mediaObserver)mediaObserver=new IntersectionObserver(entries=>{
      for(const {target,isIntersecting} of entries){
        if(target instanceof HTMLImageElement){if(isIntersecting){queueImage(target);mediaObserver.unobserve(target)}continue}
        if(!(target instanceof HTMLVideoElement))continue;
        lockVideo(target);
        clearTimeout(target.__unloadTimer);
        if(isIntersecting)visibleCardVideos.add(target);else{visibleCardVideos.delete(target);target.pause();target.__unloadTimer=setTimeout(()=>{if(!visibleCardVideos.has(target))unloadVideo(target)},1200)}
      }
      syncVisibleVideos();
    },{rootMargin:'80px 0px',threshold:.12});
    lazy.forEach(el=>mediaObserver.observe(el));
  }
  root.querySelectorAll('video.js-media-video[data-autoplay="1"]:not(.js-card-video)').forEach(video=>{lockVideo(video);const promise=video.play();if(promise?.catch)promise.catch(()=>{})});
  bindProgressiveImages(root);
  suppressBrowserVideoOverlays();
}
function cleanupMedia(root){
  root.querySelectorAll('video').forEach(video=>{visibleCardVideos.delete(video);clearTimeout(video.__unloadTimer);unloadVideo(video)});
  if(mediaObserver)root.querySelectorAll('.js-lazy-cover, video.js-card-video').forEach(el=>mediaObserver.unobserve(el));
}
function card(model){
  const media=cover(model);
  const id=Number(model.id);
  const favorite=state.favorites.has(id);
  const base=modelBaseModel(model);
  const name=String(model.name||`Model ${id}`);
  const author=model.creator?.username||model.author||t('unknownAuthor');
  const downloads=model.stats?.downloadCount??model.downloads;
  const likes=model.stats?.favoriteCount??model.stats?.thumbsUpCount??model.likes;
  return `<article class="card" data-id="${id}"><div class="thumb"><button class="thumb-open" type="button" data-open="${id}" aria-label="${esc(t('openModel',{name}))}">${mediaHtml(media,{card:true})}<span class="badge">${esc(modelTypeLabel(model.type))}</span>${base?`<span class="base-badge" title="${esc(t('baseModelTitle',{value:base}))}">${esc(base)}</span>`:''}</button><button class="fav-btn ${favorite?'on':''}" data-fav="${id}" title="${esc(t('favorites'))}" aria-label="${esc(t('favorites'))}" aria-pressed="${favorite?'true':'false'}">♥</button></div><div class="card-body"><div class="card-title" title="${esc(name)}">${esc(name)}</div><div class="creator">${esc(author)}</div><div class="stats"><span>⇩ ${fmt(downloads)}</span><span>♥ ${fmt(likes)}</span></div></div></article>`;
}
function render({append=false}={}){
  const grid=$('#grid');
  const items=state.view==='favorites'?state.favoriteItems:state.items;
  if(append&&state.view==='discover'){
    const shown=new Set([...grid.querySelectorAll('.card[data-id]')].map(el=>String(el.dataset.id)));
    const fresh=items.filter(model=>!shown.has(String(model.id)));
    if(fresh.length){
      const marker=document.createElement('div');
      marker.style.display='contents';
      marker.innerHTML=fresh.map(card).join('');
      const nodes=[...marker.children];
      nodes.forEach(node=>grid.append(node));
      nodes.forEach(node=>bindMediaPlayback(node));
    }
  }else{
    cleanupMedia(grid);
    grid.innerHTML=items.map(card).join('');
    bindMediaPlayback(grid);
  }
  $('#empty').classList.toggle('hidden',items.length>0);
  $('#resultCount').textContent=state.view==='favorites'?fmt(items.length):(state.meta?.totalItems?fmt(state.meta.totalItems):fmt(items.length));
  $('#loadMore').classList.toggle('hidden',state.view!=='discover'||!hasMore(state.meta));
}
function findModelById(id){return state.items.find(item=>Number(item.id)===Number(id))||state.favoriteItems.find(item=>Number(item.id)===Number(id))||state.modelDetails.get(Number(id))||null}
function cacheModelDetail(id,model){
  state.modelDetails.delete(id);
  state.modelDetails.set(id,model);
  while(state.modelDetails.size>MAX_CLIENT_MODEL_DETAILS){
    const oldest=state.modelDetails.keys().next().value;
    if(oldest===state.openModelId&&state.modelDetails.size>1){const keep=state.modelDetails.get(oldest);state.modelDetails.delete(oldest);state.modelDetails.set(oldest,keep);continue}
    state.modelDetails.delete(oldest);
  }
}
function getModelDetail(id){
  id=Number(id);
  if(state.modelDetails.has(id)){const model=state.modelDetails.get(id);state.modelDetails.delete(id);state.modelDetails.set(id,model);return Promise.resolve(model)}
  if(state.modelDetailPromises.has(id))return state.modelDetailPromises.get(id);
  const promise=api(`/api/models/${id}`).then(model=>{cacheModelDetail(id,model);return model}).finally(()=>state.modelDetailPromises.delete(id));
  state.modelDetailPromises.set(id,promise);
  return promise;
}
const prefetchTimers=new Map();
function initGridEvents(){
  const grid=$('#grid');
  grid.addEventListener('click',event=>{
    const favorite=event.target.closest('[data-fav]');
    if(favorite){event.stopPropagation();toggleFav(Number(favorite.dataset.fav));return}
    const open=event.target.closest('[data-open]');
    if(open)openModel(Number(open.dataset.open));
  });
  grid.addEventListener('pointerover',event=>{
    const open=event.target.closest('[data-open]');
    if(!open||open.contains(event.relatedTarget))return;
    const id=Number(open.dataset.open);
    clearTimeout(prefetchTimers.get(id));
    prefetchTimers.set(id,setTimeout(()=>{prefetchTimers.delete(id);getModelDetail(id).catch(()=>{})},450));
  });
  grid.addEventListener('pointerout',event=>{
    const open=event.target.closest('[data-open]');
    if(!open||open.contains(event.relatedTarget))return;
    const id=Number(open.dataset.open);
    clearTimeout(prefetchTimers.get(id));
    prefetchTimers.delete(id);
  });
  grid.addEventListener('pointerdown',event=>{
    const open=event.target.closest('[data-open]');
    if(open)getModelDetail(Number(open.dataset.open)).catch(()=>{});
  },{passive:true});
}
async function toggleFav(id){
  if(state.favoriteBusy.has(id))return;
  state.favoriteBusy.add(id);
  const model=state.items.find(item=>Number(item.id)===id)||state.favoriteItems.find(item=>Number(item.id)===id);
  const removing=state.favorites.has(id);
  try{
    const db=await api('/api/favorites',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({modelId:id,model:removing?undefined:model})});
    state.favoriteItems=Array.isArray(db.items)?db.items:[];
    state.favorites=new Set(state.favoriteItems.map(item=>Number(item.id)));
    $('#favCount').textContent=state.favorites.size;
    toast(removing?t('removedFavorite'):t('addedFavorite'));
    if(state.view==='favorites')render();else document.querySelectorAll(`[data-fav="${id}"]`).forEach(button=>{const on=state.favorites.has(id);button.classList.toggle('on',on);button.setAttribute('aria-pressed',on?'true':'false')});
  }catch(error){toast(t('favoriteError',{error:error.message}),'bad');dbg('error','Favorites',error)}finally{state.favoriteBusy.delete(id)}
}
function initCustomSelects(){
  const setOpen=(box,open,focusOption=false)=>{
    const trigger=box.querySelector('.select-trigger');
    box.classList.toggle('open',open);trigger.setAttribute('aria-expanded',open?'true':'false');
    if(open&&focusOption){const options=[...box.querySelectorAll('.select-menu button[data-value]')];(options.find(option=>option.classList.contains('selected'))||options[0])?.focus()}
  };
  const closeAll=except=>document.querySelectorAll('.custom-select.open').forEach(el=>{if(el!==except)setOpen(el,false)});
  document.querySelectorAll('.custom-select').forEach(box=>{
    const input=box.querySelector('input[type="hidden"]');
    const trigger=box.querySelector('.select-trigger');
    const options=[...box.querySelectorAll('.select-menu button[data-value]')];
    trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');
    trigger.onclick=event=>{event.stopPropagation();const open=!box.classList.contains('open');closeAll(box);setOpen(box,open)};
    trigger.onkeydown=event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();closeAll(box);setOpen(box,true,true)}};
    options.forEach((option,index)=>{
      option.setAttribute('role','option');
      option.onclick=event=>{event.stopPropagation();setCustomSelect(input.id,option.dataset.value,{silent:false});setOpen(box,false);trigger.focus()};
      option.onkeydown=event=>{
        if(event.key==='Escape'){event.preventDefault();setOpen(box,false);trigger.focus();return}
        let next=index;if(event.key==='ArrowDown')next=Math.min(options.length-1,index+1);else if(event.key==='ArrowUp')next=Math.max(0,index-1);else if(event.key==='Home')next=0;else if(event.key==='End')next=options.length-1;else return;
        event.preventDefault();options[next]?.focus();
      };
    });
  });
  document.addEventListener('click',()=>closeAll());
}
function setCustomSelect(id,value,{silent=true}={}){
  const input=$(`#${id}`);
  if(!input)return;
  const box=input.closest('.custom-select');
  const options=[...box.querySelectorAll('.select-menu button[data-value]')];
  const chosen=options.find(option=>option.dataset.value===String(value))||options[0];
  input.value=chosen?.dataset.value||'';
  box.querySelector('[data-select-label]').textContent=chosen?.textContent?.trim()||'';
  options.forEach(option=>{const selected=option===chosen;option.classList.toggle('selected',selected);option.setAttribute('aria-selected',selected?'true':'false')});
  if(!silent)input.dispatchEvent(new Event('change',{bubbles:true}));
}
function refreshSelectLabels(){for(const id of ['typeFilter','baseModelFilter','sortFilter','periodFilter']){const input=$(`#${id}`);if(input)setCustomSelect(id,input.value,{silent:true})}}
let prefsTimer=null;
function persistFilters(){
  clearTimeout(prefsTimer);
  prefsTimer=setTimeout(()=>api('/api/settings',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({defaultType:$('#typeFilter').value,defaultBaseModel:$('#baseModelFilter').value,defaultSort:$('#sortFilter').value,defaultPeriod:$('#periodFilter').value})}).catch(error=>dbg('warn',t('filtersSaveError'),error)),180);
}
function mergeUniqueModels(current,incoming){
  const items=[];
  const seenIds=new Set();
  const add=item=>{if(!item||item.id==null)return false;const id=String(item.id);if(seenIds.has(id))return false;seenIds.add(id);items.push(item);return true};
  for(const item of current||[])add(item);
  let added=0;
  for(const item of incoming||[])if(add(item))added++;
  return {items,added};
}
function hasMore(meta){return !!(meta?.nextPage||meta?.nextCursor)}
function nextPagination(meta,{search=false,catalogPage=1}={}){
  if(meta?.nextCursor)return {type:'cursor',value:String(meta.nextCursor)};
  if(meta?.nextPage){
    try{
      const url=new URL(meta.nextPage,location.origin);
      if(url.searchParams.get('cursor'))return {type:'cursor',value:url.searchParams.get('cursor')};
      if(!search&&url.searchParams.get('page'))return {type:'page',value:url.searchParams.get('page')};
    }catch(error){dbg('warn','Invalid metadata.nextPage',error)}
  }
  if(!search&&Number(meta?.currentPage)>=1)return {type:'page',value:String(Number(meta.currentPage)+1)};
  if(!search&&hasMore(meta))return {type:'page',value:String(Math.max(1,Number(catalogPage)||1)+1)};
  return null;
}
function showCatalogNotice(meta){
  const box=$('#errorBox');
  box.classList.remove('notice');
  if(meta?.searchFallback){
    box.textContent=t('fallbackNotice',{scanned:fmt(Number(meta.scannedItems)||0),total:fmt(Number(meta.totalItems)||0)});
    box.classList.add('notice');box.classList.remove('hidden');
  }
}
async function loadModels({append=false,retryAttempt=0}={}){
  if(append&&!hasMore(state.meta))return;
  const requestId=++state.catalogSeq;
  if(state.catalogAbort)state.catalogAbort.abort();
  const controller=new AbortController();
  state.catalogAbort=controller;
  state.loading=true;
  $('#loading').classList.remove('hidden');
  $('#loadMore').disabled=true;
  $('#errorBox').classList.add('hidden');$('#errorBox').classList.remove('notice');
  try{
    const search=state.activeSearch;
    const pageSize=Number(state.settings?.pageSize)||24;
    let workingItems=append?state.items:[];
    let workingMeta=append?(state.meta||{}):null;
    let catalogPage=append?Math.max(1,Number(state.page)||1):1;
    let source=append?(state.paginationSource||'auto'):'auto';
    let totalAdded=0;
    let hops=0;
    const maxHops=24;
    if(!append){state.usedPagination.clear();state.paginationSource='auto'}
    const requestPage=async(pagination,requestSource)=>{
      const query=new URLSearchParams({limit:String(pageSize),sort:$('#sortFilter').value,period:$('#periodFilter').value,nsfw:'true'});
      if(search)query.set('query',search);
      if(pagination)query.set(pagination.type,pagination.value);else if(!search)query.set('page','1');
      if($('#typeFilter').value)query.set('types',$('#typeFilter').value);
      if($('#baseModelFilter').value)query.set('baseModels',$('#baseModelFilter').value);
      if(requestSource==='fallback')query.set('_source','fallback');
      return api(`/api/models?${query}`,{signal:controller.signal});
    };
    while(true){
      const pagination=append?nextPagination(workingMeta,{search:!!search,catalogPage}):null;
      if(append&&!pagination)break;
      let requestSource=source;
      if(append){
        const key=`${requestSource}:${search?'search':'catalog'}:${pagination.type}:${pagination.value}`;
        if(state.usedPagination.has(key)){
          if(requestSource==='auto'){requestSource='fallback';source='fallback'}else{dbg('warn','Repeated Civitai pagination pointer',{pagination:key});break}
        }
        state.usedPagination.add(`${requestSource}:${search?'search':'catalog'}:${pagination.type}:${pagination.value}`);
      }
      let data=await requestPage(pagination,requestSource);
      let incoming=Array.isArray(data.items)?data.items:[];
      let merged=mergeUniqueModels(workingItems,incoming);
      let added=merged.added;
      let acceptedSource=requestSource;
      if(append&&added===0&&requestSource!=='fallback'){
        const fallbackKey=`fallback:${search?'search':'catalog'}:${pagination.type}:${pagination.value}`;
        if(!state.usedPagination.has(fallbackKey)){
          state.usedPagination.add(fallbackKey);
          const fallbackData=await requestPage(pagination,'fallback');
          const fallbackIncoming=Array.isArray(fallbackData.items)?fallbackData.items:[];
          const fallbackMerged=mergeUniqueModels(workingItems,fallbackIncoming);
          data=fallbackData;incoming=fallbackIncoming;merged=fallbackMerged;added=fallbackMerged.added;acceptedSource='fallback';source='fallback';
        }
      }
      workingItems=merged.items;
      totalAdded+=added;
      workingMeta=data.metadata||{};
      if(acceptedSource==='fallback')source='fallback';
      if(!search){
        const current=Number(workingMeta.currentPage);
        if(Number.isFinite(current)&&current>=1)catalogPage=current;else if(pagination?.type==='page')catalogPage=Number(pagination.value)||catalogPage;
      }
      if(!append)break;
      hops++;
      if(totalAdded>=pageSize||!hasMore(workingMeta)||hops>=maxHops)break;
    }
    if(requestId!==state.catalogSeq)return;
    state.items=mergeUniqueModels([],workingItems).items;
    state.meta=workingMeta||{};
    state.page=catalogPage;
    state.paginationSource=source;
    render({append});
    showCatalogNotice(state.meta);
    if(append&&totalAdded===0)toast(!hasMore(state.meta)?t('noMoreModels'):t('repeatedModels'),'bad');
  }catch(error){
    if(error?.name==='AbortError'||requestId!==state.catalogSeq)return;
    dbg('error','Catalog load error',error);
    const canRetry=(error.retryable||error.status===503||error.status===429)&&retryAttempt<1&&!append&&!state.activeSearch;
    if(canRetry){
      $('#errorBox').textContent=t('retrying',{error:error.message});
      $('#errorBox').classList.remove('hidden');
      clearTimeout(state.retryTimer);
      state.retryTimer=setTimeout(()=>{if(state.view==='discover'&&!state.activeSearch)loadModels({retryAttempt:retryAttempt+1})},5000);
    }else{$('#errorBox').textContent=t('loadModelsError',{error:error.message});$('#errorBox').classList.remove('hidden')}
  }finally{
    if(requestId===state.catalogSeq){state.loading=false;state.catalogAbort=null;$('#loading').classList.add('hidden');$('#loadMore').disabled=false}
  }
}

function versionHtml(version){
  const versionId=Number(version.id);
  const safeVersionId=Number.isSafeInteger(versionId)&&versionId>0?String(versionId):'';
  const files=safeVersionId?(version.files||[]).map(file=>`<div class="file"><div class="file-info"><b>${esc(file.name||t('modelFile'))}</b><small>${file.sizeKB?formatBytes(file.sizeKB*1024):''} ${esc(file.metadata?.format||'')}</small></div><a class="download-btn" href="/api/download/${encodeURIComponent(safeVersionId)}?fileId=${encodeURIComponent(file.id||'')}" data-download="${esc(safeVersionId)}" data-name="${esc(file.name||'')}">⇩ ${t('download')}</a></div>`).join(''):`<small>${t('noFiles')}</small>`;
  const date=version.publishedAt?new Date(version.publishedAt).toLocaleDateString(localeName()):'';
  return `<div class="version"><div class="version-head"><div><b>${esc(version.name||'')}</b><br><small>${esc(version.baseModel||'')}${date?` · ${date}`:''}</small></div><small>#${esc(version.id||'')}</small></div><div class="files">${files}</div></div>`;
}
function renderModelDetails(model){
  const versions=model.modelVersions||[];
  const media=modelMedia(model).slice(0,10);
  const first=media[0]||null;
  const mediaPanel=`<div class="details-media-wrap"><div id="detailsMedia" class="details-media">${mediaHtml(first,{autoplay:first?.kind==='video',label:false})}</div>${media.length>1?`<div class="media-strip">${media.map((item,index)=>`<button class="media-chip ${index===0?'active':''}" data-media-index="${index}" aria-label="${esc(t('mediaLabel',{number:index+1}))}">${mediaHtml(item,{label:false,thumbnail:true})}</button>`).join('')}</div>`:''}</div>`;
  const bases=[...new Set(versions.map(version=>String(version.baseModel||'').trim()).filter(Boolean))];
  const limit=20;
  const visibleVersions=state.showAllVersions?versions:versions.slice(0,limit);
  const toggle=versions.length>limit?`<button id="versionToggle" class="ghost full detail-more" type="button">${state.showAllVersions?t('showLessVersions'):t('showAllVersions',{count:versions.length})}</button>`:'';
  const description=plainText(model.description||'').slice(0,900)||t('descriptionMissing');
  $('#modalContent').innerHTML=`<div class="details">${mediaPanel}<div class="details-info"><div class="detail-badges"><span class="detail-pill">${esc(modelTypeLabel(model.type))}</span>${bases.slice(0,3).map(base=>`<span class="detail-pill base">${esc(base)}</span>`).join('')}</div><h2>${esc(model.name)}</h2><div class="meta">${t('author')}: ${esc(model.creator?.username||'—')} · ID ${esc(model.id)}</div><a class="model-page-link" href="https://civitai.red/models/${encodeURIComponent(model.id)}" target="_blank" rel="noopener noreferrer">${esc(t('openOnCivitai'))} ↗</a><p class="muted">${esc(description)}</p><h3>${t('versionsFiles')}</h3>${visibleVersions.map(versionHtml).join('')}${toggle}</div></div>`;
  bindMediaPlayback($('#modalContent'));
  $('#modalContent').querySelectorAll('[data-media-index]').forEach(button=>button.onclick=()=>{
    const index=Number(button.dataset.mediaIndex);
    const item=media[index];
    if(!item)return;
    $('#modalContent').querySelectorAll('[data-media-index]').forEach(el=>el.classList.toggle('active',el===button));
    const target=$('#detailsMedia');cleanupMedia(target);target.innerHTML=mediaHtml(item,{autoplay:item.kind==='video',label:false});bindMediaPlayback(target);
  });
  $('#modalContent').querySelectorAll('[data-download]').forEach(link=>link.onclick=()=>toast(t('downloadStarted')));
  const toggleButton=$('#versionToggle');
  if(toggleButton)toggleButton.onclick=()=>{state.showAllVersions=!state.showAllVersions;renderModelDetails(model)};
}
function closeModelModal(){
  state.modalRequest++;
  state.openModelId=null;
  state.showAllVersions=false;
  cleanupMedia($('#modalContent'));
  hideDialog($('#modal'));
  $('#modalContent').innerHTML='';
}
async function openModel(id){
  const request=++state.modalRequest;
  state.openModelId=Number(id);
  state.showAllVersions=false;
  const summary=findModelById(id);
  const summaryMedia=cover(summary);
  showDialog($('#modal'),'#modalClose');
  $('#modalContent').innerHTML=`<div class="details"><div class="details-media-wrap"><div class="details-media">${mediaHtml(summaryMedia,{autoplay:summaryMedia?.kind==='video',label:false})}</div></div><div class="details-info details-loading"><div class="detail-badges">${summary?.type?`<span class="detail-pill">${esc(modelTypeLabel(summary.type))}</span>`:''}${modelBaseModel(summary)?`<span class="detail-pill base">${esc(modelBaseModel(summary))}</span>`:''}</div><h2>${esc(summary?.name||t('loadingModel'))}</h2><div class="meta">${(summary?.creator?.username||summary?.author)?`${t('author')}: ${esc(summary?.creator?.username||summary?.author)} · `:''}ID ${id}</div><div class="detail-skeleton"><i></i><i></i><i></i><i></i></div></div></div>`;
  bindMediaPlayback($('#modalContent'));
  try{
    const model=await getModelDetail(id);
    if(request===state.modalRequest&&state.openModelId===Number(id)&&!$('#modal').classList.contains('hidden'))renderModelDetails(model);
  }catch(error){
    if(request!==state.modalRequest)return;
    toast(t('modelOpenError',{error:error.message}),'bad');
    dbg('error','Model',error);
    $('#modalContent').querySelector('.details-loading')?.insertAdjacentHTML('beforeend',`<div class="error">${esc(t('modelDetailsError',{error:error.message}))}</div>`);
  }
}
function applyStatus(status=state.status){
  if(!status)return;
  state.status=status;
  state.searchMinLength=Number(status.searchMinLength)||2;
  applyStatusText();
}
function applyStatusText(){
  const status=state.status;
  if(!status){$('#search').placeholder=t('searchPlaceholder',{min:state.searchMinLength});return}
  $('#apiDot').className=`status-dot ${status.apiTokenConfigured?'ok':'bad'}`;
  $('#apiStatus').textContent=status.apiTokenConfigured?t('apiConfigured'):t('apiMissing');
  $('#serverStatus').textContent=t('serverOnline',{host:status.host,version:status.version?` · v${status.version}`:''});
  $('#tokenHint').textContent=status.apiTokenConfigured?t('tokenSaved',{token:status.maskedToken}):t('tokenMissing');
  $('#search').placeholder=t('searchPlaceholder',{min:state.searchMinLength});
}
function updateViewText(){
  const favorites=state.view==='favorites';
  $('#viewTitle').textContent=favorites?t('favoritesTitle'):t('discoverTitle');
  $('#viewSubtitle').textContent=favorites?t('favoritesSubtitle'):t('discoverSubtitle');
  $('#refreshBtn').classList.toggle('hidden',favorites);
}
function setView(view){
  state.view=view;
  document.querySelectorAll('.nav').forEach(nav=>{const active=nav.dataset.view===view;nav.classList.toggle('active',active);nav.setAttribute('aria-pressed',active?'true':'false')});
  $('#errorBox').classList.add('hidden');$('#errorBox').classList.remove('notice');
  updateViewText();
  render();
}
async function initData(){
  const [settings,favorites,status]=await Promise.all([api('/api/settings'),api('/api/favorites'),api('/api/status')]);
  state.settings=settings;
  if(settings.language==='en'||settings.language==='ru'){state.locale=settings.language;localStorage.setItem('civitai.language',state.locale)}
  state.favoriteItems=Array.isArray(favorites.items)?favorites.items:[];
  state.favorites=new Set(state.favoriteItems.map(item=>Number(item.id)));
  $('#favCount').textContent=state.favorites.size;
  applyTranslations();
  setCustomSelect('typeFilter',settings.defaultType||'');
  setCustomSelect('baseModelFilter',settings.defaultBaseModel||'');
  setCustomSelect('sortFilter',settings.defaultSort||'Highest Rated');
  setCustomSelect('periodFilter',settings.defaultPeriod||'AllTime');
  applyStatus(status);
}
function commitSearch(){
  const value=$('#search').value.trim();
  if(value&&value.length<state.searchMinLength){toast(t('searchTooShort',{min:state.searchMinLength}),'bad');dbg('warn','Search query is too short',{length:value.length,min:state.searchMinLength});return false}
  clearTimeout(state.retryTimer);state.activeSearch=value;state.page=1;state.meta=null;setView('discover');loadModels();return true;
}
let languageSaveTimer=null;
function switchLanguage(){
  state.locale=state.locale==='ru'?'en':'ru';
  localStorage.setItem('civitai.language',state.locale);
  if(state.settings)state.settings.language=state.locale;
  applyTranslations();
  render();
  if(state.openModelId&&state.modelDetails.has(state.openModelId))renderModelDetails(state.modelDetails.get(state.openModelId));
  clearTimeout(languageSaveTimer);
  languageSaveTimer=setTimeout(()=>api('/api/settings',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({language:state.locale})}).catch(error=>dbg('warn','Failed to persist language',error)),120);
}
function initEvents(){
  initGridEvents();
  $('#search').addEventListener('keydown',event=>{if(event.key==='Enter')commitSearch()});
  ['typeFilter','baseModelFilter','sortFilter','periodFilter'].forEach(id=>{$(`#${id}`).onchange=()=>{clearTimeout(state.retryTimer);persistFilters();state.page=1;state.meta=null;setView('discover');loadModels()}});
  $('#refreshBtn').onclick=()=>{if(state.view!=='discover')return;clearTimeout(state.retryTimer);state.page=1;state.meta=null;loadModels()};
  $('#loadMore').onclick=()=>loadModels({append:true});
  $('#resetBtn').onclick=()=>{clearTimeout(state.retryTimer);$('#search').value='';state.activeSearch='';setCustomSelect('typeFilter','');setCustomSelect('baseModelFilter','');setCustomSelect('sortFilter','Highest Rated');setCustomSelect('periodFilter','AllTime');persistFilters();state.page=1;state.meta=null;setView('discover');loadModels()};
  document.querySelectorAll('.nav').forEach(nav=>nav.onclick=()=>setView(nav.dataset.view));
  $('#modalClose').onclick=closeModelModal;
  $('#modal').onclick=event=>{if(event.target.id==='modal')closeModelModal()};
  $('#settingsBtn').onclick=()=>showDialog($('#settingsModal'),'#apiToken');
  $('#settingsClose').onclick=()=>hideDialog($('#settingsModal'));
  $('#settingsModal').onclick=event=>{if(event.target.id==='settingsModal')hideDialog($('#settingsModal'))};
  $('#toggleToken').onclick=()=>{const input=$('#apiToken');input.type=input.type==='password'?'text':'password';$('#toggleToken').setAttribute('aria-label',t(input.type==='password'?'showToken':'hideToken'))};
  $('#languageBtn').onclick=switchLanguage;
  $('#saveSettings').onclick=async()=>{
    const button=$('#saveSettings');if(button.disabled)return;button.disabled=true;
    try{
      const output=await api('/api/settings',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({apiToken:$('#apiToken').value.trim(),language:state.locale})});
      state.settings=output.settings;applyStatus(output.status);$('#apiToken').value='';$('#settingsMsg').textContent=t('settingsSaved');toast(t('settingsToast'));setTimeout(()=>hideDialog($('#settingsModal')),650);
    }catch(error){$('#settingsMsg').textContent=t('settingsError',{error:error.message});toast(error.message,'bad')}
    finally{button.disabled=false}
  };
  document.addEventListener('keydown',event=>{
    if(event.key==='Tab')trapDialogTab(event);
    if(event.key!=='Escape')return;
    if(!$('#modal').classList.contains('hidden'))closeModelModal();else if(!$('#settingsModal').classList.contains('hidden'))hideDialog($('#settingsModal'));
  });
}
document.addEventListener('DOMContentLoaded',async()=>{
  applyTranslations();
  initCustomSelects();
  initEvents();
  try{await initData();await loadModels()}catch(error){dbg('error','Initialization',error);$('#errorBox').textContent=t('initializationError',{error:error.message});$('#errorBox').classList.remove('hidden')}
});
