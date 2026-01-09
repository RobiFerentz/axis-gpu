import { Camera } from './Camera';
import { Mat4 } from '../math/Mat4';
import { Vec3 } from '../math/Vec3';
import { Quaternion } from '../math/Quaternion';

export class Camera3D extends Camera {
  public fov: number = Math.PI / 4; // 45 degrees
  public aspect: number = 16 / 9;
  public near: number = 0.1;
  public far: number = 1000;
  public rotation: Quaternion;
  public target?: Vec3;
  public up: Vec3;

  constructor(fov: number = Math.PI / 4, aspect: number = 16 / 9, near: number = 0.1, far: number = 1000) {
    super();
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.rotation = Quaternion.identity();
    this.up = Vec3.up();
    this.updateProjectionMatrix();
  }

  setAspect(width: number, height: number): void {
    this.aspect = width / height;
    this.updateProjectionMatrix();
  }

  setPerspective(fov: number, aspect: number, near: number, far: number): void {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.updateProjectionMatrix();
  }

  updateProjectionMatrix(): void {
    this.projectionMatrix = Mat4.perspective(this.fov, this.aspect, this.near, this.far);
  }

  updateViewMatrix(): void {
    if (this.target) {
      // LookAt mode
      this.viewMatrix = Mat4.lookAt(this.position, this.target, this.up);
    } else {
      // Free camera mode using rotation quaternion
      const rotationMatrix = this.rotation.toMat4();
      const translationMatrix = Mat4.translation(-this.position.x, -this.position.y, -this.position.z);
      this.viewMatrix = rotationMatrix.multiply(translationMatrix);
    }
  }

  lookAt(target: Vec3, up: Vec3 = Vec3.up()): void {
    this.target = target;
    this.up = up;
    this.updateViewMatrix();
  }

  clearTarget(): void {
    this.target = undefined;
  }

  getForward(): Vec3 {
    if (this.target) {
      return this.target.subtract(this.position).normalize();
    }
    return this.rotation.toMat4().multiplyVec3(Vec3.forward());
  }

  getRight(): Vec3 {
    return this.rotation.toMat4().multiplyVec3(Vec3.right());
  }

  getUp(): Vec3 {
    return this.rotation.toMat4().multiplyVec3(Vec3.up());
  }

  // Camera movement helpers
  moveForward(distance: number): void {
    const forward = this.getForward();
    this.position.addSelf(forward.multiply(distance));
  }

  moveRight(distance: number): void {
    const right = this.getRight();
    this.position.addSelf(right.multiply(distance));
  }

  moveUp(distance: number): void {
    const up = this.getUp();
    this.position.addSelf(up.multiply(distance));
  }

  rotateX(angle: number): void {
    const q = Quaternion.fromAxisAngle(Vec3.right(), angle);
    this.rotation = this.rotation.multiply(q).normalize();
  }

  rotateY(angle: number): void {
    const q = Quaternion.fromAxisAngle(Vec3.up(), angle);
    this.rotation = q.multiply(this.rotation).normalize(); // Global Y rotation
  }

  rotateZ(angle: number): void {
    const q = Quaternion.fromAxisAngle(Vec3.forward(), angle);
    this.rotation = this.rotation.multiply(q).normalize();
  }
}
