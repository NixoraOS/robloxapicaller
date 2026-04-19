import { getCache, setCache } from "@/pages/lib/cache";
import { fetchRobloxCatalog } from "@/pages/lib/catalog";

let refreshing = false;

export default async function handler(req: any, res: any) {
  try {
    const cache = getCache();

    // auto-refresh ONLY for catalog endpoint
    if (cache.isStale && !refreshing) {
      refreshing = true;

      fetchRobloxCatalog()
        .then((data) => {
          setCache(data);
        })
        .catch((err) => console.error(err))
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