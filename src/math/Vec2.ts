/**
 * A 2D vector class with x and y components.
 * Provides vector operations for 2D graphics and mathematics.
 * 
 * @example
 * ```typescript
 * const v1 = new Vec2(3, 4);
 * const v2 = new Vec2(1, 2);
 * const sum = v1.add(v2); // Vec2(4, 6)
 * const length = v1.length(); // 5
 * ```
 */
export class Vec2 {
  /**
   * Creates a new 2D vector.
   * @param x - The x component (default: 0)
   * @param y - The y component (default: 0)
   */
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  /**
   * Creates a zero vector (0, 0).
   * @returns A new Vec2 with both components set to 0
   */
  static zero(): Vec2 {
    return new Vec2(0, 0);
  }

  /**
   * Creates a vector with both components set to 1.
   * @returns A new Vec2(1, 1)
   */
  static one(): Vec2 {
    return new Vec2(1, 1);
  }

  /**
   * Creates a copy of this vector.
   * @returns A new Vec2 with the same components
   */
  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  /**
   * Sets the components of this vector.
   * @param x - The new x component
   * @param y - The new y component
   * @returns This vector for chaining
   */
  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Adds another vector to this one and returns a new vector.
   * @param v - The vector to add
   * @returns A new vector containing the sum
   */
  add(v: Vec2): Vec2 {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  /**
   * Adds another vector to this one in-place.
   * @param v - The vector to add
   * @returns This vector for chaining
   */
  addSelf(v: Vec2): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /**
   * Subtracts another vector from this one and returns a new vector.
   * @param v - The vector to subtract
   * @returns A new vector containing the difference
   */
  subtract(v: Vec2): Vec2 {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  /**
   * Subtracts another vector from this one in-place.
   * @param v - The vector to subtract
   * @returns This vector for chaining
   */
  subtractSelf(v: Vec2): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /**
   * Multiplies this vector by a scalar and returns a new vector.
   * @param scalar - The scalar value to multiply by
   * @returns A new scaled vector
   */
  multiply(scalar: number): Vec2 {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  /**
   * Multiplies this vector by a scalar in-place.
   * @param scalar - The scalar value to multiply by
   * @returns This vector for chaining
   */
  multiplySelf(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /**
   * Divides this vector by a scalar and returns a new vector.
   * @param scalar - The scalar value to divide by
   * @returns A new scaled vector
   */
  divide(scalar: number): Vec2 {
    return new Vec2(this.x / scalar, this.y / scalar);
  }

  /**
   * Divides this vector by a scalar in-place.
   * @param scalar - The scalar value to divide by
   * @returns This vector for chaining
   */
  divideSelf(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  /**
   * Calculates the dot product with another vector.
   * @param v - The other vector
   * @returns The dot product (scalar value)
   */
  dot(v: Vec2): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Calculates the length (magnitude) of this vector.
   * @returns The length of the vector
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Calculates the squared length of this vector.
   * Faster than length() as it avoids the square root operation.
   * @returns The squared length
   */
  lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Returns a normalized copy of this vector (length = 1).
   * @returns A new unit vector in the same direction
   */
  normalize(): Vec2 {
    const len = this.length();
    if (len === 0) return new Vec2(0, 0);
    return new Vec2(this.x / len, this.y / len);
  }

  /**
   * Normalizes this vector in-place (makes length = 1).
   * @returns This vector for chaining
   */
  normalizeSelf(): this {
    const len = this.length();
    if (len !== 0) {
      this.x /= len;
      this.y /= len;
    }
    return this;
  }

  /**
   * Calculates the distance to another vector.
   * @param v - The other vector
   * @returns The distance between the two vectors
   */
  distance(v: Vec2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculates the squared distance to another vector.
   * Faster than distance() as it avoids the square root operation.
   * @param v - The other vector
   * @returns The squared distance
   */
  distanceSquared(v: Vec2): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  /**
   * Performs linear interpolation between this vector and another.
   * @param v - The target vector
   * @param t - The interpolation factor (0-1)
   * @returns A new interpolated vector
   */
  lerp(v: Vec2, t: number): Vec2 {
    return new Vec2(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t
    );
  }

  /**
   * Calculates the angle of this vector in radians.
   * @returns The angle in radians from the positive x-axis
   */
  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  /**
   * Rotates this vector by an angle and returns a new vector.
   * @param angle - The rotation angle in radians
   * @returns A new rotated vector
   */
  rotate(angle: number): Vec2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  /**
   * Converts this vector to an array.
   * @returns An array [x, y]
   */
  toArray(): [number, number] {
    return [this.x, this.y];
  }

  /**
   * Returns a string representation of this vector.
   * @returns A string in the format "Vec2(x, y)"
   */
  toString(): string {
    return `Vec2(${this.x}, ${this.y})`;
  }
}
