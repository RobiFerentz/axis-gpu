import { Material } from './Material';
import { GPUContext } from '../core/GPUContext';
import { ShaderModule } from '../shaders/ShaderModule';
import { vertexColorVertexShader, vertexColorFragmentShader } from '../shaders/VertexColorShader';
import { UniformBuffer } from './UniformBuffer';

export interface VertexColorMaterialOptions {
  opacity?: number;
  label?: string;
}

export class VertexColorMaterial extends Material {
  public opacity: number;
  private materialBuffer: UniformBuffer;

  constructor(options: VertexColorMaterialOptions = {}) {
    const vertexShader = ShaderModule.fromWGSL(vertexColorVertexShader, 'Vertex Color Vertex');
    const fragmentShader = ShaderModule.fromWGSL(vertexColorFragmentShader, 'Vertex Color Fragment');
    
    super({ vertexShader, fragmentShader, label: options.label ?? 'Vertex Color Material' });
    
    this.opacity = options.opacity ?? 1.0;
    this.materialBuffer = new UniformBuffer(32, 'Vertex Color Material Uniforms');
  }

  createBindGroupLayout(context: GPUContext): GPUBindGroupLayout {
    return context.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: { type: 'uniform' },
        },
      ],
      label: 'Vertex Color Material Bind Group Layout',
    });
  }

  createPipeline(
    context: GPUContext,
    vertexBufferLayout: GPUVertexBufferLayout[],
    bindGroupLayouts: GPUBindGroupLayout[]
  ): void {
    const vertexModule = this.vertexShader.getGPUShaderModule(context);
    const fragmentModule = this.fragmentShader.getGPUShaderModule(context);

    this.pipeline = context.createRenderPipeline({
      layout: context.createPipelineLayout({
        bindGroupLayouts: bindGroupLayouts,
      }),
      vertex: {
        module: vertexModule,
        entryPoint: 'main',
        buffers: vertexBufferLayout,
      },
      fragment: {
        module: fragmentModule,
        entryPoint: 'main',
        targets: [{ format: context.format }],
      },
      primitive: {
        topology: 'triangle-list',
        cullMode: 'back',
      },
      depthStencil: {
        format: 'depth24plus',
        depthWriteEnabled: true,
        depthCompare: 'less',
      },
      label: this.label,
    });
  }

  createBindGroup(context: GPUContext, bindGroupLayout: GPUBindGroupLayout): void {
    this.materialBuffer.create(context);
    this.updateUniforms(context);

    this.bindGroup = context.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: { buffer: this.materialBuffer.getBuffer() },
        },
      ],
      label: `${this.label} Bind Group`,
    });
  }

  updateUniforms(context: GPUContext): void {
    const data = new Float32Array([
      this.opacity,
      0, 0, 0, // padding
      0, 0, 0, 0, // extra padding
    ]);
    this.materialBuffer.update(context, data);
  }

  destroy(): void {
    super.destroy();
    this.materialBuffer.destroy();
  }
}
