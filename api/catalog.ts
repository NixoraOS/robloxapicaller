import { getCache, setCache } from "../lib/cache";
import { fetchRolimonsCatalog } from "../lib/catalog";

let refreshing = false;

export default async function handler(req: any, res: any) {
  try {
    const cache = getCache();

    // auto-refresh if stale
    if (cache.isStale && !refreshing) {
      refreshing = true;

      fetchRolimonsCatalog()
        .then((data) => setCache(data))
        .catch((err) => console.error("refresh error:", err))
        .finally(() => {
          refreshing = false;
        });
    }

    return res.status(200).json({
      ok: true,
      cached: true,
      lastUpdated: cache.lastUpdated,
      count: cache.data.length,
      data: cache.data,
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err.message,
      data: [],
    });
  }
}