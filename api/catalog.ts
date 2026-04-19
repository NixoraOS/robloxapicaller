import { fetchRobloxCatalog } from "../lib/catalog.js";
import { getState, hydrateState } from "../lib/state.js";
import { merge } from "../lib/passer.js";

let ready = false;

export default async function handler(req: any, res: any) {
  try {
    if (!ready) {
      await hydrateState();
      ready = true;
    }

    const result = await fetchRobloxCatalog();
    const fresh = result.items;
    await fetchRobloxCatalog({ pages: 5 });

    const stored = getState() ?? [];

    const merged = merge(fresh, stored);

    return res.status(200).json({
      ok: true,
      count: merged.length,
      data: merged,
      nextCursor: result.nextCursor,
    });

  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err.message,
      data: [],
    });
  }
}