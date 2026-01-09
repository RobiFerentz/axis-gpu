import { Material } from './Material';
import { GPUContext } from '../core/GPUContext';
import { ShaderLibrary } from '../shaders/ShaderLibrary';
import { UniformBuffer } from './UniformBuffer';
import { Texture } from '../textures/Texture';
import { Vec4 } from '../math/Vec4';

export interface TexturedMaterialOptions {
  texture: Texture;
  color?: Vec4;
  label?: string;
}

export class TexturedMaterial extends Material {
  public texture: Texture;
  public color: Vec4;
  private materialBuffer: UniformBuffer;
  private sampler?: GPUSampler;

  constructor(options: TexturedMaterialOptions) {
    const vertexShader = ShaderLibrary.get('textured_vertex')!;
    const fragmentShader = ShaderLibrary.get('textured_fragment')!;
    
    super({ vertexShader, fragmentShader, label: options.label ?? 'Textured Material' });
    
    this.texture = options.texture;
    this.color = options.color ?? new Vec4(1, 1, 1, 1);
    this.materialBuffer = new UniformBuffer(16, 'Material Uniforms');
  }

  createBindGroupLayout(context: GPUContext): GPUBindGroupLayout {
    return context.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: { type: 'uniform' },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: { type: 'filtering' },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: 'float' },
        },
      ],
      label: 'Textured Material Bind Group Layout',
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

    // Create sampler
    this.sampler = context.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
      mipmapFilter: 'linear',
      addressModeU: 'repeat',
      addressModeV: 'repeat',
    });

    this.bindGroup = context.createBindGroup({
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: { buffer: this.materialBuffer.getBuffer() },
        },
        {
          binding: 1,
          resource: this.sampler,
        },
        {
          binding: 2,
          resource: this.texture.getTextureView(),
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
