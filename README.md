# changes/updates may be slow
i kind of gave up on this project, due to request limits, but i will still update, and maybe start to work on it more again if i can find a workaround for request limits

# API link for /catalog (vercel)
https://robloxapicaller.vercel.app/catalog
(this link currently returns 404, i believe this is an issue on vercels side, not mine)

# API link for /refresh (refresh is a manual refresh, but you can also set it to run automatically. for automatic use, 24 hour cycles is recommended)
https://robloxapicaller.vercel.app/refresh

# /refresh not working
the /refresh api currently gets HTTP 429 (rate limit). this is likely due to it attempting to fetch up to 10 pages of data at once. i will try to fix this soon
