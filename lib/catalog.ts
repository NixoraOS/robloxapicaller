export async function fetchRobloxCatalog({
  limit = 120,
  cursor = "",
  category = "",
}: {
  limit?: number;
  cursor?: string;
  category?: string;
} = {}) {

  const url = new URL("https://catalog.roblox.com/v2/search/items/details");

  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sortType", "Relevance");

  url.searchParams.set("includeNotForSale", "true");

  if (category) {
    url.searchParams.set("category", category);
  }

  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }

  const res = await fetch(url.toString(), {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Catalog fetch failed: ${res.status}`);
  }

  const data = await res.json();

  return {
    items: data?.data ?? [],
    nextCursor: data?.nextPageCursor ?? data?.nextCursor ?? null,
  };
}