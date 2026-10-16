import { useMemo } from "react";
import * as THREE from "three";
import { stations, lines } from "../data/metroNetwork";
import { theme } from "./theme";

const lineColor = new Map(lines.map((l) => [l.id, l.color]));

/** All station nodes as merged instanced meshes (halos + cores + interchange
 * rings) so the whole network's ~40 stations cost only a handful of draw calls. */
export function Stations() {
  const simple = useMemo(() => stations.filter((s) => s.lines.length === 1), []);
  const interchanges = useMemo(() => stations.filter((s) => s.lines.length > 1), []);

  const haloGeo = useMemo(() => new THREE.SphereGeometry(0.11, 12, 12), []);
  const simpleGeo = useMemo(() => new THREE.SphereGeometry(0.15, 14, 14), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(0.3, 0.032, 8, 24), []);
  const coreGeo = useMemo(() => new THREE.SphereGeometry(0.17, 16, 16), []);
  const interchangeHaloGeo = useMemo(() => new THREE.SphereGeometry(0.14, 14, 14), []);

  return (
    <group>
      {/* soft additive color halo behind every simple station — cheap, reads as neon glow */}
      <instancedMesh
        key={`halo-${simple.length}`}
        args={[haloGeo, undefined, simple.length]}
        ref={(mesh) => {
          if (!mesh) return;
          const dummy = new THREE.Object3D();
          simple.forEach((s, i) => {
            dummy.position.set(...s.pos);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
            mesh.setColorAt(i, new THREE.Color(lineColor.get(s.lines[0]) ?? theme.stationCore));
          });
          mesh.instanceMatrix.needsUpdate = true;
          if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        }}
      >
        <meshBasicMaterial
          toneMapped={false}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      <instancedMesh
        key={`simple-${simple.length}`}
        args={[simpleGeo, undefined, simple.length]}
        ref={(mesh) => {
          if (!mesh) return;
          const dummy = new THREE.Object3D();
          simple.forEach((s, i) => {
            dummy.position.set(...s.pos);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
            mesh.setColorAt(i, new THREE.Color(lineColor.get(s.lines[0]) ?? theme.stationCore));
          });
          mesh.instanceMatrix.needsUpdate = true;
          if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        }}
      >
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* interchanges get a bigger white-hot core + wide additive halo + ring */}
      <instancedMesh
        key={`ihalo-${interchanges.length}`}
        args={[interchangeHaloGeo, undefined, interchanges.length]}
        ref={(mesh) => {
          if (!mesh) return;
          const dummy = new THREE.Object3D();
          interchanges.forEach((s, i) => {
            dummy.position.set(...s.pos);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
          });
          mesh.instanceMatrix.needsUpdate = true;
        }}
      >
        <meshBasicMaterial
          color={theme.interchangeRing}
          toneMapped={false}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      <instancedMesh
        key={`core-${interchanges.length}`}
        args={[coreGeo, undefined, interchanges.length]}
        ref={(mesh) => {
          if (!mesh) return;
          const dummy = new THREE.Object3D();
          interchanges.forEach((s, i) => {
            dummy.position.set(...s.pos);
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
          });
          mesh.instanceMatrix.needsUpdate = true;
        }}
      >
        <meshBasicMaterial color={theme.stationCore} toneMapped={false} />
      </instancedMesh>

      <instancedMesh
        key={`ring-${interchanges.length}`}
        args={[ringGeo, undefined, interchanges.length]}
        ref={(mesh) => {
          if (!mesh) return;
          const dummy = new THREE.Object3D();
          interchanges.forEach((s, i) => {
            dummy.position.set(...s.pos);
            dummy.rotation.x = Math.PI / 2;
            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
          });
          mesh.instanceMatrix.needsUpdate = true;
        }}
      >
        <meshBasicMaterial
          color={theme.interchangeRing}
          toneMapped={false}
          transparent
          opacity={0.75}
        />
      </instancedMesh>
    </group>
  );
}
