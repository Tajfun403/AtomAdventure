import { Actor } from "./Actor.js";
import { Asteroid } from "./Asteroid.js";
import { Projectile } from "./Projectile.js";
import { Weapon } from "./Weapon.js";

export class PlayerPawn extends Actor {
    public bIsVisible: boolean = true;
    public bHasEnabledCollision: boolean = true;
    public DisplayImgSrc: string = "Assets/Images/PlayerShip.png";
    public ZIndex: number = 100;
    // TODO FILL THIS SHIT

    public constructor() {
        super(null);
    }

    public OnTouch(other: Actor): void {
        super.OnTouch(other);

        // ignore self hits
        if (other instanceof Projectile) return;
        
        if (other instanceof Asteroid) {
            // TODO GAME OVER SCREEN!
        }
    }
}