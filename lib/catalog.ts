export async function fetchRobloxCatalog() {
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
    throw new Error("Catalog fetch failed");
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