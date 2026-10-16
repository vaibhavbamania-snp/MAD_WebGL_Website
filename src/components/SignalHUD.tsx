import { useEffect, useRef } from "react";
import { telemetry } from "../three/telemetry";
import { subscribeTick } from "../three/ticker";

/** Top-right technical readout: GPS fix strength vs. MAD's predicted-position
 * confidence. Polls the telemetry bridge on the shared tick — no React
 * re-renders, and no DOM writes on frames where nothing changed. */
export function SignalHUD() {
  const gpsValueRef = useRef<HTMLSpanElement>(null);
  const gpsBarRef = useRef<HTMLDivElement>(null);
  const gpsStatusRef = useRef<HTMLSpanElement>(null);
  const predValueRef = useRef<HTMLSpanElement>(null);
  const predStatusRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const last = useRef({ gps: -1, confidence: -1, predicting: false, gpsStatus: "" });

  useEffect(() => {
    return subscribeTick(() => {
      const u = telemetry.underground;
      const gps = Math.max(0, Math.round((1 - u) * 100));
      const predicting = u > 0.2;
      const confidence = Math.round(90 + u * 8);
      const gpsStatus = gps > 60 ? "GPS LOCK" : gps > 5 ? "GPS DEGRADED" : "GPS: NO FIX";

      if (gps !== last.current.gps) {
        if (gpsValueRef.current) gpsValueRef.current.textContent = `${gps}%`;
        if (gpsBarRef.current) gpsBarRef.current.style.transform = `scaleX(${Math.max(0.02, gps / 100)})`;
        last.current.gps = gps;
      }
      if (gpsStatus !== last.current.gpsStatus) {
        if (gpsStatusRef.current) gpsStatusRef.current.textContent = gpsStatus;
        last.current.gpsStatus = gpsStatus;
      }
      if (confidence !== last.current.confidence || predicting !== last.current.predicting) {
        if (predValueRef.current) predValueRef.current.textContent = predicting ? `${confidence}%` : "—";
        last.current.confidence = confidence;
      }
      if (predicting !== last.current.predicting) {
        if (predStatusRef.current) predStatusRef.current.textContent = predicting ? "MAD PREDICTING" : "STANDBY";
        if (rootRef.current) rootRef.current.dataset.predicting = String(predicting);
        last.current.predicting = predicting;
      }
    });
  }, []);

  return (
    <div className="signal-hud" ref={rootRef}>
      <div className="signal-hud__row">
        <span className="signal-hud__label">GPS FIX</span>
        <span className="signal-hud__value" ref={gpsValueRef}>
          100%
        </span>
      </div>
      <div className="signal-hud__bar">
        <div className="signal-hud__bar-fill signal-hud__bar-fill--gps" ref={gpsBarRef} />
      </div>
      <span className="signal-hud__status" ref={gpsStatusRef}>
        GPS LOCK
      </span>

      <div className="signal-hud__divider" />

      <div className="signal-hud__row">
        <span className="signal-hud__label">MAD PREDICTION</span>
        <span className="signal-hud__value signal-hud__value--accent" ref={predValueRef}>
          —
        </span>
      </div>
      <span className="signal-hud__status signal-hud__status--accent" ref={predStatusRef}>
        STANDBY
      </span>
    </div>
  );
}
