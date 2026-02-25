import { Actor } from "./Actor";

/**
 * Plays a simple animated particle effect, then kills itself once done.
 */
export class ParticleEffect extends Actor {
    public bIsVisible: boolean = true;
    public bHasEnabledCollision: boolean = false

    public Duration: number = 1; // In seconds
    private ElapsedTime: number = 0;

    public constructor() {
        super(null);
    }

    public Tick(DeltaTime: number): void {
        super.Tick(DeltaTime);
        this.ElapsedTime += DeltaTime;
        if (this.ElapsedTime >= this.Duration) {
            this.GetWorld()?.RemoveActorInstantly(this);
        }
    }
}