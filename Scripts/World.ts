import { Actor } from "./Actor";
import { AIController } from "./AIController";
import { Asteroid } from "./Asteroid";
import { PlayerController } from "./PlayerController";

/**
 * World class is the bridge which both contains the entire world, and talks to the DOM to create new backing DIV objects.
 */
export class World {
    public AllActors: Actor[] = [];
    public CurrentPlayerController: PlayerController | null = null;
    public RootHTMLElement: HTMLElement;
    public SpawnItemsInMinRadius: number = 2000;
    public SpawnItemsInMaxRadius: number = 4000;

    public constructor(rootElement: HTMLElement) {
        this.RootHTMLElement = rootElement;
    }

    public FindNewSpawnLocation(): [number, number] {
        const baseLoc = this.GetPlayerActor()?.Location || [0, 0];
        const angle = Math.random() * 2 * Math.PI;
        const radius = this.SpawnItemsInMinRadius + Math.random() * (this.SpawnItemsInMaxRadius - this.SpawnItemsInMinRadius);
        return [baseLoc[0] + Math.cos(angle) * radius, baseLoc[1] + Math.sin(angle) * radius];
    }

    public SpawnNewAsteroid(): Actor {
        const newLoc = this.FindNewSpawnLocation();
        const newAsteroid = new Asteroid();
        newAsteroid.Location = newLoc
        this.SpawnActor(newAsteroid);

        const AIC = new AIController();
        this.SpawnActor(AIC);
        AIC.SetPossessedPawn(newAsteroid);
        AIC.RouteToPlayer();
        return newAsteroid;
    }

    public Tick(DeltaTime: number) {
        for (const actor of this.AllActors) {
            actor.Tick(DeltaTime);
        }
    }

    public SpawnActor(actor: Actor): Actor {
        actor.World = this;
        // spawn the backing div for the actor, and set it to the correct location and image
        const backingDiv = document.createElement("div");
        backingDiv.style.position = "absolute";
        this.RootHTMLElement.appendChild(backingDiv);
        actor.BackingDiv = backingDiv;
        actor.UpdateBackingProps();
        this.AllActors.push(actor);
        return actor;
    }

    public RemoveActor(actor: Actor): void {
        const index = this.AllActors.indexOf(actor);
        if (index === -1)
            throw new Error("Trying to remove an actor that doesn't exist in the world!");

        this.AllActors.splice(index, 1);
        if (actor.BackingDiv) {
            this.RootHTMLElement.removeChild(actor.BackingDiv);
            actor.BackingDiv = null;
        }
    }

    public GetPlayerActor(): Actor | null {
        if (!this.CurrentPlayerController) return null;
        return this.CurrentPlayerController.PossesedPawn;
    }

    public GetCurrentPlayerController(): PlayerController | null {
        return this.CurrentPlayerController;
    }
}