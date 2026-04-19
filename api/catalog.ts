import { getCachedItems } from "@/lib/catalog";

export default function handler(req: any, res: any) {
  try {
    res.status(200).json(getCachedItems());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}