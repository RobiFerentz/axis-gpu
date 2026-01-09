import { GeometryWithColors } from '../GeometryWithColors';

export class MultiColorCubeGeometry extends GeometryWithColors {
  constructor(
    size: number = 1,
    colors: [number, number, number][] = [
      [1, 0, 0],    // Front - Red
      [0, 1, 0],    // Back - Green
      [0, 0, 1],    // Top - Blue
      [1, 1, 0],    // Bottom - Yellow
      [1, 0, 1],    // Right - Magenta
      [0, 1, 1],    // Left - Cyan
    ]
  ) {
    const halfSize = size / 2;
    
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const vertexColors: number[] = [];
    const indices: number[] = [];

    const faces = [
      // Front face
      {
        vertices: [
          [-halfSize, -halfSize,  halfSize],
          [ halfSize, -halfSize,  halfSize],
          [ halfSize,  halfSize,  halfSize],
          [-halfSize,  halfSize,  halfSize],
        ],
        normal: [0, 0, 1],
        color: colors[0],
      },
      // Back face
      {
        vertices: [
          [-halfSize, -halfSize, -halfSize],
          [-halfSize,  halfSize, -halfSize],
          [ halfSize,  halfSize, -halfSize],
          [ halfSize, -halfSize, -halfSize],
        ],
        normal: [0, 0, -1],
        color: colors[1],
      },
      // Top face
      {
        vertices: [
          [-halfSize,  halfSize, -halfSize],
          [-halfSize,  halfSize,  halfSize],
          [ halfSize,  halfSize,  halfSize],
          [ halfSize,  halfSize, -halfSize],
        ],
        normal: [0, 1, 0],
        color: colors[2],
      },
      // Bottom face
      {
        vertices: [
          [-halfSize, -halfSize, -halfSize],
          [ halfSize, -halfSize, -halfSize],
          [ halfSize, -halfSize,  halfSize],
          [-halfSize, -halfSize,  halfSize],
        ],
        normal: [0, -1, 0],
        color: colors[3],
      },
      // Right face
      {
        vertices: [
          [ halfSize, -halfSize, -halfSize],
          [ halfSize,  halfSize, -halfSize],
          [ halfSize,  halfSize,  halfSize],
          [ halfSize, -halfSize,  halfSize],
        ],
        normal: [1, 0, 0],
        color: colors[4],
      },
      // Left face
      {
        vertices: [
          [-halfSize, -halfSize, -halfSize],
          [-halfSize, -halfSize,  halfSize],
          [-halfSize,  halfSize,  halfSize],
          [-halfSize,  halfSize, -halfSize],
        ],
        normal: [-1, 0, 0],
        color: colors[5],
      },
    ];

    const faceUVs = [
      [0, 0], [1, 0], [1, 1], [0, 1]
    ];

    let vertexIndex = 0;
    faces.forEach((face) => {
      face.vertices.forEach((vertex, i) => {
        positions.push(...vertex);
        normals.push(...face.normal);
        uvs.push(...faceUVs[i]);
        vertexColors.push(...face.color);
      });

      const baseIndex = vertexIndex;
      indices.push(
        baseIndex, baseIndex + 1, baseIndex + 2,
        baseIndex, baseIndex + 2, baseIndex + 3
      );
      vertexIndex += 4;
    });

    super({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      colors: new Float32Array(vertexColors),
      indices: new Uint16Array(indices),
    });
  }
}
