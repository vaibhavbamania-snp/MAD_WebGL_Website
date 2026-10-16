import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles, PerformanceMonitor, AdaptiveDpr } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, HueSaturation, BrightnessContrast } from "@react-three/postprocessing";
import * as THREE from "three";
import { NetworkLines } from "./NetworkLines";
import { Stations } from "./Stations";
import { Train } from "./Train";
import { GroundPlane } from "./GroundPlane";
import { CameraRig } from "./CameraRig";
import { theme } from "./theme";

export function Experience3D() {
  // Starts optimistic (1.5x) and steps down under sustained load — the
  // heaviest frame (the final wide pull-back, where every line/station/
  // tunnel is in view at once) is exactly when this earns its keep.
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      dpr={dpr}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1,
      }}
      camera={{ fov: 42, near: 0.5, far: 260, position: [16, 46, 48] }}
      style={{ position: "fixed", inset: 0 }}
    >
      <PerformanceMonitor
        bounds={() => [45, 58]}
        onIncline={() => setDpr(1.5)}
        onDecline={() => setDpr(1)}
      />
      <AdaptiveDpr pixelated />
      <color attach="background" args={[theme.background]} />
      <ambientLight intensity={0.6} />
      <Suspense fallback={null}>
        <GroundPlane />
        <NetworkLines />
        <Stations />
        <Train />
        <Sparkles
          count={130}
          position={[0, 16, 0]}
          scale={[120, 10, 120]}
          size={1}
          speed={0.15}
          opacity={0.3}
          color="#8fd8ff"
        />
        <Sparkles
          count={50}
          position={[0, 20, 0]}
          scale={[100, 8, 100]}
          size={1.2}
          speed={0.08}
          opacity={0.35}
          color="#ffcf3f"
        />
      </Suspense>
      <CameraRig />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.75}
          luminanceThreshold={0.28}
          luminanceSmoothing={0.3}
          mipmapBlur
          levels={5}
          radius={0.4}
        />
        <HueSaturation saturation={0.35} />
        <BrightnessContrast brightness={0.0} contrast={0.08} />
        <Vignette eskil={false} offset={0.2} darkness={0.75} />
      </EffectComposer>
    </Canvas>
  );
}
