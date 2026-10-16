import { useEffect } from "react";
import { setScrollProgress } from "../three/scrollState";

/** Drives the module-level scroll progress from plain document scroll —
 * no scroll-hijacking, so wheel/touch/keyboard scrolling all just work. */
export function useScrollProgress(active: boolean) {
  useEffect(() => {
    if (!active) return;

    function update() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      setScrollProgress(progress);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [active]);
}
