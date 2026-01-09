export class Vec4 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
    public w: number = 0
  ) {}

  static zero(): Vec4 {
    return new Vec4(0, 0, 0, 0);
  }

  static one(): Vec4 {
    return new Vec4(1, 1, 1, 1);
  }

  clone(): Vec4 {
    return new Vec4(this.x, this.y, this.z, this.w);
  }

  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  add(v: Vec4): Vec4 {
    return new Vec4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
  }

  addSelf(v: Vec4): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    this.w += v.w;
    return this;
  }

  subtract(v: Vec4): Vec4 {
    return new Vec4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
  }

  subtractSelf(v: Vec4): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    this.w -= v.w;
    return this;
  }

  multiply(scalar: number): Vec4 {
    return new Vec4(this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar);
  }

  multiplySelf(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    this.w *= scalar;
    return this;
  }

  divide(scalar: number): Vec4 {
    return new Vec4(this.x / scalar, this.y / scalar, this.z / scalar, this.w / scalar);
  }

  divideSelf(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    this.z /= scalar;
    this.w /= scalar;
    return this;
  }

  dot(v: Vec4): number {
    return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }

  normalize(): Vec4 {
    const len = this.length();
    if (len === 0) return new Vec4(0, 0, 0, 0);
    return new Vec4(this.x / len, this.y / len, this.z / len, this.w / len);
  }

  normalizeSelf(): this {
    const len = this.length();
    if (len !== 0) {
      this.x /= len;
      this.y /= len;
      this.z /= len;
      this.w /= len;
    }
    return this;
  }

  lerp(v: Vec4, t: number): Vec4 {
    return new Vec4(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t,
      this.z + (v.z - this.z) * t,
      this.w + (v.w - this.w) * t
    );
  }

  toArray(): [number, number, number, number] {
    return [this.x, this.y, this.z, this.w];
  }

  toString(): string {
    return `Vec4(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  }
}
