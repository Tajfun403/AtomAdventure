import { Actor } from "./Actor.js";

export class Pickupable extends Actor {
    public ItemID: number = 0;
    public bIsGlowing: boolean = false;
    public glowDistance: number = 200;
    public bIsVisible: boolean = true;
    public bHasEnabledCollision: boolean = true;
    public DisplayImgSrc: string = "Assets/Images/Papa.png";
    public ZIndex: number = 50;

    /**
     * Set the glowing state of the Actor.
     * @param bShouldGlow Whether the item should glow
     * @returns Whether thw glow setting was successful
     */
    protected SetGlowing(bShouldGlow: boolean): boolean {
        if (!this.BackingDiv) return false;

        if (bShouldGlow === this.bIsGlowing) return false;
        this.bIsGlowing = bShouldGlow;

        if (bShouldGlow)
            this.BackingDiv.classList.add("Glowing");
        else
            this.BackingDiv.classList.remove("Glowing");
        return true;
    }

    /**
     * Glow when close enough to the player
     */
    public Tick(DeltaTime: number): void {
        super.Tick(DeltaTime);
        const player = this.GetWorld().GetPlayerActor();
        if (!player) return;

        const distanceToPlayer = player.Location.Subtract(this.Location).VSize();
        this.SetGlowing(distanceToPlayer < this.glowDistance);
    }

    public OnBeingPickedUp(): void {
        this.GetWorld().RemoveActorAnimated(this);
    }
}