import { Geometry } from '../Geometry';

export class CylinderGeometry extends Geometry {
  constructor(
    radiusTop: number = 1,
    radiusBottom: number = 1,
    height: number = 2,
    radialSegments: number = 32,
    heightSegments: number = 1
  ) {
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const halfHeight = height / 2;

    // Generate sides
    for (let y = 0; y <= heightSegments; y++) {
      const v = y / heightSegments;
      const py = -halfHeight + v * height;
      const radius = radiusBottom + v * (radiusTop - radiusBottom);

      for (let x = 0; x <= radialSegments; x++) {
        const u = x / radialSegments;
        const theta = u * Math.PI * 2;

        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        const px = radius * cosTheta;
        const pz = radius * sinTheta;

        positions.push(px, py, pz);
        normals.push(cosTheta, 0, sinTheta);
        uvs.push(u, 1 - v);
      }
    }

    // Generate side indices
    for (let y = 0; y < heightSegments; y++) {
      for (let x = 0; x < radialSegments; x++) {
        const a = y * (radialSegments + 1) + x;
        const b = a + radialSegments + 1;
        const c = a + 1;
        const d = b + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    // Generate top cap
    const topCenterIndex = positions.length / 3;
    positions.push(0, halfHeight, 0);
    normals.push(0, 1, 0);
    uvs.push(0.5, 0.5);

    for (let x = 0; x <= radialSegments; x++) {
      const u = x / radialSegments;
      const theta = u * Math.PI * 2;
      const px = radiusTop * Math.cos(theta);
      const pz = radiusTop * Math.sin(theta);

      positions.push(px, halfHeight, pz);
      normals.push(0, 1, 0);
      uvs.push(0.5 + Math.cos(theta) * 0.5, 0.5 + Math.sin(theta) * 0.5);
    }

    for (let x = 0; x < radialSegments; x++) {
      indices.push(topCenterIndex, topCenterIndex + x + 1, topCenterIndex + x + 2);
    }

    // Generate bottom cap
    const bottomCenterIndex = positions.length / 3;
    positions.push(0, -halfHeight, 0);
    normals.push(0, -1, 0);
    uvs.push(0.5, 0.5);

    for (let x = 0; x <= radialSegments; x++) {
      const u = x / radialSegments;
      const theta = u * Math.PI * 2;
      const px = radiusBottom * Math.cos(theta);
      const pz = radiusBottom * Math.sin(theta);

      positions.push(px, -halfHeight, pz);
      normals.push(0, -1, 0);
      uvs.push(0.5 + Math.cos(theta) * 0.5, 0.5 + Math.sin(theta) * 0.5);
    }

    for (let x = 0; x < radialSegments; x++) {
      indices.push(bottomCenterIndex, bottomCenterIndex + x + 2, bottomCenterIndex + x + 1);
    }

    super({
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      uvs: new Float32Array(uvs),
      indices: new Uint16Array(indices),
    });
  }
}
