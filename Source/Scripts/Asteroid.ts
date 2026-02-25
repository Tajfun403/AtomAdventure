import { Actor } from "./Actor.js";

export class Asteroid extends Actor {
    public bIsVisible: boolean = true;
    public bHasEnabledCollision: boolean = true
    public Dimensions: [number, number] = [50, 50];
    public DisplayImgSrc: string = "Assets/Images/Asteroid.png";
    public ZIndex: number = 10;
    public MaxVelocity: number = 500;

    public MaxVelocityRange: [number, number] = [150, 400];

    public constructor() {
        super(null);
        this.MaxVelocity = this.MaxVelocityRange[0] + Math.random() * (this.MaxVelocityRange[1] - this.MaxVelocityRange[0]);
        this.Rotation = Math.random() * 360;
    }
    // TODO FILL THIS!
}