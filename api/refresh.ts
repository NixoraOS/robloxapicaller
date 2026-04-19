import { getState, setState, saveState } from "../lib/state";

let running = false;

const KEYWORDS = [
  "shirt",
  "pants",
  "hat",
  "hair",
  "face",
  "bundle",
  "accessory",
  "shoes",
];

async function fetchPage({
  keyword,
  cursor = "",
  limit = 120,
}: {
  keyword: string;
  cursor?: string;
  limit?: number;
}) {
  const url = new URL("https://catalog.roblox.com/v2/search/items/details");

  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sortType", "Relevance");
  url.searchParams.set("keyword", keyword);
  url.searchParams.set("includeNotForSale", "true");

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
    throw new Error(`Refresh fetch failed: ${res.status}`);
  }

  const data = await res.json();

  return {
    items: data?.data ?? [],
    nextCursor: data?.nextPageCursor ?? null,
  };
}

function merge(oldItems: any[], newItems: any[]) {
  const map = new Map<string, any>();

  for (const item of oldItems) {
    if (item?.id) map.set(item.id, item);
  }

  for (const item of newItems) {
    if (!item?.id) continue;

    const existing = map.get(item.id);

    map.set(item.id, {
      ...(existing ?? {}),
      ...item,
      updatedAt: Date.now(),
    });
  }

  return Array.from(map.values());
}

export default async function handler(req: any, res: any) {
  try {
    if (running) {
      return res.status(429).json({
        ok: false,
        error: "Refresh already running",
      });
    }

    running = true;

    const collected: any[] = [];

    for (let k = 0; k < KEYWORDS.length; k++) {
      let cursor: string | null = null;

      for (let page = 0; page < 10; page++) { 
        const result = await fetchPage({
          keyword: KEYWORDS[k],
          cursor: cursor ?? "",
        });

        collected.push(...result.items);

        cursor = result.nextCursor;

        if (!cursor) break;
      }
    }

    const old = getState();

    const merged = merge(old, collected);

    setState(merged);

    await saveState(merged);

    return res.status(200).json({
      ok: true,
      source: "refresh",
      count: merged.length,
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  } finally {
    running = false;
  }
}