type CacheEntry = { data: any; ts: number };

const cache = new Map<string, CacheEntry>();
const listeners: Set<() => void> = new Set();

export function getCached(key: string) {
  return cache.get(key);
}

export function setCached(key: string, data: any) {
  cache.set(key, { data, ts: Date.now() });
}

export function invalidateKey(key?: string) {
  if (!key) {
    cache.clear();
  } else {
    // remove exact key and keys that start with key (namespace)
    for (const k of Array.from(cache.keys())) {
      if (k === key || k.startsWith(key)) cache.delete(k);
    }
  }
  listeners.forEach((l) => l());
}

export function onInvalidate(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function clearCache() {
  cache.clear();
  listeners.forEach((l) => l());
}

export default { getCached, setCached, invalidateKey, onInvalidate, clearCache };
