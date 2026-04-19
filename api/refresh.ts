import { fetchRobloxCatalog } from "@/lib/catalog";

export default async function handler(req: any, res: any) {
  try {
    const data = await fetchRobloxCatalog();

    return res.status(200).json({
      ok: true,
      emergency: true,
      count: data.length,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
}