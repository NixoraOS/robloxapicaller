import { fetchRobloxCatalog } from "../lib/catalog";
import { getState, hydrateState } from "../lib/state";
import { merge } from "../lib/passer";
let ready = false;
export default async function handler(req, res) {
    try {
        if (!ready) {
            await hydrateState();
            ready = true;
        }
        const fresh = await fetchRobloxCatalog();
        const stored = getState();
        const merged = merge(fresh, stored);
        return res.status(200).json({
            ok: true,
            count: merged.length,
            data: merged,
        });
    }
    catch (err) {
        return res.status(500).json({
            ok: false,
            error: err.message,
            data: [],
        });
    }
}
