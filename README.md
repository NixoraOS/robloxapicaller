# changes/updates may be slow
i dont work on this project much because i realised that eventually http requests will be too high, but i will still update sometimes, and maybe work on it more if i can get a workaround/fix for http request problems

# API link for /catalog (vercel)
(/catalog is supposed to be used for automatic fetches. it is recommended to use it on 6 hour cycles)
https://robloxapicaller.vercel.app/catalog
(this link currently returns 404, i believe this is an issue on vercels side, not mine)

# API link for /refresh
(refresh is a manual refresh, but you can also set it to run automatically. for automatic use, 24 hour cycles is recommended)
https://robloxapicaller.vercel.app/refresh

# /refresh not working
the /refresh api currently gets HTTP 429 (rate limit). this is likely due to it attempting to fetch up to 10 pages of data at once. i will try to fix this soon
