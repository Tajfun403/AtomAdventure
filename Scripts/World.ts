import { Actor } from "./Actor";
import { PlayerController } from "./PlayerController";

/**
 * World class is the bridge which both contains the entire world, and talks to the DOM to create new backing DIV objects.
 */
export class World {
    public AllActors: Actor[] = [];
    public CurrentPlayerController: PlayerController | null = null;

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
        document.body.appendChild(backingDiv);
        actor.BackingDiv = backingDiv;
        actor.UpdateBackingProps();
        this.AllActors.push(actor);
        return actor;
    }

    public GetPlayerActor(): Actor | null {
        if (!this.CurrentPlayerController) return null;
        return this.CurrentPlayerController.PossesedPawn;
    }

    public GetCurrentPlayerController(): PlayerController | null {
        return this.CurrentPlayerController;
    }
}