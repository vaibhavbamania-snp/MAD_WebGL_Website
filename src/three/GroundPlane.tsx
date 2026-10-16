import { Grid } from "@react-three/drei";
import { theme } from "./theme";

/** A faint technical grid at street level — crossing below it is what reads
 * as "underground" for the rest of the scene. */
export function GroundPlane() {
  return (
    <Grid
      position={[0, 0, 0]}
      args={[140, 140]}
      cellSize={2}
      cellThickness={0.5}
      cellColor={theme.gridFaint}
      sectionSize={10}
      sectionThickness={1}
      sectionColor={theme.grid}
      fadeDistance={95}
      fadeStrength={1.5}
      infiniteGrid={false}
      followCamera={false}
    />
  );
}
