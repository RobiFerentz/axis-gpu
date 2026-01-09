import { Material } from './Material';
import { GPUContext } from '../core/GPUContext';
import { ShaderModule } from '../shaders/ShaderModule';
import { gradientVertexShader, gradientFragmentShader } from '../shaders/GradientShader';
import { UniformBuffer } from './UniformBuffer';

export interface GradientMaterialOptions {
  intensity?: number;
  label?: string;
}

export class GradientMaterial extends Material {
  public intensity: number;
  private materialBuffer: UniformBuffer;

  constructor(options: GradientMaterialOptions = {}) {
    const vertexShader = ShaderModule.fromWGSL(gradientVertexShader, 'Gradient Vertex');
    const fragmentShader = ShaderModule.fromWGSL(gradientFragmentShader, 'Gradient Fragment');
    
    super({ vertexShader, fragmentShader, label: options.label ?? 'Gradient Material' });
    
    this.intensity = options.intensity ?? 1.0;
    this.materialBuffer = new UniformBuffer(32, 'Gradient Material Uniforms'); // Minimum 32 bytes for WebGPU
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
      label: 'Gradient Material Bind Group Layout',
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
      this.intensity,
      0, 0, 0, // padding to vec4
      0, 0, 0, 0, // extra padding to reach 32 bytes minimum
    ]);
    this.materialBuffer.update(context, data);
  }

  setIntensity(intensity: number): void {
    this.intensity = intensity;
  }

  destroy(): void {
    super.destroy();
    this.materialBuffer.destroy();
  }
}
