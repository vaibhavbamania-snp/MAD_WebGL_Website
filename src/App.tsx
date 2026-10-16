import { Suspense, lazy, useEffect } from "react";
import { useDeviceCapability } from "./hooks/useDeviceCapability";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { TopBar } from "./components/TopBar";
import { SignalHUD } from "./components/SignalHUD";
import { CinematicCaption } from "./components/CinematicCaption";
import { DataOverlay } from "./components/DataOverlay";
import { HeroSection, StorySections, FinalSection } from "./components/NarrativeSections";
import { Experience2D } from "./components/Experience2D";
import "./App.css";

const Experience3D = lazy(() =>
  import("./three/Experience3D").then((m) => ({ default: m.Experience3D })),
);

function App() {
  const { mode, auto, setOverride } = useDeviceCapability();
  const is3D = mode === "3d";
  useScrollProgress(is3D);

  useEffect(() => {
    document.body.dataset.mode = mode ?? auto;
  }, [mode, auto]);

  if (!mode) return null;

  return (
    <div className="app" data-mode={mode}>
      <TopBar
        mode={mode}
        onToggleMode={() => setOverride(mode === "3d" ? "2d" : "3d")}
      />

      {is3D ? (
        <>
          <Suspense fallback={<div className="canvas-loading">Loading network…</div>}>
            <Experience3D />
          </Suspense>
          <DataOverlay />
          <SignalHUD />
          <CinematicCaption />
          <div className="scroll-track">
            <HeroSection />
            <StorySections />
            <FinalSection />
          </div>
        </>
      ) : (
        <Experience2D />
      )}
    </div>
  );
}

export default App;
