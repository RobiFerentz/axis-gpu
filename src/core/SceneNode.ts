import { Transform } from '../math/Transform';
import { Mat4 } from '../math/Mat4';
import { Camera } from '../camera/Camera';
import { Renderer } from './Renderer';

export abstract class SceneNode {
  public transform: Transform;
  public parent: SceneNode | null = null;
  public children: SceneNode[] = [];
  public visible: boolean = true;
  public name: string = '';

  constructor() {
    this.transform = Transform.identity();
  }

  add(child: SceneNode): this {
    if (!this.children.includes(child)) {
      if (child.parent) {
        child.parent.remove(child);
      }
      this.children.push(child);
      child.parent = this;
    }
    return this;
  }

  remove(child: SceneNode): this {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
    return this;
  }

  removeFromParent(): this {
    if (this.parent) {
      this.parent.remove(this);
    }
    return this;
  }

  traverse(callback: (node: SceneNode) => void): void {
    this.children.forEach(child => {
      callback(child);
      child.traverse(callback);
    });
  }

  getWorldTransform(): Transform {
    if (!this.parent) {
      return this.transform.clone();
    }
    return this.transform.combine(this.parent.getWorldTransform());
  }

  getWorldMatrix(): Mat4 {
    return this.getWorldTransform().toMat4();
  }

  // Called every frame before rendering
  updateNode(deltaTime: number): void {
    this.update(deltaTime);
    
    this.children.forEach(child => {
      if (child.visible) {
        child.updateNode(deltaTime);
      }
    });
  }

  // Override this in subclasses for custom update logic
  update(_deltaTime: number): void {
    // Default: no-op
  }

  // Called during rendering
  renderNode(passEncoder: GPURenderPassEncoder, camera: Camera, renderer: Renderer): void {
    this.render(passEncoder, camera, renderer);
    
    this.children.forEach(child => {
      if (child.visible) {
        child.renderNode(passEncoder, camera, renderer);
      }
    });
  }

  // Override this in subclasses to implement rendering
  abstract render(passEncoder: GPURenderPassEncoder, camera: Camera, renderer: Renderer): void;

  // Convenience accessors for transform properties
  get position() {
    return this.transform.position;
  }

  get rotation() {
    return this.transform.rotation;
  }

  get scale() {
    return this.transform.scale;
  }
}
