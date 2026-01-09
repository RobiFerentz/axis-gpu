import { Camera } from './Camera';
import { Mat4 } from '../math/Mat4';
import { Vec3 } from '../math/Vec3';

export class Camera2D extends Camera {
  public zoom: number = 1;
  public left: number;
  public right: number;
  public bottom: number;
  public top: number;
  public near: number = -1000;
  public far: number = 1000;

  constructor(width: number = 800, height: number = 600) {
    super();
    this.left = -width / 2;
    this.right = width / 2;
    this.bottom = -height / 2;
    this.top = height / 2;
    this.updateProjectionMatrix();
  }

  setSize(width: number, height: number): void {
    this.left = -width / 2;
    this.right = width / 2;
    this.bottom = -height / 2;
    this.top = height / 2;
    this.updateProjectionMatrix();
  }

  setViewport(left: number, right: number, bottom: number, top: number): void {
    this.left = left;
    this.right = right;
    this.bottom = bottom;
    this.top = top;
    this.updateProjectionMatrix();
  }

  updateProjectionMatrix(): void {
    const zoom = this.zoom;
    this.projectionMatrix = Mat4.orthographic(
      this.left / zoom,
      this.right / zoom,
      this.bottom / zoom,
      this.top / zoom,
      this.near,
      this.far
    );
  }

  updateViewMatrix(): void {
    // Simple translation for 2D camera
    this.viewMatrix = Mat4.translation(-this.position.x, -this.position.y, -this.position.z);
  }

  screenToWorld(screenX: number, screenY: number, canvasWidth: number, canvasHeight: number): Vec3 {
    // Convert screen coordinates to normalized device coordinates (-1 to 1)
    const ndcX = (screenX / canvasWidth) * 2 - 1;
    const ndcY = 1 - (screenY / canvasHeight) * 2; // Flip Y axis

    // Convert NDC to world space
    const worldX = ndcX * (this.right / this.zoom) + this.position.x;
    const worldY = ndcY * (this.top / this.zoom) + this.position.y;

    return new Vec3(worldX, worldY, 0);
  }
}
