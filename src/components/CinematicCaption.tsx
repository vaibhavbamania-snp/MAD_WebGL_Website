import { useEffect, useRef } from "react";
import { telemetry } from "../three/telemetry";
import { subscribeTick } from "../three/ticker";

/** Bottom-left caption that tracks whatever the camera is currently looking
 * at, cross-fading only when the underlying text actually changes. */
export function CinematicCaption() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const lastLabel = useRef("");

  useEffect(() => {
    return subscribeTick(() => {
      if (telemetry.label !== lastLabel.current) {
        lastLabel.current = telemetry.label;
        if (labelRef.current) labelRef.current.textContent = telemetry.label;
        if (subRef.current) subRef.current.textContent = telemetry.sub;
        wrapRef.current?.classList.remove("caption--pulse");
        // force reflow so the animation can restart
        void wrapRef.current?.offsetWidth;
        wrapRef.current?.classList.add("caption--pulse");
      }
    });
  }, []);

  return (
    <div className="cinematic-caption" ref={wrapRef}>
      <div className="cinematic-caption__label" ref={labelRef} />
      <div className="cinematic-caption__sub" ref={subRef} />
    </div>
  );
}
