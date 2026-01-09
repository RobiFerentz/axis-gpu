import { Geometry } from '../Geometry';

export class SphereGeometry extends Geometry {
  constructor(radius: number = 1, widthSegments: number = 32, heightSegments: number = 16) {
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      const phi = v * Math.PI;

      for (let x = 0; x <= widthSegments; x++) {
        const u = x / widthSegments;
        const theta = u * Math.PI * 2;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);
        const sinTheta = Math.sin(theta);
        const cosTheta = Math.cos(theta);

        const px = radius * sinPhi * cosTheta;
        const py = radius * cosPhi;
        const pz = radius * sinPhi * sinTheta;

        positions.push(px, py, pz);
        
        // Normals (normalized position for a sphere)
        const length = Math.sqrt(px * px + py * py + pz * pz);
        normals.push(px / length, py / length, pz / length);
        
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
