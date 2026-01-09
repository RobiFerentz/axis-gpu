import { Geometry } from '../Geometry';

export class CircleGeometry extends Geometry {
  constructor(radius: number = 1, segments: number = 32) {
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    // Center vertex
    positions.push(0, 0, 0);
    normals.push(0, 0, 1);
    uvs.push(0.5, 0.5);

    // Perimeter vertices
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;

      positions.push(x, y, 0);
      normals.push(0, 0, 1);
      uvs.push((Math.cos(theta) + 1) / 2, (Math.sin(theta) + 1) / 2);
    }

    // Generate indices
    for (let i = 1; i <= segments; i++) {
      indices.push(0, i, i + 1);
    }

    super({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
    });
  }
}
