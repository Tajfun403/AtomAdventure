import { Actor } from "./Actor";

export class Pickupable extends Actor {
    public ItemID: number = 0;
    public bIsGlowing: boolean = false;
    public glowDistance: number = 200;

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

        const deltaX = player.Location[0] - this.Location[0];
        const deltaY = player.Location[1] - this.Location[1];
        const distanceToPlayer = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        this.SetGlowing(distanceToPlayer < this.glowDistance);
    }
}