import { GPUContext } from '../core/GPUContext';

export interface ShaderModuleOptions {
  code: string;
  label?: string;
}

export class ShaderModule {
  public code: string;
  public label?: string;
  private gpuShaderModule?: GPUShaderModule;

  constructor(options: ShaderModuleOptions) {
    this.code = options.code;
    this.label = options.label;
  }

  getGPUShaderModule(context: GPUContext): GPUShaderModule {
    if (!this.gpuShaderModule) {
      this.gpuShaderModule = context.createShaderModule({
        code: this.code,
        label: this.label,
      });
    }
    return this.gpuShaderModule;
  }

  static fromWGSL(code: string, label?: string): ShaderModule {
    return new ShaderModule({ code, label });
  }
}
