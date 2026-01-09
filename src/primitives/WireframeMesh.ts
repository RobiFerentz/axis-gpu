import { SceneNode } from '../core/SceneNode';
import { WireframeGeometry } from './WireframeGeometry';
import { WireframeMaterial } from '../materials/WireframeMaterial';
import { Camera } from '../camera/Camera';
import { Renderer } from '../core/Renderer';
import { GPUContext } from '../core/GPUContext';
import { UniformBuffer } from '../materials/UniformBuffer';

export class WireframeMesh extends SceneNode {
  public geometry: WireframeGeometry;
  public material: WireframeMaterial;
  
  private sceneUniformBuffer?: UniformBuffer;
  private sceneBindGroup?: GPUBindGroup;
  private initialized: boolean = false;

  constructor(geometry: WireframeGeometry, material: WireframeMaterial) {
    super();
    this.geometry = geometry;
    this.material = material;
  }

  private initialize(context: GPUContext): void {
    if (this.initialized) return;

    // Create geometry buffers
    this.geometry.createBuffers(context);

    // Create uniform buffer for scene data
    this.sceneUniformBuffer = new UniformBuffer(128, 'Scene Uniforms');
    this.sceneUniformBuffer.create(context);

    // Create bind group layout for scene uniforms
    const sceneBindGroupLayout = context.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: 'uniform' },
        },
      ],
      label: 'Wireframe Scene Bind Group Layout',
    });

    // Empty bind group layout for material (wireframe doesn't need material uniforms)
    const materialBindGroupLayout = context.createBindGroupLayout({
      entries: [],
      label: 'Wireframe Material Bind Group Layout',
    });

    // Create pipeline
    this.material.createPipeline(
      context,
      [WireframeGeometry.getVertexBufferLayout()],
      [sceneBindGroupLayout, materialBindGroupLayout]
    );

    // Create material bind group
    this.material.createBindGroup(context, materialBindGroupLayout);

    // Create scene bind group
    this.sceneBindGroup = context.createBindGroup({
      layout: sceneBindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: { buffer: this.sceneUniformBuffer.getBuffer() },
        },
      ],
      label: 'Wireframe Scene Bind Group',
    });

    this.initialized = true;
  }

  render(passEncoder: GPURenderPassEncoder, camera: Camera, renderer: Renderer): void {
    const context = renderer.context;

    // Initialize if needed
    if (!this.initialized) {
      this.initialize(context);
    }

    // Update uniforms
    const modelMatrix = this.getWorldMatrix();
    const viewProjectionMatrix = camera.getViewProjectionMatrix();
    
    const uniformData = new Float32Array([
      ...modelMatrix.toArray(),
      ...viewProjectionMatrix.toArray(),
    ]);
    
    this.sceneUniformBuffer!.update(context, uniformData);

    // Set pipeline and bind groups
    passEncoder.setPipeline(this.material.getPipeline());
    passEncoder.setBindGroup(0, this.sceneBindGroup!);
    passEncoder.setBindGroup(1, this.material.getBindGroup());

    // Set vertex and index buffers
    passEncoder.setVertexBuffer(0, this.geometry.getVertexBuffer());
    passEncoder.setIndexBuffer(this.geometry.getIndexBuffer(), 'uint16');

    // Draw
    passEncoder.drawIndexed(this.geometry.getIndexCount());
  }

  destroy(): void {
    this.geometry.destroy();
    this.material.destroy();
    this.sceneUniformBuffer?.destroy();
  }
}
