import { Actor } from "./Actor.js";

/**
 * Controller that can Posses an Actor / Pawn to take control of it.
 */
export class Controller extends Actor {
    public PossesedPawn: Actor | null = null;
    public bDieOnPossessedPawnDeath: boolean = false;

    public constructor() {
        super(null);
        this.bIsVisible = false;
        this.bHasEnabledCollision = false;
    }

    public SetPossessedPawn(pawn: Actor | null) {
        this.PossesedPawn = pawn;
        if (pawn) {
            pawn.PossessedBy = this;
        }
    }
    
    public Tick(DeltaTime: number): void {
        super.Tick(DeltaTime);
    }
}