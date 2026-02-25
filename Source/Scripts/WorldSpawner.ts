import { World } from "./World.js";

export async function WorldSpawner(): Promise<World> {
    console.log("Spawning world actually...");

    const playground = document.querySelector(".Playground") as HTMLElement;
    const world = new World(playground);

    const gameOverScreen = document.getElementById("GameOverScreen") as HTMLDivElement;
    if (gameOverScreen) {
        gameOverScreen.style.display = "none";
    }

    await world.InitWorld();

    world.OnPlayerDied = () => {
        setTimeout(() => {
        const gameOverScreen = document.getElementById("GameOverMain") as HTMLDivElement;
        if (gameOverScreen) {
            gameOverScreen.style.display = "flex";
            gameOverScreen.classList.add("fade-in");
        }
        }, 1000);
    }

    // requestAnimationFrame returns miliseconds,
    // while the entire game assumes seconds!
    let lastTime: number | null = null;
    function loop(timestamp: number) {
        const deltaTime = lastTime !== null ? (timestamp - lastTime) / 1000 : 0;
        lastTime = timestamp;
        world.Tick(deltaTime);
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    return world;
}

(window as any).WorldSpawner = WorldSpawner;