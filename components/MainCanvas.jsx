import { animated, config, useSpring } from "@react-spring/three";
import {
  Environment,
  Float,
  OrbitControls,
  PresentationControls,
  RandomizedLight,
  Torus,
  TorusKnot,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import React, { Suspense, useLayoutEffect, useRef, useState } from "react";
import { MathUtils } from "three";
import { useStore } from "../helpers/zustandStore";
import { SpherePlane } from "./SpherePlane";
import { EarthToEarthScene } from "./EarthToEarthScene";

export const pointer = {
  x: 0,
  y: 0,
};

export const rawPointer = {
  x: 0,
  y: 0,
};

export function MainCanvas() {
  const handlerPointerMove = (e) => {
    rawPointer.x = e.pageX / document.body.clientWidth - 0.5;
    rawPointer.y = e.pageY / document.body.clientHeight - 0.5;
  };

  return (
    <Canvas
      shadows
      onPointerMove={handlerPointerMove}
      camera={{ position: [0, 0, 0], fov: 35, far: 2000, focus: 50 }}
      style={{
        position: "sticky",
        top: "0",
        height: "calc(100 * var(--vh, 1vh))",
        backgroundColor: "rgb(15,15,15)",
      }}
      gl={{
        powerPreference: "high-performance",
      }}
      performance={{
        min: 0.9,
      }}
      onError={() => {
        console.error("Something unexpected happened.");
      }}
    >
      <StageRenderer />
    </Canvas>
  );
}

const minWidth = 330;
const maxWidth = 1000;
const minScale = 0.7;
const maxScale = 1;

const StageRenderer = () => {
  const { camera } = useThree();
  const [scale, setScale] = useState(1);
  const isPotrait = useStore((state) => state.isPotrait);

  useLayoutEffect(() => {
    function updateSize() {
      const deltaFromMinWidth =
        (window.innerWidth - minWidth) / (maxWidth - minWidth);

      let newScale = maxScale;

      if (window.innerWidth <= minWidth) {
        newScale = minScale;
      } else if (window.innerWidth >= maxWidth) {
        newScale = maxScale;
      } else {
        newScale = minScale + deltaFromMinWidth * (maxScale - minScale);
      }

      setScale(newScale);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const xCameraOffset = isPotrait ? 0.03 : 0.07;
  const yCameraOffset = isPotrait ? 0.08 : 0.2;

  return (
    <group scale={scale}>
      <Model />
      <ambientLight />
      <RandomizedLight intensity={2} />
    </group>
  );
};
function Model() {
  const { autoRotate } = useControls({ autoRotate: false });

  const springs = useSpring({
    from: { scale: 0 },
    to: { scale: 1 },
    config: config.slow,
  });

  const { showNormals } = useControls({ showNormals: true });

  const ref = useRef(null);
  useFrame((_, delta) => {
    if (ref.current) {
      if (autoRotate) {
        // @ts-ignore
        ref.current.rotation.y += delta * 0.2;
      }
    }
  });

  return (
    <animated.group ref={ref} {...springs}>
      <SpherePlane />
      <Suspense fallback={null}>
        <EarthToEarthScene />
      </Suspense>
    </animated.group>
  );
}
