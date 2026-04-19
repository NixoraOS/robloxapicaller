import { getState, setState, saveState } from "../lib/state.js";

let running = false;

const LIMIT = 50; 
const MAX_TOTAL = 5000;

async function fetchRefreshData() {
  let cursor = "";
  let total: any[] = [];

  while (true) {
    const url = new URL("https://catalog.roblox.com/v2/search/items/details");

    url.searchParams.set("limit", String(LIMIT));
    url.searchParams.set("sortType", "Relevance");

    if (cursor) url.searchParams.set("cursor", cursor);

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

    const batch = Array.isArray(data?.data)
      ? data.data
      : Object.entries(data?.items ?? {}).map(([id, value]: any) => ({
          id,
          data: value,
          updatedAt: Date.now(),
        }));

    total.push(...batch);

    cursor = data?.nextPageCursor ?? data?.nextCursor;

    if (!cursor) break;
    if (total.length >= MAX_TOTAL) break;
  }

  return total;
}

function refreshMerge(oldItems: any[], newItems: any[]) {
  const map = new Map<string, any>();

  for (const item of oldItems ?? []) {
    if (item?.id) map.set(item.id, item);
  }

  for (const item of newItems ?? []) {
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

    const fresh = await fetchRefreshData();
    const old = getState() ?? [];

    const merged = refreshMerge(old, fresh);

    setState(merged);
    await saveState(merged);

    return res.status(200).json({
      ok: true,
      source: "refresh",
      count: merged.length,
      fetched: fresh.length,
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