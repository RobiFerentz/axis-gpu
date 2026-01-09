import { GPUContext } from '../core/GPUContext';
import { ShaderModule } from '../shaders/ShaderModule';

export interface MaterialOptions {
  vertexShader: ShaderModule;
  fragmentShader: ShaderModule;
  label?: string;
}

export abstract class Material {
  public vertexShader: ShaderModule;
  public fragmentShader: ShaderModule;
  public label?: string;
  
  protected pipeline?: GPURenderPipeline;
  protected bindGroup?: GPUBindGroup;
  protected uniformBuffer?: GPUBuffer;

  constructor(options: MaterialOptions) {
    this.vertexShader = options.vertexShader;
    this.fragmentShader = options.fragmentShader;
    this.label = options.label;
  }

  abstract createBindGroupLayout(context: GPUContext): GPUBindGroupLayout;

  abstract createPipeline(
    context: GPUContext,
    vertexBufferLayout: GPUVertexBufferLayout[],
    bindGroupLayouts: GPUBindGroupLayout[]
  ): void;

  abstract createBindGroup(context: GPUContext, bindGroupLayout: GPUBindGroupLayout): void;

  abstract updateUniforms(context: GPUContext): void;

  getPipeline(): GPURenderPipeline {
    if (!this.pipeline) {
      throw new Error('Pipeline not created. Call createPipeline() first.');
    }
    return this.pipeline;
  }

  getBindGroup(): GPUBindGroup {
    if (!this.bindGroup) {
      throw new Error('Bind group not created. Call createBindGroup() first.');
    }
    return this.bindGroup;
  }

  destroy(): void {
    this.uniformBuffer?.destroy();
    this.pipeline = undefined;
    this.bindGroup = undefined;
    this.uniformBuffer = undefined;
  }
}
