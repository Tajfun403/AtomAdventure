
/**
 * Represents a 2D vector.
 */
export class Vector {
    public X: number;
    public Y: number;

    public constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }

    public Add(other: Vector): Vector {
        return new Vector(this.X + other.X, this.Y + other.Y);
    }

    public Subtract(other: Vector): Vector {
        return new Vector(this.X - other.X, this.Y - other.Y);
    }

    public Multiply(scalar: number): Vector {
        return new Vector(this.X * scalar, this.Y * scalar);
    }

    public Divide(scalar: number): Vector {
        return new Vector(this.X / scalar, this.Y / scalar);
    }

    public VSize(): number {
        return Math.sqrt(this.X * this.X + this.Y * this.Y);
    }

    public Normal(): Vector {
        const length = this.VSize();
        if (length === 0) return new Vector(0, 0);
        return this.Divide(length);
    }
}