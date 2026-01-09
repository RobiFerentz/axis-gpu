import { Geometry } from '../Geometry';

export class RectangleGeometry extends Geometry {
  constructor(width: number = 1, height: number = 1) {
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const positions = new Float32Array([
      -halfWidth, -halfHeight, 0,
       halfWidth, -halfHeight, 0,
       halfWidth,  halfHeight, 0,
      -halfWidth,  halfHeight, 0,
    ]);

    const normals = new Float32Array([
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
    ]);

    const uvs = new Float32Array([
      0, 0,
      1, 0,
      1, 1,
      0, 1,
    ]);

    const indices = new Uint16Array([
      0, 1, 2,
      0, 2, 3,
    ]);

    super({ positions, normals, uvs, indices });
  }
}
