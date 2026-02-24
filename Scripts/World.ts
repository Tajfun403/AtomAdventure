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

    public SpawnActor(actor: Actor) {
        this.AllActors.push(actor);
    }
}