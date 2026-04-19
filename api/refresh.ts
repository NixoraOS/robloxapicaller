export const config = {
  runtime: "edge"
};

export default async function handler() {
  try {
    const CATEGORIES = [
      3, 4, 8, 11, 13, 16, 17, 18, 19, 21,
      24, 25, 26, 27, 34
    ];

    const items: any[] = [];
    const base = "https://catalog.roblox.com/v2/search/items/details";

    for (const category of CATEGORIES) {
      let cursor: string | undefined;
      let safety = 0;
      let categoryCount = 0;

      while (safety < 6) {
        safety++;

        const url = new URL(base);

        url.searchParams.set("category", category.toString());
        url.searchParams.set("limit", "120");

        url.searchParams.set("sortType", "Relevance");
        url.searchParams.set("keyword", "a");

        if (cursor) {
          url.searchParams.set("cursor", cursor);
        }

        const res = await fetch(url.toString(), {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",

            "Accept": "application/json, text/plain, */*",
            "Referer": "https://www.roblox.com/",
            "Origin": "https://www.roblox.com"
          }
        });

        if (!res.ok) {
          break;
        }

        const data = await res.json();

        const newItems =
          data?.data ??
          data?.items ??
          data?.results ??
          [];

        if (!Array.isArray(newItems) || newItems.length === 0) {
          break;
        }

        items.push(...newItems);
        categoryCount += newItems.length;

        cursor = data?.nextPageCursor ?? data?.nextCursor;

        if (!cursor) {
          break;
        }

        if (categoryCount > 1000) {
          break;
        }
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        emergency: true,
        count: items.length,
        data: items
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: err.message
      }),
      { status: 500 }
    );
  }
}