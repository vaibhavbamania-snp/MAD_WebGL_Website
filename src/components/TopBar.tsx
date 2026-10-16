import { useEffect, useRef } from "react";
import { scrollState } from "../three/scrollState";
import { subscribeTick } from "../three/ticker";
import type { RenderMode } from "../hooks/useDeviceCapability";

export function TopBar({
  mode,
  onToggleMode,
}: {
  mode: RenderMode;
  onToggleMode: () => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode !== "3d") return;
    return subscribeTick(() => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${scrollState.raw})`;
    });
  }, [mode]);

  return (
    <header className="top-bar">
      <div className="top-bar__brand">
        <span className="top-bar__mark" aria-hidden />
        MAD <span className="top-bar__brand-sub">Metro Assist &middot; Delhi</span>
      </div>
      <button className="top-bar__toggle" onClick={onToggleMode} type="button">
        {mode === "3d" ? "Simplified view" : "Full 3D experience"}
      </button>
      {mode === "3d" && (
        <div className="top-bar__progress">
          <div className="top-bar__progress-fill" ref={barRef} />
        </div>
      )}
    </header>
  );
}
