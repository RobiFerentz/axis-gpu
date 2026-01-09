import { GPUContext } from '../core/GPUContext';
import { Texture } from './Texture';

export class TextureLoader {
  private static cache = new Map<string, Texture>();

  static async loadFromURL(context: GPUContext, url: string, generateMipmaps: boolean = false): Promise<Texture> {
    // Check cache
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // Load image
    const image = await this.loadImage(url);
    const texture = await this.loadFromImage(context, image, generateMipmaps);
    
    // Cache the texture
    this.cache.set(url, texture);
    
    return texture;
  }

  static async loadFromImage(context: GPUContext, image: HTMLImageElement | ImageBitmap, generateMipmaps: boolean = false): Promise<Texture> {
    // Create ImageBitmap if not already
    const bitmap = image instanceof ImageBitmap ? image : await createImageBitmap(image);

    // Create texture
    const mipLevelCount = generateMipmaps ? Math.floor(Math.log2(Math.max(bitmap.width, bitmap.height))) + 1 : 1;
    const texture = new Texture({
      width: bitmap.width,
      height: bitmap.height,
      mipLevelCount,
      label: `Texture ${bitmap.width}x${bitmap.height}`,
    });

    texture.create(context);

    // Upload image data to texture
    context.device.queue.copyExternalImageToTexture(
      { source: bitmap },
      { texture: texture.getGPUTexture() },
      { width: bitmap.width, height: bitmap.height }
    );

    if (generateMipmaps && mipLevelCount > 1) {
      texture.generateMipmaps(context);
    }

    return texture;
  }

  static async loadFromBlob(context: GPUContext, blob: Blob, generateMipmaps: boolean = false): Promise<Texture> {
    const bitmap = await createImageBitmap(blob);
    return this.loadFromImage(context, bitmap, generateMipmaps);
  }

  static async loadFromCanvas(context: GPUContext, canvas: HTMLCanvasElement, generateMipmaps: boolean = false): Promise<Texture> {
    const bitmap = await createImageBitmap(canvas);
    return this.loadFromImage(context, bitmap, generateMipmaps);
  }

  static createSolidColor(context: GPUContext, r: number, g: number, b: number, a: number = 255): Texture {
    const texture = Texture.createFromSize(1, 1, 'Solid Color Texture');
    texture.create(context);

    const data = new Uint8Array([r, g, b, a]);
    texture.uploadData(context, data, 1, 1);

    return texture;
  }

  static createCheckerboard(context: GPUContext, size: number = 256, checkSize: number = 32): Texture {
    const texture = Texture.createFromSize(size, size, 'Checkerboard Texture');
    texture.create(context);

    const data = new Uint8Array(size * size * 4);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const checkX = Math.floor(x / checkSize);
        const checkY = Math.floor(y / checkSize);
        const isWhite = (checkX + checkY) % 2 === 0;
        const color = isWhite ? 255 : 128;
        
        const index = (y * size + x) * 4;
        data[index] = color;
        data[index + 1] = color;
        data[index + 2] = color;
        data[index + 3] = 255;
      }
    }

    texture.uploadData(context, data, size, size);

    return texture;
  }

  static clearCache(): void {
    this.cache.forEach(texture => texture.destroy());
    this.cache.clear();
  }

  private static loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      image.src = url;
    });
  }
}
