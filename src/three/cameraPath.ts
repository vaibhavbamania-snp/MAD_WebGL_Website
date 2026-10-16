import { stationById } from "../data/metroNetwork";
import type { Vec3 } from "../data/metroNetwork";

export interface CameraKeyframe {
  t: number;
  position: Vec3;
  lookAt: Vec3;
  /** 0 = full signal / surface daylight, 1 = fully underground / signal lost */
  underground: number;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  /** narrative caption shown in the HUD near this keyframe */
  label: string;
  sub: string;
}

const ina = stationById.get("ina")!.pos;
const centralSecretariat = stationById.get("central-secretariat")!.pos;
const rajivChowk = stationById.get("rajiv-chowk")!.pos;
const kashmereGate = stationById.get("kashmere-gate")!.pos;
const vishwavidyalaya = stationById.get("vishwavidyalaya")!.pos;
const jahangirpuri = stationById.get("jahangirpuri")!.pos;

export const cameraKeyframes: CameraKeyframe[] = [
  {
    t: 0,
    position: [16, 46, 48],
    lookAt: [0, -2, 0],
    underground: 0,
    fogColor: "#050810",
    fogNear: 60,
    fogFar: 160,
    label: "MAD",
    sub: "Metro Assist — Delhi",
  },
  {
    t: 0.16,
    position: [ina[0] + 9, ina[1] + 9, ina[2] + 10],
    lookAt: ina,
    underground: 0,
    fogColor: "#070b16",
    fogNear: 40,
    fogFar: 120,
    label: "Every journey starts on the surface",
    sub: "GPS lock: strong. Position confirmed by satellite.",
  },
  {
    t: 0.33,
    position: [centralSecretariat[0] + 8, centralSecretariat[1] + 4, centralSecretariat[2] + 4],
    lookAt: centralSecretariat,
    underground: 0.35,
    fogColor: "#080a14",
    fogNear: 26,
    fogFar: 95,
    label: "Then the descent begins",
    sub: "Signal weakening as the line drops below street level.",
  },
  {
    t: 0.5,
    position: [rajivChowk[0] + 7, rajivChowk[1] - 0.5, rajivChowk[2] - 8],
    lookAt: rajivChowk,
    underground: 0.75,
    fogColor: "#05060c",
    fogNear: 14,
    fogFar: 60,
    label: "Underground, GPS goes dark",
    sub: "No satellite fix is possible below grade.",
  },
  {
    t: 0.64,
    position: [kashmereGate[0] + 5, kashmereGate[1] - 1, kashmereGate[2] - 6],
    lookAt: kashmereGate,
    underground: 1,
    fogColor: "#040509",
    fogNear: 8,
    fogFar: 34,
    label: "MAD keeps predicting your position",
    sub: "Velocity, dwell time, and line topology replace the satellite fix.",
  },
  {
    t: 0.78,
    position: [vishwavidyalaya[0] + 6, vishwavidyalaya[1] - 0.5, vishwavidyalaya[2] - 7],
    lookAt: vishwavidyalaya,
    underground: 0.9,
    fogColor: "#05060b",
    fogNear: 10,
    fogFar: 40,
    label: "Every junction, every dwell — modeled",
    sub: "The predicted position tracks the train through the network graph.",
  },
  {
    t: 0.9,
    position: [jahangirpuri[0] + 11, jahangirpuri[1] + 8, jahangirpuri[2] - 10],
    lookAt: jahangirpuri,
    underground: 0.1,
    fogColor: "#070c17",
    fogNear: 30,
    fogFar: 100,
    label: "Signal reacquired",
    sub: "The predicted and the real position converge again.",
  },
  {
    t: 1,
    position: [-22, 52, 54],
    lookAt: [-2, -3, -8],
    underground: 0,
    fogColor: "#050810",
    fogNear: 60,
    fogFar: 170,
    label: "MAD never loses the thread",
    sub: "A continuous journey — above ground and below it.",
  },
];

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function lerp3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function lerpColor(a: string, b: string, t: number): [number, number, number] {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 255, ag = (pa >> 8) & 255, ab = pa & 255;
  const br = (pb >> 16) & 255, bg = (pb >> 8) & 255, bb = pb & 255;
  return [(ar + (br - ar) * t) / 255, (ag + (bg - ag) * t) / 255, (ab + (bb - ab) * t) / 255];
}

export interface SampledCamera {
  position: Vec3;
  lookAt: Vec3;
  underground: number;
  fogColor: [number, number, number];
  fogNear: number;
  fogFar: number;
  segmentIndex: number;
  segmentT: number;
}

/** Sample the keyframe path at progress t in [0,1] with eased interpolation. */
export function sampleCameraPath(t: number): SampledCamera {
  const kf = cameraKeyframes;
  let i = 0;
  for (; i < kf.length - 2; i++) {
    if (t < kf[i + 1].t) break;
  }
  const a = kf[i];
  const b = kf[i + 1];
  const span = b.t - a.t || 1;
  const localT = smoothstep(0, 1, (t - a.t) / span);

  return {
    position: lerp3(a.position, b.position, localT),
    lookAt: lerp3(a.lookAt, b.lookAt, localT),
    underground: a.underground + (b.underground - a.underground) * localT,
    fogColor: lerpColor(a.fogColor, b.fogColor, localT),
    fogNear: a.fogNear + (b.fogNear - a.fogNear) * localT,
    fogFar: a.fogFar + (b.fogFar - a.fogFar) * localT,
    segmentIndex: i,
    segmentT: localT,
  };
}
