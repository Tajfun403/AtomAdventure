import { Actor } from "./Actor.js";

/**
 * Plays a simple animated particle effect, then kills itself once done.
 */
export class ParticleEffect extends Actor {
    public bIsVisible: boolean = true;
    public bHasEnabledCollision: boolean = false

    public Duration: number = 2;
    protected ElapsedTime: number = 0;

    public constructor() {
        super();
    }

    public Tick(DeltaTime: number): void {
        super.Tick(DeltaTime);
        this.ElapsedTime += DeltaTime;
        if (this.ElapsedTime >= this.Duration) {
            this.GetWorld()?.RemoveActorInstantly(this);
        }
    }
}