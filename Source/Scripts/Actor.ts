import { Weapon } from "./Weapon.js";
import { World } from "./World.js";
import { Vector } from "./Vector.js";
import { Controller } from "./Controller.js";

/**
 * Base abstract class for all Actors that can be spawned in the Game World.
 */
export abstract class Actor {
    public Location: Vector = new Vector(0, 0);
    public DisplayImgSrc: string = "";
    public bHasEnabledCollision: boolean = false;
    public bIsVisible: boolean = false;
    public BackingDiv?: HTMLDivElement | null = null;
    public Velocity: Vector = new Vector(0, 0);
    public Acceleration: Vector = new Vector(0, 0);
    public MaxAcceleration: number = 200;
    public MaxVelocity: number = 200;
    public ZIndex: number = 0;
    public World: World = null as any;
    public Rotation: number = 0; // in degrees, 0 is facing right, positive is clockwise
    public Dimensions: [number, number] = [50, 50]; // width, height in pixels
    public Name: string = "Default__Actor";
    public Weapon: Weapon | null = null;

    public AttachedActors: Actor[] = [];
    public ToBeDestroyed: boolean = false;
    public IsDestroyed: boolean = false;
    public ColliderWidth: number = 50;

    public PossessedBy: Controller | null = null;
    public bDestroyWhenAwayFromPlayer: boolean = false;
    public MaxDistanceFromPlayer: number = 5000;

    // TODO handle rotation when actors move around!

    public constructor() {
    }

    public GetWorld(): World {
        return this.World;
    }

    public Move(moveVector: Vector): void {
        this.Location = this.Location.Add(moveVector);
        for (const attachedActor of this.AttachedActors) {
            attachedActor.Move(moveVector);
        }
    }

    public GetMovingSummary(): string {
        return `Loc (${this.Location.X.toFixed(2)}, ${this.Location.Y.toFixed(2)}), Vel (${this.Velocity.X.toFixed(2)}, ${this.Velocity.Y.toFixed(2)}), Accel (${this.Acceleration.X.toFixed(2)}, ${this.Acceleration.Y.toFixed(2)})`;
    }

    public LastInputTime: number = 0;
    public TimeToFullSlowdown: number = 1.33;

    public UpdateLocation(DeltaTime: number): void {
        let innerAccelX = 0;
        let innerAccelY = 0;

        if (this.Acceleration.X !== 0 || this.Acceleration.Y !== 0) {
            this.LastInputTime = this.GetWorld().GameTimeSeconds;
        }

        const timeSinceLastInput = this.GetWorld().GameTimeSeconds - this.LastInputTime;
        const innerMaxVelocity = this.MaxVelocity * Math.max(0, 1 - timeSinceLastInput / this.TimeToFullSlowdown);

        // Opposite accel to slow down
        if (this.Acceleration.X === 0) {
            if (this.Velocity.X > 0) innerAccelX = -this.MaxAcceleration;
            else if (this.Velocity.X < 0) innerAccelX = this.MaxAcceleration;
        }
        if (this.Acceleration.Y === 0) {
            if (this.Velocity.Y > 0) innerAccelY = -this.MaxAcceleration;
            else if (this.Velocity.Y < 0) innerAccelY = this.MaxAcceleration;
        }

        if (Math.abs(innerAccelX) < 1) innerAccelX = 0;
        if (Math.abs(innerAccelY) < 1) innerAccelY = 0;

        this.Velocity = this.Velocity.Add(
            this.Acceleration.Add(new Vector(innerAccelX, innerAccelY)).Multiply(DeltaTime)
        );

        // Clamp velocity by magnitude to prevent per-component distortion
        const speed = this.Velocity.VSize();
        if (speed > innerMaxVelocity && speed > 0) {
            this.Velocity = this.Velocity.Normal().Multiply(innerMaxVelocity);
        }

        this.Move(this.Velocity.Multiply(DeltaTime));
    }

    public Tick(DeltaTime: number): void {
        this.UpdateLocation(DeltaTime);
        this.PartialUpdateBackingProps();
        this.DestroyWhenAwayFromPlayer();
    }

    public OnTouch(other: Actor): void {
        if (!this.bHasEnabledCollision || !other.bHasEnabledCollision) return;
        if (this.ToBeDestroyed){
            return;
        }
    }

    /**
     * Update all derivative props.
     */
    public UpdateBackingProps(): void {
        if (!this.BackingDiv) return;

        // TODO props not all of them need to be updated all the time
        this.BackingDiv.style.left = `${this.Location.X - this.Dimensions[0] / 2}px`;
        this.BackingDiv.style.top = `${this.Location.Y - this.Dimensions[1] / 2}px`;
        this.BackingDiv.style.width = `${this.Dimensions[0]}px`;
        this.BackingDiv.style.height = `${this.Dimensions[1]}px`;
        this.BackingDiv.style.display = this.bIsVisible ? "block" : "none";
        this.BackingDiv.style.zIndex = `${this.ZIndex}`;
        this.BackingDiv.style.transform = `rotate(${this.Rotation}deg)`;

        const imgDiv = this.BackingDiv.querySelector(".ActorImage") as HTMLImageElement | null;
        if (imgDiv) {
            imgDiv.src = this.DisplayImgSrc ?? "";
        }
    }

    /**
     * Update only the properties that realistically change often enough.
     */
    public PartialUpdateBackingProps(){
        if (!this.BackingDiv) return;

        this.BackingDiv.style.left = `${this.Location.X - this.Dimensions[0] / 2}px`;
        this.BackingDiv.style.top = `${this.Location.Y - this.Dimensions[1] / 2}px`;
        this.BackingDiv.style.transform = `rotate(${this.Rotation}deg)`;
        this.BackingDiv.style.display = this.bIsVisible ? "block" : "none";
    }

    /**
     * Attach an actor so that it follows this one.
     */
    public AttachActor(actor: Actor): void {
        this.AttachedActors.push(actor);
    }

    /**
     * Detach this actor.
     * @param actor 
     */
    public DetachActor(actor: Actor): void {
        const index = this.AttachedActors.indexOf(actor);
        if (index !== -1) {
            this.AttachedActors.splice(index, 1);
        }
    }

    public OnDestroyed(): void {

    }

    /**
     * Destroy the actor if `this.bDestroyWhenAwayFromPlayer === true` and the player is too far away.
     * @returns 
     */
    public DestroyWhenAwayFromPlayer(): void {
        if (!this.bDestroyWhenAwayFromPlayer) return;
        const player = this.GetWorld().GetPlayerActor();
        if (!player) return;

        if (this.Location.Subtract(player.Location).VSize() > this.MaxDistanceFromPlayer) {
            this.GetWorld().RemoveActorInstantly(this);
            return;
        }
    }
}