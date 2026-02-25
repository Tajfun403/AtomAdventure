import { Actor } from "./Actor.js";
import { Asteroid } from "./Asteroid.js";
import { AsteroidExplosionParticle } from "./AsteroidExplosionParticle.js";
import { Projectile } from "./Projectile.js";

export class PlayerPawn extends Actor {
    public bIsVisible: boolean = true;
    public bHasEnabledCollision: boolean = true;
    public DisplayImgSrc: string = "Assets/Images/PlayerShip.png";
    public ZIndex: number = 100;
    // TODO FILL THIS SHIT

    public constructor() {
        super();
    }

    public OnTouch(other: Actor): void {
        super.OnTouch(other);

        // ignore self hits
        if (other instanceof Projectile) return;
        
        if (other instanceof Asteroid) {
            // TODO GAME OVER SCREEN!
            this.GetWorld().RemoveActorAnimated(this);
            this.GetWorld().GameOver();

            // maybe give it a normal particle lol
            const particle = new AsteroidExplosionParticle();
            particle.Location = this.Location;
            this.GetWorld().SpawnActor(particle);
        }
    }
}