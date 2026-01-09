import { SceneNode } from './SceneNode';
import { Camera } from '../camera/Camera';
import { Renderer } from './Renderer';

export class Scene {
  public children: SceneNode[] = [];
  public background?: [number, number, number, number];

  add(node: SceneNode): this {
    if (!this.children.includes(node)) {
      this.children.push(node);
      node.parent = null; // Scene is the root
    }
    return this;
  }

  remove(node: SceneNode): this {
    const index = this.children.indexOf(node);
    if (index !== -1) {
      this.children.splice(index, 1);
      node.parent = null;
    }
    return this;
  }

  clear(): this {
    this.children.forEach(child => {
      child.parent = null;
    });
    this.children = [];
    return this;
  }

  traverse(callback: (node: SceneNode) => void): void {
    this.children.forEach(child => {
      callback(child);
      child.traverse(callback);
    });
  }

  render(passEncoder: GPURenderPassEncoder, camera: Camera, renderer: Renderer): void {
    this.children.forEach(child => {
      if (child.visible) {
        child.renderNode(passEncoder, camera, renderer);
      }
    });
  }

  update(deltaTime: number): void {
    this.children.forEach(child => {
      child.updateNode(deltaTime);
    });
  }
}
