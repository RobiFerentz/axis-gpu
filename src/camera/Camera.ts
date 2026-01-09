import { Mat4 } from '../math/Mat4';
import { Vec3 } from '../math/Vec3';

export abstract class Camera {
  public viewMatrix: Mat4;
  public projectionMatrix: Mat4;
  public viewProjectionMatrix: Mat4;
  public position: Vec3;

  constructor() {
    this.viewMatrix = Mat4.identity();
    this.projectionMatrix = Mat4.identity();
    this.viewProjectionMatrix = Mat4.identity();
    this.position = new Vec3(0, 0, 0);
  }

  abstract updateProjectionMatrix(): void;

  updateViewMatrix(): void {
    // Override in subclasses if needed
  }

  updateMatrices(): void {
    this.updateProjectionMatrix();
    this.updateViewMatrix();
    this.viewProjectionMatrix = this.projectionMatrix.multiply(this.viewMatrix);
  }

  getViewProjectionMatrix(): Mat4 {
    return this.viewProjectionMatrix;
  }
}
