/**
 * Create a new player and receive the playerGUID cookie
 * @returns Promise that resolves if player creation succeeds
 */
export async function createPlayer(): Promise<void> {
    const response = await fetch('/players', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    });

    if (!response.ok) {
        throw new Error('Failed to create player');
    }
}

// Expose to global scope for use in inline scripts
(window as any).createPlayer = createPlayer;
