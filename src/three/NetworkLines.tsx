import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { lines, stationById } from "../data/metroNetwork";

function buildCurvePoints(stationIds: string[], samplesPerSpan = 8): THREE.Vector3[] {
  const controlPoints = stationIds.map((id) => {
    const [x, y, z] = stationById.get(id)!.pos;
    return new THREE.Vector3(x, y, z);
  });
  const curve = new THREE.CatmullRomCurve3(controlPoints, false, "catmullrom", 0.15);
  return curve.getPoints((controlPoints.length - 1) * samplesPerSpan);
}

/** Renders every metro line as a glowing tri-strip line, plus a faint wireframe
 * "bore" around segments that run underground to read as a tunnel. */
export function NetworkLines() {
  const lineData = useMemo(
    () =>
      lines.map((line) => ({
        line,
        points: buildCurvePoints(line.stationIds),
      })),
    [],
  );

  const tunnels = useMemo(() => {
    const tubes: { key: string; points: THREE.Vector3[]; color: string }[] = [];
    for (const { line, points } of lineData) {
      let start = -1;
      for (let i = 0; i < points.length; i++) {
        const underground = points[i].y < -1.5;
        if (underground && start === -1) start = i;
        if ((!underground || i === points.length - 1) && start !== -1) {
          const end = underground ? i : i - 1;
          if (end - start > 2) {
            tubes.push({ key: `${line.id}-${start}`, points: points.slice(start, end + 1), color: line.color });
          }
          start = -1;
        }
      }
    }
    return tubes;
  }, [lineData]);

  return (
    <group>
      {lineData.map(({ line, points }) => (
        <group key={line.id}>
          {/* outer colored halo — wide + soft, feeds the bloom pass */}
          <Line points={points} color={line.color} lineWidth={5} toneMapped={false} transparent opacity={0.22} />
          {/* saturated core — reads clearly at any zoom */}
          <Line points={points} color={line.color} lineWidth={2.4} toneMapped={false} transparent opacity={0.95} />
        </group>
      ))}
      {tunnels.map((t) => (
        <TunnelBore key={t.key} points={t.points} color={t.color} />
      ))}
    </group>
  );
}

function TunnelBore({ points, color }: { points: THREE.Vector3[]; color: string }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points);
    // Kept deliberately low-poly: this is a decorative wireframe silhouette,
    // not a hero asset, and wireframe rendering already costs far more than
    // a filled mesh at the same segment count.
    const tubularSegments = Math.min(18, Math.max(6, Math.round(points.length / 3)));
    return new THREE.TubeGeometry(curve, tubularSegments, 1.1, 7, false);
  }, [points]);

  const dimColor = useMemo(() => new THREE.Color(color).lerp(new THREE.Color("#060314"), 0.55), [color]);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color={dimColor}
        wireframe
        transparent
        opacity={0.12}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
