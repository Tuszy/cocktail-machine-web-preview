'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "1c9625c4f119adc0a8594de3bb464a4b",
"index.html": "9de9a47e26bcc7e59005c8a75e5a118d",
"/": "9de9a47e26bcc7e59005c8a75e5a118d",
"main.dart.js": "1acf8766f205b0f22195c9a078c0ca9a",
"sqlite3.wasm": "79a4cf7ac1cf1f9d5081474f5a7bb5ba",
"flutter.js": "6fef97aeca90b426343ba6c5c9dc5d4a",
"favicon.png": "c8f70ba58328d7cf2055682c4be3254f",
"sqflite_sw.js": "238ab83a2e66a6945b7c1970b4908c0a",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "41eb9835fdc5d5998f0cad8e4598c327",
"assets/AssetManifest.json": "b6e172d0a58d34ebc0ca5492e49f2156",
"assets/NOTICES": "b135580c8750809211bd4789efb1a77c",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"assets/AssetManifest.bin": "7f32e0465491485ad1b4c180916f0aaa",
"assets/fonts/MaterialIcons-Regular.otf": "02c803eb697424e1ce5f8b72651a15e4",
"assets/assets/preparing-anim.json": "38d474a65da899a800f3c643115b199c",
"assets/assets/speech_bubble.png": "86859f091a9cdf42081a246ac8361478",
"assets/assets/cocktail/images/custom.png": "b633815c8b9be47ca09ddf40701d4d7d",
"assets/assets/cocktail/images/8.png": "2015b886806204a04e4acec92467a645",
"assets/assets/cocktail/images/9.png": "d8b17431499ec363d90576ff4a5ed799",
"assets/assets/cocktail/images/14.png": "676120da9762acf4874bb4c20db9b20f",
"assets/assets/cocktail/images/15.png": "fccc0477ab19f2cd0751b41359f3bde3",
"assets/assets/cocktail/images/17.png": "d08b2112d20d96b3c11ed1ca5050f70b",
"assets/assets/cocktail/images/custom.svg": "e80e0df5398fa4d963f4182662fe7381",
"assets/assets/cocktail/images/16.png": "dcb1d57f140ae1ff425c02dc48ac2c49",
"assets/assets/cocktail/images/12.png": "ffa71349ad6fc82c6099e9f8c76ab8d7",
"assets/assets/cocktail/images/13.png": "0a47bdb101170b82afee7496e7e02830",
"assets/assets/cocktail/images/11.png": "0c4ac0a09d379fdcde4657101c35a081",
"assets/assets/cocktail/images/10.png": "3855c78b7a531b1439b7f56693309949",
"assets/assets/cocktail/images/4.png": "8425292572272bf98b3e9e1caaab1f9d",
"assets/assets/cocktail/images/5.png": "13ec347a6121c3275758c874b16fd9c9",
"assets/assets/cocktail/images/7.png": "1abf2bd2ac4511c721d98f1f3cfab5c3",
"assets/assets/cocktail/images/6.png": "e5dfe97b2b79a7ab28357759c8926857",
"assets/assets/cocktail/images/2.png": "b344f0f08eadbaf5461f9e98d9b5a00a",
"assets/assets/cocktail/images/3.png": "3db7645a50fb7850408e44dc1d30dc4c",
"assets/assets/cocktail/images/1.png": "035f9820671e3de25ae5d35dcde41340",
"assets/assets/filling-anim.json": "3f9ae869f4c054088d30fe17615c1253",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/skwasm.wasm": "1a074e8452fe5e0d02b112e22cdcf455",
"canvaskit/chromium/canvaskit.js": "96ae916cd2d1b7320fff853ee22aebb0",
"canvaskit/chromium/canvaskit.wasm": "be0e3b33510f5b7b0cc76cc4d3e50048",
"canvaskit/canvaskit.js": "bbf39143dfd758d8d847453b120c8ebb",
"canvaskit/canvaskit.wasm": "42df12e09ecc0d5a4a34a69d7ee44314",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
