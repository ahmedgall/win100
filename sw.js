// 1. استيراد مكتبات Firebase الأساسية
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// 2. إعدادات Firebase (البيانات اللي في الصورة عندك)
firebase.initializeApp({
    apiKey: "AIzaSyAzcP_T8x5ouwwKkhadtBTdsUxk3XqwJec",
    authDomain: "vexa-4b2fb.firebaseapp.com",
    projectId: "vexa-4b2fb",
    storageBucket: "vexa-4b2fb.firebasestorage.app",
    messagingSenderId: "977620445308",
    appId: "1:977620445308:web:71e66418d95c43dc8881f9"
});

const messaging = firebase.messaging();

// -------------------------------------------------------------
// 3. جزء الكاش (Caching) لفتح اللعبة Offline بسرعة
// -------------------------------------------------------------
const cacheName = 'win100-v1';
const assets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/ic.png',
  '/icon.png',
  // ضيف أي ملفات CSS أو JS تانية بتستخدمها هنا
];

// التثبيت (Install) وحفظ الملفات في الكاش
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Caching assets for Win100...');
      return cache.addAll(assets);
    })
  );
});

// التفعيل (Activate) لمسح الكاش القديم
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== cacheName) {
            console.log('Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// جلب البيانات (Fetch) لدعم وضع الأوفلاين
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});

// -------------------------------------------------------------
// 4. جزء الإشعارات (Firebase Cloud Messaging)
// -------------------------------------------------------------

// استقبال الإشعارات في الخلفية (والتطبيق مقفول)
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png', // تأكد إن المسار صح للوجو بتاعك
        badge: '/ic.png',
        data: { url: payload.data.url || '/' } 
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// التعامل مع الضغط على الإشعار وفتح الرابط المطلوب
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // قفل الإشعار بعد الضغط
    event.waitUntil(
        clients.openWindow(event.notification.data.url) // فتح صفحة الألعاب أو الرابط المبعوث
    );
});
