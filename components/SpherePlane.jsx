import { useMemo } from "react";
import { SpherePlaneGeometry } from "../helpers/SpherePlaneGeometry";
import { useControls } from "leva";
import { DoubleSide } from "three";

const startTransition = 0.5;

export const SpherePlane = () => {
  const { radius, widthSegments, heightSegments } = useControls({
    radius: { value: 1, min: 0, max: 10, step: 0.1 },
    widthSegments: { value: 32, min: 1, max: 256, step: 1 },
    heightSegments: { value: 32, min: 1, max: 256, step: 1 },
    transition: {
      value: startTransition,
      min: 0,
      max: 1,
      step: 0.001,
      onChange: (value) => {
        spherePlaneGeometry.setTransition(value);
      },
    },
  });

  const spherePlaneGeometry = useMemo(
    () =>
      new SpherePlaneGeometry(
        startTransition,
        radius,
        widthSegments,
        heightSegments
      ),
    [radius, heightSegments, widthSegments]
  );
  return (
    <mesh geometry={spherePlaneGeometry}>
      <meshNormalMaterial side={DoubleSide} wireframe={true} />
    </mesh>
  );
};
