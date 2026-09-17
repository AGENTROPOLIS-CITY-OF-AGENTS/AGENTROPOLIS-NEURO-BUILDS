import { useEffect, useState, type ComponentType, type WheelEvent } from "react";
import { useCompute } from "@/lib/compute";
import { ComputeDock } from "@/components/grid-chrome";
import type { CityGfx } from "@/lib/gfx";
import {
  STACK_BOUNDARY,
  STACK_BY_ID,
  STACK_GOV,
  STACK_INTRO,
  STACK_LAYERS,
  STACK_RAIL,
  STACK_REGIONS,
  STACK_SECONDARY,
  STACK_START,
  layerByIndex,
  layerIndex,
  stackMeta,
  type StackLayer,
} from "@/lib/world-stack";
import { cn } from "@/lib/utils";

type WorldProps = {
  layer: StackLayer;
  region: string | null;
  gfx: CityGfx;
  reduced: boolean;
  paused: boolean;
  onRegion: (id: string) => void;
  onEnterCity: () => void;
};

export function WorldStack({ onClose, onCity }: { onClose: () => void; onCity: () => void }) {
  const [World, setWorld] = useState<ComponentType<WorldProps> | null>(null);
  const [layer, setLayer] = useState<StackLayer>(STACK_START);
  const [region, setRegion] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [compute, setCompute, gfx] = useCompute();
  const mapMode = compute === "minimum" || !World;
  const meta = stackMeta();
  const current = STACK_BY_ID[layer];
  const place = STACK_REGIONS.find((r) => r.id === region);

  useEffect(() => {
    if (compute === "minimum") {
      setWorld(null);
      return;
    }
    let alive = true;
    void import("@/components/world-stack-world").then((mod) => {
      if (alive) setWorld(() => mod.WorldStackWorld);
    });
    return () => {
      alive = false;
    };
  }, [compute]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    const vis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => {
      mq.removeEventListener("change", apply);
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  const goLayer = (next: StackLayer) => {
    setLayer(next);
    if (next === "orbit") setRegion(null);
  };

  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaY) < 24) return;
    const i = layerIndex(layer) + (e.deltaY > 0 ? 1 : -1);
    if (i < 0 || i >= STACK_LAYERS.length) return;
    goLayer(layerByIndex(i));
  };

  const pickRegion = (id: string) => {
    setRegion(id);
    if (id === "agentropolis") goLayer("city");
    else if (layer === "orbit") goLayer("atlas");
    else if (layer === "atlas") goLayer("grid");
  };

  return (
    <div
      data-world-stack
      className="stack-root absolute inset-0 z-[55] flex flex-col bg-[#02040a] text-paper"
      onWheel={onWheel}
    >
      {mapMode ? (
        <StackFallback layer={layer} region={region} onRegion={pickRegion} />
      ) : World ? (
        <div className="absolute inset-0">
          <World
            layer={layer}
            region={region}
            gfx={gfx}
            reduced={reduced}
            paused={paused}
            onRegion={pickRegion}
            onEnterCity={onCity}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#02040a]" />
      )}

      <header className="relative z-20 flex shrink-0 items-center gap-2 px-3 py-2 sm:px-4">
        <button type="button" data-stack-exit onClick={onClose} className="h-11 px-3 font-display text-2xs tracking-[0.16em] text-cyan">
          City
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold tracking-[0.14em] text-cyan sm:text-base">{STACK_INTRO}</p>
          <p className="truncate text-2xs tracking-[0.1em] text-mute uppercase">{STACK_SECONDARY}</p>
        </div>
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

      <div className="pointer-events-none relative z-20 mt-auto flex flex-col gap-3 px-3 pb-4 sm:max-w-md sm:px-5">
        <div className="stack-hud pointer-events-auto">
          <p className="font-mono text-2xs tracking-[0.2em] text-cyan">{current.mark} · {current.name}</p>
          <p className="mt-1 font-display text-lg font-semibold tracking-tight text-paper">{current.line}</p>
          <p className="mt-1 text-xs text-mute">{current.identity}</p>
          <p className="mt-1 text-xs tracking-[0.04em] text-cyan">{current.knows}</p>
          {layer === "grid" ? (
            <p className="mt-2 text-2xs leading-relaxed text-mute">{STACK_BOUNDARY}</p>
          ) : null}
          {place ? <p className="mt-2 text-2xs tracking-[0.12em] text-cyan uppercase">{place.name} · {place.note}</p> : null}
          <p className="mt-3 font-mono text-2xs text-mute">
            {meta.provider_status} · {meta.provider} · confidence {meta.confidence} · estimated
          </p>
        </div>
        <div className="pointer-events-auto flex flex-wrap gap-2">
          {layer === "city" ? (
            <button type="button" className="stack-cta" data-stack-enter onClick={onCity}>
              ENTER AGENTROPOLIS
            </button>
          ) : (
            <button
              type="button"
              className="stack-cta"
              data-stack-explore
              onClick={() => goLayer(layerIndex(layer) >= 3 ? "city" : layerByIndex(layerIndex(layer) + 1))}
            >
              EXPLORE THE WORLD
            </button>
          )}
          {layer !== "city" ? (
            <button type="button" className="stack-cta is-ghost" onClick={onCity}>
              ENTER AGENTROPOLIS
            </button>
          ) : null}
        </div>
      </div>
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
