const $=selector=>document.querySelector(selector);
const I18N={
  ru:{
    home:'Главная',search:'Поиск',settings:'Настройки',modelDetails:'Подробности модели',showToken:'Показать API-ключ',hideToken:'Скрыть API-ключ',openModel:'Открыть модель {name}',navigation:'Навигация',discover:'Обзор',favorites:'Избранное',filters:'Фильтры',modelType:'Тип модели',allTypes:'Все типы',baseModel:'Базовая модель',allBaseModels:'Все базовые модели',groupSdxl:'SDXL-экосистема',groupFlux:'Flux и новые',groupVideo:'Видео',other:'Другое',sorting:'Сортировка',sortRated:'Самые высоко оценённые',sortDownloaded:'Самые скачиваемые',sortNewest:'Самые новые',period:'Период',periodAll:'За всё время',periodYear:'За год',periodMonth:'За месяц',periodWeek:'За неделю',periodDay:'За день',resetFilters:'Сбросить фильтры',apiChecking:'Проверка API…',serverConnected:'Сервер подключён',catalog:'КАТАЛОГ',results:'результатов',refresh:'Обновить',loading:'Получаем данные Civitai…',emptyTitle:'Здесь пока пусто',emptyText:'Попробуй изменить запрос или фильтры.',loadMore:'Показать ещё',system:'СИСТЕМА',tokenDescription:'API-ключ хранится постоянно на сервере в .env, не имеет таймера удаления и не передаётся интерфейсу.',apiToken:'API-ключ Civitai',tokenPlaceholder:'Введите API key',saveSettings:'Сохранить настройки',discoverTitle:'Популярные модели',discoverSubtitle:'Обновляется только вручную',favoritesTitle:'Избранное',favoritesSubtitle:'Сохранённые модели',image:'ИЗОБРАЖЕНИЕ',video:'ВИДЕО',unknownAuthor:'Неизвестный автор',baseModelTitle:'Базовая модель: {value}',addedFavorite:'Добавлено в избранное',removedFavorite:'Удалено из избранного',favoriteError:'Не удалось изменить избранное: {error}',filtersSaveError:'Не удалось сохранить фильтры',fallbackNotice:'Поиск Civitai сейчас перегружен — включён резервный поиск. Проверено моделей: {scanned}, найдено совпадений: {total}.',noMoreModels:'Новых моделей больше нет.',repeatedModels:'Civitai сейчас повторяет одну и ту же выдачу. Новые карточки не добавлены.',retrying:'{error} Автоматический повтор через {seconds} с…',loadModelsError:'Не удалось получить модели: {error}',author:'Автор',descriptionMissing:'Описание отсутствует',versionsFiles:'Версии и файлы',modelFile:'Файл модели',download:'Скачать',noFiles:'Нет доступных файлов',downloadStarted:'Загрузка началась',loadingModel:'Загрузка модели…',modelOpenError:'Не удалось открыть модель: {error}',modelDetailsError:'Не удалось загрузить подробности модели: {error}',apiConfigured:'API-ключ настроен',apiMissing:'API-ключ не задан',serverOnline:'Сервер онлайн · {host}{version}',tokenSaved:'Сохранён постоянно в .env: {token}',tokenMissing:'Ключ пока не сохранён',searchPlaceholder:'Найти модель, LoRA, checkpoint… (от {min} симв.)',searchTooShort:'Для поиска введи минимум {min} символа.',settingsSaved:'✓ Настройки сохранены',settingsToast:'Настройки сохранены',settingsError:'Ошибка: {error}',initializationError:'Ошибка запуска интерфейса: {error}',mediaLabel:'Медиа {number}',showAllVersions:'Показать все версии ({count})',showLessVersions:'Свернуть список версий',openOnCivitai:'Открыть на Civitai',switchLanguage:'Switch to English',byteB:'Б',byteKB:'КБ',byteMB:'МБ',byteGB:'ГБ',removeToken:'Удалить ключ',confirmRemoveToken:'Удалить сохранённый API-ключ из .env?',tokenRemoved:'API-ключ удалён',privateMode:'Приватный режим',lockPasswordLabel:'Пароль',lockCurrentLabel:'Текущий пароль',lockNewLabel:'Новый пароль',lockRepeatLabel:'Повтори пароль',unlock:'Разблокировать',lockSet:'Установить пароль',lockChange:'Сменить пароль',lockNow:'Заблокировать сейчас',lockRemove:'Удалить пароль',lockDescriptionOff:'Пароль не задан. Если его установить, без ввода пароля будут доступны только просмотр и скачивание моделей без контента 18+, а коллекции, свой контент, избранное, Buzz и API-ключ будут скрыты.',lockDescriptionOn:'Пароль установлен, приватный режим сейчас выключен. Можно сменить пароль, удалить его или сразу заблокировать доступ.',lockDescriptionLocked:'Включён приватный режим: доступны только просмотр и скачивание моделей без контента 18+. Введи пароль, чтобы вернуть полный доступ.',lockEnterPassword:'Введи пароль',lockEnterCurrent:'Введи текущий пароль',lockRules:'Пароль должен быть от 4 до 200 символов',lockMismatch:'Пароли не совпадают',lockSetDone:'Пароль установлен',lockChanged:'Пароль изменён',lockRemoved:'Пароль удалён, приватный режим отключён',lockRemoveConfirm:'Удалить пароль? Приватный режим будет полностью отключён.',unlocked:'Полный доступ открыт',lockedNow:'Приватный режим включён',lockThrottled:'Слишком много попыток. Повтори через {seconds} с.',unlockHint:'Приватный режим — ввести пароль',lockNowHint:'Заблокировать (включить приватный режим)',collections:'Коллекции',myContent:'Мой контент',collectionsTitle:'Мои коллекции',collectionsSubtitle:'Коллекции из аккаунта Civitai',mineTitle:'Мой контент',mineSubtitle:'Медиа и публикации аккаунта',tabMedia:'Медиа',tabPosts:'Публикации',buzzBalance:'Баланс Buzz',buzzTotal:'Всего',buzzBlue:'Синий',buzzYellow:'Жёлтый',buzzGreen:'Зелёный',buzzRed:'Красный',buzzUnavailable:'Buzz недоступен: {error}',openProfile:'Профиль на Civitai',openSettings:'Открыть настройки',accountNeedsToken:'Нужен API-ключ',accountNeedsTokenText:'Сохрани API-ключ Civitai в настройках, чтобы видеть свои коллекции, медиа и публикации.',noPermissionTitle:'Нет разрешения',noPermissionText:'У этого API-ключа нет разрешения на эти данные. Создай на Civitai ключ с нужными правами.',accountLoadError:'Не удалось загрузить данные аккаунта: {error}',noCollections:'Коллекций пока нет',collectionEmpty:'В этой коллекции пока ничего нет',noMedia:'Медиа пока нет',noPosts:'Публикаций пока нет',typeModel:'Модели',typeImage:'Изображения',typePost:'Публикации',typeArticle:'Статьи',privateCollection:'Приватная',bookmark:'Закладки',untitledPost:'Публикация без названия',imagesCount:'{count} медиа',generationData:'Данные генерации',prompt:'Промпт',negativePrompt:'Негативный промпт',resources:'Ресурсы',sampler:'Сэмплер',steps:'Шаги',cfg:'CFG',seed:'Seed',size:'Размер',noGenerationData:'Данные генерации не указаны',copy:'Копировать',copied:'Скопировано',openImage:'Открыть медиа',openPost:'Открыть публикацию',postImages:'Медиа публикации',published:'Опубликовано',reactions:'Реакции',comments:'Комментарии',accountStatus:'Статус: {status}',member:'Подписчик',signedInAs:'Аккаунт: {name}',openOriginal:'Открыть оригинал',newPost:'Новая публикация',publishNew:'Опубликовать',dropFiles:'Перетащи файлы сюда или нажми, чтобы выбрать',dropHint:'Изображения до 50 МБ, видео до 750 МБ, до 20 файлов',postTitle:'Название',postTitlePlaceholder:'Необязательно',postDescription:'Описание',postDescriptionPlaceholder:'Необязательно',publishNow:'Опубликовать',publishing:'Публикация…',uploadingFile:'Загрузка {name}…',fileReady:'Готов',fileUploaded:'Загружен',fileError:'Ошибка',removeFile:'Убрать файл',fileTypeError:'{name}: неподдерживаемый тип файла',fileSizeError:'{name}: файл больше {max} МБ',tooManyFiles:'Можно добавить не больше {max} файлов',noFilesSelected:'Добавь хотя бы один файл',publishSuccess:'Публикация создана. Civitai обрабатывает медиа — она появится в списке через минуту.',publishError:'Не удалось опубликовать: {error}',confirmClosePublish:'Загрузка ещё идёт. Закрыть окно и прервать её?',deleteImage:'Удалить медиа',deletePost:'Удалить публикацию',confirmDeleteImage:'Удалить это медиа с Civitai безвозвратно?',confirmDeletePost:'Удалить эту публикацию и всё её медиа с Civitai безвозвратно?',imageDeleted:'Медиа удалено',postDeleted:'Публикация удалена',deleteError:'Не удалось удалить: {error}',noWritePermission:'У API-ключа нет разрешения на публикацию (Media Write).',noDeletePermission:'У API-ключа нет разрешения на удаление (Media Delete).',retry:'Повторить',metaFound:'Найдены данные генерации',rateLimited:'Civitai временно ограничил частоту запросов. Повтори через {seconds} с.',connectionLost:'Соединение с сервером прервано',addToCollection:'Добавить в коллекцию',toCollection:'В коллекцию',newCollection:'Новая коллекция',collectionNamePlaceholder:'Название, до 30 символов',privacyPrivate:'Приватная',privacyUnlisted:'По ссылке',privacyPublic:'Публичная',createAndAdd:'Создать и добавить',noCollectionsOfType:'У тебя пока нет коллекций для типа «{type}». Создай новую ниже.',addedToCollection:'Добавлено в «{name}»',removedFromCollection:'Убрано из «{name}»',collectionCreated:'Коллекция «{name}» создана',collectionError:'Не удалось изменить коллекцию: {error}',removeFromCollection:'Убрать из коллекции',cannotRemove:'Этот элемент добавил другой участник — убрать его может только он',noCollectionPermission:'У API-ключа нет разрешения на изменение коллекций (Collections Write).',collectionNameRequired:'Укажи название коллекции'
  },
  en:{
    home:'Home',search:'Search',settings:'Settings',modelDetails:'Model details',showToken:'Show API key',hideToken:'Hide API key',openModel:'Open model {name}',navigation:'Navigation',discover:'Discover',favorites:'Favorites',filters:'Filters',modelType:'Model type',allTypes:'All types',baseModel:'Base model',allBaseModels:'All base models',groupSdxl:'SDXL ecosystem',groupFlux:'Flux and newer',groupVideo:'Video',other:'Other',sorting:'Sort',sortRated:'Highest rated',sortDownloaded:'Most downloaded',sortNewest:'Newest',period:'Period',periodAll:'All time',periodYear:'Year',periodMonth:'Month',periodWeek:'Week',periodDay:'Day',resetFilters:'Reset filters',apiChecking:'Checking API…',serverConnected:'Server connected',catalog:'CATALOG',results:'results',refresh:'Refresh',loading:'Loading Civitai data…',emptyTitle:'Nothing here yet',emptyText:'Try changing your search or filters.',loadMore:'Show more',system:'SYSTEM',tokenDescription:'The API key is stored permanently on the server in .env, has no deletion timer, and is never exposed to the interface.',apiToken:'Civitai API key',tokenPlaceholder:'Enter API key',saveSettings:'Save settings',discoverTitle:'Popular models',discoverSubtitle:'Updates only when requested',favoritesTitle:'Favorites',favoritesSubtitle:'Saved models',image:'IMAGE',video:'VIDEO',unknownAuthor:'Unknown author',baseModelTitle:'Base model: {value}',addedFavorite:'Added to favorites',removedFavorite:'Removed from favorites',favoriteError:'Failed to update favorites: {error}',filtersSaveError:'Failed to save filters',fallbackNotice:'Civitai search is overloaded, so fallback search is active. Scanned: {scanned}, matches: {total}.',noMoreModels:'There are no more new models.',repeatedModels:'Civitai is repeating the same results. No new cards were added.',retrying:'{error} Retrying automatically in {seconds}s…',loadModelsError:'Failed to load models: {error}',author:'Author',descriptionMissing:'No description available',versionsFiles:'Versions and files',modelFile:'Model file',download:'Download',noFiles:'No files available',downloadStarted:'Download started',loadingModel:'Loading model…',modelOpenError:'Failed to open model: {error}',modelDetailsError:'Failed to load model details: {error}',apiConfigured:'API key configured',apiMissing:'API key not configured',serverOnline:'Server online · {host}{version}',tokenSaved:'Stored permanently in .env: {token}',tokenMissing:'The key has not been saved yet',searchPlaceholder:'Find a model, LoRA, checkpoint… ({min}+ chars)',searchTooShort:'Enter at least {min} characters to search.',settingsSaved:'✓ Settings saved',settingsToast:'Settings saved',settingsError:'Error: {error}',initializationError:'Interface startup error: {error}',mediaLabel:'Media {number}',showAllVersions:'Show all versions ({count})',showLessVersions:'Show fewer versions',openOnCivitai:'Open on Civitai',switchLanguage:'Переключить на русский',byteB:'B',byteKB:'KB',byteMB:'MB',byteGB:'GB',removeToken:'Remove key',confirmRemoveToken:'Remove the saved API key from .env?',tokenRemoved:'API key removed',privateMode:'Private mode',lockPasswordLabel:'Password',lockCurrentLabel:'Current password',lockNewLabel:'New password',lockRepeatLabel:'Repeat password',unlock:'Unlock',lockSet:'Set password',lockChange:'Change password',lockNow:'Lock now',lockRemove:'Remove password',lockDescriptionOff:'No password is set. Once you set one, without the password only browsing and downloading models without 18+ content is available; collections, your content, favorites, Buzz and the API key are hidden.',lockDescriptionOn:'A password is set and private mode is currently off. You can change the password, remove it, or lock access right away.',lockDescriptionLocked:'Private mode is on: only browsing and downloading models without 18+ content is available. Enter the password to restore full access.',lockEnterPassword:'Enter the password',lockEnterCurrent:'Enter the current password',lockRules:'The password must be 4 to 200 characters long',lockMismatch:'Passwords do not match',lockSetDone:'Password set',lockChanged:'Password changed',lockRemoved:'Password removed, private mode disabled',lockRemoveConfirm:'Remove the password? Private mode will be fully disabled.',unlocked:'Full access restored',lockedNow:'Private mode enabled',lockThrottled:'Too many attempts. Retry in {seconds}s.',unlockHint:'Private mode — enter password',lockNowHint:'Lock (enable private mode)',collections:'Collections',myContent:'My content',collectionsTitle:'My collections',collectionsSubtitle:'Collections from your Civitai account',mineTitle:'My content',mineSubtitle:'Your media and posts',tabMedia:'Media',tabPosts:'Posts',buzzBalance:'Buzz balance',buzzTotal:'Total',buzzBlue:'Blue',buzzYellow:'Yellow',buzzGreen:'Green',buzzRed:'Red',buzzUnavailable:'Buzz unavailable: {error}',openProfile:'Civitai profile',openSettings:'Open settings',accountNeedsToken:'API key required',accountNeedsTokenText:'Save your Civitai API key in Settings to see your collections, media and posts.',noPermissionTitle:'No permission',noPermissionText:'This API key has no permission for this data. Create a key with the required scope on Civitai.',accountLoadError:'Failed to load account data: {error}',noCollections:'No collections yet',collectionEmpty:'This collection is empty',noMedia:'No media yet',noPosts:'No posts yet',typeModel:'Models',typeImage:'Images',typePost:'Posts',typeArticle:'Articles',privateCollection:'Private',bookmark:'Bookmarks',untitledPost:'Untitled post',imagesCount:'{count} media',generationData:'Generation data',prompt:'Prompt',negativePrompt:'Negative prompt',resources:'Resources',sampler:'Sampler',steps:'Steps',cfg:'CFG',seed:'Seed',size:'Size',noGenerationData:'No generation data provided',copy:'Copy',copied:'Copied',openImage:'Open media',openPost:'Open post',postImages:'Post media',published:'Published',reactions:'Reactions',comments:'Comments',accountStatus:'Status: {status}',member:'Member',signedInAs:'Account: {name}',openOriginal:'Open original',newPost:'New post',publishNew:'Publish',dropFiles:'Drop files here or click to choose',dropHint:'Images up to 50 MB, videos up to 750 MB, up to 20 files',postTitle:'Title',postTitlePlaceholder:'Optional',postDescription:'Description',postDescriptionPlaceholder:'Optional',publishNow:'Publish',publishing:'Publishing…',uploadingFile:'Uploading {name}…',fileReady:'Ready',fileUploaded:'Uploaded',fileError:'Error',removeFile:'Remove file',fileTypeError:'{name}: unsupported file type',fileSizeError:'{name}: file is larger than {max} MB',tooManyFiles:'You can add up to {max} files',noFilesSelected:'Add at least one file',publishSuccess:'Post created. Civitai is processing the media — it will appear in the list in about a minute.',publishError:'Failed to publish: {error}',confirmClosePublish:'An upload is still running. Close the window and cancel it?',deleteImage:'Delete media',deletePost:'Delete post',confirmDeleteImage:'Permanently delete this media from Civitai?',confirmDeletePost:'Permanently delete this post and all of its media from Civitai?',imageDeleted:'Media deleted',postDeleted:'Post deleted',deleteError:'Failed to delete: {error}',noWritePermission:'The API key has no permission to publish (Media Write).',noDeletePermission:'The API key has no permission to delete (Media Delete).',retry:'Retry',metaFound:'Generation data found',rateLimited:'Civitai temporarily rate-limited requests. Retry in {seconds}s.',connectionLost:'Connection to the server was lost',addToCollection:'Add to collection',toCollection:'To collection',newCollection:'New collection',collectionNamePlaceholder:'Name, up to 30 characters',privacyPrivate:'Private',privacyUnlisted:'Unlisted',privacyPublic:'Public',createAndAdd:'Create and add',noCollectionsOfType:'You have no «{type}» collections yet. Create one below.',addedToCollection:'Added to «{name}»',removedFromCollection:'Removed from «{name}»',collectionCreated:'Collection «{name}» created',collectionError:'Failed to update the collection: {error}',removeFromCollection:'Remove from collection',cannotRemove:'Another contributor added this item — only they can remove it',noCollectionPermission:'The API key has no permission to change collections (Collections Write).',collectionNameRequired:'Enter a collection name'
  }
};
function readStoredLocale(){try{return localStorage.getItem('civitai.language')}catch{return null}}
function storeLocale(value){try{localStorage.setItem('civitai.language',value)}catch{}}
const storedLocale=readStoredLocale();
const state={view:'discover',items:[],meta:null,page:1,loading:false,settings:null,retryTimer:null,activeSearch:'',searchMinLength:2,favorites:new Set(),favoriteItems:[],usedPagination:new Set(),paginationSource:'auto',modelDetails:new Map(),modelDetailPromises:new Map(),locale:storedLocale==='en'?'en':'ru',openModelId:null,modalRequest:0,showAllVersions:false,catalogSeq:0,catalogAbort:null,favoriteBusy:new Set(),account:null,accountError:null,accountLoading:false,collections:null,collectionsError:null,activeCollectionId:null,mineTab:'images',accountItems:[],accountKind:null,accountCursor:null,accountListError:null,accountSeq:0,accountAbort:null,accountBusy:false,mediaIndex:new Map(),postIndex:new Map()};
const ACCOUNT_VIEWS=new Set(['collections','mine']);
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
  if(state.status)applyLockUi();else renderAccountPill();
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
function fmt(value){if(value==null||value===''||!Number.isFinite(Number(value)))return '—';return Intl.NumberFormat(localeName(),{notation:'compact',maximumFractionDigits:1}).format(Number(value))}
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
      error.status=response.status;error.detail=data.detail;error.code=data.code;error.upstream=data.upstream;error.retryable=!!data.retryable;error.retryAfter=data.retryAfter;
      if(response.status===423&&data.code==='LOCKED'&&!String(url).startsWith('/api/lock/'))onLockedResponse();
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
const CARD_IMAGE_WIDTH=Math.round(Math.min(720,Math.max(360,300*(window.devicePixelRatio||1))));
const MAX_IMAGE_LOADS=3;
const MAX_PLAYING_VIDEOS=2;
const MAX_CLIENT_MODEL_DETAILS=12;
let mediaObserver=null;
let activeImageLoads=0;
const imageQueue=[];
const visibleCardVideos=new Set();
function civitaiMediaUrl(url,{width=CARD_IMAGE_WIDTH,quality=82,mode='image'}={}){
  const value=String(url||'');
  if(!value||!/image\.civitai\.(com|red)/i.test(value))return value;
  try{
    const parsed=new URL(value,location.href);
    const parts=parsed.pathname.split('/').filter(Boolean);
    if(parts.length<2)return value;
    const targetWidth=Math.max(96,Math.min(900,Math.round(Number(width)||CARD_IMAGE_WIDTH)));
    const targetQuality=Math.max(55,Math.min(92,Math.round(Number(quality)||82)));
    const wanted=mode==='original'?['original=true']:mode==='video'?['transcode=true',`width=${targetWidth}`,'optimized=true']:mode==='poster'?['anim=false','transcode=true',`width=${targetWidth}`,`quality=${targetQuality}`,'optimized=true']:[`width=${targetWidth}`,`quality=${targetQuality}`,'optimized=true'];
    const managed=/^(?:width|original|quality|optimized|anim|transcode)=/i;
    const transformIndex=parts.length-2;
    if(/(?:^|,)(?:width|original|quality|optimized|anim|transcode)=/i.test(parts[transformIndex]||'')){
      const options=parts[transformIndex].split(',').filter(Boolean).filter(option=>!managed.test(option));
      parts[transformIndex]=[...options,...wanted].join(',');
    }else parts.splice(parts.length-1,0,wanted.join(','));
    parsed.pathname=`/${parts.join('/')}`;
    return parsed.toString();
  }catch{return value}
}
function optimizedImageUrl(url,width=CARD_IMAGE_WIDTH,quality=82){return civitaiMediaUrl(url,{width,quality})}
function videoPosterUrl(media,width=CARD_IMAGE_WIDTH,quality=78){return media?.poster?optimizedImageUrl(media.poster,width,quality):civitaiMediaUrl(media?.url,{width,quality,mode:'poster'})}
function originalMediaUrl(url){return civitaiMediaUrl(url,{mode:'original'})}
function mediaFrameStyle(media){const w=Number(media?.width),h=Number(media?.height);return w>0&&h>0?` style="aspect-ratio:${Math.round(w)}/${Math.round(h)}"`:''}
function mediaHtml(media,{className='',autoplay=false,label=true,card=false,thumbnail=false,original=false,controls=false}={}){
  if(!media)return '<div class="media-placeholder">◇</div>';
  if(thumbnail){
    if(media.kind==='video'){
      const poster=videoPosterUrl(media,112,72);
      return poster?`<img loading="lazy" decoding="async" fetchpriority="low" src="${esc(poster)}" alt=""><span class="media-mini-video">▶</span>`:'<div class="media-placeholder media-placeholder-small">▶</div>';
    }
    return `<img loading="lazy" decoding="async" fetchpriority="low" src="${esc(optimizedImageUrl(media.url,112,72))}" alt="">`;
  }
  if(media.kind==='video'){
    const poster=videoPosterUrl(media,card?CARD_IMAGE_WIDTH:original?900:480,80);
    if(controls)return `<video class="${esc(className)} js-media-video with-controls" controls ${autoplay?'autoplay':''} muted loop playsinline preload="metadata" disablepictureinpicture src="${esc(original?originalMediaUrl(media.url):media.url)}" ${poster?`poster="${esc(poster)}"`:''}></video>`;
    if(card)return `<video class="${esc(className)} js-media-video js-card-video" muted loop playsinline preload="none" disablepictureinpicture disableremoteplayback controlslist="nodownload nofullscreen noremoteplayback noplaybackrate" tabindex="-1" aria-hidden="true" data-src="${esc(civitaiMediaUrl(media.url,{width:CARD_IMAGE_WIDTH,mode:'video'}))}" ${poster?`data-poster="${esc(poster)}"`:''}></video>${label?`<span class="media-type video">▶ ${t('video')}</span>`:''}`;
    return `<video class="${esc(className)} js-media-video" muted loop playsinline preload="metadata" disablepictureinpicture disableremoteplayback controlslist="nodownload nofullscreen noremoteplayback noplaybackrate" tabindex="-1" aria-hidden="true" src="${esc(media.url)}" ${poster?`poster="${esc(poster)}"`:''} ${autoplay?'data-autoplay="1"':''}></video>${label?`<span class="media-type video">▶ ${t('video')}</span>`:''}`;
  }
  if(card)return `<img class="${esc(className)} js-lazy-cover" decoding="async" fetchpriority="low" data-src="${esc(optimizedImageUrl(media.url,CARD_IMAGE_WIDTH,78))}" alt="">${label?`<span class="media-type">▧ ${t('image')}</span>`:''}`;
  const preview=optimizedImageUrl(media.url,CARD_IMAGE_WIDTH,78);
  const full=original?originalMediaUrl(media.url):optimizedImageUrl(media.url,900,86);
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
    if(video.dataset.poster&&!video.poster)video.poster=video.dataset.poster;
    if(playing<MAX_PLAYING_VIDEOS){
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
  root.querySelectorAll('video.js-media-video[data-autoplay="1"]:not(.js-card-video):not(.with-controls)').forEach(video=>{lockVideo(video);const promise=video.play();if(promise?.catch)promise.catch(()=>{})});
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
  const showFavorite=!isLocked();
  const base=modelBaseModel(model);
  const name=String(model.name||`Model ${id}`);
  const author=model.creator?.username||model.author||t('unknownAuthor');
  const downloads=model.stats?.downloadCount??model.downloads;
  const likes=model.stats?.favoriteCount??model.stats?.thumbsUpCount??model.likes;
  return `<article class="card" data-id="${id}"><div class="thumb"><button class="thumb-open" type="button" data-open="${id}" aria-label="${esc(t('openModel',{name}))}">${mediaHtml(media,{card:true})}<span class="badge">${esc(modelTypeLabel(model.type))}</span>${base?`<span class="base-badge" title="${esc(t('baseModelTitle',{value:base}))}">${esc(base)}</span>`:''}</button>${showFavorite?`<button class="fav-btn ${favorite?'on':''}" data-fav="${id}" title="${esc(t('favorites'))}" aria-label="${esc(t('favorites'))}" aria-pressed="${favorite?'true':'false'}">♥</button>`:''}${collectButton('Model',id)}${uncollectButton('Model',id)}</div><div class="card-body"><div class="card-title" title="${esc(name)}">${esc(name)}</div><div class="creator">${esc(author)}</div><div class="stats"><span>⇩ ${fmt(downloads)}</span><span>♥ ${fmt(likes)}</span></div></div></article>`;
}
function render({append=false}={}){
  if(ACCOUNT_VIEWS.has(state.view))return renderAccountView({append});
  resetEmptyState();
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
function findModelById(id){return state.items.find(item=>Number(item.id)===Number(id))||state.favoriteItems.find(item=>Number(item.id)===Number(id))||(state.accountKind==='model'?state.accountItems.find(item=>Number(item.id)===Number(id)):null)||state.modelDetails.get(Number(id))||null}
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
function initGridEvents(){
  const grid=$('#grid');
  grid.addEventListener('click',event=>{
    const favorite=event.target.closest('[data-fav]');
    if(favorite){event.stopPropagation();toggleFav(Number(favorite.dataset.fav));return}
    const delImage=event.target.closest('[data-delete-image]');
    if(delImage){event.stopPropagation();deleteAccountImage(Number(delImage.dataset.deleteImage));return}
    const delPost=event.target.closest('[data-delete-post]');
    if(delPost){event.stopPropagation();deleteAccountPost(Number(delPost.dataset.deletePost));return}
    const image=event.target.closest('[data-image]');
    if(image){openImage(Number(image.dataset.image));return}
    const post=event.target.closest('[data-post]');
    if(post){openPost(Number(post.dataset.post));return}
    const open=event.target.closest('[data-open]');
    if(open)openModel(Number(open.dataset.open));
  });
  grid.addEventListener('pointerdown',event=>{
    const open=event.target.closest('[data-open]');
    if(open)getModelDetail(Number(open.dataset.open)).catch(()=>{});
  },{passive:true});
}
async function toggleFav(id){
  if(state.favoriteBusy.has(id))return;
  state.favoriteBusy.add(id);
  const model=findModelById(id);
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
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    const open=document.querySelector('.custom-select.open');
    if(!open)return;
    event.preventDefault();event.stopImmediatePropagation();setOpen(open,false);open.querySelector('.select-trigger')?.focus();
  },true);
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
  syncLoading();
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
    if(state.view!=='discover')return;
    render({append});
    showCatalogNotice(state.meta);
    if(append&&totalAdded===0)toast(!hasMore(state.meta)?t('noMoreModels'):t('repeatedModels'),'bad');
  }catch(error){
    if(error?.name==='AbortError'||requestId!==state.catalogSeq)return;
    dbg('error','Catalog load error',error);
    if(state.view!=='discover')return;
    const canRetry=(error.retryable||error.status===503||error.status===429)&&retryAttempt<1&&!append&&!state.activeSearch;
    if(canRetry){
      const retryMs=Math.min(60000,Math.max(5000,(Number(error.retryAfter)||0)*1000));
      $('#errorBox').textContent=t('retrying',{error:error.message,seconds:Math.round(retryMs/1000)});
      $('#errorBox').classList.remove('hidden');
      clearTimeout(state.retryTimer);
      state.retryTimer=setTimeout(()=>{if(state.view==='discover'&&!state.activeSearch)loadModels({retryAttempt:retryAttempt+1})},retryMs);
    }else{$('#errorBox').textContent=t('loadModelsError',{error:error.message});$('#errorBox').classList.remove('hidden')}
  }finally{
    if(requestId===state.catalogSeq){state.loading=false;state.catalogAbort=null;syncLoading()}
  }
}

