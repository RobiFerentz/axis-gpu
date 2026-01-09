import { Vec3 } from './Vec3';
import { Quaternion } from './Quaternion';
import { Mat4 } from './Mat4';

export class Transform {
  public position: Vec3;
  public rotation: Quaternion;
  public scale: Vec3;

  constructor(
    position: Vec3 = new Vec3(0, 0, 0),
    rotation: Quaternion = Quaternion.identity(),
    scale: Vec3 = new Vec3(1, 1, 1)
  ) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  static identity(): Transform {
    return new Transform();
  }

  clone(): Transform {
    return new Transform(
      this.position.clone(),
      this.rotation.clone(),
      this.scale.clone()
    );
  }

  setPosition(x: number, y: number, z: number): this {
    this.position.set(x, y, z);
    return this;
  }

  setRotation(x: number, y: number, z: number, w: number): this {
    this.rotation.set(x, y, z, w);
    return this;
  }

  setRotationFromEuler(x: number, y: number, z: number): this {
    this.rotation = Quaternion.fromEuler(x, y, z);
    return this;
  }

  setScale(x: number, y: number, z: number): this {
    this.scale.set(x, y, z);
    return this;
  }

  translate(x: number, y: number, z: number): this {
    this.position.x += x;
    this.position.y += y;
    this.position.z += z;
    return this;
  }

  rotate(axis: Vec3, angle: number): this {
    const q = Quaternion.fromAxisAngle(axis, angle);
    this.rotation = this.rotation.multiply(q);
    return this;
  }

  rotateX(angle: number): this {
    return this.rotate(Vec3.right(), angle);
  }

  rotateY(angle: number): this {
    return this.rotate(Vec3.up(), angle);
  }

  rotateZ(angle: number): this {
    return this.rotate(Vec3.forward(), angle);
  }

  toMat4(): Mat4 {
    const t = Mat4.translation(this.position.x, this.position.y, this.position.z);
    const r = this.rotation.toMat4();
    const s = Mat4.scaling(this.scale.x, this.scale.y, this.scale.z);
    
    // TRS order: Translation * Rotation * Scale
    return t.multiply(r).multiply(s);
  }

  combine(parent: Transform): Transform {
    // Combine this transform with a parent transform
    const newPosition = parent.rotation.toMat4()
      .multiplyVec3(this.position.multiply(parent.scale.x)) // Simplified uniform scale
      .add(parent.position);
    
    const newRotation = parent.rotation.multiply(this.rotation);
    
    const newScale = new Vec3(
      parent.scale.x * this.scale.x,
      parent.scale.y * this.scale.y,
      parent.scale.z * this.scale.z
    );

    return new Transform(newPosition, newRotation, newScale);
  }

  lookAt(target: Vec3, up: Vec3 = Vec3.up()): this {
    const direction = target.subtract(this.position).normalize();
    const right = up.cross(direction).normalize();
    const realUp = direction.cross(right);

    // Create rotation matrix from basis vectors
    const m = new Mat4([
      right.x, right.y, right.z, 0,
      realUp.x, realUp.y, realUp.z, 0,
      direction.x, direction.y, direction.z, 0,
      0, 0, 0, 1
    ]);

    // Convert to quaternion (simplified)
    const trace = m.elements[0] + m.elements[5] + m.elements[10];
    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1.0);
      this.rotation.w = 0.25 / s;
      this.rotation.x = (m.elements[6] - m.elements[9]) * s;
      this.rotation.y = (m.elements[8] - m.elements[2]) * s;
      this.rotation.z = (m.elements[1] - m.elements[4]) * s;
    } else {
      if (m.elements[0] > m.elements[5] && m.elements[0] > m.elements[10]) {
        const s = 2.0 * Math.sqrt(1.0 + m.elements[0] - m.elements[5] - m.elements[10]);
        this.rotation.w = (m.elements[6] - m.elements[9]) / s;
        this.rotation.x = 0.25 * s;
        this.rotation.y = (m.elements[4] + m.elements[1]) / s;
        this.rotation.z = (m.elements[8] + m.elements[2]) / s;
      } else if (m.elements[5] > m.elements[10]) {
        const s = 2.0 * Math.sqrt(1.0 + m.elements[5] - m.elements[0] - m.elements[10]);
        this.rotation.w = (m.elements[8] - m.elements[2]) / s;
        this.rotation.x = (m.elements[4] + m.elements[1]) / s;
        this.rotation.y = 0.25 * s;
        this.rotation.z = (m.elements[9] + m.elements[6]) / s;
      } else {
        const s = 2.0 * Math.sqrt(1.0 + m.elements[10] - m.elements[0] - m.elements[5]);
        this.rotation.w = (m.elements[1] - m.elements[4]) / s;
        this.rotation.x = (m.elements[8] + m.elements[2]) / s;
        this.rotation.y = (m.elements[9] + m.elements[6]) / s;
        this.rotation.z = 0.25 * s;
      }
    }

    return this;
  }
}
