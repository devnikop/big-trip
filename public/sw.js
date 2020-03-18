const CACHE_NAME = `BIG_TRIP`;

function cacheFiles(cache) {
  return cache.addAll([
    `./`,
    `./index.html`,
    `./bundle.js`,
    `./css/normalize.css`,
    `./css/main.css`,
    `./img/star.svg`,
    `./img/star--check.svg`,
  ]);
}

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cacheFiles)
      .catch((err) => {
        console.error(err);
        throw err;
      })
    );
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
    caches.match(evt.request)
      .then((response) => {
        return response ? response : fetch(evt.request);
      })
      .catch((err) => {
        console.error(err);
        throw err;
      })
  );
});
