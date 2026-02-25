import { Actor } from "./Actor.js";
import { Projectile } from "./Projectile.js";
import { Vector } from "./Vector.js";


export class Weapon extends Actor {
    public bIsVisible: boolean = false;
    protected LastShotTime: number = 0;
    public FireRate: number = 6;

    public Tick(DeltaTime: number): void {
        super.Tick(DeltaTime);
    }

    public CanShootNow(): boolean {
        const currentTime = this.GetWorld().GameTimeSeconds;
        return (currentTime - this.LastShotTime) >= (1 / this.FireRate);
    }

    /**
     * Shoot the weapon in given direction.
     * @param targetLocation The in-world location that the projectile will pass through.
     * @returns 
     */
    public ShootTowards(targetLocation: Vector) {
        if (!this.CanShootNow()) return;
        this.LastShotTime = this.GetWorld().GameTimeSeconds;
        this.SpawnProjectileTowards(targetLocation);
        console.log(`Shot towards ${targetLocation.X}, ${targetLocation.Y}!`);
        // TODO fill this thing
    }

    /**
     * Spawn a projectile that will go through that `direction`.
     * @param targetLocation The in-world direction that the projectile will travel in.
     */
    protected SpawnProjectileTowards(targetLocation: Vector) {
        const dir = targetLocation.Subtract(this.Location).Normal();
        const projectile = new Projectile();
        projectile.Location = this.Location;
        projectile.Acceleration = dir.Multiply(projectile.MaxAcceleration);
        this.GetWorld().SpawnActor(projectile);
    }
}