import { Geometry } from '../Geometry';

export class CubeGeometry extends Geometry {
  constructor(size: number = 1) {
    const halfSize = size / 2;
    
    // Positions for a cube (6 faces, 4 vertices each)
    const positions = new Float32Array([
      // Front face
      -halfSize, -halfSize,  halfSize,
       halfSize, -halfSize,  halfSize,
       halfSize,  halfSize,  halfSize,
      -halfSize,  halfSize,  halfSize,
      
      // Back face
      -halfSize, -halfSize, -halfSize,
      -halfSize,  halfSize, -halfSize,
       halfSize,  halfSize, -halfSize,
       halfSize, -halfSize, -halfSize,
      
      // Top face
      -halfSize,  halfSize, -halfSize,
      -halfSize,  halfSize,  halfSize,
       halfSize,  halfSize,  halfSize,
       halfSize,  halfSize, -halfSize,
      
      // Bottom face
      -halfSize, -halfSize, -halfSize,
       halfSize, -halfSize, -halfSize,
       halfSize, -halfSize,  halfSize,
      -halfSize, -halfSize,  halfSize,
      
      // Right face
       halfSize, -halfSize, -halfSize,
       halfSize,  halfSize, -halfSize,
       halfSize,  halfSize,  halfSize,
       halfSize, -halfSize,  halfSize,
      
      // Left face
      -halfSize, -halfSize, -halfSize,
      -halfSize, -halfSize,  halfSize,
      -halfSize,  halfSize,  halfSize,
      -halfSize,  halfSize, -halfSize,
    ]);

    // Normals
    const normals = new Float32Array([
      // Front
      0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
      // Back
      0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
      // Top
      0, 1, 0,  0, 1, 0,  0, 1, 0,  0, 1, 0,
      // Bottom
      0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
      // Right
      1, 0, 0,  1, 0, 0,  1, 0, 0,  1, 0, 0,
      // Left
      -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
    ]);

    // UVs
    const uvs = new Float32Array([
      // Front
      0, 0,  1, 0,  1, 1,  0, 1,
      // Back
      1, 0,  1, 1,  0, 1,  0, 0,
      // Top
      0, 1,  0, 0,  1, 0,  1, 1,
      // Bottom
      1, 1,  0, 1,  0, 0,  1, 0,
      // Right
      1, 0,  1, 1,  0, 1,  0, 0,
      // Left
      0, 0,  1, 0,  1, 1,  0, 1,
    ]);

    // Indices
    const indices = new Uint16Array([
      0,  1,  2,    0,  2,  3,    // Front
      4,  5,  6,    4,  6,  7,    // Back
      8,  9,  10,   8,  10, 11,   // Top
      12, 13, 14,   12, 14, 15,   // Bottom
      16, 17, 18,   16, 18, 19,   // Right
      20, 21, 22,   20, 22, 23,   // Left
    ]);

    super({ positions, normals, uvs, indices });
  }
}
