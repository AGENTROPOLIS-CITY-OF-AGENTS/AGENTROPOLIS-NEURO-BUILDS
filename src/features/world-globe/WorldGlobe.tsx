import { WorldStackWorld } from "@/components/world-stack-world";
import type { CityGfx } from "@/lib/gfx";
import type { StackLayer } from "@/lib/world-stack";

/** Public globe module. Appearance lives in the existing WorldStackWorld scene. */
export function WorldGlobe(props: {
  layer: StackLayer;
  region: string | null;
  gfx: CityGfx;
  reduced: boolean;
  paused: boolean;
  zoom: number;
  interrupted: boolean;
  calm: boolean;
  onRegion: (id: string) => void;
  onEnterCity: () => void;
  onPointer: () => void;
  globeDistrict?: string | null;
  globeChild?: string | null;
  onGlobe?: (id: string) => void;
}) {
  return <WorldStackWorld {...props} />;
}
