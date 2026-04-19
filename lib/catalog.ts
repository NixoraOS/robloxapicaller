const CATEGORIES = [3, 4, 8, 11, 13, 16, 17, 18, 19, 21, 24, 25, 26, 27, 34];

let cachedItems: any[] = [];
let lastUpdated = 0;

const ONE_HOUR = 60 * 60 * 1000;

export function getCache() {
  return {
    data: cachedItems,
    lastUpdated,
    isStale: Date.now() - lastUpdated > ONE_HOUR,
  };
}

export async function fetchCatalog(): Promise<any[]> {
  const items: any[] = [];
  const baseUrl =
    "https://catalog.roblox.com/v2/search/items/details";

  for (const category of CATEGORIES) {
    let cursor: string | undefined;
    let safety = 0;

    while (safety < 20) {
      safety++;

      try {
        const url = new URL(baseUrl);
        url.searchParams.set("category", category.toString());
        url.searchParams.set("limit", "120");
        if (cursor) url.searchParams.set("cursor", cursor);

        const res = await fetch(url.toString(), {
          headers: {
            "User-Agent": "Mozilla/5.0",
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          console.warn("Roblox API error:", res.status);
          break;
        }

        let data;
        try {
          data = await res.json();
        } catch {
          console.warn("Invalid JSON from Roblox API");
          break;
        }

        const newItems = data?.data;
        if (!Array.isArray(newItems) || newItems.length === 0) break;

        items.push(...newItems);

        cursor = data.nextPageCursor;
        if (!cursor) break;

        if (items.length >= 10000) break;
      } catch (err) {
        console.error("Fetch error:", err);
        break;
      }
    }
  }

  return items;
}

export async function refreshCache() {
  try {
    console.log("Refreshing catalog...");

    const items = await fetchCatalog();

    if (!Array.isArray(items)) return;

    cachedItems = items;
    lastUpdated = Date.now();

    console.log(`Cached ${items.length} items`);
  } catch (err) {
    console.error("refreshCache failed:", err);
  }
}