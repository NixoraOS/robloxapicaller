import { getState, setState, saveState } from "../lib/state.ts";

let running = false;

// INDEPENDENT FETCH (NOT lib/catalog)
async function fetchRefreshData() {
  const res = await fetch(
    "https://api.rolimons.com/items/v1/itemdetails",
    {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Refresh fetch failed");
  }

  const data = await res.json();

  return Object.entries(data?.items ?? {}).map(
    ([id, value]: any) => ({
      id,
      data: value,
      updatedAt: Date.now(),
    })
  );
}

// INDEPENDENT MERGE LAYER (refresh-only logic)
function refreshMerge(oldItems: any[], newItems: any[]) {
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
      updatedAt: item.updatedAt ?? Date.now(),
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

    // STEP 1: independent fetch
    const fresh = await fetchRefreshData();

    // STEP 2: old state ONLY
    const old = getState();

    // STEP 3: refresh-specific merge logic
    const merged = refreshMerge(old, fresh);

    // STEP 4: update runtime memory
    setState(merged);

    // STEP 5: persist
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