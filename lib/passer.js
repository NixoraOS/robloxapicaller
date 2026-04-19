export function merge(fresh, stored) {
    const map = new Map();
    for (const item of stored) {
        map.set(item.id, item);
    }
    for (const item of fresh) {
        const existing = map.get(item.id);
        map.set(item.id, {
            ...(existing ?? {}),
            ...item,
            updatedAt: item.updatedAt ?? Date.now(),
        });
    }
    return Array.from(map.values());
}
