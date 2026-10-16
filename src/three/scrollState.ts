// Module-scoped scroll progress, written by a plain `scroll` listener and read
// every frame inside the R3F loop. Kept outside React state so scrubbing the
// camera never triggers a re-render.
export const scrollState = {
  /** raw progress 0..1 from document scroll position */
  raw: 0,
};

export function setScrollProgress(v: number) {
  scrollState.raw = Math.min(1, Math.max(0, v));
}
