import { GPUContext } from '../core/GPUContext';

export class UniformBuffer {
  private buffer?: GPUBuffer;
  private size: number;
  private label?: string;

  constructor(size: number, label?: string) {
    this.size = size;
    this.label = label;
  }

  create(context: GPUContext): void {
    this.buffer = context.createBuffer({
      size: this.size,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      label: this.label,
    });
  }

  update(context: GPUContext, data: BufferSource, offset: number = 0): void {
    if (!this.buffer) {
      this.create(context);
    }
    context.writeBuffer(this.buffer!, data, offset);
  }

  getBuffer(): GPUBuffer {
    if (!this.buffer) {
      throw new Error('Buffer not created. Call create() first.');
    }
    return this.buffer;
  }

  destroy(): void {
    this.buffer?.destroy();
    this.buffer = undefined;
  }

  static createFloat32Array(values: number[]): Float32Array {
    return new Float32Array(values);
  }

  static padToAlignment(size: number, alignment: number = 16): number {
    return Math.ceil(size / alignment) * alignment;
  }
}
