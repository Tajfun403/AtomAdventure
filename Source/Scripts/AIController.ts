import { Actor } from "./Actor.js";
import { Controller } from "./Controller.js";
import { Vector } from "./Vector.js";

/**
 * AI Controller that will simply find the direction towards the player at spawn and will continue moving in that direction.
 */
export class AIController extends Controller {
    // TODO FILL THIS!
    protected PlayerRef: Actor | null = null;
    protected Direction: Vector = new Vector(0, 0);

    /**
     * Route this actor towards the snapshotted player location.
     * @returns 
     */
    public RouteToPlayer() {
        this.PlayerRef = this.GetWorld().GetPlayerActor();
        if (!this.PlayerRef) return;

        this.RouteTowardsLocation(this.PlayerRef.Location);
    }

    /**
     * Snapshot the target location and route the pawn towards it in a continoues movement.
     */
    public RouteTowardsLocation(targetLocation: Vector) {
        if (!this.PossesedPawn) return;

        this.Direction = targetLocation.Subtract(this.PossesedPawn.Location).Normal();
        this.PossesedPawn.Acceleration = this.Direction.Multiply(this.MaxAcceleration);
    }
}