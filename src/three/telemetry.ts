// Shared, mutation-only telemetry bridge from the R3F render loop to the DOM
// HUD overlay. Written every frame by CameraRig, read every frame by
// SignalHUD via its own rAF loop — never touches React state.
export const telemetry = {
  underground: 0,
  label: "",
  sub: "",
};
