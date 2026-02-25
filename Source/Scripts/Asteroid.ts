import { Actor } from "./Actor.js";
import { AsteroidExplosionParticle } from "./AsteroidExplosionParticle.js";

export class Asteroid extends Actor {
    public bIsVisible: boolean = true;
    public bHasEnabledCollision: boolean = true
    public Dimensions: [number, number] = [50, 50];
    public DisplayImgSrc: string = "Assets/Images/Asteroid.png";
    public ZIndex: number = 10;
    public MaxVelocity: number = 500;

    public MaxVelocityRange: [number, number] = [150, 400];

    public bDestroyWhenAwayFromPlayer: boolean = true;

    public constructor() {
        super();
        this.MaxVelocity = this.MaxVelocityRange[0] + Math.random() * (this.MaxVelocityRange[1] - this.MaxVelocityRange[0]);
        this.Rotation = Math.random() * 360;
    }
    // TODO FILL THIS!

    public OnDestroyed(): void {
        super.OnDestroyed();
        if (this.IsDestroyed) return;
        const particle = new AsteroidExplosionParticle();
        particle.Location = this.Location;
        this.GetWorld().SpawnActor(particle);
    }

    public OnTouch(other: Actor): void {
        super.OnTouch(other);
        if (!this.bHasEnabledCollision || !other.bHasEnabledCollision) return;
        this.GetWorld().RemoveActorAnimated(this);
    }

    public Tick(DeltaTime: number): void {
        super.Tick(DeltaTime);
    }
}