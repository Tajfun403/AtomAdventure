import { Actor } from "./Actor.js";
import { Weapon } from "./Weapon.js";

export class PlayerPawn extends Actor {
    public bIsVisible: boolean = true;
    public bHasEnabledCollision: boolean = true;
    public DisplayImgSrc: string = "Assets/Images/PlayerShip.png";
    public ZIndex: number = 100;
    // TODO FILL THIS SHIT

    public constructor() {
        super(null);
    }
}