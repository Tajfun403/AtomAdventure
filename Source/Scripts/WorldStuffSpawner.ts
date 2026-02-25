import { Actor } from './Actor.js';
import { AIController } from './AIController.js';
import { Asteroid } from './Asteroid.js';
import { PlayerController } from './PlayerController.js';
import { Pickupable } from './Pickupable.js';
import { getRandomItem } from '../API/ItemsAPI.js';
import { Vector } from './Vector.js';

export class WorldStuffSpawner extends Actor {
    public SpawnItemsInRadius: [number, number] = [1000, 2000];
    public SpawnPickupableInRadius: [number, number] = [100, 2000];
    protected timeToSpawnAsteroid: number = 0;
    protected timeToSpawnPickupable: number = 0;
    protected asteroidSpawnRange: [number, number] = [1, 6];
    protected pickupableSpawnRange: [number, number] = [10, 20];

    protected asteroidsPerSpawn: [number, number] = [1, 5];

    public Tick(DeltaTime: number): void {
        super.Tick(DeltaTime);
        // TODO spawn some asteroids every once in a while

        this.timeToSpawnAsteroid -= DeltaTime;
        if (this.timeToSpawnAsteroid <= 0) {
            for (let i = 0; i < this.asteroidsPerSpawn[0] + Math.floor(Math.random() * (this.asteroidsPerSpawn[1] - this.asteroidsPerSpawn[0] + 1)); i++) {
                this.SpawnNewAsteroid();
            }
            this.timeToSpawnAsteroid = this.asteroidSpawnRange[0] + Math.random() * (this.asteroidSpawnRange[1] - this.asteroidSpawnRange[0]);
        }

        this.timeToSpawnPickupable -= DeltaTime;
        if (this.timeToSpawnPickupable <= 0) {
            this.SpawnRandomPickupable();
            this.timeToSpawnPickupable = this.pickupableSpawnRange[0] + Math.random() * (this.pickupableSpawnRange[1] - this.pickupableSpawnRange[0]);
        }
    }

    public FindNewSpawnLocation(Pickupable: boolean = false): Vector {
        const baseLoc = this.GetWorld().GetPlayerActor()?.Location ?? new Vector(0, 0);
        const angle = Math.random() * 2 * Math.PI;
        const radius = Pickupable ? 
            this.SpawnPickupableInRadius[0] + Math.random() * (this.SpawnPickupableInRadius[1] - this.SpawnPickupableInRadius[0]) :
            this.SpawnItemsInRadius[0] + Math.random() * (this.SpawnItemsInRadius[1] - this.SpawnItemsInRadius[0]);
        return new Vector(baseLoc.X + Math.cos(angle) * radius, baseLoc.Y + Math.sin(angle) * radius);
    }

    public SpawnNewAsteroid(): Actor {
        const newLoc = this.FindNewSpawnLocation();
        const newAsteroid = new Asteroid();
        newAsteroid.Location = newLoc;
        this.GetWorld().SpawnActor(newAsteroid);

        const AIC = new AIController();
        this.GetWorld().SpawnActor(AIC);
        AIC.SetPossessedPawn(newAsteroid);
        AIC.RouteToPlayer();
        return newAsteroid;
    }

    public async SpawnRandomPickupable(): Promise<Pickupable> {
        const item = await getRandomItem();
        const pickupable = new Pickupable();
        pickupable.ItemID = item.ID;
        pickupable.DisplayImgSrc = item.Image;
        pickupable.Location = this.FindNewSpawnLocation(true);
        this.GetWorld().SpawnActor(pickupable);
        return pickupable;
    }
}