import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Trail } from "@react-three/drei";
import * as THREE from "three";
import { stationById, predictedJourney } from "../data/metroNetwork";
import { scrollState } from "./scrollState";
import { theme } from "./theme";

const JOURNEY_START = 0.16;
const JOURNEY_END = 0.9;

export function Train() {
  const groupRef = useRef<THREE.Group>(null);

  const curve = useMemo(() => {
    const pts = predictedJourney.map((id) => {
      const [x, y, z] = stationById.get(id)!.pos;
      return new THREE.Vector3(x, y + 0.35, z);
    });
    return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.1);
  }, []);

  const tmpPos = useMemo(() => new THREE.Vector3(), []);
  const tmpLook = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const t = scrollState.raw;
    const u = THREE.MathUtils.clamp((t - JOURNEY_START) / (JOURNEY_END - JOURNEY_START), 0, 1);
    curve.getPointAt(u, tmpPos);
    const aheadU = Math.min(1, u + 0.01);
    curve.getPointAt(aheadU, tmpLook);

    if (groupRef.current) {
      groupRef.current.position.copy(tmpPos);
      if (aheadU !== u) groupRef.current.lookAt(tmpLook);
    }
  });

  return (
    <group>
      <Trail
        width={3.4}
        length={9}
        color={new THREE.Color(theme.predicted)}
        attenuation={(t) => t * t}
        target={groupRef as RefObject<THREE.Object3D>}
      />
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial
            color={theme.trainGlow}
            toneMapped={false}
            transparent
            opacity={0.35}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.28, 1.1, 4, 8]} />
          <meshBasicMaterial color={theme.trainBody} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}
