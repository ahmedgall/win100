// 1. استيراد مكتبات فايربيز
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// 2. إعدادات فايربيز (حط بياناتك هنا)
firebase.initializeApp({
    apiKey: "YOUR_API_KEY",
    projectId: "YOUR_PROJECT_ID",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// 3. كود الكاش القديم (عشان اللعبة تفتح Offline)
const cacheName = 'win100-v1';
const assets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/ic.png',
  '/icon.png'
];

// تثبيت السيرفس وركر وحفظ الملفات في الكاش
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// تفعيل السيرفس وركر ومسح الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== cacheName) return caches.delete(key);
        })
      );
    })
  );
});

// جلب الملفات (Offline Mode)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});

// 4. التعامل مع الإشعارات في الخلفية (اللي إنت بعته)
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo.png', 
        data: { url: payload.data.url || '/' } 
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// فتح الرابط لما المستخدم يدوس على الإشعار
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
