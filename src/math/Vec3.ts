export class Vec3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  static zero(): Vec3 {
    return new Vec3(0, 0, 0);
  }

  static one(): Vec3 {
    return new Vec3(1, 1, 1);
  }

  static up(): Vec3 {
    return new Vec3(0, 1, 0);
  }

  static down(): Vec3 {
    return new Vec3(0, -1, 0);
  }

  static left(): Vec3 {
    return new Vec3(-1, 0, 0);
  }

  static right(): Vec3 {
    return new Vec3(1, 0, 0);
  }

  static forward(): Vec3 {
    return new Vec3(0, 0, 1);
  }

  static back(): Vec3 {
    return new Vec3(0, 0, -1);
  }

  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  add(v: Vec3): Vec3 {
    return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  addSelf(v: Vec3): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  subtract(v: Vec3): Vec3 {
    return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  subtractSelf(v: Vec3): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  multiply(scalar: number): Vec3 {
    return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  multiplySelf(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  }

  divide(scalar: number): Vec3 {
    return new Vec3(this.x / scalar, this.y / scalar, this.z / scalar);
  }

  divideSelf(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    return this;
  }

  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vec3): Vec3 {
    return new Vec3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  normalize(): Vec3 {
    const len = this.length();
    if (len === 0) return new Vec3(0, 0, 0);
    return new Vec3(this.x / len, this.y / len, this.z / len);
  }

  normalizeSelf(): this {
    const len = this.length();
    if (len !== 0) {
      this.x /= len;
      this.y /= len;
      this.z /= len;
    }
    return this;
  }

  distance(v: Vec3): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  distanceSquared(v: Vec3): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    const dz = this.z - v.z;
    return dx * dx + dy * dy + dz * dz;
  }

  lerp(v: Vec3, t: number): Vec3 {
    return new Vec3(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t,
      this.z + (v.z - this.z) * t
    );
  }

  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  toString(): string {
    return `Vec3(${this.x}, ${this.y}, ${this.z})`;
  }
}
