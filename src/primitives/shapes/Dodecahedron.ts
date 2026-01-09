import { GeometryWithColors } from '../GeometryWithColors';

export class DodecahedronGeometry extends GeometryWithColors {
  constructor(
    radius: number = 1,
    faceColors?: [number, number, number][]
  ) {
    // Golden ratio
    const phi = (1 + Math.sqrt(5)) / 2;
    const invPhi = 1 / phi;

    // Generate vertices of a dodecahedron
    // A dodecahedron has 20 vertices
    const vertices = [
      // (±1, ±1, ±1)
      [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
      [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
      // (0, ±1/φ, ±φ)
      [0, invPhi, phi], [0, invPhi, -phi], [0, -invPhi, phi], [0, -invPhi, -phi],
      // (±1/φ, ±φ, 0)
      [invPhi, phi, 0], [invPhi, -phi, 0], [-invPhi, phi, 0], [-invPhi, -phi, 0],
      // (±φ, 0, ±1/φ)
      [phi, 0, invPhi], [phi, 0, -invPhi], [-phi, 0, invPhi], [-phi, 0, -invPhi],
    ];

    // Normalize vertices to radius
    const normalizedVertices = vertices.map(v => {
      const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      return [v[0] / len * radius, v[1] / len * radius, v[2] / len * radius];
    });

    // Define the 12 pentagonal faces (each face has 5 vertex indices)
    const faces = [
      [0, 8, 10, 2, 16],
      [0, 16, 17, 1, 12],
      [0, 12, 14, 4, 8],
      [1, 17, 3, 11, 9],
      [1, 9, 5, 14, 12],
      [2, 10, 6, 15, 13],
      [2, 13, 3, 17, 16],
      [3, 13, 15, 7, 11],
      [4, 14, 5, 19, 18],
      [4, 18, 6, 10, 8],
      [5, 9, 11, 7, 19],
      [6, 18, 19, 7, 15],
    ];

    // Default colors for each face (if not provided)
    const defaultColors: [number, number, number][] = [
      [1, 0, 0],     // Red
      [0, 1, 0],     // Green
      [0, 0, 1],     // Blue
      [1, 1, 0],     // Yellow
      [1, 0, 1],     // Magenta
      [0, 1, 1],     // Cyan
      [1, 0.5, 0],   // Orange
      [0.5, 0, 1],   // Purple
      [1, 0, 0.5],   // Pink
      [0.5, 1, 0],   // Lime
      [0, 0.5, 1],   // Sky blue
      [1, 0.5, 0.5], // Salmon
    ];

    const colors = faceColors || defaultColors;

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const vertexColors: number[] = [];
    const indices: number[] = [];

    let vertexIndex = 0;

    // Process each pentagonal face
    faces.forEach((face, faceIndex) => {
      // Calculate face center for normal calculation
      const center = [0, 0, 0];
      face.forEach(vi => {
        center[0] += normalizedVertices[vi][0];
        center[1] += normalizedVertices[vi][1];
        center[2] += normalizedVertices[vi][2];
      });
      center[0] /= 5;
      center[1] /= 5;
      center[2] /= 5;

      // Normal points outward from center
      const len = Math.sqrt(center[0] * center[0] + center[1] * center[1] + center[2] * center[2]);
      const normal = [center[0] / len, center[1] / len, center[2] / len];

      const faceColor = colors[faceIndex % colors.length];

      // Add vertices for this face
      const faceStartIndex = vertexIndex;
      face.forEach((vi, i) => {
        const v = normalizedVertices[vi];
        positions.push(v[0], v[1], v[2]);
        normals.push(normal[0], normal[1], normal[2]);
        
        // Simple UV mapping (can be improved)
        const angle = (i / 5) * Math.PI * 2;
        uvs.push(0.5 + Math.cos(angle) * 0.5, 0.5 + Math.sin(angle) * 0.5);
        
        vertexColors.push(...faceColor);
        vertexIndex++;
      });

      // Triangulate the pentagon (fan triangulation from first vertex)
      for (let i = 1; i < 4; i++) {
        indices.push(
          faceStartIndex,
          faceStartIndex + i,
          faceStartIndex + i + 1
        );
      }
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
