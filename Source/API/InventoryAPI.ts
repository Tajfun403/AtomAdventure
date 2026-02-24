export interface InventoryItem {
    ID: number;
    PlayerGUID: string;
    ItemID: number;
    Item?: {
        ID: number;
        PrettyName: string;
        Image: string;
        Description: string;
        Value: number;
    };
}

/** Fetch all inventory entries for the current player (identified by cookie). */
export async function GetInventory(): Promise<InventoryItem[]> {
    const res = await fetch("/inventory", {
        method: "GET",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error);
    }
    return res.json() as Promise<InventoryItem[]>;
}

/** Add an item to the current player's inventory. */
export async function AddInventoryEntry(itemID: number): Promise<InventoryItem> {
    const res = await fetch("/inventory", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ItemID: itemID }),
    });
    if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error);
    }
    return res.json() as Promise<InventoryItem>;
}

/** Delete an inventory entry by its instance ID. */
export async function DeleteInventoryEntry(id: number): Promise<void> {
    const res = await fetch(`/inventory/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error);
    }
}
