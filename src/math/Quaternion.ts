import { Vec3 } from './Vec3';
import { Mat4 } from './Mat4';

export class Quaternion {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
    public w: number = 1
  ) {}

  static identity(): Quaternion {
    return new Quaternion(0, 0, 0, 1);
  }

  static fromAxisAngle(axis: Vec3, angle: number): Quaternion {
    const halfAngle = angle / 2;
    const s = Math.sin(halfAngle);
    const normalizedAxis = axis.normalize();
    
    return new Quaternion(
      normalizedAxis.x * s,
      normalizedAxis.y * s,
      normalizedAxis.z * s,
      Math.cos(halfAngle)
    );
  }

  static fromEuler(x: number, y: number, z: number): Quaternion {
    const cx = Math.cos(x / 2);
    const cy = Math.cos(y / 2);
    const cz = Math.cos(z / 2);
    const sx = Math.sin(x / 2);
    const sy = Math.sin(y / 2);
    const sz = Math.sin(z / 2);

    return new Quaternion(
      sx * cy * cz + cx * sy * sz,
      cx * sy * cz - sx * cy * sz,
      cx * cy * sz + sx * sy * cz,
      cx * cy * cz - sx * sy * sz
    );
  }

  clone(): Quaternion {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  set(x: number, y: number, z: number, w: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  multiply(q: Quaternion): Quaternion {
    const ax = this.x, ay = this.y, az = this.z, aw = this.w;
    const bx = q.x, by = q.y, bz = q.z, bw = q.w;

    return new Quaternion(
      ax * bw + aw * bx + ay * bz - az * by,
      ay * bw + aw * by + az * bx - ax * bz,
      az * bw + aw * bz + ax * by - ay * bx,
      aw * bw - ax * bx - ay * by - az * bz
    );
  }

  conjugate(): Quaternion {
    return new Quaternion(-this.x, -this.y, -this.z, this.w);
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  normalize(): Quaternion {
    const len = this.length();
    if (len === 0) {
      return new Quaternion(0, 0, 0, 1);
    }
    return new Quaternion(
      this.x / len,
      this.y / len,
      this.z / len,
      this.w / len
    );
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

  dot(q: Quaternion): number {
    return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
  }

  slerp(q: Quaternion, t: number): Quaternion {
    let dot = this.dot(q);
    
    // If the dot product is negative, slerp won't take the shorter path
    let q2 = q.clone();
    if (dot < 0) {
      q2.x = -q2.x;
      q2.y = -q2.y;
      q2.z = -q2.z;
      q2.w = -q2.w;
      dot = -dot;
    }

    // If quaternions are very close, use linear interpolation
    if (dot > 0.9995) {
      return new Quaternion(
        this.x + t * (q2.x - this.x),
        this.y + t * (q2.y - this.y),
        this.z + t * (q2.z - this.z),
        this.w + t * (q2.w - this.w)
      ).normalize();
    }

    const theta0 = Math.acos(dot);
    const theta = theta0 * t;
    const sinTheta = Math.sin(theta);
    const sinTheta0 = Math.sin(theta0);

    const s0 = Math.cos(theta) - dot * sinTheta / sinTheta0;
    const s1 = sinTheta / sinTheta0;

    return new Quaternion(
      this.x * s0 + q2.x * s1,
      this.y * s0 + q2.y * s1,
      this.z * s0 + q2.z * s1,
      this.w * s0 + q2.w * s1
    );
  }

  toMat4(): Mat4 {
    const x = this.x, y = this.y, z = this.z, w = this.w;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    return new Mat4([
      1 - (yy + zz), xy + wz, xz - wy, 0,
      xy - wz, 1 - (xx + zz), yz + wx, 0,
      xz + wy, yz - wx, 1 - (xx + yy), 0,
      0, 0, 0, 1
    ]);
  }

  toEuler(): Vec3 {
    const x = this.x, y = this.y, z = this.z, w = this.w;
    
    // Roll (x-axis rotation)
    const sinr_cosp = 2 * (w * x + y * z);
    const cosr_cosp = 1 - 2 * (x * x + y * y);
    const roll = Math.atan2(sinr_cosp, cosr_cosp);

    // Pitch (y-axis rotation)
    const sinp = 2 * (w * y - z * x);
    const pitch = Math.abs(sinp) >= 1 ? Math.sign(sinp) * Math.PI / 2 : Math.asin(sinp);

    // Yaw (z-axis rotation)
    const siny_cosp = 2 * (w * z + x * y);
    const cosy_cosp = 1 - 2 * (y * y + z * z);
    const yaw = Math.atan2(siny_cosp, cosy_cosp);

    return new Vec3(roll, pitch, yaw);
  }

  toArray(): [number, number, number, number] {
    return [this.x, this.y, this.z, this.w];
  }

  toString(): string {
    return `Quaternion(${this.x}, ${this.y}, ${this.z}, ${this.w})`;
  }
}
