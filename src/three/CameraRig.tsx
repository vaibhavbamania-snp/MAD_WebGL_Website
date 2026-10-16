import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "./scrollState";
import { sampleCameraPath, cameraKeyframes } from "./cameraPath";
import { telemetry } from "./telemetry";

export function CameraRig() {
  const { camera, scene } = useThree();
  const displayedT = useRef(0);
  const fog = useMemo(() => new THREE.Fog("#050810", 40, 140), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const targetPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    scene.fog = fog;

    displayedT.current = THREE.MathUtils.damp(displayedT.current, scrollState.raw, 6, delta);
    const sample = sampleCameraPath(displayedT.current);

    const sway = 0.35;
    const t = state.clock.elapsedTime;
    targetPos.set(
      sample.position[0] + Math.sin(t * 0.15) * sway,
      sample.position[1] + Math.cos(t * 0.12) * sway * 0.6,
      sample.position[2] + Math.cos(t * 0.1) * sway,
    );

    camera.position.lerp(targetPos, 1 - Math.pow(0.001, delta));
    lookTarget.set(...sample.lookAt);
    camera.lookAt(lookTarget);

    fog.color.setRGB(...sample.fogColor);
    fog.near = sample.fogNear;
    fog.far = sample.fogFar;

    telemetry.underground = sample.underground;
    const kf = cameraKeyframes[Math.min(sample.segmentIndex + 1, cameraKeyframes.length - 1)];
    telemetry.label = kf.label;
    telemetry.sub = kf.sub;
  });

  return null;
}
