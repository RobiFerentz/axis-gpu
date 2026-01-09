import { GPUContext } from '../core/GPUContext';

export interface TextureOptions {
  width: number;
  height: number;
  format?: GPUTextureFormat;
  usage?: GPUTextureUsageFlags;
  mipLevelCount?: number;
  label?: string;
}

export class Texture {
  public width: number;
  public height: number;
  public format: GPUTextureFormat;
  public usage: GPUTextureUsageFlags;
  public mipLevelCount: number;
  public label?: string;
  
  private gpuTexture?: GPUTexture;
  private textureView?: GPUTextureView;

  constructor(options: TextureOptions) {
    this.width = options.width;
    this.height = options.height;
    this.format = options.format ?? 'rgba8unorm';
    this.usage = options.usage ?? (GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT);
    this.mipLevelCount = options.mipLevelCount ?? 1;
    this.label = options.label;
  }

  create(context: GPUContext): void {
    this.gpuTexture = context.createTexture({
      size: { width: this.width, height: this.height },
      format: this.format,
      usage: this.usage,
      mipLevelCount: this.mipLevelCount,
      label: this.label,
    });
    this.textureView = this.gpuTexture.createView();
  }

  getGPUTexture(): GPUTexture {
    if (!this.gpuTexture) {
      throw new Error('Texture not created. Call create() first.');
    }
    return this.gpuTexture;
  }

  getTextureView(): GPUTextureView {
    if (!this.textureView) {
      throw new Error('Texture not created. Call create() first.');
    }
    return this.textureView;
  }

  uploadData(context: GPUContext, data: BufferSource, width?: number, height?: number): void {
    if (!this.gpuTexture) {
      this.create(context);
    }

    const w = width ?? this.width;
    const h = height ?? this.height;

    context.writeTexture(
      { texture: this.gpuTexture! },
      data,
      { bytesPerRow: w * 4 },
      { width: w, height: h }
    );
  }

  generateMipmaps(_context: GPUContext): void {
    // Simple mipmap generation (would need a compute shader for production)
    // For now, just creating the texture with mipLevelCount > 1 will work
    // TODO: Implement proper mipmap generation
    console.warn('Mipmap generation not yet implemented');
  }

  destroy(): void {
    this.gpuTexture?.destroy();
    this.gpuTexture = undefined;
    this.textureView = undefined;
  }

  static createFromSize(width: number, height: number, label?: string): Texture {
    return new Texture({ width, height, label });
  }
}
