import { Material } from './Material';
import { GPUContext } from '../core/GPUContext';
import { ShaderLibrary } from '../shaders/ShaderLibrary';
import { UniformBuffer } from './UniformBuffer';
import { Vec4 } from '../math/Vec4';

export interface BasicMaterialOptions {
  color?: Vec4;
  label?: string;
}

export class BasicMaterial extends Material {
  public color: Vec4;
  private materialBuffer: UniformBuffer;

  constructor(options: BasicMaterialOptions = {}) {
    const vertexShader = ShaderLibrary.get('basic_vertex')!;
    const fragmentShader = ShaderLibrary.get('basic_fragment')!;
    
    super({ vertexShader, fragmentShader, label: options.label ?? 'Basic Material' });
    
    this.color = options.color ?? new Vec4(1, 1, 1, 1);
    this.materialBuffer = new UniformBuffer(16, 'Material Uniforms'); // vec4 = 16 bytes
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
      label: 'Basic Material Bind Group Layout',
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
      this.color.x,
      this.color.y,
      this.color.z,
      this.color.w,
    ]);
    this.materialBuffer.update(context, data);
  }

  setColor(r: number, g: number, b: number, a: number = 1): void {
    this.color.set(r, g, b, a);
  }

  destroy(): void {
    super.destroy();
    this.materialBuffer.destroy();
  }
}
