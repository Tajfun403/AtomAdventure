import { Actor } from "./Actor.js";

export class BackgroundProp extends Actor {
    public bIsVisible: boolean = true;
    public bHasEnabledCollision: boolean = false;
    public DisplayImgSrc: string = "Assets/Images/BackgroundProp.png";

    // TODO give it a set of nebulas
}