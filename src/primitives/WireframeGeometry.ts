import { GPUContext } from '../core/GPUContext';

export interface WireframeGeometryData {
  positions: Float32Array;
  colors: Float32Array; // RGB colors per vertex
  indices: Uint16Array;
}

export class WireframeGeometry {
  public positions: Float32Array;
  public colors: Float32Array;
  public indices: Uint16Array;
  
  private vertexBuffer?: GPUBuffer;
  private indexBuffer?: GPUBuffer;
  private vertexCount: number;
  private indexCount: number;

  constructor(data: WireframeGeometryData) {
    this.positions = data.positions;
    this.colors = data.colors;
    this.indices = data.indices;
    this.vertexCount = this.positions.length / 3;
    this.indexCount = this.indices.length;
  }

  createBuffers(context: GPUContext): void {
    // Interleave vertex data: position (3) + color (3) = 6 floats per vertex
    const vertexData = new Float32Array(this.vertexCount * 6);
    
    for (let i = 0; i < this.vertexCount; i++) {
      const offset = i * 6;
      // Position
      vertexData[offset + 0] = this.positions[i * 3 + 0];
      vertexData[offset + 1] = this.positions[i * 3 + 1];
      vertexData[offset + 2] = this.positions[i * 3 + 2];
      // Color
      vertexData[offset + 3] = this.colors[i * 3 + 0];
      vertexData[offset + 4] = this.colors[i * 3 + 1];
      vertexData[offset + 5] = this.colors[i * 3 + 2];
    }

    // Create vertex buffer
    this.vertexBuffer = context.createBuffer({
      size: vertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      label: 'Wireframe Vertex Buffer',
    });
    context.writeBuffer(this.vertexBuffer, vertexData);

    // Create index buffer
    this.indexBuffer = context.createBuffer({
      size: this.indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      label: 'Wireframe Index Buffer',
    });
    context.writeBuffer(this.indexBuffer, this.indices as BufferSource);
  }

  getVertexBuffer(): GPUBuffer {
    if (!this.vertexBuffer) {
      throw new Error('Vertex buffer not created. Call createBuffers() first.');
    }
    return this.vertexBuffer;
  }

  getIndexBuffer(): GPUBuffer {
    if (!this.indexBuffer) {
      throw new Error('Index buffer not created. Call createBuffers() first.');
    }
    return this.indexBuffer;
  }

  getIndexCount(): number {
    return this.indexCount;
  }

  static getVertexBufferLayout(): GPUVertexBufferLayout {
    return {
      arrayStride: 6 * 4, // 6 floats * 4 bytes
      attributes: [
        {
          // Position
          shaderLocation: 0,
          offset: 0,
          format: 'float32x3',
        },
        {
          // Color
          shaderLocation: 1,
          offset: 3 * 4,
          format: 'float32x3',
        },
      ],
    };
  }

  destroy(): void {
    this.vertexBuffer?.destroy();
    this.indexBuffer?.destroy();
    this.vertexBuffer = undefined;
    this.indexBuffer = undefined;
  }
}
