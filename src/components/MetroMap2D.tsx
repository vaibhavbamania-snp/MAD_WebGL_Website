import { useMemo } from "react";
import { lines, stations, stationById, predictedJourney } from "../data/metroNetwork";

interface Point {
  x: number;
  y: number;
  underground: boolean;
}

function project(pos: readonly [number, number, number]): Point {
  return { x: pos[0], y: pos[2], underground: pos[1] < -1.5 };
}

/** A static (SMIL-animated) SVG schematic of the network for low-end / no-WebGL
 * devices. No per-frame JS — the train dot animates natively via <animateMotion>. */
export function MetroMap2D() {
  const bounds = useMemo(() => {
    const xs = stations.map((s) => s.pos[0]);
    const zs = stations.map((s) => s.pos[2]);
    const pad = 6;
    return {
      minX: Math.min(...xs) - pad,
      maxX: Math.max(...xs) + pad,
      minY: Math.min(...zs) - pad,
      maxY: Math.max(...zs) + pad,
    };
  }, []);

  const w = bounds.maxX - bounds.minX;
  const h = bounds.maxY - bounds.minY;

  const linePaths = useMemo(
    () =>
      lines.map((line) => {
        const pts = line.stationIds.map((id) => project(stationById.get(id)!.pos));
        const segments: { d: string; underground: boolean }[] = [];
        for (let i = 0; i < pts.length - 1; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          segments.push({
            d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`,
            underground: a.underground && b.underground,
          });
        }
        return { line, segments };
      }),
    [],
  );

  const predictedD = useMemo(() => {
    const pts = predictedJourney.map((id) => project(stationById.get(id)!.pos));
    return pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, []);

  return (
    <svg
      className="metro-map-2d"
      viewBox={`${bounds.minX} ${bounds.minY} ${w} ${h}`}
      role="img"
      aria-label="Schematic map of the Delhi Metro network with the MAD-predicted underground route highlighted"
    >
      <defs>
        <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="bg-glow" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#241a45" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#0d1430" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#060314" stopOpacity="0" />
        </radialGradient>
        <path id="predicted-path" d={predictedD} />
      </defs>

      <rect x={bounds.minX} y={bounds.minY} width={w} height={h} fill="url(#bg-glow)" />

      <g filter="url(#glow)">
        {linePaths.map(({ line, segments }) =>
          segments.map((seg, i) => (
            <path
              key={`${line.id}-${i}`}
              d={seg.d}
              stroke={line.color}
              strokeWidth={1.05}
              strokeDasharray={seg.underground ? "1.4 1.1" : undefined}
              opacity={seg.underground ? 0.6 : 0.95}
              fill="none"
              strokeLinecap="round"
            />
          )),
        )}

        <path d={predictedD} stroke="#ffcf3f" strokeWidth={3} fill="none" opacity={0.3} strokeLinecap="round" />
        <path d={predictedD} stroke="#ffcf3f" strokeWidth={1.3} fill="none" opacity={0.95} strokeLinecap="round" />

        {stations.map((s) => (
          <circle
            key={s.id}
            cx={s.pos[0]}
            cy={s.pos[2]}
            r={s.lines.length > 1 ? 1.35 : 0.7}
            fill={s.lines.length > 1 ? "#ffffff" : "#eaf6ff"}
            opacity={0.95}
          />
        ))}
      </g>

      <circle r="2" fill="#ffcf3f" filter="url(#glow)">
        <animateMotion dur="9s" repeatCount="indefinite" rotate="auto">
          <mpath href="#predicted-path" />
        </animateMotion>
      </circle>
    </svg>
  );
}
