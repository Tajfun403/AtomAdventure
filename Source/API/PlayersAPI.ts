/**
 * Create a new player and receive the playerGUID cookie
 * @param name - The display name for the player
 * @returns Promise that resolves if player creation succeeds
 */
export async function createPlayer(name: string): Promise<void> {
    const response = await fetch('/players', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Name: name }),
    });

    if (!response.ok) {
        throw new Error('Failed to create player');
    }
}

/**
 * Add a value to the current player's Prestige
 * @param amount - The number to add (can be negative)
 * @returns Promise that resolves with the updated player
 */
export async function addPrestige(amount: number): Promise<void> {
    const response = await fetch('/players/prestige', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
        throw new Error('Failed to update prestige');
    }
}

/**
 * Rename the current player
 * @param name - The new display name
 * @returns Promise resolving to the updated player
 */
export async function renamePlayer(name: string): Promise<{ GUID: string; Name: string; Prestige: number }> {
    const response = await fetch('/players', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Name: name }),
    });

    if (!response.ok) {
        throw new Error('Failed to rename player');
    }

    return response.json();
}

/**
 * Get the current player via their playerGUID cookie
 * @returns Promise resolving to the player object
 */
export async function getPlayer(): Promise<{ GUID: string; Name: string; Prestige: number }> {
    const response = await fetch('/players', {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to get player');
    }

    return response.json();
}

// Expose to global scope for use in inline scripts
(window as any).createPlayer = createPlayer;
(window as any).addPrestige = addPrestige;
(window as any).getPlayer = getPlayer;
(window as any).renamePlayer = renamePlayer;
