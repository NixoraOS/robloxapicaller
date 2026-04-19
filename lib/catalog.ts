const DEFAULT_KEYWORDS = [
  "shirt",
  "pants",
  "hat",
  "hair",
  "face",
  "bundle",
  "accessory",
  "shoes",
];

export async function fetchRobloxCatalog(params?: {
  limit?: number;
  cursor?: string;
  keywordIndex?: number;
  category?: string;
}) {
  const {
    limit = 120,
    cursor = "",
    keywordIndex = 0,
    category = "",
  } = params || {};

  const keyword = DEFAULT_KEYWORDS[keywordIndex % DEFAULT_KEYWORDS.length];

  const url = new URL("https://catalog.roblox.com/v2/search/items/details");

  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sortType", "Relevance");

  url.searchParams.set("keyword", keyword);

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
    nextCursor: data?.nextPageCursor ?? null,
  };
}