import { serve } from "https://deno.land/std@0.170.0/http/server.ts";

const CATEGORIES = [3, 4, 8, 11, 13, 16, 17, 18, 19, 21, 24, 25, 26, 27, 34];

async function fetchCatalog() {
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

serve(async (req) => {
  const url = new URL(req.url);
  
  if (url.pathname === "/catalog") {
    try {
      const items = await fetchCatalog();
      return new Response(JSON.stringify(items), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }
  
  return new Response("Roblox Catalog API");
});  