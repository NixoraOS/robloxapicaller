export async function fetchRobloxCatalog() {
  const CATEGORIES = [
    3, 4, 8, 11, 13, 16, 17, 18, 19, 21,
    24, 25, 26, 27, 34
  ];

  const items: any[] = [];
  const base = "https://catalog.roblox.com/v2/search/items/details";

  for (const category of CATEGORIES) {
    let cursor: string | undefined;
    let safety = 0;
    let categoryCount = 0;

    while (safety < 6) {
      safety++;

      const url = new URL(base);
      url.searchParams.set("category", category.toString());
      url.searchParams.set("limit", "120");
      if (cursor) url.searchParams.set("cursor", cursor);

      const res = await fetch(url.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
      });

      if (!res.ok) break;

      let data;
      try {
        data = await res.json();
      } catch {
        break;
      }

      const newItems = data?.data;
      if (!Array.isArray(newItems)) break;

      items.push(...newItems);
      categoryCount += newItems.length;

      cursor = data.nextPageCursor;
      if (!cursor) break;

      // ✅ per-category limit
      if (categoryCount > 1000) break;
    }
  }

  return items;
}