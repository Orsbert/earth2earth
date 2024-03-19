import { useMemo } from "react";
import { SpherePlaneGeometry } from "../helpers/SpherePlaneGeometry";
import { useControls } from "leva";

export const SpherePlane = () => {
  const { radius, widthSegments, heightSegments, transition } = useControls({
    radius: { value: 1, min: 0, max: 10, step: 0.1 },
    widthSegments: { value: 32, min: 1, max: 256, step: 1 },
    heightSegments: { value: 32, min: 1, max: 256, step: 1 },
    transition: { value: 0.5, min: 0, max: 1, step: 0.001 },
  });

  const spherePlaneGeometry = useMemo(
    () =>
      new SpherePlaneGeometry(
        radius,
        widthSegments,
        heightSegments,
        transition
      ),
    [radius, heightSegments, widthSegments, transition]
  );
  return (
    <mesh geometry={spherePlaneGeometry}>
      <meshNormalMaterial wireframe />
    </mesh>
  );
};
