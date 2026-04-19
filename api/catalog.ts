import { getCache, refreshCache } from "@/lib/catalog";

export default async function handler(req: any, res: any) {
  try {
    const cache = getCache();

    // lazy refresh
    if (cache.isStale || cache.data.length === 0) {
      refreshCache().catch((err) =>
        console.error("Background refresh failed:", err)
      );
    }

    return res.status(200).json({
      ok: true,
      lastUpdated: cache.lastUpdated,
      stale: cache.isStale,
      count: cache.data.length,
      data: cache.data,
    });
  } catch (err: any) {
    console.error("API CRASH:", err);

    return res.status(500).json({
      ok: false,
      error: err?.message || "Unknown error",
    });
  }
}