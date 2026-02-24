import { Controller } from "./Controller";

/**
 * PlayerController that translates a Player's input into the pawn.
 */
export class PlayerController extends Controller {
    public inputAxisX: number = 0;
    public inputAxisY: number = 0;

    // TODO MAP INPUT AXES!
    // Via some function in the world itself...
    public Tick(DeltaTime: number) {
        if (!this.PossesedPawn) return;

        this.PossesedPawn.Acceleration[0] = this.inputAxisX * this.PossesedPawn.MaxAcceleration;
        this.PossesedPawn.Acceleration[1] = this.inputAxisY * this.PossesedPawn.MaxAcceleration;
    }

    /**
     * Subscribe to keydown & keyup events to handle input for the player controller.
     */

    public OnKeyDown(e: KeyboardEvent) {
        switch (e.key.toLowerCase()) {
            case "a":
                this.inputAxisX = -1;
                break;
            case "d":
                this.inputAxisX = 1;
                break;
            case "w":
                this.inputAxisY = -1;
                break;
            case "s":
                this.inputAxisY = 1;
                break;
        }
    }

    public OnKeyUp(e: KeyboardEvent) {
        switch (e.key.toLowerCase()) {
            case "a":
            case "d":
                this.inputAxisX = 0;
                break;
            case "w":
            case "s":
                this.inputAxisY = 0;
                break;
        }
    }

    public SubscribeToInput() {
        // without a bind, `this` will point to window, or whatever context the callback is called from
        // so the method needs to be bound to this specific instance!
        window.addEventListener("keydown", this.OnKeyDown.bind(this));
        window.addEventListener("keyup", this.OnKeyUp.bind(this));
    }
}