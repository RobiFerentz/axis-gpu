import { Material } from './Material';
import { GPUContext } from '../core/GPUContext';
import { ShaderModule } from '../shaders/ShaderModule';
import { wireframeVertexShader, wireframeFragmentShader } from '../shaders/WireframeShader';

export interface WireframeMaterialOptions {
  lineWidth?: number;
  label?: string;
}

export class WireframeMaterial extends Material {
  public lineWidth: number;

  constructor(options: WireframeMaterialOptions = {}) {
    const vertexShader = ShaderModule.fromWGSL(wireframeVertexShader, 'Wireframe Vertex');
    const fragmentShader = ShaderModule.fromWGSL(wireframeFragmentShader, 'Wireframe Fragment');
    
    super({ vertexShader, fragmentShader, label: options.label ?? 'Wireframe Material' });
    
    this.lineWidth = options.lineWidth ?? 1.0;
  }

  createBindGroupLayout(context: GPUContext): GPUBindGroupLayout {
    return context.createBindGroupLayout({
      entries: [],
      label: 'Wireframe Material Bind Group Layout',
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
        topology: 'line-list',
        cullMode: 'none',
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
    // Wireframe material doesn't need uniforms, but we need an empty bind group
    // Create a dummy uniform buffer to satisfy the bind group layout
    this.uniformBuffer = context.createBuffer({
      size: 16,
      usage: GPUBufferUsage.UNIFORM,
      label: 'Wireframe Dummy Uniform',
    });

    this.bindGroup = context.createBindGroup({
      layout: bindGroupLayout,
      entries: [],
      label: `${this.label} Bind Group`,
    });
  }

  updateUniforms(_context: GPUContext): void {
    // No uniforms to update for wireframe
  }

  destroy(): void {
    super.destroy();
  }
}
