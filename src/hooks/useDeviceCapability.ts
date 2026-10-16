import { useEffect, useState } from "react";

export type RenderMode = "3d" | "2d";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    return !!gl;
  } catch {
    return false;
  }
}

function isLowEndHeuristic(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const narrow = window.innerWidth < 720;

  if (memory <= 2 || cores <= 2) return true;
  if (isMobileUA && narrow && (cores <= 4 || memory <= 4)) return true;
  return false;
}

/** Decides between the full WebGL experience and the lightweight 2D fallback,
 * with a manual override the user can flip and that persists for the tab. */
export function useDeviceCapability() {
  const [mode, setMode] = useState<RenderMode | null>(null);
  const [auto, setAuto] = useState<RenderMode>("3d");

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const webgl = detectWebGL();
    const lowEnd = isLowEndHeuristic();
    const decided: RenderMode = !webgl || reducedMotion || lowEnd ? "2d" : "3d";
    setAuto(decided);

    const stored = sessionStorage.getItem("mad-render-mode") as RenderMode | null;
    setMode(stored ?? decided);
  }, []);

  function setOverride(next: RenderMode) {
    sessionStorage.setItem("mad-render-mode", next);
    setMode(next);
  }

  return { mode, auto, setOverride };
}
