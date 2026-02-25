import { Actor } from "./Actor.js";
import { Asteroid } from "./Asteroid.js";
import { Pickupable } from "./Pickupable.js";
import { PlayerPawn } from "./PlayerPawn.js";

/**
 * Projectile that will destroy non-pickup non-player when collided with.
 */
export class Projectile extends Actor {
    public bIsVisible: boolean = true;
    public bHasEnabledCollision: boolean = true;
    // TODO MAKE A PROJECTILE IMAGE
    public DisplayImgSrc: string = "Assets/Images/Projectile.png";
    public Dimensions: [number, number] = [25, 25];
    public MaxVelocity: number = 800;
    public MaxAcceleration: number = 10000;

    public OnTouch(other: Actor): void {
        // TODO play an explosion anim
        if (other instanceof PlayerPawn || other instanceof Pickupable) return;
        if (!other.bHasEnabledCollision) return;

        if (other instanceof Asteroid)
            console.log("Hit an asteroid!");

        this.World?.RemoveActorInstantly(this);
        this.World?.RemoveActorAnimated(other);

        this.GetWorld().AddPrestige(1);

        // TODO maybe just spawn an actor with a gif as its image, and then remove it a moment later on a timeout?
    }
}