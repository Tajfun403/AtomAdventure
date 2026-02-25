import { Controller } from "./Controller.js";
import { Pickupable } from "./Pickupable.js";
import { AddInventoryEntry } from "../API/InventoryAPI.js";
import { Vector } from "./Vector.js";

/**
 * PlayerController that translates a Player's input into the pawn.
 */
export class PlayerController extends Controller {
    public inputAxisX: number = 0;
    public inputAxisY: number = 0;

    private mouseX: number = 0;
    private mouseY: number = 0;

    private printCounter: number = 0;

    private bShouldBeShooting: boolean = false;

    public MaxAcceleration: number = 1500;

    public bHasEnabledCollision: boolean = false;

    // TODO MAP INPUT AXES!
    // Via some function in the world itself...
    public Tick(DeltaTime: number) {
        if (!this.PossesedPawn) return;

        this.PossesedPawn.Acceleration = new Vector(this.inputAxisX, this.inputAxisY)
        .Multiply(this.PossesedPawn.MaxAcceleration);

        

        this.UpdateRotationTowardsMouse();
        this.printCounter += 1;
        if (this.printCounter % 60 === 0) {
            // console.log(this.PossesedPawn.GetMovingSummary());
        }

        this.TryShoot();
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
            asPickupable.OnBeingPickedUp();
            this.GetWorld().RemoveActorAnimated(asPickupable);
            AddInventoryEntry(asPickupable.ItemID).catch(console.error);
        }
    }

    protected GetMouseLocInWorld(): Vector {
        const player = this.PossesedPawn;
        if (!player) return new Vector(0, 0);

        return new Vector(
            player.Location.X + (this.mouseX - window.innerWidth / 2),
            player.Location.Y + (this.mouseY - window.innerHeight / 2)
        );
    }

    protected UpdateRotationTowardsMouse() {
        const pawn = this.PossesedPawn;
        if (!pawn || !pawn.BackingDiv) return;

        const rect = pawn.BackingDiv.getBoundingClientRect();
        const pawnCenterX = rect.left + rect.width / 2;
        const pawnCenterY = rect.top + rect.height / 2;

        const d = new Vector(this.mouseX - pawnCenterX, this.mouseY - pawnCenterY);
        pawn.Rotation = Math.atan2(d.Y, d.X) * (180 / Math.PI);
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


    public StartShooting() {
        this.bShouldBeShooting = true;
        // TODO start shooting in the direction of the mouse cursor
    }

    public StopShooting() {
        this.bShouldBeShooting = false;
        // TODO stop shooting
    }

    public TryShoot() {
        if (!this.bShouldBeShooting || !this.PossesedPawn || !this.PossesedPawn.Weapon) return;

        this.PossesedPawn.Weapon.ShootTowards(this.GetMouseLocInWorld());
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
        window.addEventListener("mousedown", this.StartShooting.bind(this));
        window.addEventListener("mouseup", this.StopShooting.bind(this));
    }
}