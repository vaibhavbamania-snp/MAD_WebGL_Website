import { useEffect, useRef } from "react";
import { telemetry } from "../three/telemetry";
import { subscribeTick } from "../three/ticker";
import { ScatterFitGraph, SparklineGraph } from "./MiniGraph";

interface Placed {
  top: string;
  left?: string;
  right?: string;
  start: number;
  end: number;
}

const equations: (Placed & { text: string })[] = [
  { text: "ŷ = β₀ + β₁x", top: "13%", left: "6%", start: 0.12, end: 0.42 },
  { text: "L(β) = Σ(yᵢ − ŷᵢ)²", top: "9%", right: "9%", start: 0.18, end: 0.48 },
  { text: "β = (XᵀX)⁻¹Xᵀy", top: "23%", right: "22%", start: 0.24, end: 0.54 },
  { text: "y = a₀ + a₁x + a₂x² + a₃x³", top: "40%", left: "4%", start: 0.3, end: 0.6 },
  { text: "R² = 1 − SSres⁄SStot", top: "60%", right: "6%", start: 0.34, end: 0.64 },
  { text: "K = PHᵀ(HPHᵀ + R)⁻¹", top: "72%", left: "9%", start: 0.4, end: 0.7 },
  { text: "x̂ₖ = Fx̂ₖ₋₁ + Buₖ", top: "86%", right: "16%", start: 0.44, end: 0.74 },
  { text: "x(t) = x₀ + v₀t + ½at²", top: "31%", left: "37%", start: 0.2, end: 0.5 },
];

const stats: (Placed & { label: string; value: string })[] = [
  { label: "R²", value: "0.962", top: "19%", left: "23%", start: 0.16, end: 0.46 },
  { label: "RMSE", value: "1.4 m", top: "50%", left: "13%", start: 0.26, end: 0.56 },
  { label: "STD DEV", value: "±0.8 m", top: "65%", right: "24%", start: 0.36, end: 0.66 },
  { label: "SAMPLES", value: "n = 1,204", top: "80%", left: "29%", start: 0.42, end: 0.72 },
  { label: "CONFIDENCE", value: "94.2%", top: "15%", right: "31%", start: 0.22, end: 0.52 },
  { label: "VELOCITY EST.", value: "11.2 m/s", top: "91%", right: "35%", start: 0.46, end: 0.76 },
];

const graphs: (Placed & { kind: "scatter" | "spark"; color: string })[] = [
  { kind: "scatter", color: "#7fd7ff", top: "35%", right: "9%", start: 0.28, end: 0.58 },
  { kind: "spark", color: "#ffcf3f", top: "67%", left: "17%", start: 0.38, end: 0.68 },
];

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/** Background "the model is working" dressing: regression / curve-fitting
 * equations, stat readouts, and a couple of line graphs that fade in as the
 * camera goes underground and recede again on resurfacing. Pure opacity/
 * transform driven by telemetry.underground on its own rAF loop — no React
 * state, so it costs nothing on top of the existing HUD loops. */
export function DataOverlay() {
  const eqRefs = useRef<(HTMLDivElement | null)[]>([]);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);
  const graphRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bannerRef = useRef<HTMLDivElement>(null);
  const lastU = useRef(-1);

  useEffect(() => {
    return subscribeTick(() => {
      const u = telemetry.underground;
      // Idle frames (resting between scroll steps) vastly outnumber moving
      // ones — skip the ~17-element style pass entirely when nothing moved.
      if (Math.abs(u - lastU.current) < 0.0008) return;
      lastU.current = u;

      eqRefs.current.forEach((el, i) => {
        if (!el) return;
        const item = equations[i];
        const p = smoothstep(item.start, item.end, u);
        el.style.opacity = String(p * 0.55);
        el.style.transform = `translateY(${(1 - p) * 10}px)`;
      });

      statRefs.current.forEach((el, i) => {
        if (!el) return;
        const item = stats[i];
        const p = smoothstep(item.start, item.end, u);
        el.style.opacity = String(p * 0.65);
        el.style.transform = `translateY(${(1 - p) * 8}px)`;
      });

      graphRefs.current.forEach((el, i) => {
        if (!el) return;
        const item = graphs[i];
        const p = smoothstep(item.start, item.end, u);
        el.style.opacity = String(p * 0.5);
        el.style.transform = `translateY(${(1 - p) * 12}px)`;
      });

      if (bannerRef.current) {
        const p = smoothstep(0.48, 0.68, u);
        bannerRef.current.style.opacity = String(p * 0.9);
        bannerRef.current.style.transform = `translate(-50%, ${(1 - p) * -6}px)`;
      }
    });
  }, []);

  return (
    <div className="data-overlay" aria-hidden="true">
      {equations.map((item, i) => (
        <div
          key={item.text}
          ref={(el) => {
            eqRefs.current[i] = el;
          }}
          className="data-overlay__eq"
          style={{ top: item.top, left: item.left, right: item.right }}
        >
          {item.text}
        </div>
      ))}

      {stats.map((item, i) => (
        <div
          key={item.label}
          ref={(el) => {
            statRefs.current[i] = el;
          }}
          className="data-overlay__stat"
          style={{ top: item.top, left: item.left, right: item.right }}
        >
          <span className="data-overlay__stat-label">{item.label}</span>
          <span className="data-overlay__stat-value">{item.value}</span>
        </div>
      ))}

      {graphs.map((item, i) => (
        <div
          key={i}
          ref={(el) => {
            graphRefs.current[i] = el;
          }}
          className="data-overlay__graph"
          style={{ top: item.top, left: item.left, right: item.right, color: item.color }}
        >
          {item.kind === "scatter" ? (
            <ScatterFitGraph color={item.color} />
          ) : (
            <SparklineGraph color={item.color} />
          )}
        </div>
      ))}

      <div className="data-overlay__banner" ref={bannerRef}>
        Estimates &amp; predictions take over
      </div>
    </div>
  );
}
