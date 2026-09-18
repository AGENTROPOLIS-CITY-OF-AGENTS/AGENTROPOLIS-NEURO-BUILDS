import type { StackLayer } from "@/lib/world-stack";
import type { ComputeWeight } from "@/lib/design-system";

export type SemanticView = "orbit" | "atlas" | "grid" | "city" | "district" | "worldq";

export type ScpNav = {
  currentLayer: StackLayer;
  view: SemanticView;
  selectedRegion: string | null;
  selectedCity: string | null;
  selectedDistrict: string | null;
  selectedMission: string | null;
  selectedObject: string | null;
  zoomLevel: number;
  viewMode: ComputeWeight;
  reducedMotion: boolean;
  calm: boolean;
  highContrast: boolean;
  density: "full" | "quiet";
  soundEnabled: boolean;
  cameraInterrupted: boolean;
};

export const ZOOM_BANDS: { view: SemanticView; layer: StackLayer; from: number; to: number }[] = [
  { view: "orbit", layer: "orbit", from: 0, to: 0.15 },
  { view: "atlas", layer: "atlas", from: 0.15, to: 0.32 },
  { view: "grid", layer: "grid", from: 0.32, to: 0.5 },
  { view: "city", layer: "city", from: 0.5, to: 0.72 },
  { view: "district", layer: "city", from: 0.72, to: 0.88 },
  { view: "worldq", layer: "worldq", from: 0.88, to: 1 },
];

export const ZOOM_MID: Record<SemanticView, number> = {
  orbit: 0.07,
  atlas: 0.23,
  grid: 0.41,
  city: 0.61,
  district: 0.8,
  worldq: 0.94,
};
