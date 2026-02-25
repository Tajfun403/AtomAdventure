export interface Item {
    ID: number;
    PrettyName: string;
    Image: string;
    Description: string;
    Value: number;
}

/** Fetch all items. */
export async function getItems(): Promise<Item[]> {
    const res = await fetch('/items', { method: 'GET' });
    if (!res.ok) throw new Error('Failed to fetch items');
    return res.json() as Promise<Item[]>;
}

/** Fetch a single random item. */
export async function getRandomItem(): Promise<Item> {
    const res = await fetch('/items/random', { method: 'GET' });
    if (!res.ok) throw new Error('Failed to fetch random item');
    return res.json() as Promise<Item>;
}
