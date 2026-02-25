import { Actor } from "./Actor.js";
import { AIController } from "./AIController.js";
import { Asteroid } from "./Asteroid.js";
import { PlayerController } from "./PlayerController.js";
import { PlayerPawn } from "./PlayerPawn.js";
import { getPlayer } from "../API/PlayersAPI.js";
import { WorldStuffSpawner } from "./WorldStuffSpawner.js";
import { Vector } from "./Vector.js";
import { Weapon } from "./Weapon.js";

/**
 * World class is the bridge which both contains the entire world, and talks to the DOM to create new backing DIV objects.
 */
export class World {
    public AllActors: Actor[] = [];
    public CurrentPlayerController: PlayerController | null = null;
    public RootHTMLElement: HTMLElement;
    public CurrentPrestige: number = 0;
    public PlayerName: string = "Player";
    public WorldStuffSpawnerRef: WorldStuffSpawner | null = null;
    public GameTimeSeconds: number = 0;
    public TotalInstancesPerClass: Map<string, number> = new Map();

    public constructor(rootElement: HTMLElement) {
        this.RootHTMLElement = rootElement;
    }

    public Tick(DeltaTime: number) {
        this.GameTimeSeconds += DeltaTime;
        for (const actor of [...this.AllActors]) {
            actor.Tick(DeltaTime);
        }
        this.CheckCollisions();
        this.CenterCamera();
    }

    public CheckCollisions(): void {
        const actors = this.AllActors;
        for (let i = 0; i < actors.length; i++) {
            const a = actors[i]!;
            if (!a.bHasEnabledCollision) continue;

            for (let j = i + 1; j < actors.length; j++) {
                const b = actors[j]!;
                if (!b.bHasEnabledCollision) continue;

                const dist = a.Location.Subtract(b.Location).VSize();
                const touchDist = (a.ColliderWidth + b.ColliderWidth) / 2;
                if (dist < touchDist) {
                    a.OnTouch(b);
                    b.OnTouch(a);
                }
            }
        }
    }

    /**
     * Spawn the actor in the world. This will create the associated DOM element, as well as set properties such as dimensions or the image which represents it.
     * @param actor 
     * @returns 
     */
    public SpawnActor(actor: Actor): Actor {
        // ue-like indices
        const newIdx = (this.TotalInstancesPerClass.get(actor.constructor.name) || 0);
        this.TotalInstancesPerClass.set(actor.constructor.name, newIdx + 1);

        const myName = `${actor.constructor.name}_${newIdx}`;
        actor.Name = myName;
        console.log(`Spawning actor ${myName}`);

        actor.World = this;
        // spawn the backing div for the actor, and set it to the correct location and image
        const backingDiv = document.createElement("div");
        backingDiv.classList.add("fade-in", "GameActor");
        backingDiv.style.position = "absolute";
        backingDiv.id = myName;
        this.RootHTMLElement.appendChild(backingDiv);
        actor.BackingDiv = backingDiv;
        actor.UpdateBackingProps();
        this.AllActors.push(actor);
        return actor;
    }

    /**
     * Remove the Actor from the world, but with a fade-out animation.
     * @param 
     * @returns 
     */
    public RemoveActorAnimated(actor: Actor): void {
        if (actor.ToBeDestroyed) return;

        if (!actor.BackingDiv) {
            this.RemoveActorInstantly(actor);
            return;
        }

        actor.ToBeDestroyed = true;
        actor.bHasEnabledCollision = false;
        console.log(`Marking ${actor.Name} for delayed removal.`);

        // play a fade out animation, and then remove the actor from the world
        actor.BackingDiv.classList.remove("fade-in");
        actor.BackingDiv.classList.add("fade-out");
        setTimeout(() => {
            this.RemoveActorInstantly(actor);
        }, 500);
    }

    public RemoveActorInstantly(actor: Actor): void {
        if (actor.IsDestroyed) return;
        actor.ToBeDestroyed = true;
        actor.IsDestroyed = true;
        console.log(`Removing ${actor.Name}.`);

        actor.OnDestroyed();
        const index = this.AllActors.indexOf(actor);
        if (index === -1)
            throw new Error("Trying to remove an actor that doesn't exist in the world!");

        this.AllActors.splice(index, 1);
        if (actor.BackingDiv) {
            this.RootHTMLElement.removeChild(actor.BackingDiv);
            actor.BackingDiv = null;
        }
        if (actor.PossessedBy && actor.PossessedBy.bDieOnPossessedPawnDeath) {
            this.RemoveActorInstantly(actor.PossessedBy);
        }
    }

    public GetPlayerActor(): Actor | null {
        if (!this.CurrentPlayerController) return null;
        return this.CurrentPlayerController.PossesedPawn;
    }

    public AddPrestige(amount: number): void {
        this.CurrentPrestige += amount;
        this.UpdatePrestige(this.CurrentPrestige);
    }

    public UpdatePrestige(newCurrency: number): void {
        this.UpdateCurrencyDisplay(newCurrency);
    }

    public UpdateCurrencyDisplay(newCurrency: number): void {
        const currencyDisplay = document.getElementById("CurrencyCount");
        if (currencyDisplay) {
            currencyDisplay.textContent = `${newCurrency}`;
        }
    }

    public async InitServerVariables(): Promise<void> {
        const player = await getPlayer();
        console.log("Received player data from server: ", player);
        this.PlayerName = player.Name;
        this.CurrentPrestige = player.Prestige;
        this.UpdatePrestige(this.CurrentPrestige);
        
        const playerEl = document.getElementById("PlayerName");
        if (playerEl) playerEl.textContent = this.PlayerName;
    }

    /**
     * Init the world.
     */
    public async InitWorld(): Promise<void> {
        // Spawn the player in the middle of the world
        const serverVarsPromise = this.InitServerVariables();
        
        const playerSpawnPromise = this.SpawnPlayer();
        
        const worldStuffSpawner = new WorldStuffSpawner();
        this.WorldStuffSpawnerRef = worldStuffSpawner;
        worldStuffSpawner.Location = new Vector(0, 0);
        this.SpawnActor(worldStuffSpawner);

        // spawn some initial asteroids
        for (let i = 0; i < 5; i++) {
            worldStuffSpawner.SpawnNewAsteroid();
            worldStuffSpawner.SpawnRandomPickupable();
        }

        await serverVarsPromise;
        await playerSpawnPromise;
    }

    /**
     * Center the viewport over the player.
     */
    public CenterCamera(): void {
        const player = this.GetPlayerActor();
        if (!player) return;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const offsetX = viewportWidth / 2 - player.Location.X;
        const offsetY = viewportHeight / 2 - player.Location.Y;

        this.RootHTMLElement.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    /**
     * Spawn the player pawn, along its controller and weapon.
     */
    public async SpawnPlayer(): Promise<void> {
        const player = new PlayerPawn();
        player.Location = new Vector(0, 0);
        this.SpawnActor(player);

        const playerController = new PlayerController();
        this.CurrentPlayerController = playerController;
        playerController.SetPossessedPawn(player);
        playerController.SubscribeToInput();
        this.SpawnActor(playerController);

        const weapon = new Weapon();
        player.Weapon = weapon;
        this.SpawnActor(weapon);
        player.AttachActor(weapon);
    }
}