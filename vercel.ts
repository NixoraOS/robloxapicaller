const CATEGORIES = [3, 4, 8, 11, 13, 16, 17, 18, 19, 21, 24, 25, 26, 27, 34];

let cachedItems: any[] = [];

async function fetchCatalog(): Promise<any[]> {
  const items: any[] = [];
  const baseUrl =
    "https://catalog.roblox.com/v2/search/items/details";

  for (const category of CATEGORIES) {
    let cursor: string | undefined;

    while (items.length < 10000) {
      const params = new URLSearchParams({
        category: category.toString(),
        limit: "120",
        ...(cursor ? { cursor } : {}),
      });

      const res = await fetch(`${baseUrl}?${params}`);

      if (!res.ok) break;

      const data = await res.json();
      const newItems = data.data || [];

      if (newItems.length === 0) break;

      items.push(...newItems);

      cursor = data.nextPageCursor;
      if (!cursor) break;
    }
  }

  return items;
}

export default async function handler(req: any, res: any) {
  try {
    // Optional: trigger refresh manually via /api/catalog?refresh=1
    const refresh = req.query?.refresh === "1";

    if (refresh || cachedItems.length === 0) {
      cachedItems = await fetchCatalog();
      console.log(`✅ Updated catalog: ${cachedItems.length} items`);
    }

    res.status(200).json(cachedItems);
  } catch (err: any) {
    console.error("❌ Failed:", err);
    res.status(500).json({ error: err.message });
  }
}