import { fetchCatalog, setCachedItems } from "@/lib/catalog";

export default async function handler(req: any, res: any) {
  try {
    const items = await fetchCatalog();
    setCachedItems(items);

    console.log(`✅ Updated catalog: ${items.length} items`);

    res.status(200).json({
      ok: true,
      count: items.length,
    });
  } catch (err: any) {
    console.error("❌ Cron failed:", err);

    res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
}