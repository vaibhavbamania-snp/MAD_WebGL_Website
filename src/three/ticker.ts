// A single shared requestAnimationFrame loop for the DOM-overlay HUD bits
// (TopBar progress, SignalHUD, CinematicCaption, DataOverlay). Each of those
// polls plain mutable state (scrollState/telemetry) and writes directly to
// refs — subscribing them to one rAF instead of each running its own avoids
// stacking up N redundant frame callbacks for the same 60Hz tick.
type TickFn = () => void;

const listeners = new Set<TickFn>();
let rafId: number | null = null;

function loop() {
  listeners.forEach((fn) => fn());
  rafId = requestAnimationFrame(loop);
}

export function subscribeTick(fn: TickFn): () => void {
  listeners.add(fn);
  if (rafId === null) {
    rafId = requestAnimationFrame(loop);
  }
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}
