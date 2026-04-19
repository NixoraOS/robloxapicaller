import { refreshCache } from "@/lib/catalog";

let lastRefresh = 0;
const COOLDOWN = 30000;

export default async function handler(req: any, res: any) {
  try {
    const now = Date.now();

    if (now - lastRefresh < COOLDOWN) {
      return res.status(429).json({
        ok: false,
        error: "Too many requests",
      });
    }

    lastRefresh = now;

    await refreshCache();

    return res.status(200).json({
      ok: true,
      message: "Catalog refreshed",
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err?.message || "Refresh failed",
    });
  }
}