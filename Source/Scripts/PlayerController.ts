import { Controller } from "./Controller";
import { Pickupable } from "./Pickupable";
import { AddInventoryEntry } from "../API/InventoryAPI";

/**
 * PlayerController that translates a Player's input into the pawn.
 */
export class PlayerController extends Controller {
    public inputAxisX: number = 0;
    public inputAxisY: number = 0;

    private mouseX: number = 0;
    private mouseY: number = 0;

    // TODO MAP INPUT AXES!
    // Via some function in the world itself...
    public Tick(DeltaTime: number) {
        if (!this.PossesedPawn) return;

        this.PossesedPawn.Acceleration[0] = this.inputAxisX * this.PossesedPawn.MaxAcceleration;
        this.PossesedPawn.Acceleration[1] = this.inputAxisY * this.PossesedPawn.MaxAcceleration;

        this.UpdateRotationTowardsMouse();
    }

    /**
     * Pickup all items in proximity. By default -- bound to the E key.
     */
    public Pickup() {
        // let's find pickupable items

        for (const actor of this.GetWorld().AllActors) {
            if (!(actor instanceof Pickupable)) continue;

            const asPickupable = actor as Pickupable;
            if (!asPickupable.bIsGlowing) continue;

            // TODO add this actor to the inventory and remove it from the world
            // make the respective call
            this.GetWorld().RemoveActor(asPickupable);
            AddInventoryEntry(asPickupable.ItemID).catch(console.error);
        }
    }

    protected UpdateRotationTowardsMouse() {
        const pawn = this.PossesedPawn;
        if (!pawn || !pawn.BackingDiv) return;

        // Get the screen-space centre of the pawn's backing div
        const rect = pawn.BackingDiv.getBoundingClientRect();
        const pawnCenterX = rect.left + rect.width / 2;
        const pawnCenterY = rect.top + rect.height / 2;

        // Angle from pawn centre to mouse cursor (0° = right, clockwise positive)
        const dx = this.mouseX - pawnCenterX;
        const dy = this.mouseY - pawnCenterY;
        pawn.Rotation = Math.atan2(dy, dx) * (180 / Math.PI);
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
            case "e":
                this.Pickup();
                break;
        }
    }

    public SubscribeToInput() {
        // without a bind, `this` will point to window, or whatever context the callback is called from
        // so the method needs to be bound to this specific instance!
        window.addEventListener("keydown", this.OnKeyDown.bind(this));
        window.addEventListener("keyup", this.OnKeyUp.bind(this));
        window.addEventListener("mousemove", (e: MouseEvent) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
    }
}