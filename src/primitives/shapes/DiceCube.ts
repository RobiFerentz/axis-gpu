import { Geometry } from '../Geometry';

export class DiceCubeGeometry extends Geometry {
  constructor(size: number = 1) {
    const halfSize = size / 2;
    
    // Positions for a cube (6 faces, 4 vertices each)
    const positions = new Float32Array([
      // Front face (1)
      -halfSize, -halfSize,  halfSize,
       halfSize, -halfSize,  halfSize,
       halfSize,  halfSize,  halfSize,
      -halfSize,  halfSize,  halfSize,
      
      // Back face (6)
      -halfSize, -halfSize, -halfSize,
      -halfSize,  halfSize, -halfSize,
       halfSize,  halfSize, -halfSize,
       halfSize, -halfSize, -halfSize,
      
      // Top face (2)
      -halfSize,  halfSize, -halfSize,
      -halfSize,  halfSize,  halfSize,
       halfSize,  halfSize,  halfSize,
       halfSize,  halfSize, -halfSize,
      
      // Bottom face (5)
      -halfSize, -halfSize, -halfSize,
       halfSize, -halfSize, -halfSize,
       halfSize, -halfSize,  halfSize,
      -halfSize, -halfSize,  halfSize,
      
      // Right face (3)
       halfSize, -halfSize, -halfSize,
       halfSize,  halfSize, -halfSize,
       halfSize,  halfSize,  halfSize,
       halfSize, -halfSize,  halfSize,
      
      // Left face (4)
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

    // UVs mapped to dice texture (2x3 grid)
    // Each face maps to its corresponding position in the texture
    const faceWidth = 1 / 3;  // 3 faces wide
    const faceHeight = 1 / 2;  // 2 faces tall
    
    const uvs = new Float32Array([
      // Front (face 1 - position 0,0 in grid)
      0, faceHeight,  faceWidth, faceHeight,  faceWidth, 0,  0, 0,
      
      // Back (face 6 - position 2,1 in grid)
      2 * faceWidth, 1,  2 * faceWidth, faceHeight,  1, faceHeight,  1, 1,
      
      // Top (face 2 - position 1,0 in grid)
      faceWidth, faceHeight,  faceWidth, 0,  2 * faceWidth, 0,  2 * faceWidth, faceHeight,
      
      // Bottom (face 5 - position 1,1 in grid)
      faceWidth, 1,  2 * faceWidth, 1,  2 * faceWidth, faceHeight,  faceWidth, faceHeight,
      
      // Right (face 3 - position 2,0 in grid)
      2 * faceWidth, faceHeight,  2 * faceWidth, 0,  1, 0,  1, faceHeight,
      
      // Left (face 4 - position 0,1 in grid)
      0, 1,  faceWidth, 1,  faceWidth, faceHeight,  0, faceHeight,
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
