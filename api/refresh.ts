import { setCache } from "../lib/cache";

export default async function handler(req: any, res: any) {
  try {
    // Direct Rolimons fetch (no dependency on /lib/catalog logic)
    const response = await fetch(
      "https://api.rolimons.com/items/v1/itemdetails"
    );

    if (!response.ok) {
      return res.status(500).json({
        ok: false,
        error: `Rolimons API failed: ${response.status}`,
      });
    }

    const data = await response.json();

    // Normalize inline (NO /lib/catalog usage)
    const items = Object.entries(data?.items ?? data ?? {}).map(
      ([id, value]: any) => ({
        id,
        ...value,
      })
    );

    // Only responsibility: update cache
    setCache(items);

    return res.status(200).json({
      ok: true,
      emergency: true,
      refreshed: true,
      count: items.length,
      data: items,
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
}