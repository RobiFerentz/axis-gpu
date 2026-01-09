import { ShaderModule } from './ShaderModule';
import { basicVertexShader, basicFragmentShader } from './BasicShader';
import { texturedVertexShader, texturedFragmentShader } from './TexturedShader';
import { litVertexShader, litFragmentShader } from './LitShader';

export class ShaderLibrary {
  private static shaders = new Map<string, ShaderModule>();

  static register(name: string, shader: ShaderModule): void {
    this.shaders.set(name, shader);
  }

  static get(name: string): ShaderModule | undefined {
    return this.shaders.get(name);
  }

  static has(name: string): boolean {
    return this.shaders.has(name);
  }

  static initialize(): void {
    // Register built-in shaders
    this.register('basic_vertex', ShaderModule.fromWGSL(basicVertexShader, 'Basic Vertex Shader'));
    this.register('basic_fragment', ShaderModule.fromWGSL(basicFragmentShader, 'Basic Fragment Shader'));
    this.register('textured_vertex', ShaderModule.fromWGSL(texturedVertexShader, 'Textured Vertex Shader'));
    this.register('textured_fragment', ShaderModule.fromWGSL(texturedFragmentShader, 'Textured Fragment Shader'));
    this.register('lit_vertex', ShaderModule.fromWGSL(litVertexShader, 'Lit Vertex Shader'));
    this.register('lit_fragment', ShaderModule.fromWGSL(litFragmentShader, 'Lit Fragment Shader'));
  }
}

// Initialize built-in shaders on module load
ShaderLibrary.initialize();
