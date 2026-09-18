import { useEffect, useState, type ComponentType, type KeyboardEvent, type WheelEvent } from "react";
import { useCompute } from "@/lib/compute";
import { ComputeDock } from "@/components/grid-chrome";
import type { CityGfx } from "@/lib/gfx";
import {
  STACK_BOUNDARY,
  STACK_BY_ID,
  STACK_GOV,
  STACK_INTRO,
  STACK_RAIL,
  STACK_REGIONS,
  STACK_SECONDARY,
  type StackLayer,
} from "@/lib/world-stack";
import { CITY_RUNS } from "@/lib/journeys";
import { DISTRICT_BY_ID } from "@/lib/grid";
import { scpLayer, scpView, useWorldLayer } from "@/features/world-globe/WorldLayerState";
import { CommandHUD } from "@/features/spatial-control-plane/CommandHUD";
import { WORLDQ_OBJECTS } from "@/features/spatial-control-plane/spatial-data";
import { cn } from "@/lib/utils";

type WorldProps = {
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
};

const CITY_NODES = CITY_RUNS.map((s) => DISTRICT_BY_ID[s.districtId]).filter(Boolean);

export function WorldStack({ onClose, onCity }: { onClose: () => void; onCity: () => void }) {
  const [World, setWorld] = useState<ComponentType<WorldProps> | null>(null);
  const [Canvas, setCanvas] = useState<ComponentType<{ killed: boolean }> | null>(null);
  const [paused, setPaused] = useState(false);
  const [killed, setKilled] = useState(false);
  const [compute, setCompute, gfx] = useCompute();
  const zoom = useWorldLayer((s) => s.zoomLevel);
  const region = useWorldLayer((s) => s.selectedRegion);
  const district = useWorldLayer((s) => s.selectedDistrict);
  const mission = useWorldLayer((s) => s.selectedMission);
  const selectedObject = useWorldLayer((s) => s.selectedObject);
  const reduced = useWorldLayer((s) => s.reducedMotion);
  const calm = useWorldLayer((s) => s.calm);
  const contrast = useWorldLayer((s) => s.highContrast);
  const density = useWorldLayer((s) => s.density);
  const interrupted = useWorldLayer((s) => s.cameraInterrupted);
  const nudgeZoom = useWorldLayer((s) => s.nudgeZoom);
  const goLayer = useWorldLayer((s) => s.goLayer);
  const goView = useWorldLayer((s) => s.goView);
  const pickRegion = useWorldLayer((s) => s.pickRegion);
  const pickDistrict = useWorldLayer((s) => s.pickDistrict);
  const pickMission = useWorldLayer((s) => s.pickMission);
  const back = useWorldLayer((s) => s.back);
  const interruptCamera = useWorldLayer((s) => s.interruptCamera);
  const setFlag = useWorldLayer((s) => s.setFlag);
  const setDensity = useWorldLayer((s) => s.setDensity);
  const layer = scpLayer(zoom);
  const view = scpView(zoom);
  const mapMode = compute === "minimum" || !World;
  const worldq = view === "worldq";
  const showCity = view === "city" || view === "district";
  const current = STACK_BY_ID[layer];
  const place = STACK_REGIONS.find((r) => r.id === region);
  const selectedItem = WORLDQ_OBJECTS.find((o) => o.id === selectedObject) ?? null;

  useEffect(() => {
    if (compute === "minimum") {
      setWorld(null);
      return;
    }
    let alive = true;
    void import("@/features/world-globe/WorldGlobe").then((mod) => {
      if (alive) setWorld(() => mod.WorldGlobe);
    });
    return () => {
      alive = false;
    };
  }, [compute]);

  useEffect(() => {
    if (!worldq) {
      setCanvas(null);
      return;
    }
    let alive = true;
    void import("@/features/spatial-control-plane/SpatialCanvas").then((mod) => {
      if (alive) setCanvas(() => mod.SpatialCanvas);
    });
    return () => {
      alive = false;
    };
  }, [worldq]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setFlag("reducedMotion", mq.matches);
    apply();
    mq.addEventListener("change", apply);
    const vis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => {
      mq.removeEventListener("change", apply);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [setFlag]);

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (worldq) return;
    if (Math.abs(e.deltaY) < 18) return;
    nudgeZoom(e.deltaY > 0 ? 0.045 : -0.045);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      if (!back()) onClose();
    } else if (e.key === "+" || e.key === "=") nudgeZoom(0.06);
    else if (e.key === "-" || e.key === "_") nudgeZoom(-0.06);
    else if (e.key === "ArrowDown") nudgeZoom(0.08);
    else if (e.key === "ArrowUp") nudgeZoom(-0.08);
    else if (e.key === "Enter" && view === "city") goView("district");
    else if (e.key === "Enter" && view === "district") {
      pickMission("ms-hold");
    }
  };

  return (
    <div
      data-world-stack
      data-scp-view={view}
      tabIndex={0}
      className={cn(
        "stack-root absolute inset-0 z-[55] flex flex-col bg-[#02040a] text-cyan outline-none",
        contrast && "is-contrast",
        calm && "is-calm",
        density === "quiet" && "is-quiet",
      )}
      onWheel={onWheel}
      onKeyDown={onKey}
    >
      {worldq && Canvas ? (
        <Canvas killed={killed} />
      ) : mapMode ? (
        <StackFallback layer={layer} region={region} onRegion={pickRegion} />
      ) : World ? (
        <div className="absolute inset-0">
          <World
            layer={layer}
            region={region}
            gfx={gfx}
            reduced={reduced}
            paused={paused}
            zoom={zoom}
            interrupted={interrupted}
            calm={calm}
            onRegion={pickRegion}
            onEnterCity={() => goView("district")}
            onPointer={interruptCamera}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#02040a]" />
      )}

      <header className="stack-top relative z-20 flex shrink-0 items-center gap-2 px-3 py-1.5 sm:px-4">
        <button type="button" data-stack-exit onClick={onClose} className="h-11 px-3 font-display text-2xs tracking-[0.16em] text-cyan">
          City
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xs font-bold tracking-[0.14em] text-cyan sm:text-sm">{STACK_INTRO}</p>
          <p className="hidden truncate text-2xs tracking-[0.1em] text-mute uppercase sm:block">{STACK_SECONDARY}</p>
        </div>
        <button type="button" className="h-11 px-2 font-mono text-2xs tracking-[0.12em] text-mute" onClick={() => setFlag("calm", !calm)}>
          {calm ? "CALM ON" : "CALM"}
        </button>
        <button type="button" className="hidden h-11 px-2 font-mono text-2xs tracking-[0.12em] text-mute sm:inline" onClick={() => setFlag("highContrast", !contrast)}>
          {contrast ? "HI-CON" : "CONTRAST"}
        </button>
        <button type="button" className="hidden h-11 px-2 font-mono text-2xs tracking-[0.12em] text-mute md:inline" onClick={() => setDensity(density === "quiet" ? "full" : "quiet")}>
          {density === "quiet" ? "QUIET" : "DENSITY"}
        </button>
        <ComputeDock value={compute} onChange={setCompute} />
      </header>

      <aside className="stack-rail" aria-label="World stack altitude">
        {STACK_RAIL.map((item, i) => (
          <button
            key={item.id}
            type="button"
            data-stack-layer={item.id}
            onClick={() => goLayer(item.id)}
            className={cn("stack-tick", layer === item.id && "is-on")}
          >
            <span className="stack-tick-mark">{String(i + 1).padStart(2, "0")}</span>
            <span className="stack-tick-copy">
              <span className="stack-tick-label">{item.label}</span>
              <span className="stack-tick-sub">{item.sub}</span>
            </span>
          </button>
        ))}
      </aside>

      {showCity && !worldq ? (
        <div className="stack-city" aria-label="Agentropolis districts">
          {CITY_NODES.map((d) =>
            d ? (
              <button
                key={d.id}
                type="button"
                className={cn("stack-node", district === d.id && "is-on")}
                style={{ left: d.x, top: d.y }}
                onClick={() => pickDistrict(d.id)}
              >
                <span>{d.code}</span>
                <em>{d.name}</em>
              </button>
            ) : null,
          )}
        </div>
      ) : null}

      {!worldq ? (
      <div className="stack-card pointer-events-none relative z-20 mt-auto flex flex-col gap-3 px-3 pb-4">
        <div className="stack-hud pointer-events-auto">
          <p className="font-mono text-2xs tracking-[0.2em] text-cyan">{current.mark} · {current.name}</p>
          <p className="mt-1 font-display text-base font-semibold tracking-tight text-cyan sm:text-lg">{current.line}</p>
          {density !== "quiet" ? <p className="mt-1 text-xs text-mute">{current.identity}</p> : null}
          <p className="mt-1 text-xs tracking-[0.04em] text-cyan">{current.knows}</p>
          {layer === "grid" ? <p className="mt-2 text-2xs leading-relaxed text-mute">{STACK_BOUNDARY}</p> : null}
          {place ? <p className="mt-2 text-2xs tracking-[0.12em] text-cyan uppercase">{place.name} · {place.note}</p> : null}
          {district && DISTRICT_BY_ID[district] ? (
            <p className="mt-2 text-2xs text-mute">{DISTRICT_BY_ID[district]!.name} · {DISTRICT_BY_ID[district]!.role}</p>
          ) : null}
          <p className="mt-3 font-mono text-2xs text-mute">DEMO · NEURO BUILDS · estimated · zoom {zoom.toFixed(2)}</p>
        </div>
        <div className="pointer-events-auto flex flex-wrap gap-2">
          {view === "district" ? (
            <button type="button" className="stack-cta" data-stack-enter onClick={() => pickMission("ms-hold")}>
              ENTER WORLDQ
            </button>
          ) : view === "city" ? (
            <button type="button" className="stack-cta" onClick={() => goView("district")}>
              OPEN DISTRICTS
            </button>
          ) : (
            <button
              type="button"
              className="stack-cta"
              data-stack-explore
              onClick={() => nudgeZoom(0.12)}
            >
              EXPLORE THE WORLD
            </button>
          )}
          <button type="button" className="stack-cta is-ghost" onClick={onCity}>
            ENTER AGENTROPOLIS
          </button>
        </div>
      </div>
      ) : null}

      <CommandHUD
        layer={layer}
        view={view}
        district={district}
        mission={mission}
        item={selectedItem}
        compute={compute}
        agents={killed ? 0 : 2}
        killed={killed}
        compact={worldq}
        onKill={() => setKilled(true)}
        onBack={() => {
          if (!back()) onClose();
        }}
      />
    </div>
  );
}

function StackFallback({
  layer,
  region,
  onRegion,
}: {
  layer: StackLayer;
  region: string | null;
  onRegion: (id: string) => void;
}) {
  return (
    <div className="stack-fall" aria-hidden={false}>
      <div className={cn("stack-orb", `is-${layer}`)} />
      <div className="stack-rings">
        <span />
        <span />
        <span />
      </div>
      <div className="stack-fall-pins">
        {STACK_REGIONS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onRegion(r.id)}
            className={cn("stack-fall-pin", region === r.id && "is-on", r.kind === "city" && "is-city")}
            style={{ left: `${((r.lon + 180) / 360) * 100}%`, top: `${((90 - r.lat) / 180) * 100}%` }}
          >
            {r.name}
          </button>
        ))}
        {layer === "grid"
          ? STACK_GOV.map((g) => (
              <span
                key={g.id}
                className="stack-fall-pin is-gov"
                style={{ left: `${((g.lon + 180) / 360) * 100}%`, top: `${((90 - g.lat) / 180) * 100}%` }}
              >
                {g.name}
              </span>
            ))
          : null}
      </div>
    </div>
  );
}
