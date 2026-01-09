import { GPUContext } from '../core/GPUContext';

export interface GeometryData {
  positions: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  indices: Uint16Array;
}

export class Geometry {
  public positions: Float32Array;
  public normals: Float32Array;
  public uvs: Float32Array;
  public indices: Uint16Array;
  
  private vertexBuffer?: GPUBuffer;
  private indexBuffer?: GPUBuffer;
  private vertexCount: number;
  private indexCount: number;

  constructor(data: GeometryData) {
    this.positions = data.positions;
    this.normals = data.normals;
    this.uvs = data.uvs;
    this.indices = data.indices;
    this.vertexCount = this.positions.length / 3;
    this.indexCount = this.indices.length;
  }

  createBuffers(context: GPUContext): void {
    // Interleave vertex data: position (3) + normal (3) + uv (2) = 8 floats per vertex
    const vertexData = new Float32Array(this.vertexCount * 8);
    
    for (let i = 0; i < this.vertexCount; i++) {
      const offset = i * 8;
      // Position
      vertexData[offset + 0] = this.positions[i * 3 + 0];
      vertexData[offset + 1] = this.positions[i * 3 + 1];
      vertexData[offset + 2] = this.positions[i * 3 + 2];
      // Normal
      vertexData[offset + 3] = this.normals[i * 3 + 0];
      vertexData[offset + 4] = this.normals[i * 3 + 1];
      vertexData[offset + 5] = this.normals[i * 3 + 2];
      // UV
      vertexData[offset + 6] = this.uvs[i * 2 + 0];
      vertexData[offset + 7] = this.uvs[i * 2 + 1];
    }

    // Create vertex buffer
    this.vertexBuffer = context.createBuffer({
      size: vertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      label: 'Vertex Buffer',
    });
    context.writeBuffer(this.vertexBuffer, vertexData);

    // Create index buffer
    this.indexBuffer = context.createBuffer({
      size: this.indices.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
      label: 'Index Buffer',
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
      arrayStride: 8 * 4, // 8 floats * 4 bytes
      attributes: [
        {
          // Position
          shaderLocation: 0,
          offset: 0,
          format: 'float32x3',
        },
        {
          // Normal
          shaderLocation: 1,
          offset: 3 * 4,
          format: 'float32x3',
        },
        {
          // UV
          shaderLocation: 2,
          offset: 6 * 4,
          format: 'float32x2',
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
