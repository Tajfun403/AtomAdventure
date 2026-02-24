import { Actor } from "./Actor.js";
import { Controller } from "./Controller.js";

/**
 * AI Controller that will simply find the direction towards the player at spawn and will continue moving in that direction.
 */
export class AIController extends Controller {
    // TODO FILL THIS!
    protected PlayerRef: Actor | null = null;
    protected Direction: [number, number] = [0, 0];

    /**
     * Route this actor towards the snapshotted player location.
     * @returns 
     */
    protected RouteToPlayer() {
        this.PlayerRef = this.GetWorld().GetPlayerActor();
        if (!this.PlayerRef) return;

        const deltaX = this.PlayerRef.Location[0] - this.Location[0];
        const deltaY = this.PlayerRef.Location[1] - this.Location[1];
        const VSize = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (VSize > 0) {
            this.Direction[0] = deltaX / VSize;
            this.Direction[1] = deltaY / VSize;
        }
        
        if (!this.PossesedPawn) return;
        this.PossesedPawn.Acceleration[0] = this.Direction[0] * this.MaxAcceleration;
        this.PossesedPawn.Acceleration[1] = this.Direction[1] * this.MaxAcceleration;
    }
}