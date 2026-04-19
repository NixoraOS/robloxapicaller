const CATEGORIES = [3, 4, 8, 11, 13, 16, 17, 18, 19, 21, 24, 25, 26, 27, 34];

let cachedItems: any[] = [];

export function getCachedItems() {
  return cachedItems;
}

export function setCachedItems(items: any[]) {
  cachedItems = items;
}

export async function fetchCatalog(): Promise<any[]> {
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