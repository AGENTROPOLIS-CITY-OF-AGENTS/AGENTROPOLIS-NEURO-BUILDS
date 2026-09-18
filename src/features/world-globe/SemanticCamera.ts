import { STACK_CAM, type StackLayer } from "@/lib/world-stack";
import { ZOOM_BANDS, type SemanticView } from "./world-globe.types";

export type CamPose = { pos: [number, number, number]; look: [number, number, number]; fov: number };

const KEYS: { z: number; layer: StackLayer }[] = [
  { z: 0, layer: "orbit" },
  { z: 0.23, layer: "atlas" },
  { z: 0.41, layer: "grid" },
  { z: 0.61, layer: "city" },
  { z: 0.94, layer: "worldq" },
];

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function clampZoom(z: number) {
  return Math.max(0, Math.min(1, z));
}

export function viewFromZoom(z: number): SemanticView {
  const v = ZOOM_BANDS.find((b) => z < b.to) ?? ZOOM_BANDS[ZOOM_BANDS.length - 1]!;
  return v.view;
}

export function layerFromZoom(z: number): StackLayer {
  const v = ZOOM_BANDS.find((b) => z < b.to) ?? ZOOM_BANDS[ZOOM_BANDS.length - 1]!;
  return v.layer;
}

export function camAt(zoom: number): CamPose {
  const z = clampZoom(zoom);
  if (z <= KEYS[0]!.z) return STACK_CAM[KEYS[0]!.layer];
  for (let i = 1; i < KEYS.length; i++) {
    const b = KEYS[i]!;
    if (z <= b.z) {
      const a = KEYS[i - 1]!;
      const t = (z - a.z) / (b.z - a.z);
      const A = STACK_CAM[a.layer];
      const B = STACK_CAM[b.layer];
      return {
        pos: [mix(A.pos[0], B.pos[0], t), mix(A.pos[1], B.pos[1], t), mix(A.pos[2], B.pos[2], t)],
        look: [mix(A.look[0], B.look[0], t), mix(A.look[1], B.look[1], t), mix(A.look[2], B.look[2], t)],
        fov: mix(A.fov, B.fov, t),
      };
    }
  }
  return STACK_CAM.worldq;
}