function versionHtml(version){
  const versionId=Number(version.id);
  const safeVersionId=Number.isSafeInteger(versionId)&&versionId>0?String(versionId):'';
  const files=safeVersionId?(version.files||[]).map(file=>`<div class="file"><div class="file-info"><b>${esc(file.name||t('modelFile'))}</b><small>${file.sizeKB?formatBytes(file.sizeKB*1024):''} ${esc(file.metadata?.format||'')}</small></div><a class="download-btn" href="/api/download/${encodeURIComponent(safeVersionId)}?fileId=${encodeURIComponent(file.id||'')}" target="_blank" rel="noopener" data-download="${esc(safeVersionId)}" data-name="${esc(file.name||'')}">⇩ ${t('download')}</a></div>`).join(''):`<small>${t('noFiles')}</small>`;
  const published=version.publishedAt?new Date(version.publishedAt):null;
  const date=published&&!Number.isNaN(published.getTime())?published.toLocaleDateString(localeName()):'';
  return `<div class="version"><div class="version-head"><div><b>${esc(version.name||'')}</b><br><small>${esc(version.baseModel||'')}${date?` · ${date}`:''}</small></div><small>#${esc(version.id||'')}</small></div><div class="files">${files}</div></div>`;
}
function renderModelDetails(model){
  const versions=model.modelVersions||[];
  const media=modelMedia(model).slice(0,10);
  const first=media[0]||null;
  const mediaPanel=`<div class="details-media-wrap"><div id="detailsMedia" class="details-media natural"${mediaFrameStyle(first)}>${mediaHtml(first,{autoplay:first?.kind==='video',label:false,original:true,controls:first?.kind==='video'})}</div>${media.length>1?`<div class="media-strip">${media.map((item,index)=>`<button class="media-chip ${index===0?'active':''}" data-media-index="${index}" aria-label="${esc(t('mediaLabel',{number:index+1}))}">${mediaHtml(item,{label:false,thumbnail:true})}</button>`).join('')}</div>`:''}</div>`;
  const bases=[...new Set(versions.map(version=>String(version.baseModel||'').trim()).filter(Boolean))];
  const limit=20;
  const visibleVersions=state.showAllVersions?versions:versions.slice(0,limit);
  const toggle=versions.length>limit?`<button id="versionToggle" class="ghost full detail-more" type="button">${state.showAllVersions?t('showLessVersions'):t('showAllVersions',{count:versions.length})}</button>`:'';
  const description=plainText(model.description||'').slice(0,900)||t('descriptionMissing');
  $('#modalContent').innerHTML=`<div class="details">${mediaPanel}<div class="details-info"><div class="detail-badges"><span class="detail-pill">${esc(modelTypeLabel(model.type))}</span>${bases.slice(0,3).map(base=>`<span class="detail-pill base">${esc(base)}</span>`).join('')}</div><h2>${esc(model.name)}</h2><div class="meta">${t('author')}: ${esc(model.creator?.username||'—')} · ID ${esc(model.id)}</div><div class="detail-links"><a class="model-page-link" href="https://civitai.red/models/${encodeURIComponent(model.id)}" target="_blank" rel="noopener noreferrer">${esc(t('openOnCivitai'))} ↗</a>${collectButton('Model',model.id,{inline:true})}</div><p class="muted">${esc(description)}</p><h3>${t('versionsFiles')}</h3>${visibleVersions.map(versionHtml).join('')}${toggle}</div></div>`;
  bindMediaPlayback($('#modalContent'));
  $('#modalContent').querySelectorAll('[data-media-index]').forEach(button=>button.onclick=()=>{
    const index=Number(button.dataset.mediaIndex);
    const item=media[index];
    if(!item)return;
    $('#modalContent').querySelectorAll('[data-media-index]').forEach(el=>el.classList.toggle('active',el===button));
    const target=$('#detailsMedia');cleanupMedia(target);target.style.aspectRatio=item.width&&item.height?`${item.width}/${item.height}`:'';target.innerHTML=mediaHtml(item,{autoplay:item.kind==='video',label:false,original:true,controls:item.kind==='video'});bindMediaPlayback(target);
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
  $('#modalContent').innerHTML=`<div class="details"><div class="details-media-wrap"><div class="details-media natural"${mediaFrameStyle(summaryMedia)}>${mediaHtml(summaryMedia,{autoplay:summaryMedia?.kind==='video',label:false,original:true,controls:summaryMedia?.kind==='video'})}</div></div><div class="details-info details-loading"><div class="detail-badges">${summary?.type?`<span class="detail-pill">${esc(modelTypeLabel(summary.type))}</span>`:''}${modelBaseModel(summary)?`<span class="detail-pill base">${esc(modelBaseModel(summary))}</span>`:''}</div><h2>${esc(summary?.name||t('loadingModel'))}</h2><div class="meta">${(summary?.creator?.username||summary?.author)?`${t('author')}: ${esc(summary?.creator?.username||summary?.author)} · `:''}ID ${id}</div><div class="detail-skeleton"><i></i><i></i><i></i><i></i></div></div></div>`;
  bindMediaPlayback($('#modalContent'));
  try{
    const model=await getModelDetail(id);
    if(request===state.modalRequest&&state.openModelId===Number(id)&&!$('#modal').classList.contains('hidden'))renderModelDetails(model);
  }catch(error){
    if(request!==state.modalRequest)return;
    if(error?.code==='LOCKED_NSFW'){closeModelModal();toast(error.message,'bad');return}
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
  $('#clearToken').classList.toggle('hidden',!status.apiTokenConfigured);
  $('#search').placeholder=t('searchPlaceholder',{min:state.searchMinLength});
}
function updateViewText(){
  const view=state.view;
  const titles={discover:['discoverTitle','discoverSubtitle'],favorites:['favoritesTitle','favoritesSubtitle'],collections:['collectionsTitle','collectionsSubtitle'],mine:['mineTitle','mineSubtitle']};
  const [title,subtitle]=titles[view]||titles.discover;
  $('#viewTitle').textContent=t(title);
  let sub=t(subtitle);
  if(view==='collections'){const active=activeCollection();if(active)sub=[active.name,collectionTypeLabel(active.type),active.description].filter(Boolean).join(' · ')}
  $('#viewSubtitle').textContent=sub;
  $('#refreshBtn').classList.toggle('hidden',view==='favorites');
  document.body.dataset.view=view;
}
function syncLoading(){
  const busy=ACCOUNT_VIEWS.has(state.view)?state.accountBusy:(state.view==='discover'&&state.loading);
  $('#loading').classList.toggle('hidden',!busy);
  $('#loadMore').disabled=!!busy;
}
function setView(view){
  const previous=state.view;
  state.view=view;
  document.querySelectorAll('.nav').forEach(nav=>{const active=nav.dataset.view===view;nav.classList.toggle('active',active);nav.setAttribute('aria-pressed',active?'true':'false')});
  $('#errorBox').classList.add('hidden');$('#errorBox').classList.remove('notice');
  if(!ACCOUNT_VIEWS.has(view)){$('#subnav').classList.add('hidden');if(ACCOUNT_VIEWS.has(previous))abortAccountRequest()}
  updateViewText();
  if(ACCOUNT_VIEWS.has(view)&&previous!==view){resetAccountList();render();loadAccountItems()}
  else render();
  syncLoading();
}
function hasToken(){return !!state.status?.apiTokenConfigured&&!isLocked()}
function formatInt(value){const number=Number(value);return Number.isFinite(number)?Intl.NumberFormat(localeName(),{maximumFractionDigits:0}).format(number):'—'}
function formatDate(value){if(!value)return '';const date=new Date(value);return Number.isNaN(date.getTime())?'':date.toLocaleDateString(localeName(),{day:'numeric',month:'short',year:'numeric'})}
function collectionTypeLabel(type){return t({Model:'typeModel',Image:'typeImage',Post:'typePost',Article:'typeArticle'}[type]||'typeModel')}
function collectionIcon(type){return {Model:'◆',Image:'▧',Post:'▤',Article:'✎'}[type]||'◆'}
function activeCollection(){return (state.collections||[]).find(item=>item.id===state.activeCollectionId)||null}
function readStoredCollection(){try{return Number(localStorage.getItem('civitai.collection'))||null}catch{return null}}
function storeCollection(id){try{localStorage.setItem('civitai.collection',String(id))}catch{}}
function abortAccountRequest(){state.accountSeq++;state.accountAbort?.abort();state.accountAbort=null;state.accountBusy=false}
function resetAccountList(){abortAccountRequest();state.accountItems=[];state.accountKind=null;state.accountCursor=null;state.accountListError=null}
function accountMediaItem(item){return item?.url?{url:item.url,kind:item.type==='video'?'video':'image',poster:'',width:Number(item.width)||0,height:Number(item.height)||0}:null}
function indexAccountItems(items,kind){
  for(const item of items||[]){
    if(kind==='image')state.mediaIndex.set(Number(item.id),item);
    if(kind==='post'){state.postIndex.set(Number(item.id),item);for(const image of item.images||[])state.mediaIndex.set(Number(image.id),image)}
  }
}
async function loadCollections({force=false}={}){
  if(state.collections&&!force)return state.collections;
  const data=await api('/api/account/collections');
  state.collections=Array.isArray(data.items)?data.items:[];
  state.collectionsError=null;
  $('#collectionCount').textContent=state.collections.length;
  $('#collectionCount').classList.toggle('hidden',!state.collections.length);
  if(!state.collections.some(item=>item.id===state.activeCollectionId)){
    const stored=readStoredCollection();
    state.activeCollectionId=(state.collections.find(item=>item.id===stored)||state.collections[0])?.id??null;
  }
  return state.collections;
}
function accountListUrl(append){
  const params=new URLSearchParams({limit:'40'});
  if(append&&state.accountCursor)params.set('cursor',state.accountCursor);
  if(state.view==='collections'){
    const collection=activeCollection();
    if(!collection)return null;
    params.set('type',collection.type);
    if(collection.mode)params.set('mode',collection.mode);
    return `/api/account/collections/${encodeURIComponent(collection.id)}?${params}`;
  }
  return `/api/account/${state.mineTab==='posts'?'posts':'images'}?${params}`;
}
async function loadAccountItems({append=false}={}){
  const view=state.view;
  if(!ACCOUNT_VIEWS.has(view))return;
  if(append&&(!state.accountCursor||state.accountBusy))return;
  if(!hasToken()){resetAccountList();state.accountListError={code:'NO_TOKEN'};render();syncLoading();return}
  const seq=++state.accountSeq;
  state.accountAbort?.abort();
  const controller=new AbortController();
  state.accountAbort=controller;
  state.accountBusy=true;
  if(!append){state.accountItems=[];state.accountKind=null;state.accountCursor=null;state.accountListError=null;render()}
  syncLoading();
  try{
    if(view==='collections'&&!state.collections){await loadCollections();if(seq!==state.accountSeq)return;render()}
    const url=accountListUrl(append);
    if(!url){state.accountItems=[];state.accountKind=null;state.accountCursor=null;return}
    const data=await api(url,{signal:controller.signal});
    if(seq!==state.accountSeq)return;
    const incoming=Array.isArray(data.items)?data.items:[];
    state.accountKind=data.kind||state.accountKind||'model';
    state.accountItems=mergeUniqueModels(append?state.accountItems:[],incoming).items;
    state.accountCursor=data.nextCursor||null;
    state.accountListError=null;
    indexAccountItems(incoming,state.accountKind);
  }catch(error){
    if(error?.name==='AbortError'||seq!==state.accountSeq)return;
    dbg('error','Account list',error);
    if(append)toast(t('accountLoadError',{error:error.message}),'bad');
    else state.accountListError={code:error.code,status:error.status,message:error.message};
  }finally{
    if(seq===state.accountSeq){
      state.accountBusy=false;state.accountAbort=null;
      if(state.view===view)render({append:append&&!state.accountListError});
      syncLoading();
    }
  }
}
function renderSubnav(){
  const box=$('#subnav');
  if(state.view==='mine'){
    box.innerHTML=[['images','tabMedia','▧'],['posts','tabPosts','▤']].map(([tab,label,icon])=>`<button class="subnav-chip ${state.mineTab===tab?'active':''}" type="button" role="tab" aria-selected="${state.mineTab===tab}" data-tab="${tab}"><span class="chip-icon">${icon}</span>${esc(t(label))}</button>`).join('')+(canWriteMedia()?`<button id="publishBtn" class="primary subnav-action" type="button" data-publish="1">＋ ${esc(t('publishNew'))}</button>`:'');
    box.classList.toggle('hidden',!hasToken());
    return;
  }
  const collections=state.collections||[];
  box.innerHTML=collections.map(item=>`<button class="subnav-chip ${item.id===state.activeCollectionId?'active':''}" type="button" role="tab" aria-selected="${item.id===state.activeCollectionId}" data-collection="${item.id}" title="${esc([collectionTypeLabel(item.type),item.mode==='Bookmark'?t('bookmark'):'',item.read==='Private'?t('privateCollection'):''].filter(Boolean).join(' · '))}"><span class="chip-icon">${collectionIcon(item.type)}</span>${esc(item.name)}${item.mode==='Bookmark'?'<span class="chip-flag">★</span>':''}</button>`).join('');
  box.classList.toggle('hidden',!collections.length);
}
function imageCard(item){
  const media=accountMediaItem(item);
  const date=formatDate(item.publishedAt||item.createdAt);
  return `<article class="card media-card" data-id="${Number(item.id)}"><div class="thumb"><button class="thumb-open" type="button" data-image="${Number(item.id)}" aria-label="${esc(t('openImage'))}">${mediaHtml(media,{card:true})}</button>${ownerDeleteButton('image',item)}${uncollectButton('Image',item.id)}</div><div class="card-body"><div class="card-title">${esc(date||`#${item.id}`)}</div><div class="creator">${esc(item.author||'')}</div><div class="stats"><span title="${esc(t('reactions'))}">♥ ${fmt(item.reactions)}</span><span title="${esc(t('comments'))}">✉ ${fmt(item.comments)}</span></div></div></article>`;
}
function postCard(item){
  const media=accountMediaItem(item.cover);
  const title=item.title||t('untitledPost');
  return `<article class="card post-card" data-id="${Number(item.id)}"><div class="thumb"><button class="thumb-open" type="button" data-post="${Number(item.id)}" aria-label="${esc(t('openPost'))}">${mediaHtml(media,{card:true,label:false})}<span class="badge">${esc(t('imagesCount',{count:fmt(item.imageCount)}))}</span></button>${ownerDeleteButton('post',item)}${uncollectButton('Post',item.id)}</div><div class="card-body"><div class="card-title" title="${esc(title)}">${esc(title)}</div><div class="creator">${esc(formatDate(item.publishedAt))}</div><div class="stats"><span title="${esc(t('reactions'))}">♥ ${fmt(item.reactions)}</span><span title="${esc(t('comments'))}">✉ ${fmt(item.comments)}</span></div></div></article>`;
}
function articleCard(item){
  const media=accountMediaItem(item.cover);
  const title=item.title||`#${item.id}`;
  return `<article class="card" data-id="${Number(item.id)}"><div class="thumb"><a class="thumb-open" href="https://civitai.red/articles/${encodeURIComponent(item.id)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(title)}">${mediaHtml(media,{card:true,label:false})}<span class="badge">${esc(t('typeArticle'))}</span></a>${uncollectButton('Article',item.id)}</div><div class="card-body"><div class="card-title" title="${esc(title)}">${esc(title)}</div><div class="creator">${esc(item.author||'')}</div><div class="stats"><span>${esc(formatDate(item.publishedAt))}</span></div></div></article>`;
}
function accountCardHtml(item){
  if(state.accountKind==='image')return imageCard(item);
  if(state.accountKind==='post')return postCard(item);
  if(state.accountKind==='article')return articleCard(item);
  return card(item);
}
function resetEmptyState(){
  $('#emptyTitle').textContent=t('emptyTitle');
  $('#emptyText').textContent=t('emptyText');
  $('#emptyAction').classList.add('hidden');
}
function setEmptyState(title,text,withAction=false,action='settings'){
  $('#emptyTitle').textContent=title;
  $('#emptyText').textContent=text;
  $('#emptyAction').dataset.action=action;
  $('#emptyAction').textContent=t(action==='retry'?'retry':'openSettings');
  $('#emptyAction').classList.toggle('hidden',!withAction);
}
function renderAccountView({append=false}={}){
  renderSubnav();
  updateViewText();
  const grid=$('#grid');
  const items=state.accountItems;
  if(append){
    const shown=new Set([...grid.querySelectorAll('.card[data-id]')].map(el=>String(el.dataset.id)));
    const fresh=items.filter(item=>!shown.has(String(item.id)));
    if(fresh.length){
      const marker=document.createElement('div');
      marker.innerHTML=fresh.map(accountCardHtml).join('');
      const nodes=[...marker.children];
      nodes.forEach(node=>grid.append(node));
      nodes.forEach(node=>bindMediaPlayback(node));
    }
  }else{
    cleanupMedia(grid);
    grid.innerHTML=items.map(accountCardHtml).join('');
    bindMediaPlayback(grid);
  }
  const error=state.accountListError;
  let showEmpty=false;
  if(error?.code==='NO_TOKEN'){setEmptyState(t('accountNeedsToken'),t('accountNeedsTokenText'),true);showEmpty=true}
  else if(error?.code==='NO_PERMISSION'||error?.status===403){setEmptyState(t('noPermissionTitle'),t('noPermissionText'),true);showEmpty=true}
  else if(error){setEmptyState(t('accountLoadError',{error:error.message||error.code}),'',true,'retry');showEmpty=true}
  else if(!state.accountBusy&&!items.length){
    const title=state.view==='collections'?(state.collections&&!state.collections.length?t('noCollections'):t('collectionEmpty')):(state.mineTab==='posts'?t('noPosts'):t('noMedia'));
    setEmptyState(title,'',false);showEmpty=true;
  }
  $('#empty').classList.toggle('hidden',!showEmpty);
  $('#resultCount').textContent=`${fmt(items.length)}${state.accountCursor?'+':''}`;
  $('#loadMore').classList.toggle('hidden',!state.accountCursor||!!error);
}
function generationBlock(label,value){
  if(!value)return '';
  return `<div class="gen-block"><div class="gen-head"><span>${esc(label)}</span><button class="link-btn" type="button" data-copy="${esc(value)}">${esc(t('copy'))}</button></div><p>${esc(value)}</p></div>`;
}
function renderGenerationData(info){
  const params=[['sampler',info.sampler],['steps',info.steps],['cfg',info.cfgScale],['seed',info.seed],['size',info.size]].filter(([,value])=>value);
  const resources=(info.resources||[]).map(item=>{
    const label=`${esc(item.modelName||'—')}${item.versionName?` <small>${esc(item.versionName)}</small>`:''}`;
    const meta=[item.modelType,item.baseModel,item.strength!=null?`× ${item.strength}`:''].filter(Boolean).map(esc).join(' · ');
    return `<li>${item.modelId?`<button class="resource-link" type="button" data-open-model="${Number(item.modelId)}">${label}</button>`:`<span>${label}</span>`}<small>${meta}</small></li>`;
  }).join('');
  const hasAny=info.prompt||info.negativePrompt||params.length||resources||(info.techniques||[]).length;
  if(!hasAny)return `<p class="muted">${esc(t('noGenerationData'))}</p>`;
  return `${generationBlock(t('prompt'),info.prompt)}${generationBlock(t('negativePrompt'),info.negativePrompt)}${params.length?`<div class="gen-params">${params.map(([key,value])=>`<span><small>${esc(t(key))}</small><b>${esc(value)}</b></span>`).join('')}</div>`:''}${(info.techniques||[]).length?`<div class="detail-badges gen-techniques">${info.techniques.map(name=>`<span class="detail-pill base">${esc(name)}</span>`).join('')}</div>`:''}${resources?`<h3>${esc(t('resources'))}</h3><ul class="resource-list">${resources}</ul>`:''}`;
}
async function openImage(id,{fromPost=null}={}){
  const item=state.mediaIndex.get(Number(id));
  if(!item)return;
  const request=++state.modalRequest;
  state.openModelId=null;
  const media=accountMediaItem(item);
  const content=$('#modalContent');
  if($('#modal').classList.contains('hidden'))showDialog($('#modal'),'#modalClose');
  cleanupMedia(content);
  const date=formatDate(item.publishedAt||item.createdAt);
  const back=fromPost?`<button class="ghost back-btn" type="button" data-back-post="${Number(fromPost)}">← ${esc(t('postImages'))}</button>`:'';
  content.innerHTML=`<div class="details"><div class="details-media-wrap"><div class="details-media natural"${mediaFrameStyle(media)}>${mediaHtml(media,{autoplay:media?.kind==='video',label:false,original:true,controls:media?.kind==='video'})}</div><a class="model-page-link media-original-link" href="${esc(originalMediaUrl(media?.url||''))}" target="_blank" rel="noopener noreferrer">${esc(t('openOriginal'))} ↗</a></div><div class="details-info">${back}<div class="detail-badges"><span class="detail-pill">${esc(media?.kind==='video'?t('video'):t('image'))}</span>${item.width&&item.height?`<span class="detail-pill base">${Number(item.width)}×${Number(item.height)}</span>`:''}</div><h2>${esc(date||`#${item.id}`)}</h2><div class="meta">${item.author?`${esc(t('author'))}: ${esc(item.author)} · `:''}ID ${Number(item.id)}</div><div class="detail-links"><a class="model-page-link" href="https://civitai.red/images/${encodeURIComponent(item.id)}" target="_blank" rel="noopener noreferrer">${esc(t('openOnCivitai'))} ↗</a>${item.postId?`<a class="model-page-link" href="https://civitai.red/posts/${encodeURIComponent(item.postId)}" target="_blank" rel="noopener noreferrer">${esc(t('openPost'))} ↗</a>`:''}${collectButton('Image',item.id,{inline:true})}</div>${ownsItem(item)&&canDeleteMedia()?`<button class="danger-btn" type="button" data-delete-image="${Number(item.id)}">✕ ${esc(t('deleteImage'))}</button>`:''}<h3>${esc(t('generationData'))}</h3><div id="generationData"><div class="detail-skeleton"><i></i><i></i><i></i></div></div></div></div>`;
  bindMediaPlayback(content);
  try{
    const info=await api(`/api/account/images/${encodeURIComponent(item.id)}`);
    if(request!==state.modalRequest)return;
    const target=$('#generationData');if(target)target.innerHTML=renderGenerationData(info);
  }catch(error){
    if(request!==state.modalRequest)return;
    const target=$('#generationData');if(target)target.innerHTML=`<div class="error">${esc(t('accountLoadError',{error:error.message}))}</div>`;
  }
}
function postTileMedia(image){
  const media=accountMediaItem(image);
  if(!media)return '<div class="media-placeholder">◇</div>';
  const src=media.kind==='video'?videoPosterUrl(media,320,76):optimizedImageUrl(media.url,320,78);
  return `<img loading="lazy" decoding="async" src="${esc(src)}" alt="">${media.kind==='video'?'<span class="media-mini-video">▶</span>':''}`;
}
function openPost(id){
  const post=state.postIndex.get(Number(id));
  if(!post)return;
  state.modalRequest++;
  state.openModelId=null;
  const content=$('#modalContent');
  if($('#modal').classList.contains('hidden'))showDialog($('#modal'),'#modalClose');
  cleanupMedia(content);
  const title=post.title||t('untitledPost');
  const tiles=(post.images||[]).map(image=>`<button class="post-tile" type="button" data-post-image="${Number(image.id)}" data-post-id="${Number(post.id)}" aria-label="${esc(t('openImage'))}">${postTileMedia(image)}</button>`).join('');
  content.innerHTML=`<div class="post-details"><div class="detail-badges"><span class="detail-pill">${esc(t('typePost'))}</span><span class="detail-pill base">${esc(t('imagesCount',{count:fmt(post.imageCount)}))}</span></div><h2>${esc(title)}</h2><div class="meta">${esc(t('published'))}: ${esc(formatDate(post.publishedAt)||'—')} · ♥ ${fmt(post.reactions)} · ✉ ${fmt(post.comments)} · ID ${Number(post.id)}</div><div class="detail-links"><a class="model-page-link" href="https://civitai.red/posts/${encodeURIComponent(post.id)}" target="_blank" rel="noopener noreferrer">${esc(t('openOnCivitai'))} ↗</a>${collectButton('Post',post.id,{inline:true})}</div>${ownsItem(post)&&canDeleteMedia()?`<button class="danger-btn" type="button" data-delete-post="${Number(post.id)}">✕ ${esc(t('deletePost'))}</button>`:''}<div class="post-grid">${tiles}</div></div>`;
  bindMediaPlayback(content);
}
function renderAccountPill(){
  const pill=$('#accountBtn');
  if(!hasToken()){pill.classList.add('hidden');$('#accountMenu').classList.add('hidden');return}
  pill.classList.remove('hidden');
  const account=state.account;
  const avatar=$('#accountAvatar');
  if(account?.avatar){avatar.src=optimizedImageUrl(account.avatar,96,80);avatar.classList.remove('hidden')}else avatar.classList.add('hidden');
  $('#accountName').textContent=account?.username||(state.accountError?'!':'…');
  const total=account?.buzz?.total;
  $('#buzzTotal').textContent=state.accountLoading&&!account?'…':(Number.isFinite(total)?formatInt(total):'—');
  pill.title=account?`${t('signedInAs',{name:account.username})} · ${t('buzzBalance')}: ${Number.isFinite(total)?formatInt(total):'—'}`:(state.accountError?t('accountLoadError',{error:state.accountError.message}):t('buzzBalance'));
  pill.classList.toggle('error',!!state.accountError&&!account);
  $('#accountMenuTitle').textContent=account?.username||t('buzzBalance');
  $('#accountMenuStatus').textContent=account?[account.status?t('accountStatus',{status:account.status}):'',account.isMember?t('member'):''].filter(Boolean).join(' · '):(state.accountError?t('accountLoadError',{error:state.accountError.message}):'');
  const names={blue:'buzzBlue',yellow:'buzzYellow',green:'buzzGreen',red:'buzzRed'};
  const buzz=account?.buzz;
  const rows=buzz?Object.entries(buzz).filter(([key])=>key!=='total').map(([key,value])=>`<div class="buzz-row"><span><i class="buzz-dot buzz-${esc(key)}"></i>${esc(names[key]?t(names[key]):key)}</span><b>${formatInt(value)}</b></div>`).join(''):'';
  $('#buzzBreakdown').innerHTML=buzz?`${rows}<div class="buzz-row total"><span>${esc(t('buzzTotal'))}</span><b>⚡ ${formatInt(buzz.total)}</b></div>`:`<p class="muted">${esc(account?.buzzError?t('buzzUnavailable',{error:account.buzzError==='NO_PERMISSION'?t('noPermissionTitle'):account.buzzError}):'—')}</p>`;
  $('#accountProfileLink').href=account?.username?`https://civitai.red/user/${encodeURIComponent(account.username)}`:'https://civitai.red';
}
let accountProfileRequest=0;
async function loadAccountProfile({fresh=false}={}){
  const request=++accountProfileRequest;
  if(!hasToken()){state.account=null;state.accountError=null;state.accountLoading=false;renderAccountPill();return}
  state.accountLoading=true;renderAccountPill();
  try{
    const account=await api(`/api/account${fresh?'?fresh=1':''}`);
    if(request!==accountProfileRequest)return;
    state.account=account;state.accountError=null;
  }catch(error){
    if(request!==accountProfileRequest)return;
    state.accountError={code:error.code,message:error.message};
    dbg('warn','Account profile',error);
  }finally{
    if(request===accountProfileRequest){state.accountLoading=false;renderAccountPill();const scopeKey=String(state.account?.tokenScope??'')+'|'+String(state.account?.username??'');if(scopeKey!==state.renderedScopeKey){state.renderedScopeKey=scopeKey;if(document.querySelector('#grid .card'))render();if(state.view==='mine')renderSubnav()}}
  }
}
function setAccountMenu(open){
  $('#accountMenu').classList.toggle('hidden',!open);
  $('#accountBtn').setAttribute('aria-expanded',open?'true':'false');
}
function onTokenChanged(){
  state.account=null;state.accountError=null;state.collections=null;state.activeCollectionId=null;
  state.mediaIndex.clear();state.postIndex.clear();
  $('#collectionCount').classList.add('hidden');
  resetAccountList();
  loadAccountProfile();
  if(ACCOUNT_VIEWS.has(state.view)){render();loadAccountItems()}
}
function initAccountEvents(){
  $('#accountBtn').onclick=event=>{event.stopPropagation();const open=$('#accountMenu').classList.contains('hidden');setAccountMenu(open);if(open&&!state.accountLoading)loadAccountProfile({fresh:true})};
  $('#accountMenu').onclick=event=>event.stopPropagation();
  document.addEventListener('click',()=>setAccountMenu(false));
  $('#accountRefresh').onclick=()=>loadAccountProfile({fresh:true});
  $('#emptyAction').onclick=()=>{if($('#emptyAction').dataset.action==='retry'){resetAccountList();render();loadAccountItems();return}openSettingsDialog()};
  initPublishEvents();
  initCollectEvents();
  $('#subnav').onclick=event=>{
    const tab=event.target.closest('[data-tab]');
    if(tab&&tab.dataset.tab!==state.mineTab){state.mineTab=tab.dataset.tab==='posts'?'posts':'images';resetAccountList();render();loadAccountItems();return}
    const chip=event.target.closest('[data-collection]');
    if(chip){const id=Number(chip.dataset.collection);if(id===state.activeCollectionId)return;state.activeCollectionId=id;storeCollection(id);resetAccountList();render();loadAccountItems()}
  };
  $('#modalContent').addEventListener('click',event=>{
    const copy=event.target.closest('[data-copy]');
    if(copy){navigator.clipboard?.writeText(copy.dataset.copy).then(()=>toast(t('copied'))).catch(()=>{});return}
    const model=event.target.closest('[data-open-model]');
    if(model){openModel(Number(model.dataset.openModel));return}
    const tile=event.target.closest('[data-post-image]');
    if(tile){openImage(Number(tile.dataset.postImage),{fromPost:Number(tile.dataset.postId)});return}
    const back=event.target.closest('[data-back-post]');
    if(back)openPost(Number(back.dataset.backPost));
  });
  setInterval(()=>{if(document.visibilityState==='visible'&&hasToken()&&!state.accountLoading)loadAccountProfile({fresh:true})},120000);
}
async function initData(){
  const [settings,status]=await Promise.all([api('/api/settings'),api('/api/status')]);
  state.status=status;
  const favorites=isLocked()?{items:[]}:await api('/api/favorites').catch(error=>{dbg('warn','Favorites',error);return {items:[]}});
  state.settings=settings;
  if(settings.language==='en'||settings.language==='ru'){state.locale=settings.language;storeLocale(state.locale)}
  state.favoriteItems=Array.isArray(favorites.items)?favorites.items:[];
  state.favorites=new Set(state.favoriteItems.map(item=>Number(item.id)));
  $('#favCount').textContent=state.favorites.size;
  applyTranslations();
  setCustomSelect('typeFilter',settings.defaultType||'');
  setCustomSelect('baseModelFilter',settings.defaultBaseModel||'');
  setCustomSelect('sortFilter',settings.defaultSort||'Highest Rated');
  setCustomSelect('periodFilter',settings.defaultPeriod||'AllTime');
  applyStatus(status);
  applyLockUi();
  loadAccountProfile();
}
function commitSearch(){
  const value=$('#search').value.trim();
  if(value&&value.length<state.searchMinLength){toast(t('searchTooShort',{min:state.searchMinLength}),'bad');dbg('warn','Search query is too short',{length:value.length,min:state.searchMinLength});return false}
  clearTimeout(state.retryTimer);state.activeSearch=value;state.page=1;state.meta=null;setView('discover');loadModels();return true;
}
let languageSaveTimer=null;
function switchLanguage(){
  state.locale=state.locale==='ru'?'en':'ru';
  storeLocale(state.locale);
  if(state.settings)state.settings.language=state.locale;
  applyTranslations();
  render();
  if(state.openModelId&&state.modelDetails.has(state.openModelId))renderModelDetails(state.modelDetails.get(state.openModelId));
  clearTimeout(languageSaveTimer);
  languageSaveTimer=setTimeout(()=>api('/api/settings',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({language:state.locale})}).catch(error=>dbg('warn','Failed to persist language',error)),120);
}
function initEvents(){
  initGridEvents();
  $('#search').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.isComposing)commitSearch()});
  $('#search').addEventListener('input',()=>{if(!$('#search').value&&state.activeSearch)commitSearch()});
  document.querySelector('.brand').addEventListener('click',event=>{event.preventDefault();if(state.view!=='discover')setView('discover');window.scrollTo({top:0,behavior:'smooth'})});
  ['typeFilter','baseModelFilter','sortFilter','periodFilter'].forEach(id=>{$(`#${id}`).onchange=()=>{clearTimeout(state.retryTimer);persistFilters();state.page=1;state.meta=null;setView('discover');loadModels()}});
  $('#refreshBtn').onclick=()=>{
    if(ACCOUNT_VIEWS.has(state.view)){if(state.view==='collections')state.collections=null;resetAccountList();render();loadAccountItems();loadAccountProfile({fresh:true});return}
    if(state.view!=='discover')return;clearTimeout(state.retryTimer);state.page=1;state.meta=null;loadModels();
  };
  $('#loadMore').onclick=()=>ACCOUNT_VIEWS.has(state.view)?loadAccountItems({append:true}):loadModels({append:true});
  initAccountEvents();
  $('#resetBtn').onclick=()=>{clearTimeout(state.retryTimer);$('#search').value='';state.activeSearch='';setCustomSelect('typeFilter','');setCustomSelect('baseModelFilter','');setCustomSelect('sortFilter','Highest Rated');setCustomSelect('periodFilter','AllTime');persistFilters();state.page=1;state.meta=null;setView('discover');loadModels()};
  document.querySelectorAll('.nav').forEach(nav=>nav.onclick=()=>setView(nav.dataset.view));
  $('#modalClose').onclick=closeModelModal;
  $('#modal').onclick=event=>{if(event.target.id==='modal')closeModelModal()};
  $('#settingsBtn').onclick=openSettingsDialog;
  initLockEvents();
  $('#clearToken').onclick=async()=>{
    const button=$('#clearToken');if(button.disabled||!confirm(t('confirmRemoveToken')))return;button.disabled=true;
    try{
      const output=await api('/api/settings',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({clearApiToken:true})});
      state.settings=output.settings;applyStatus(output.status);onTokenChanged();$('#settingsMsg').textContent=t('tokenRemoved');toast(t('tokenRemoved'));
    }catch(error){$('#settingsMsg').textContent=t('settingsError',{error:error.message});toast(error.message,'bad')}
    finally{button.disabled=false}
  };
  $('#settingsClose').onclick=()=>hideDialog($('#settingsModal'));
  $('#settingsModal').onclick=event=>{if(event.target.id==='settingsModal')hideDialog($('#settingsModal'))};
  $('#toggleToken').onclick=()=>{const input=$('#apiToken');input.type=input.type==='password'?'text':'password';$('#toggleToken').setAttribute('aria-label',t(input.type==='password'?'showToken':'hideToken'))};
  $('#languageBtn').onclick=switchLanguage;
  $('#saveSettings').onclick=async()=>{
    const button=$('#saveSettings');if(button.disabled)return;button.disabled=true;
    try{
      const tokenChanged=!!$('#apiToken').value.trim();
      const output=await api('/api/settings',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({apiToken:$('#apiToken').value.trim(),language:state.locale})});
      state.settings=output.settings;applyStatus(output.status);if(tokenChanged)onTokenChanged();$('#apiToken').value='';$('#settingsMsg').textContent=t('settingsSaved');toast(t('settingsToast'));setTimeout(()=>hideDialog($('#settingsModal')),650);
    }catch(error){$('#settingsMsg').textContent=t('settingsError',{error:error.message});toast(error.message,'bad')}
    finally{button.disabled=false}
  };
  document.addEventListener('keydown',event=>{
    if(event.key==='Tab')trapDialogTab(event);
    if(event.key!=='Escape')return;
    if(!$('#accountMenu').classList.contains('hidden')){setAccountMenu(false);$('#accountBtn').focus();return}
    if(!$('#collectModal').classList.contains('hidden')){closeCollectDialog();return}
    if(!$('#publishModal').classList.contains('hidden')){closePublishDialog();return}
    if(!$('#modal').classList.contains('hidden'))closeModelModal();else if(!$('#settingsModal').classList.contains('hidden'))hideDialog($('#settingsModal'));
  });
}
document.addEventListener('DOMContentLoaded',async()=>{
  applyTranslations();
  initCustomSelects();
  initEvents();
  try{await initData();await loadModels()}catch(error){dbg('error','Initialization',error);$('#errorBox').textContent=t('initializationError',{error:error.message});$('#errorBox').classList.remove('hidden')}
});
const SCOPE_MEDIA_WRITE=64;
const SCOPE_MEDIA_DELETE=128;
const PUBLISH_TYPES={'image/png':'image','image/jpeg':'image','image/webp':'image','image/gif':'image','image/avif':'image','video/mp4':'video','video/webm':'video','video/quicktime':'video'};
const PUBLISH_MAX_FILES=20;
const PUBLISH_MAX_IMAGE_MB=50;
const PUBLISH_MAX_VIDEO_MB=750;
const publish={files:[],busy:false,xhr:null,seq:0};
function hasScope(bit){const scope=Number(state.account?.tokenScope);return Number.isSafeInteger(scope)&&(scope&bit)===bit}
function canWriteMedia(){return hasToken()&&hasScope(SCOPE_MEDIA_WRITE)}
function canDeleteMedia(){return hasToken()&&hasScope(SCOPE_MEDIA_DELETE)}
function ownsItem(item){const mine=String(state.account?.username||'').toLowerCase();return !!mine&&String(item?.author||'').toLowerCase()===mine}
function ownerDeleteButton(kind,item){
  if(state.view!=='mine'||!ownsItem(item)||!canDeleteMedia())return '';
  const attr=kind==='post'?'data-delete-post':'data-delete-image';
  const label=t(kind==='post'?'deletePost':'deleteImage');
  return `<button class="card-delete" type="button" ${attr}="${Number(item.id)}" title="${esc(label)}" aria-label="${esc(label)}">✕</button>`;
}
function refreshOwnerControls(){if(state.view==='mine'&&state.accountItems.length)render()}
function apiErrorText(error){
  if(error?.status===429){const seconds=Number(error.retryAfter)||10;return t('rateLimited',{seconds})}
  return error?.message||String(error);
}
async function deleteAccountImage(id){
  const item=state.mediaIndex.get(Number(id));
  if(!item)return;
  if(!canDeleteMedia()){toast(t('noDeletePermission'),'bad');return}
  if(!confirm(t('confirmDeleteImage')))return;
  try{
    await api(`/api/account/images/${encodeURIComponent(id)}/delete`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
    forgetImage(id,item);
    toast(t('imageDeleted'));
    const post=item.postId?state.postIndex.get(Number(item.postId)):null;
    if(!$('#modal').classList.contains('hidden')){if(post&&post.images.length)openPost(post.id);else closeModelModal()}
    render();
  }catch(error){
    if(error?.status===404){forgetImage(id,item);render()}
    toast(t('deleteError',{error:apiErrorText(error)}),'bad');
  }
}
function forgetImage(id,item){
  state.mediaIndex.delete(Number(id));
  const post=item?.postId?state.postIndex.get(Number(item.postId)):null;
  if(post){
    post.images=(post.images||[]).filter(image=>Number(image.id)!==Number(id));
    post.imageCount=Math.max(0,(Number(post.imageCount)||1)-1);
    if(post.cover&&Number(post.cover.id)===Number(id))post.cover=post.images[0]||null;
  }
  if(state.accountKind==='image')state.accountItems=state.accountItems.filter(entry=>Number(entry.id)!==Number(id));
}
async function deleteAccountPost(id){
  const post=state.postIndex.get(Number(id));
  if(!post)return;
  if(!canDeleteMedia()){toast(t('noDeletePermission'),'bad');return}
  if(!confirm(t('confirmDeletePost')))return;
  try{
    await api(`/api/account/posts/${encodeURIComponent(id)}/delete`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
    forgetPost(id,post);
    toast(t('postDeleted'));
    if(!$('#modal').classList.contains('hidden'))closeModelModal();
    render();
  }catch(error){
    if(error?.status===404){forgetPost(id,post);render()}
    toast(t('deleteError',{error:apiErrorText(error)}),'bad');
  }
}
function forgetPost(id,post){
  state.postIndex.delete(Number(id));
  for(const image of post?.images||[])state.mediaIndex.delete(Number(image.id));
  if(state.accountKind==='post')state.accountItems=state.accountItems.filter(entry=>Number(entry.id)!==Number(id));
  if(state.accountKind==='image')state.accountItems=state.accountItems.filter(entry=>Number(entry.postId)!==Number(id));
}
function parseA1111Parameters(text){
  const lines=String(text||'').replace(/\r/g,'').split('\n');
  let settingsIndex=-1;
  for(let i=lines.length-1;i>=0;i--)if(/^\s*Steps:\s*\d+/.test(lines[i])){settingsIndex=i;break}
  const head=settingsIndex>=0?lines.slice(0,settingsIndex):lines;
  const negativeIndex=head.findIndex(line=>/^Negative prompt:/i.test(line));
  const prompt=(negativeIndex>=0?head.slice(0,negativeIndex):head).join('\n').trim();
  const negative=negativeIndex>=0?head.slice(negativeIndex).join('\n').replace(/^Negative prompt:\s*/i,'').trim():'';
  const meta={};
  if(prompt)meta.prompt=prompt;
  if(negative)meta.negativePrompt=negative;
  if(settingsIndex>=0){
    const settings=lines.slice(settingsIndex).join(', ');
    const pattern=/\s*([A-Za-z][\w .\-]*?):\s*("(?:[^"\\]|\\.)*"|[^,]*)(?:,|$)/g;
    const map={'Steps':'steps','Sampler':'sampler','CFG scale':'cfgScale','Seed':'seed','Size':'Size','Model':'Model','Model hash':'Model hash','Clip skip':'clipSkip','Schedule type':'scheduler'};
    let match;
    while((match=pattern.exec(settings))){
      if(match[0]===''){pattern.lastIndex++;continue}
      const key=map[match[1].trim()];
      if(!key)continue;
      const value=match[2].trim().replace(/^"|"$/g,'');
      meta[key]=['steps','cfgScale','seed','clipSkip'].includes(key)&&Number.isFinite(Number(value))?Number(value):value;
    }
  }
  return Object.keys(meta).length?meta:null;
}
async function readPngParameters(file){
  if(file.type!=='image/png')return null;
  try{
    const buffer=await file.slice(0,Math.min(file.size,8*1024*1024)).arrayBuffer();
    const view=new DataView(buffer);
    const bytes=new Uint8Array(buffer);
    const latin=new TextDecoder('latin1'),utf8=new TextDecoder('utf-8');
    let offset=8;
    while(offset+8<=bytes.length){
      const length=view.getUint32(offset);
      const type=String.fromCharCode(bytes[offset+4],bytes[offset+5],bytes[offset+6],bytes[offset+7]);
      const start=offset+8,end=start+length;
      if(end>bytes.length||type==='IDAT'||type==='IEND')break;
      if(type==='tEXt'||type==='iTXt'){
        const data=bytes.subarray(start,end);
        const zero=data.indexOf(0);
        if(zero>0&&latin.decode(data.subarray(0,zero))==='parameters'){
          if(type==='tEXt')return parseA1111Parameters(latin.decode(data.subarray(zero+1)));
          const compressed=data[zero+1];
          let cursor=zero+3;
          cursor=data.indexOf(0,cursor)+1;
          cursor=data.indexOf(0,cursor)+1;
          if(!compressed)return parseA1111Parameters(utf8.decode(data.subarray(cursor)));
          if('DecompressionStream' in window){
            const stream=new Blob([data.subarray(cursor)]).stream().pipeThrough(new DecompressionStream('deflate'));
            return parseA1111Parameters(await new Response(stream).text());
          }
        }
      }
      offset=end+4;
    }
  }catch(error){dbg('warn','PNG metadata',error)}
  return null;
}
function readMediaInfo(kind,url){
  return new Promise(resolve=>{
    let timer=null;
    const done=info=>{clearTimeout(timer);resolve(info)};
    timer=setTimeout(()=>done({}),15000);
    if(kind==='video'){
      const video=document.createElement('video');
      video.preload='metadata';video.muted=true;
      video.onloadedmetadata=()=>done({width:video.videoWidth,height:video.videoHeight,duration:video.duration});
      video.onerror=()=>done({});
      video.src=url;
      return;
    }
    const image=new Image();
    image.onload=()=>done({width:image.naturalWidth,height:image.naturalHeight});
    image.onerror=()=>done({});
    image.src=url;
  });
}
async function addPublishFiles(fileList){
  for(const file of [...(fileList||[])]){
    if(publish.files.length>=PUBLISH_MAX_FILES){toast(t('tooManyFiles',{max:PUBLISH_MAX_FILES}),'bad');break}
    const kind=PUBLISH_TYPES[file.type];
    if(!kind){toast(t('fileTypeError',{name:file.name}),'bad');continue}
    const maxMb=kind==='video'?PUBLISH_MAX_VIDEO_MB:PUBLISH_MAX_IMAGE_MB;
    if(file.size>maxMb*1024*1024){toast(t('fileSizeError',{name:file.name,max:maxMb}),'bad');continue}
    const entry={id:++publish.seq,file,kind,url:URL.createObjectURL(file),status:'ready',progress:0,uuid:null,error:'',meta:null,width:0,height:0,duration:0};
    publish.files.push(entry);
    renderPublishList();
    const [info,meta]=await Promise.all([readMediaInfo(kind,entry.url),kind==='image'?readPngParameters(file):null]);
    Object.assign(entry,{width:info.width||0,height:info.height||0,duration:Number.isFinite(info.duration)?info.duration:0,meta});
    renderPublishList();
  }
}
function renderPublishList(){
  $('#publishList').innerHTML=publish.files.map(entry=>{
    const preview=entry.kind==='video'?`<video src="${esc(entry.url)}" muted playsinline preload="metadata"></video>`:`<img src="${esc(entry.url)}" alt="">`;
    const status=entry.status==='uploading'?`${Math.round(entry.progress)}%`:entry.status==='done'?t('fileUploaded'):entry.status==='error'?`${t('fileError')}: ${entry.error}`:t('fileReady');
    const details=[formatBytes(entry.file.size),entry.width&&entry.height?`${entry.width}×${entry.height}`:'',entry.duration?`${Math.round(entry.duration)} s`:'',entry.meta?t('metaFound'):''].filter(Boolean).join(' · ');
    return `<div class="publish-item ${esc(entry.status)}" data-file="${entry.id}"><div class="publish-thumb">${preview}</div><div class="publish-info"><b title="${esc(entry.file.name)}">${esc(entry.file.name)}</b><small>${esc(details)}</small><div class="publish-progress"><i style="width:${entry.status==='done'?100:Math.round(entry.progress)}%"></i></div><small class="publish-status">${esc(status)}</small></div><button class="icon-btn publish-remove" type="button" data-remove-file="${entry.id}" aria-label="${esc(t('removeFile'))}" ${publish.busy?'disabled':''}>×</button></div>`;
  }).join('');
  $('#publishSubmit').disabled=publish.busy||!publish.files.length;
  $('#publishSubmit').textContent=publish.busy?t('publishing'):t('publishNow');
  $('#dropZone').classList.toggle('disabled',publish.busy);
}
function renderPublishProgress(entry){
  const row=document.querySelector(`#publishList [data-file="${entry.id}"]`);
  if(!row)return renderPublishList();
  row.querySelector('.publish-progress i').style.width=`${Math.round(entry.progress)}%`;
  row.querySelector('.publish-status').textContent=`${Math.round(entry.progress)}%`;
}
function resetPublishForm(){
  for(const entry of publish.files)URL.revokeObjectURL(entry.url);
  publish.files=[];
  $('#publishTitleInput').value='';
  $('#publishDetail').value='';
  $('#publishMsg').textContent='';
  $('#publishFiles').value='';
  renderPublishList();
}
function openPublishDialog(){
  if(!canWriteMedia()){toast(t('noWritePermission'),'bad');return}
  $('#publishMsg').textContent='';
  renderPublishList();
  showDialog($('#publishModal'),'#dropZone');
}
function closePublishDialog(){
  if(publish.busy){if(!confirm(t('confirmClosePublish')))return;publish.cancelled=true;publish.xhr?.abort()}
  hideDialog($('#publishModal'));
}
function uploadPublishFile(entry){
  return new Promise((resolve,reject)=>{
    const xhr=new XMLHttpRequest();
    publish.xhr=xhr;
    xhr.open('POST','/api/account/upload');
    xhr.setRequestHeader('Content-Type',entry.file.type);
    xhr.setRequestHeader('X-File-Name',encodeURIComponent(entry.file.name));
    xhr.setRequestHeader('x-ui-language',state.locale);
    xhr.responseType='json';
    xhr.upload.onprogress=event=>{if(event.lengthComputable){entry.progress=Math.min(99,event.loaded/event.total*100);renderPublishProgress(entry)}};
    xhr.onload=()=>{
      publish.xhr=null;
      const data=xhr.response||{};
      if(xhr.status>=200&&xhr.status<300&&data.uuid)return resolve(data);
      reject(Object.assign(new Error(data.error||`HTTP ${xhr.status}`),{status:xhr.status,retryAfter:data.retryAfter}));
    };
    xhr.onerror=()=>{publish.xhr=null;reject(new Error(t('connectionLost')))};
    xhr.onabort=()=>{publish.xhr=null;reject(Object.assign(new Error('aborted'),{name:'AbortError'}))};
    xhr.send(entry.file);
  });
}
async function submitPublish(){
  if(publish.busy)return;
  if(!publish.files.length){$('#publishMsg').textContent=t('noFilesSelected');return}
  if(!canWriteMedia()){$('#publishMsg').textContent=t('noWritePermission');return}
  publish.busy=true;
  publish.cancelled=false;
  $('#publishMsg').textContent='';
  renderPublishList();
  try{
    for(const entry of publish.files){
      if(entry.uuid)continue;
      entry.status='uploading';entry.progress=0;entry.error='';renderPublishList();
      $('#publishMsg').textContent=t('uploadingFile',{name:entry.file.name});
      try{
        const data=await uploadPublishFile(entry);
        entry.uuid=data.uuid;entry.status='done';entry.progress=100;
      }catch(error){
        entry.status=error?.name==='AbortError'?'ready':'error';entry.error=apiErrorText(error);
        throw error;
      }finally{renderPublishList()}
      if(publish.cancelled)throw Object.assign(new Error('aborted'),{name:'AbortError'});
    }
    $('#publishMsg').textContent=t('publishing');
    const images=publish.files.map(entry=>({uuid:entry.uuid,name:entry.file.name,type:entry.kind,mimeType:entry.file.type,sizeKB:Math.max(1,Math.round(entry.file.size/1024)),width:entry.width||undefined,height:entry.height||undefined,duration:entry.duration||undefined,meta:entry.meta||undefined}));
    await api('/api/account/posts',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({title:$('#publishTitleInput').value.trim(),detail:$('#publishDetail').value.trim(),publish:true,images})});
    publish.busy=false;
    resetPublishForm();
    hideDialog($('#publishModal'));
    toast(t('publishSuccess'));
    state.mineTab='posts';
    if(state.view!=='mine')setView('mine');else{resetAccountList();render();loadAccountItems()}
    showPublishNotice();
    schedulePublishRefresh();
  }catch(error){
    if(error?.name!=='AbortError'){$('#publishMsg').textContent=t('publishError',{error:apiErrorText(error)});dbg('error','Publish',error)}
  }finally{
    publish.busy=false;
    publish.xhr=null;
    renderPublishList();
  }
}
function showPublishNotice(){
  const box=$('#errorBox');
  box.textContent=t('publishSuccess');
  box.classList.add('notice');box.classList.remove('hidden');
}
let publishRefreshTimers=[];
function schedulePublishRefresh(){
  publishRefreshTimers.forEach(clearTimeout);
  publishRefreshTimers=[20000,60000].map(delay=>setTimeout(()=>{if(state.view==='mine'&&!state.accountBusy){resetAccountList();render();loadAccountItems()}},delay));
}
function initPublishEvents(){
  $('#subnav').addEventListener('click',event=>{if(event.target.closest('[data-publish]'))openPublishDialog()});
  $('#publishClose').onclick=closePublishDialog;
  $('#publishModal').onclick=event=>{if(event.target.id==='publishModal')closePublishDialog()};
  $('#publishSubmit').onclick=submitPublish;
  const zone=$('#dropZone');
  zone.onclick=()=>{if(!publish.busy)$('#publishFiles').click()};
  zone.onkeydown=event=>{if((event.key==='Enter'||event.key===' ')&&!publish.busy){event.preventDefault();$('#publishFiles').click()}};
  $('#publishFiles').onchange=event=>{const files=[...event.target.files];event.target.value='';addPublishFiles(files)};
  zone.addEventListener('dragover',event=>{event.preventDefault();if(!publish.busy)zone.classList.add('over')});
  zone.addEventListener('dragleave',()=>zone.classList.remove('over'));
  zone.addEventListener('drop',event=>{event.preventDefault();zone.classList.remove('over');if(!publish.busy)addPublishFiles(event.dataTransfer?.files)});
  $('#publishList').addEventListener('click',event=>{
    const remove=event.target.closest('[data-remove-file]');
    if(!remove||publish.busy)return;
    const id=Number(remove.dataset.removeFile);
    const entry=publish.files.find(item=>item.id===id);
    if(entry)URL.revokeObjectURL(entry.url);
    publish.files=publish.files.filter(item=>item.id!==id);
    renderPublishList();
  });
  $('#modalContent').addEventListener('click',event=>{
    const delImage=event.target.closest('[data-delete-image]');
    if(delImage){deleteAccountImage(Number(delImage.dataset.deleteImage));return}
    const delPost=event.target.closest('[data-delete-post]');
    if(delPost)deleteAccountPost(Number(delPost.dataset.deletePost));
  });
}
const SCOPE_COLLECTIONS_WRITE=262144;
const collect={type:null,id:null,name:'',member:new Map(),busy:new Set(),read:'Private',request:0,creating:false};
function canWriteCollections(){return hasToken()&&hasScope(SCOPE_COLLECTIONS_WRITE)}
function collectButton(type,id,{inline=false}={}){
  if(!canWriteCollections())return '';
  if(inline)return `<button class="model-page-link collect-link" type="button" data-collect-type="${esc(type)}" data-collect-id="${Number(id)}">▦ ${esc(t('toCollection'))}</button>`;
  return `<button class="collect-btn" type="button" data-collect-type="${esc(type)}" data-collect-id="${Number(id)}" title="${esc(t('addToCollection'))}" aria-label="${esc(t('addToCollection'))}">▦</button>`;
}
function uncollectButton(type,id){
  if(state.view!=='collections'||!canWriteCollections())return '';
  const collection=activeCollection();
  if(!collection||collection.isOwner===false||collection.type!==type)return '';
  return `<button class="card-uncollect" type="button" data-uncollect-type="${esc(type)}" data-uncollect-id="${Number(id)}" title="${esc(t('removeFromCollection'))}" aria-label="${esc(t('removeFromCollection'))}">✕</button>`;
}
function collectItemName(type,id){
  id=Number(id);
  if(type==='Model')return findModelById(id)?.name||`#${id}`;
  if(type==='Image'){const item=state.mediaIndex.get(id);return item?(formatDate(item.publishedAt||item.createdAt)||item.name||`#${id}`):`#${id}`}
  if(type==='Post'){const post=state.postIndex.get(id);return post?.title||t('untitledPost')}
  return `#${id}`;
}
async function openCollectDialog(type,id){
  if(!canWriteCollections()){toast(t('noCollectionPermission'),'bad');return}
  const request=++collect.request;
  Object.assign(collect,{type,id:Number(id),name:collectItemName(type,id),member:new Map()});
  collect.busy.clear();
  $('#collectSubtitle').textContent=`${collectionTypeLabel(type)} · ${collect.name}`;
  $('#collectMsg').textContent='';
  $('#collectName').value='';
  setCollectPrivacy('Private');
  $('#collectList').innerHTML='<div class="detail-skeleton"><i></i><i></i><i></i></div>';
  showDialog($('#collectModal'),'#collectClose');
  try{
    const [,membership]=await Promise.all([loadCollections(),api(`/api/account/collections/for-item?type=${encodeURIComponent(type)}&id=${encodeURIComponent(id)}`)]);
    if(request!==collect.request)return;
    for(const row of membership.items||[])collect.member.set(Number(row.collectionId),row.canRemove!==false);
    renderCollectList();
  }catch(error){
    if(request!==collect.request)return;
    $('#collectList').innerHTML=`<div class="error">${esc(t('collectionError',{error:apiErrorText(error)}))}</div>`;
  }
}
function renderCollectList(){
  const list=(state.collections||[]).filter(item=>item.type===collect.type&&item.isOwner!==false);
  if(!list.length){$('#collectList').innerHTML=`<p class="muted">${esc(t('noCollectionsOfType',{type:collectionTypeLabel(collect.type)}))}</p>`;return}
  $('#collectList').innerHTML=list.map(item=>{
    const inside=collect.member.has(item.id);
    const locked=inside&&collect.member.get(item.id)===false;
    const busy=collect.busy.has(item.id);
    const flags=[item.mode==='Bookmark'?t('bookmark'):'',item.read==='Private'?t('privacyPrivate'):item.read==='Unlisted'?t('privacyUnlisted'):item.read==='Public'?t('privacyPublic'):''].filter(Boolean).join(' · ');
    return `<button class="collect-row ${inside?'on':''} ${busy?'busy':''}" type="button" role="checkbox" aria-checked="${inside}" data-collect-toggle="${item.id}" ${busy||locked?'disabled':''} title="${esc(locked?t('cannotRemove'):'')}"><span class="collect-check" aria-hidden="true"></span><span class="collect-row-text"><b>${esc(item.name)}</b><small>${esc(flags)}</small></span><span class="chip-icon">${collectionIcon(item.type)}</span></button>`;
  }).join('');
}
async function toggleCollectMembership(collectionId){
  collectionId=Number(collectionId);
  if(collect.busy.has(collectionId))return;
  const collection=(state.collections||[]).find(item=>item.id===collectionId);
  const inside=collect.member.has(collectionId);
  const {type,id}=collect;
  collect.busy.add(collectionId);
  renderCollectList();
  try{
    await api('/api/account/collections/items',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type,id,collectionId,action:inside?'remove':'add'})});
    if(inside)collect.member.delete(collectionId);else collect.member.set(collectionId,true);
    toast(t(inside?'removedFromCollection':'addedToCollection',{name:collection?.name||`#${collectionId}`}));
    afterCollectionChange(collectionId,type,id,inside?'remove':'add');
  }catch(error){
    toast(t('collectionError',{error:apiErrorText(error)}),'bad');
  }finally{
    collect.busy.delete(collectionId);
    if(collect.type===type&&collect.id===id)renderCollectList();
  }
}
function afterCollectionChange(collectionId,type,id,action){
  if(state.view!=='collections'||state.activeCollectionId!==collectionId)return;
  if(action==='remove'){
    state.accountItems=state.accountItems.filter(item=>Number(item.id)!==Number(id));
    render();
  }else{resetAccountList();render();loadAccountItems()}
}
function setCollectPrivacy(read){
  collect.read=read;
  document.querySelectorAll('#collectModal .privacy-chip').forEach(chip=>{const on=chip.dataset.read===read;chip.classList.toggle('active',on);chip.setAttribute('aria-checked',on?'true':'false')});
}
async function createCollectionWithItem(){
  if(collect.creating)return;
  const name=$('#collectName').value.trim();
  if(!name){$('#collectMsg').textContent=t('collectionNameRequired');$('#collectName').focus();return}
  collect.creating=true;
  $('#collectCreate').disabled=true;
  $('#collectMsg').textContent='';
  const {type,id}=collect;
  try{
    const created=await api('/api/account/collections/create',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name,type,read:collect.read,itemId:id})});
    state.collections=[...(state.collections||[]),{id:created.id,name:created.name,description:'',type:created.type,mode:created.mode,read:created.read,isOwner:true,cover:null}];
    $('#collectionCount').textContent=state.collections.length;
    $('#collectionCount').classList.remove('hidden');
    if(created.itemAdded)collect.member.set(Number(created.id),true);
    $('#collectName').value='';
    toast(t('collectionCreated',{name:created.name}));
    if(collect.type===type&&collect.id===id)renderCollectList();
    if(state.view==='collections')renderSubnav();
  }catch(error){
    $('#collectMsg').textContent=t('collectionError',{error:apiErrorText(error)});
  }finally{
    collect.creating=false;
    $('#collectCreate').disabled=false;
  }
}
async function removeFromActiveCollection(type,id){
  const collection=activeCollection();
  if(!collection)return;
  try{
    await api('/api/account/collections/items',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type,id,collectionId:collection.id,action:'remove'})});
    state.accountItems=state.accountItems.filter(item=>Number(item.id)!==Number(id));
    toast(t('removedFromCollection',{name:collection.name}));
    render();
  }catch(error){toast(t('collectionError',{error:apiErrorText(error)}),'bad')}
}
function closeCollectDialog(){collect.request++;hideDialog($('#collectModal'))}
function initCollectEvents(){
  const openFrom=event=>{
    const button=event.target.closest('[data-collect-type]');
    if(!button)return false;
    event.stopPropagation();
    openCollectDialog(button.dataset.collectType,Number(button.dataset.collectId));
    return true;
  };
  $('#grid').addEventListener('click',event=>{
    if(openFrom(event))return;
    const remove=event.target.closest('[data-uncollect-type]');
    if(remove){event.stopPropagation();removeFromActiveCollection(remove.dataset.uncollectType,Number(remove.dataset.uncollectId))}
  },true);
  $('#modalContent').addEventListener('click',openFrom);
  $('#collectClose').onclick=closeCollectDialog;
  $('#collectModal').onclick=event=>{if(event.target.id==='collectModal')closeCollectDialog()};
  $('#collectList').addEventListener('click',event=>{const row=event.target.closest('[data-collect-toggle]');if(row&&!row.disabled)toggleCollectMembership(Number(row.dataset.collectToggle))});
  document.querySelectorAll('#collectModal .privacy-chip').forEach(chip=>chip.onclick=()=>setCollectPrivacy(chip.dataset.read));
  $('#collectCreate').onclick=createCollectionWithItem;
  $('#collectName').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.isComposing){event.preventDefault();createCollectionWithItem()}});
}
function lockInfo(){return state.status?.lock||{enabled:false,unlocked:true}}
function isLocked(){const lock=lockInfo();return !!lock.enabled&&!lock.unlocked}
function applyLockUi(){
  const lock=lockInfo();
  const locked=isLocked();
  document.body.classList.toggle('locked',locked);
  const button=$('#lockBtn');
  button.classList.toggle('hidden',!lock.enabled);
  button.classList.toggle('is-locked',locked);
  button.setAttribute('aria-pressed',locked?'true':'false');
  const label=t(locked?'unlockHint':'lockNowHint');
  button.title=label;button.setAttribute('aria-label',label);
  $('#tokenSection').classList.toggle('hidden',locked);
  $('#lockUnlockForm').classList.toggle('hidden',!locked);
  $('#lockManageForm').classList.toggle('hidden',locked);
  $('#lockCurrentWrap').classList.toggle('hidden',!lock.enabled);
  $('#lockNow').classList.toggle('hidden',!lock.enabled||locked);
  $('#lockRemove').classList.toggle('hidden',!lock.enabled||locked);
  $('#lockSave').textContent=t(lock.enabled?'lockChange':'lockSet');
  $('#lockDescription').textContent=t(locked?'lockDescriptionLocked':lock.enabled?'lockDescriptionOn':'lockDescriptionOff');
  if(locked){
    setAccountMenu(false);
    if(!$('#publishModal').classList.contains('hidden'))hideDialog($('#publishModal'));
    if(!$('#collectModal').classList.contains('hidden'))hideDialog($('#collectModal'));
    if(state.view!=='discover')setView('discover');
  }
  renderAccountPill();
}
function clearLockForms(){for(const id of ['lockPassword','lockCurrent','lockNew','lockRepeat'])$(`#${id}`).value=''}
async function afterLockChange(status){
  const wasLocked=isLocked();
  applyStatus(status);
  const locked=isLocked();
  clearLockForms();
  state.modelDetails.clear();
  state.modelDetailPromises.clear();
  if(!$('#modal').classList.contains('hidden'))closeModelModal();
  state.account=null;state.accountError=null;state.collections=null;state.activeCollectionId=null;
  state.mediaIndex.clear();state.postIndex.clear();
  resetAccountList();
  state.renderedScopeKey=null;
  if(locked){state.favoriteItems=[];state.favorites=new Set();$('#favCount').textContent='0'}
  else{
    try{const favorites=await api('/api/favorites');state.favoriteItems=Array.isArray(favorites.items)?favorites.items:[];state.favorites=new Set(state.favoriteItems.map(item=>Number(item.id)));$('#favCount').textContent=state.favorites.size}catch(error){dbg('warn','Favorites after unlock',error)}
  }
  applyLockUi();
  loadAccountProfile();
  if(wasLocked!==locked||state.view==='discover'){clearTimeout(state.retryTimer);state.items=[];state.meta=null;state.page=1;if(state.view!=='discover')setView('discover');else render();loadModels()}
}
let lockCheckPending=null;
function onLockedResponse(){
  if(lockCheckPending)return lockCheckPending;
  lockCheckPending=fetch('/api/status',{headers:{'x-ui-language':state.locale}}).then(response=>response.json()).then(status=>{if(status?.lock&&!(status.lock.enabled&&!status.lock.unlocked)===!isLocked())return;return afterLockChange(status)}).catch(()=>{}).finally(()=>{lockCheckPending=null});
  return lockCheckPending;
}
function lockRequest(path,body){return api(path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body||{})})}
async function unlockWithPassword(){
  const password=$('#lockPassword').value;
  if(!password){$('#lockMsg').textContent=t('lockEnterPassword');$('#lockPassword').focus();return}
  const button=$('#lockUnlock');if(button.disabled)return;button.disabled=true;
  $('#lockMsg').textContent='';
  try{
    const output=await lockRequest('/api/lock/unlock',{password});
    await afterLockChange(output.status);
    toast(t('unlocked'));
    $('#lockMsg').textContent='';
    hideDialog($('#settingsModal'));
  }catch(error){
    $('#lockMsg').textContent=error.status===429?t('lockThrottled',{seconds:Number(error.retryAfter)||30}):error.message;
    $('#lockPassword').select();
  }finally{button.disabled=false}
}
async function saveLockPassword(){
  const lock=lockInfo();
  const current=$('#lockCurrent').value,next=$('#lockNew').value,repeat=$('#lockRepeat').value;
  if(lock.enabled&&!current){$('#lockMsg').textContent=t('lockEnterCurrent');$('#lockCurrent').focus();return}
  if(next.length<4||next.length>200){$('#lockMsg').textContent=t('lockRules');$('#lockNew').focus();return}
  if(next!==repeat){$('#lockMsg').textContent=t('lockMismatch');$('#lockRepeat').focus();return}
  const button=$('#lockSave');if(button.disabled)return;button.disabled=true;
  try{
    const output=await lockRequest('/api/lock/password',{currentPassword:lock.enabled?current:undefined,newPassword:next});
    await afterLockChange(output.status);
    $('#lockMsg').textContent=t(lock.enabled?'lockChanged':'lockSetDone');
    toast(t(lock.enabled?'lockChanged':'lockSetDone'));
  }catch(error){$('#lockMsg').textContent=error.status===429?t('lockThrottled',{seconds:Number(error.retryAfter)||30}):error.message}
  finally{button.disabled=false}
}
async function removeLockPassword(){
  const current=$('#lockCurrent').value;
  if(!current){$('#lockMsg').textContent=t('lockEnterCurrent');$('#lockCurrent').focus();return}
  if(!confirm(t('lockRemoveConfirm')))return;
  const button=$('#lockRemove');if(button.disabled)return;button.disabled=true;
  try{
    const output=await lockRequest('/api/lock/remove',{currentPassword:current});
    await afterLockChange(output.status);
    $('#lockMsg').textContent=t('lockRemoved');
    toast(t('lockRemoved'));
  }catch(error){$('#lockMsg').textContent=error.status===429?t('lockThrottled',{seconds:Number(error.retryAfter)||30}):error.message}
  finally{button.disabled=false}
}
async function lockNow(){
  try{
    const output=await lockRequest('/api/lock/lock',{});
    await afterLockChange(output.status);
    hideDialog($('#settingsModal'));
    toast(t('lockedNow'));
  }catch(error){toast(error.message,'bad')}
}
function openSettingsDialog(){
  $('#settingsMsg').textContent='';
  $('#lockMsg').textContent='';
  clearLockForms();
  applyLockUi();
  showDialog($('#settingsModal'),isLocked()?'#lockPassword':'#apiToken');
}
function initLockEvents(){
  $('#lockBtn').onclick=()=>{if(isLocked())openSettingsDialog();else lockNow()};
  $('#lockUnlock').onclick=unlockWithPassword;
  $('#lockPassword').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.isComposing){event.preventDefault();unlockWithPassword()}});
  $('#lockSave').onclick=saveLockPassword;
  $('#lockRepeat').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.isComposing){event.preventDefault();saveLockPassword()}});
  $('#lockRemove').onclick=removeLockPassword;
  $('#lockNow').onclick=lockNow;
}
