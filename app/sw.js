const CACHE='hausmeister-live-1.3.5';
const ASSETS=['./rd-homemaster-logo.svg','./','./index.html','./manifest.json','./app-icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});return response;}).catch(()=>caches.match(event.request).then(cached=>cached||caches.match('./index.html'))));});

self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?event.data.json():{}}catch{data={body:event.data?.text()||'Neuer Einsatz'}}
  const title=data.title||'Hausmeister';
  const options={
    body:data.body||'Du hast eine neue Mitteilung.',
    icon:data.icon||'./app-icon.svg',
    badge:data.badge||'./app-icon.svg',
    tag:data.tag||'hausmeister',
    renotify:true,
    data:data.data||{url:'./'},
    actions:[
      {action:'open',title:'Auftrag öffnen'},
      {action:'route',title:'Navigation'}
    ]
  };
  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const d=event.notification.data||{};
  if(event.action==='route'&&d.address){
    const maps='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(d.address);
    event.waitUntil(clients.openWindow(maps));
    return;
  }
  const target=d.url||'./';
  event.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
      for(const client of list){
        if('focus' in client){
          if('navigate' in client)client.navigate(target).catch(()=>{});
          return client.focus();
        }
      }
      return clients.openWindow(target);
    })
  );
});
