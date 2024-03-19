import { BufferGeometry, Float32BufferAttribute, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils";

class SpherePlaneGeometry extends BufferGeometry {
  constructor(
    radius = 1,
    widthSegments = 32,
    heightSegments = 16,
    transition = 0.5,
    phiStart = 0,
    phiLength = Math.PI * 2,
    thetaStart = 0,
    thetaLength = Math.PI
  ) {
    super();

    this.type = "SphereGeometry";

    this.parameters = {
      radius: radius,
      widthSegments: widthSegments,
      heightSegments: heightSegments,
      transition: transition,
      phiStart: phiStart,
      phiLength: phiLength,
      thetaStart: thetaStart,
      thetaLength: thetaLength,
    };

    // widthSegments = Math.max(3, Math.floor(widthSegments));
    // heightSegments = Math.max(2, Math.floor(heightSegments));

    const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);

    let index = 0;
    const grid = [];

    const vertex = new Vector3();
    const normal = new Vector3();

    // buffers

    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];

    const segmentWidth = (phiLength / widthSegments) * 1;
    const segment_height = (thetaLength / heightSegments) * 1;

    const radiusHalf = radius / 2;
    const height_half = radiusHalf;

    // generate vertices, normals and uvs

    for (let iy = 0; iy <= heightSegments; iy++) {
      const verticesRow = [];

      const v = iy / heightSegments;

      // special case for the poles

      let uOffset = 0;

      if (iy === 0 && thetaStart === 0) {
        uOffset = 0.5 / widthSegments;
      } else if (iy === heightSegments && thetaEnd === Math.PI) {
        uOffset = -0.5 / widthSegments;
      }

      const planeY = iy * segment_height - height_half;

      for (let ix = 0; ix <= widthSegments; ix++) {
        const u = ix / widthSegments;

        // vertex

        const planeX = -radiusHalf + (ix * segmentWidth - radiusHalf);
        const planeZ = -radiusHalf + (iy * segmentWidth - radiusHalf);

        const sphereX =
          -radius *
          Math.cos(phiStart + u * phiLength) *
          Math.sin(thetaStart + v * thetaLength);
        const sphereY = radius * Math.cos(thetaStart + v * thetaLength);
        const sphereZ =
          radius *
          Math.sin(phiStart + u * phiLength) *
          Math.sin(thetaStart + v * thetaLength);

        vertex.x = lerp(planeX, sphereX, transition);
        vertex.y = lerp(planeY, sphereY, transition);
        vertex.z = lerp(planeZ, sphereZ, transition);

        vertices.push(vertex.x, vertex.y, vertex.z);

        // normal

        normal.copy(vertex).normalize();
        normals.push(normal.x, normal.y, normal.z);

        // uv

        uvs.push(u + uOffset, 1 - v);

        verticesRow.push(index++);
      }

      grid.push(verticesRow);
    }

    // indices

    for (let iy = 0; iy < heightSegments; iy++) {
      for (let ix = 0; ix < widthSegments; ix++) {
        const a = grid[iy][ix + 1];
        const b = grid[iy][ix];
        const c = grid[iy + 1][ix];
        const d = grid[iy + 1][ix + 1];

        if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
        if (iy !== heightSegments - 1 || thetaEnd < Math.PI)
          indices.push(b, c, d);
      }
    }

    // build geometry

    this.setIndex(indices);
    this.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    this.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  }

  copy(source) {
    super.copy(source);

    this.parameters = Object.assign({}, source.parameters);

    return this;
  }

  static fromJSON(data) {
    return new SpherePlaneGeometry(
      data.radius,
      data.widthSegments,
      data.heightSegments,
      data.phiStart,
      data.phiLength,
      data.thetaStart,
      data.thetaLength
    );
  }
}

export { SpherePlaneGeometry };
