import { World } from "./World";

/**
 * Base abstract class for all Actors that can be spawned in the Game World.
 */
export abstract class Actor {
    public Location: [number, number] = [0, 0];
    public DisplayImgSrc: string = "";
    public bHasEnabledCollision: boolean = false;
    public bIsVisible: boolean = true;
    public BackingDiv: HTMLDivElement | null = null;
    public Velocity: [number, number] = [0, 0];
    public Acceleration: [number, number] = [0, 0];
    public MaxAcceleration: number = 200;
    public MaxVelocity: number = 200;
    public ZIndex: number = 0;
    public World: World = null as any;

    public constructor(backingDiv: HTMLDivElement | null = null) {
        this.BackingDiv = backingDiv;
    }

    public GetWorld(): World {
        return this.World;
    }

    public Move(moveVector: [number, number]): void {
        this.Location[0] += moveVector[0];
        this.Location[1] += moveVector[1];
    }

    public Tick(DeltaTime: number): void {
        let innerAccel: [number, number] = [0, 0];

        // Opposite accel to slow down
        if (this.Acceleration[0] === 0) {
            const actualVelX = this.Velocity[0];
            if (actualVelX > 0) {
                innerAccel[0] = -this.MaxAcceleration;
            } else if (actualVelX < 0) {
                innerAccel[0] = this.MaxAcceleration;
            }
        }

        if (this.Acceleration[1] === 0) {
            const actualVelY = this.Velocity[1];
            if (actualVelY > 0) {
                innerAccel[1] = -this.MaxAcceleration;
            } else if (actualVelY < 0) {
                innerAccel[1] = this.MaxAcceleration;
            }
        }

        this.Velocity[0] += (this.Acceleration[0] + innerAccel[0]) * DeltaTime;
        this.Velocity[1] += (this.Acceleration[1] + innerAccel[1]) * DeltaTime;

        // Clamp velocity to max velocity
        this.Velocity[0] = Math.max(-this.MaxVelocity, Math.min(this.MaxVelocity, this.Velocity[0]));
        this.Velocity[1] = Math.max(-this.MaxVelocity, Math.min(this.MaxVelocity, this.Velocity[1]));

        const locationDelta: [number, number] = [this.Velocity[0] * DeltaTime, this.Velocity[1] * DeltaTime];
        this.Move(locationDelta);
    }

    public OnTouch(other: Actor): void {

    }

    public UpdateBackingProps(): void {
        if (!this.BackingDiv) return;

        this.BackingDiv.style.left = `${this.Location[0]}px`;
        this.BackingDiv.style.top = `${this.Location[1]}px`;
        this.BackingDiv.style.backgroundImage = `url(${this.DisplayImgSrc})`;
        this.BackingDiv.style.display = this.bIsVisible ? "block" : "none";
        this.BackingDiv.style.zIndex = `${this.ZIndex}`;
    }
}