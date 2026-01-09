import { Geometry } from '../Geometry';

export class PlaneGeometry extends Geometry {
  constructor(width: number = 1, height: number = 1, widthSegments: number = 1, heightSegments: number = 1) {
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const segmentWidth = width / widthSegments;
    const segmentHeight = height / heightSegments;

    // Generate vertices
    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      const py = halfHeight - y * segmentHeight;

      for (let x = 0; x <= widthSegments; x++) {
        const u = x / widthSegments;
        const px = -halfWidth + x * segmentWidth;

        positions.push(px, py, 0);
        normals.push(0, 0, 1);
        uvs.push(u, 1 - v);
      }
    }

    // Generate indices
    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < widthSegments; x++) {
        const a = y * (widthSegments + 1) + x;
        const b = a + widthSegments + 1;
        const c = a + 1;
        const d = b + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    super({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
    });
  }
}
