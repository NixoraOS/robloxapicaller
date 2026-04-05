/// <reference lib="deno.unstable" />

const CATEGORIES = [3, 4, 8, 11, 13, 16, 17, 18, 19, 21, 24, 25, 26, 27, 34];
let cachedItems: any[] = [];

async function fetchCatalog(): Promise<any[]> {
  const items: any[] = [];
  const baseUrl = "https://catalog.roblox.com/v2/search/items/details";

  for (const category of CATEGORIES) {
    let cursor: string | undefined;

    while (items.length < 10000) {
      const params = new URLSearchParams({
        category: category.toString(),
        limit: "120",
        ...(cursor && { cursor }),
      });

      const url = `${baseUrl}?${params}`;
      const res = await fetch(url);

      if (res.status !== 200) break;

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

Deno.cron("fetch-catalog-hourly", "0 * * * *", async () => {
  try {
    cachedItems = await fetchCatalog();
    console.log(`✅ Catalog updated with ${cachedItems.length} items`);
  } catch (err) {
    console.error("❌ Failed to update catalog:", err.message);
  }
});

Deno.serve(() => {
  return new Response(JSON.stringify(cachedItems), {
    headers: { "Content-Type": "application/json" },
  });
});   