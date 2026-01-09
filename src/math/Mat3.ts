import { Vec2 } from './Vec2';

export class Mat3 {
  // Column-major order: [m00, m10, m20, m01, m11, m21, m02, m12, m22]
  public elements: Float32Array;

  constructor(elements?: number[]) {
    if (elements && elements.length === 9) {
      this.elements = new Float32Array(elements);
    } else {
      this.elements = new Float32Array([
        1, 0, 0,
        0, 1, 0,
        0, 0, 1
      ]);
    }
  }

  static identity(): Mat3 {
    return new Mat3();
  }

  static translation(x: number, y: number): Mat3 {
    return new Mat3([
      1, 0, 0,
      0, 1, 0,
      x, y, 1
    ]);
  }

  static rotation(angle: number): Mat3 {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return new Mat3([
      c, s, 0,
      -s, c, 0,
      0, 0, 1
    ]);
  }

  static scaling(x: number, y: number): Mat3 {
    return new Mat3([
      x, 0, 0,
      0, y, 0,
      0, 0, 1
    ]);
  }

  clone(): Mat3 {
    return new Mat3(Array.from(this.elements));
  }

  multiply(m: Mat3): Mat3 {
    const a = this.elements;
    const b = m.elements;
    const result = new Float32Array(9);

    result[0] = a[0] * b[0] + a[3] * b[1] + a[6] * b[2];
    result[1] = a[1] * b[0] + a[4] * b[1] + a[7] * b[2];
    result[2] = a[2] * b[0] + a[5] * b[1] + a[8] * b[2];

    result[3] = a[0] * b[3] + a[3] * b[4] + a[6] * b[5];
    result[4] = a[1] * b[3] + a[4] * b[4] + a[7] * b[5];
    result[5] = a[2] * b[3] + a[5] * b[4] + a[8] * b[5];

    result[6] = a[0] * b[6] + a[3] * b[7] + a[6] * b[8];
    result[7] = a[1] * b[6] + a[4] * b[7] + a[7] * b[8];
    result[8] = a[2] * b[6] + a[5] * b[7] + a[8] * b[8];

    return new Mat3(Array.from(result));
  }

  multiplyVec2(v: Vec2): Vec2 {
    const m = this.elements;
    const x = m[0] * v.x + m[3] * v.y + m[6];
    const y = m[1] * v.x + m[4] * v.y + m[7];
    return new Vec2(x, y);
  }

  determinant(): number {
    const m = this.elements;
    return (
      m[0] * (m[4] * m[8] - m[7] * m[5]) -
      m[3] * (m[1] * m[8] - m[7] * m[2]) +
      m[6] * (m[1] * m[5] - m[4] * m[2])
    );
  }

  invert(): Mat3 | null {
    const m = this.elements;
    const det = this.determinant();

    if (Math.abs(det) < 1e-10) {
      return null;
    }

    const invDet = 1 / det;
    const result = new Float32Array(9);

    result[0] = (m[4] * m[8] - m[7] * m[5]) * invDet;
    result[1] = (m[7] * m[2] - m[1] * m[8]) * invDet;
    result[2] = (m[1] * m[5] - m[4] * m[2]) * invDet;

    result[3] = (m[6] * m[5] - m[3] * m[8]) * invDet;
    result[4] = (m[0] * m[8] - m[6] * m[2]) * invDet;
    result[5] = (m[3] * m[2] - m[0] * m[5]) * invDet;

    result[6] = (m[3] * m[7] - m[6] * m[4]) * invDet;
    result[7] = (m[6] * m[1] - m[0] * m[7]) * invDet;
    result[8] = (m[0] * m[4] - m[3] * m[1]) * invDet;

    return new Mat3(Array.from(result));
  }

  transpose(): Mat3 {
    const m = this.elements;
    return new Mat3([
      m[0], m[3], m[6],
      m[1], m[4], m[7],
      m[2], m[5], m[8]
    ]);
  }

  toArray(): number[] {
    return Array.from(this.elements);
  }
}
