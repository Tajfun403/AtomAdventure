import { ParticleEffect } from "./ParticleEffect.js";

export class AsteroidExplosionParticle extends ParticleEffect {
    public DisplayImgSrc: string = "Assets/Images/AsteroidParts.webp";
    public Duration: number = 2.5;
    public Dimensions: [number, number] = [150, 150];

    public constructor() {
        super();
        // this.DisplayImgSrc = "Assets/Images/AsteroidParts.webp?cachebuster=" + Math.random();
    }
}