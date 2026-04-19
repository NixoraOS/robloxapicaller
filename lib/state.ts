import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

let memory: any[] = [];

export function getState() {
  return memory;
}

export function setState(items: any[]) {
  memory = items;
}

export async function hydrateState() {
  const { data, error } = await supabase
    .from("catalog_items")
    .select("*");

  if (error) throw error;

  memory = (data ?? []).map((row: any) => ({
    id: row.id,
    data: row.data,
    updatedAt: row.updated_at,
  }));
}

export async function saveState(items: any[]) {
  const payload = items.map((item) => ({
    id: item.id,
    data: item.data,
    updated_at: item.updatedAt,
  }));

  const { error } = await supabase
    .from("catalog_items")
    .upsert(payload);

  if (error) throw error;
}