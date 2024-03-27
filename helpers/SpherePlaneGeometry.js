import {
  BufferGeometry,
  Float32BufferAttribute,
  PlaneGeometry,
  SphereGeometry,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { lerp } from "three/src/math/MathUtils";

class SpherePlaneGeometry extends BufferGeometry {
  constructor(
    startTransition = 0.5 /* transition between plane and sphere geometries. plane 0 -> 1  sphere */,
    radius = 1,
    widthSegments = 32,
    heightSegments = 16,
    phiStart = 0,
    phiLength = Math.PI * 2,
    thetaStart = 0,
    thetaLength = Math.PI
  ) {
    super();

    this.type = "SpherePlaneGeometry";

    this.parameters = {
      startTransition: startTransition,
      radius: radius,
      widthSegments: widthSegments,
      heightSegments: heightSegments,
      phiStart: phiStart,
      phiLength: phiLength,
      thetaStart: thetaStart,
      thetaLength: thetaLength,
    };

    // plane geometry

    this.planeGeometry = new PlaneGeometry(
      radius * 2,
      radius * 2,
      widthSegments,
      heightSegments
    );

    // sphere geometry
    this.sphereGeometry = new SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
      phiStart,
      phiLength,
      thetaStart,
      thetaLength
    );

    // build geometry

    // set default values to plane values

    const vertices = this.planeGeometry.attributes.position.array;
    const normals = this.planeGeometry.attributes.normal.array;
    const uvs = this.planeGeometry.attributes.uv.array;
    const index = this.planeGeometry.index.array;

    if (index) {
      this.setIndex(new Uint16BufferAttribute(index, 1));
    }
    this.setAttribute("position", new Float32BufferAttribute(vertices, 3));
    this.setAttribute("normal", new Float32BufferAttribute(normals, 3));
    this.setAttribute("uv", new Float32BufferAttribute(uvs, 2));

    this.setTransition(startTransition);
  }

  setTransition(transition, easing = lerp) {
    this.parameters.transition = transition;

    const position = this.attributes.position;
    const normal = this.attributes.normal;
    const uv = this.attributes.uv;

    /**
     * Transition between plane and sphere geometries
     * 0 = plane
     * 1 = sphere
     */
    for (let i = 0; i < position.count; i++) {
      /**
       * position
       */
      position.setXYZ(
        i,
        easing(
          this.planeGeometry.attributes.position.getX(i),
          this.sphereGeometry.attributes.position.getX(i),
          transition
        ),
        easing(
          this.planeGeometry.attributes.position.getY(i),
          this.sphereGeometry.attributes.position.getY(i),
          transition
        ),
        easing(
          this.planeGeometry.attributes.position.getZ(i),
          this.sphereGeometry.attributes.position.getZ(i),
          transition
        )
      );

      /**
       * normal
       */
      normal.setXYZ(
        i,
        easing(
          this.planeGeometry.attributes.normal.getX(i),
          this.sphereGeometry.attributes.normal.getX(i),
          transition
        ),
        easing(
          this.planeGeometry.attributes.normal.getY(i),
          this.sphereGeometry.attributes.normal.getY(i),
          transition
        ),
        easing(
          this.planeGeometry.attributes.normal.getZ(i),
          this.sphereGeometry.attributes.normal.getZ(i),
          transition
        )
      );

      /**
       * uv
       */
      uv.setXY(
        i,
        easing(
          this.planeGeometry.attributes.uv.getX(i),
          this.sphereGeometry.attributes.uv.getX(i),
          transition
        ),
        easing(
          this.planeGeometry.attributes.uv.getY(i),
          this.sphereGeometry.attributes.uv.getY(i),
          transition
        )
      );
    }

    this.attributes.position.needsUpdate = true;
    this.attributes.normal.needsUpdate = true;
    this.attributes.uv.needsUpdate = true;
  }

  copy(source) {
    super.copy(source);

    this.parameters = Object.assign({}, source.parameters);

    return this;
  }

  dispose() {
    this.dispatchEvent({ type: "dispose" });
    this.planeGeometry.dispose();
    this.sphereGeometry.dispose();
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
