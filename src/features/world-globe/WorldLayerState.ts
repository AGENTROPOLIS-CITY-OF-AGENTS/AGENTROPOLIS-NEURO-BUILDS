import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StackLayer } from "@/lib/world-stack";
import type { ComputeWeight } from "@/lib/design-system";
import { ZOOM_MID, type SemanticView } from "./world-globe.types";
import { clampZoom, layerFromZoom, viewFromZoom } from "./SemanticCamera";

type Snap = {
  zoomLevel: number;
  selectedRegion: string | null;
  selectedCity: string | null;
  selectedDistrict: string | null;
  selectedMission: string | null;
  selectedObject: string | null;
};

type ScpState = {
  zoomLevel: number;
  selectedRegion: string | null;
  selectedCity: string | null;
  selectedDistrict: string | null;
  selectedMission: string | null;
  selectedObject: string | null;
  reducedMotion: boolean;
  calm: boolean;
  highContrast: boolean;
  density: "full" | "quiet";
  soundEnabled: boolean;
  cameraInterrupted: boolean;
  history: Snap[];
  setZoom: (z: number) => void;
  nudgeZoom: (delta: number) => void;
  goView: (view: SemanticView) => void;
  goLayer: (layer: StackLayer) => void;
  pickRegion: (id: string) => void;
  pickDistrict: (id: string) => void;
  pickMission: (id: string) => void;
  pickObject: (id: string | null) => void;
  interruptCamera: () => void;
  clearInterrupt: () => void;
  back: () => boolean;
  setFlag: (key: "calm" | "highContrast" | "soundEnabled" | "reducedMotion", value: boolean) => void;
  setDensity: (d: "full" | "quiet") => void;
};

function snapOf(s: Snap): Snap {
  return { ...s };
}

const LAYER_VIEW: Record<StackLayer, SemanticView> = {
  orbit: "orbit",
  atlas: "atlas",
  grid: "grid",
  city: "city",
  worldq: "worldq",
};

export const useWorldLayer = create<ScpState>()(
  persist(
    (set, get) => ({
      zoomLevel: ZOOM_MID.atlas,
      selectedRegion: null,
      selectedCity: null,
      selectedDistrict: null,
      selectedMission: null,
      selectedObject: null,
      reducedMotion: false,
      calm: false,
      highContrast: false,
      density: "full",
      soundEnabled: true,
      cameraInterrupted: false,
      history: [],
      setZoom: (z) =>
        set({
          zoomLevel: clampZoom(z),
          cameraInterrupted: false,
        }),
      nudgeZoom: (delta) => {
        const next = clampZoom(get().zoomLevel + delta);
        set({ zoomLevel: next, cameraInterrupted: false });
      },
      goView: (view) => {
        const cur = get();
        set({
          history: [...cur.history, snapOf(cur)].slice(-12),
          zoomLevel: ZOOM_MID[view],
          cameraInterrupted: false,
        });
      },
      goLayer: (layer) => get().goView(LAYER_VIEW[layer]),
      pickRegion: (id) => {
        const cur = get();
        const city = id === "agentropolis";
        set({
          history: [...cur.history, snapOf(cur)].slice(-12),
          selectedRegion: id,
          selectedCity: city ? "agentropolis" : cur.selectedCity,
          zoomLevel: city ? ZOOM_MID.city : cur.zoomLevel < 0.32 ? ZOOM_MID.atlas : ZOOM_MID.grid,
          cameraInterrupted: false,
        });
      },
      pickDistrict: (id) => {
        const cur = get();
        set({
          history: [...cur.history, snapOf(cur)].slice(-12),
          selectedDistrict: id,
          selectedCity: "agentropolis",
          selectedRegion: "agentropolis",
          zoomLevel: ZOOM_MID.district,
          cameraInterrupted: false,
        });
      },
      pickMission: (id) => {
        const cur = get();
        set({
          history: [...cur.history, snapOf(cur)].slice(-12),
          selectedMission: id,
          zoomLevel: ZOOM_MID.worldq,
          cameraInterrupted: false,
        });
      },
      pickObject: (id) => set({ selectedObject: id }),
      interruptCamera: () => set({ cameraInterrupted: true }),
      clearInterrupt: () => set({ cameraInterrupted: false }),
      back: () => {
        const hist = get().history;
        const prev = hist[hist.length - 1];
        if (!prev) {
          const z = get().zoomLevel;
          if (z <= 0.16) return false;
          set({ zoomLevel: clampZoom(z - 0.18), cameraInterrupted: false });
          return true;
        }
        set({ ...prev, history: hist.slice(0, -1), cameraInterrupted: false });
        return true;
      },
      setFlag: (key, value) => set({ [key]: value }),
      setDensity: (d) => set({ density: d }),
    }),
    {
      name: "agentropolis.scp.state",
      partialize: (s) => ({
        zoomLevel: s.zoomLevel,
        selectedRegion: s.selectedRegion,
        selectedCity: s.selectedCity,
        selectedDistrict: s.selectedDistrict,
        selectedMission: s.selectedMission,
        selectedObject: s.selectedObject,
        calm: s.calm,
        highContrast: s.highContrast,
        density: s.density,
        soundEnabled: s.soundEnabled,
      }),
    },
  ),
);

export function scpView(zoom: number): SemanticView {
  return viewFromZoom(zoom);
}

export function scpLayer(zoom: number): StackLayer {
  return layerFromZoom(zoom);
}

export function useScpDerived() {
  const zoom = useWorldLayer((s) => s.zoomLevel);
  return { zoom, view: viewFromZoom(zoom), layer: layerFromZoom(zoom) };
}

export type { ComputeWeight };
