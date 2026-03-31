const cacheName = 'win100-v1';
// ضيف هنا كل الملفات المهمة عشان اللعبة تفتح Offline بسرعة
const assets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/ic.png',
  '/icon.png',
  // ضيف ملفات الـ CSS والـ JS بتاعتك هنا لو منفصلة
];

// 1. التثبيت (Install)
self.addEventListener('install', e => {
  // إجبار السيرفس وركر الجديد إنه يشتغل فوراً بدل ما يستنى القديم يقفل
  self.skipWaiting();
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Caching assets...');
      return cache.addAll(assets);
    })
  );
});

// 2. التفعيل (Activate) - لمسح الكاش القديم لو غيرت رقم النسخة (v1 -> v2)
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

// 3. جلب البيانات (Fetch)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      // لو الملف موجود في الكاش هاته، لو مش موجود اطلبه من النت
      return res || fetch(e.request);
    })
  );
});
