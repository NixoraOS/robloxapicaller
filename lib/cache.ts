let cache: any[] = [];
let lastUpdated = 0;

const ONE_HOUR = 60 * 60 * 1000;

export function getCache() {
  return {
    data: cache,
    lastUpdated,
    isStale: Date.now() - lastUpdated > ONE_HOUR,
  };
}

export function setCache(data: any[]) {
  cache = data;
  lastUpdated = Date.now();
}