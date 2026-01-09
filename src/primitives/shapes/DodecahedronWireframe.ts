import { WireframeGeometry } from '../WireframeGeometry';

export class DodecahedronWireframeGeometry extends WireframeGeometry {
  constructor(
    radius: number = 1,
    color: [number, number, number] = [1, 1, 1]
  ) {
    // Golden ratio
    const phi = (1 + Math.sqrt(5)) / 2;
    const invPhi = 1 / phi;

    // Generate vertices of a dodecahedron (20 vertices)
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

    // Define edges (30 edges for a dodecahedron)
    // Each edge connects two vertices
    const edges = [
      // Edges from cube-like structure
      [0, 8], [0, 12], [0, 16],
      [1, 9], [1, 12], [1, 17],
      [2, 10], [2, 13], [2, 16],
      [3, 11], [3, 13], [3, 17],
      [4, 8], [4, 14], [4, 18],
      [5, 9], [5, 14], [5, 19],
      [6, 10], [6, 15], [6, 18],
      [7, 11], [7, 15], [7, 19],
      // Pentagon edges
      [8, 10], [10, 13], [13, 15], [15, 18], [18, 6],
      [12, 14], [14, 19], [19, 11], [11, 9], [9, 5],
      [16, 17],
    ];

    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];

    // Create vertices for edges
    edges.forEach((edge, edgeIndex) => {
      const v1 = normalizedVertices[edge[0]];
      const v2 = normalizedVertices[edge[1]];

      // Add both vertices of the edge
      positions.push(...v1);
      colors.push(...color);
      
      positions.push(...v2);
      colors.push(...color);

      // Add indices for the line
      const baseIndex = edgeIndex * 2;
      indices.push(baseIndex, baseIndex + 1);
    });

    super({
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      indices: new Uint16Array(indices),
    });
  }
}
