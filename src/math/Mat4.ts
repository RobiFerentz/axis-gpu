import { Vec3 } from './Vec3';
import { Vec4 } from './Vec4';

export class Mat4 {
  // Column-major order for WebGPU compatibility
  public elements: Float32Array;

  constructor(elements?: number[]) {
    if (elements && elements.length === 16) {
      this.elements = new Float32Array(elements);
    } else {
      this.elements = new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ]);
    }
  }

  static identity(): Mat4 {
    return new Mat4();
  }

  static translation(x: number, y: number, z: number): Mat4 {
    return new Mat4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      x, y, z, 1
    ]);
  }

  static rotationX(angle: number): Mat4 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Mat4([
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1
    ]);
  }

  static rotationY(angle: number): Mat4 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Mat4([
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1
    ]);
  }

  static rotationZ(angle: number): Mat4 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Mat4([
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  static scaling(x: number, y: number, z: number): Mat4 {
    return new Mat4([
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1
    ]);
  }

  static perspective(fov: number, aspect: number, near: number, far: number): Mat4 {
    const f = 1.0 / Math.tan(fov / 2);
    const rangeInv = 1.0 / (near - far);

    return new Mat4([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ]);
  }

  static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Mat4 {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);

    return new Mat4([
      -2 * lr, 0, 0, 0,
      0, -2 * bt, 0, 0,
      0, 0, 2 * nf, 0,
      (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1
    ]);
  }

  static lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
    const z = eye.subtract(target).normalize();
    const x = up.cross(z).normalize();
    const y = z.cross(x);

    return new Mat4([
      x.x, y.x, z.x, 0,
      x.y, y.y, z.y, 0,
      x.z, y.z, z.z, 0,
      -x.dot(eye), -y.dot(eye), -z.dot(eye), 1
    ]);
  }

  clone(): Mat4 {
    return new Mat4(Array.from(this.elements));
  }

  multiply(m: Mat4): Mat4 {
    const a = this.elements;
    const b = m.elements;
    const result = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i * 4 + j] =
          a[j] * b[i * 4] +
          a[j + 4] * b[i * 4 + 1] +
          a[j + 8] * b[i * 4 + 2] +
          a[j + 12] * b[i * 4 + 3];
      }
    }

    return new Mat4(Array.from(result));
  }

  multiplyVec3(v: Vec3, w: number = 1): Vec3 {
    const m = this.elements;
    const x = m[0] * v.x + m[4] * v.y + m[8] * v.z + m[12] * w;
    const y = m[1] * v.x + m[5] * v.y + m[9] * v.z + m[13] * w;
    const z = m[2] * v.x + m[6] * v.y + m[10] * v.z + m[14] * w;
    return new Vec3(x, y, z);
  }

  multiplyVec4(v: Vec4): Vec4 {
    const m = this.elements;
    const x = m[0] * v.x + m[4] * v.y + m[8] * v.z + m[12] * v.w;
    const y = m[1] * v.x + m[5] * v.y + m[9] * v.z + m[13] * v.w;
    const z = m[2] * v.x + m[6] * v.y + m[10] * v.z + m[14] * v.w;
    const w = m[3] * v.x + m[7] * v.y + m[11] * v.z + m[15] * v.w;
    return new Vec4(x, y, z, w);
  }

  determinant(): number {
    const m = this.elements;
    
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }

  invert(): Mat4 | null {
    const m = this.elements;
    const a00 = m[0], a01 = m[1], a02 = m[2], a03 = m[3];
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    const a30 = m[12], a31 = m[13], a32 = m[14], a33 = m[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    const det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (Math.abs(det) < 1e-10) {
      return null;
    }

    const invDet = 1.0 / det;

    const result = new Float32Array(16);
    result[0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;
    result[1] = (a02 * b10 - a01 * b11 - a03 * b09) * invDet;
    result[2] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;
    result[3] = (a22 * b04 - a21 * b05 - a23 * b03) * invDet;
    result[4] = (a12 * b08 - a10 * b11 - a13 * b07) * invDet;
    result[5] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;
    result[6] = (a32 * b02 - a30 * b05 - a33 * b01) * invDet;
    result[7] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;
    result[8] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;
    result[9] = (a01 * b08 - a00 * b10 - a03 * b06) * invDet;
    result[10] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;
    result[11] = (a21 * b02 - a20 * b04 - a23 * b00) * invDet;
    result[12] = (a11 * b07 - a10 * b09 - a12 * b06) * invDet;
    result[13] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;
    result[14] = (a31 * b01 - a30 * b03 - a32 * b00) * invDet;
    result[15] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;

    return new Mat4(Array.from(result));
  }

  transpose(): Mat4 {
    const m = this.elements;
    return new Mat4([
      m[0], m[4], m[8], m[12],
      m[1], m[5], m[9], m[13],
      m[2], m[6], m[10], m[14],
      m[3], m[7], m[11], m[15]
    ]);
  }

  toArray(): number[] {
    return Array.from(this.elements);
  }
}
