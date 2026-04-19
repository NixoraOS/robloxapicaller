import { fetchRobloxCatalog } from "../lib/catalog";

export const config = {
  runtime: "edge",
};

let cache: any[] = [];
let lastUpdated = 0;

const ONE_HOUR = 60 * 60 * 1000;

export default async function handler() {
  try {
    if (!cache.length || Date.now() - lastUpdated > ONE_HOUR) {
      cache = await fetchRobloxCatalog();
      lastUpdated = Date.now();
    }

    return new Response(JSON.stringify({
      ok: true,
      cached: true,
      count: cache.length,
      data: cache
    }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500 }
    );
  }
}