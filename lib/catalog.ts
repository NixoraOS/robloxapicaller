export async function fetchRolimonsCatalog() {
  const url = "https://api.rolimons.com/items/v1/itemdetails";

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Rolimons API failed: ${res.status}`);
  }

  const data = await res.json();

  // Rolimons usually returns an object keyed by itemId
  // We normalize it into an array
  const items = Object.entries(data?.items ?? data ?? {}).map(
    ([id, value]: any) => ({
      id,
      ...value,
    })
  );

  return items;
}