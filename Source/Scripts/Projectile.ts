import { Actor } from "./Actor";
import { Pickupable } from "./Pickupable";
import { PlayerPawn } from "./PlayerPawn";

/**
 * Projectile that will remove non-pickup non-player actors on it.
 */
export class Projectile extends Actor {
    public OnTouch(other: Actor): void {
        // TODO play an explosion anim
        if (other instanceof PlayerPawn || other instanceof Pickupable) return;
        if (!other.bHasEnabledCollision) return;
        this.World?.RemoveActor(this);

        // TODO maybe just spawn an actor with a gif as its image, and then remove it a moment later on a timeout?
    }
}