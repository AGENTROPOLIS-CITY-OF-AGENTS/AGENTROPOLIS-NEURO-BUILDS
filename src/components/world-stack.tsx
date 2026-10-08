import { useEffect, useState, type ComponentType, type KeyboardEvent, type WheelEvent } from "react";
import { useCompute } from "@/lib/compute";
import { ComputeDock } from "@/components/grid-chrome";
import type { CityGfx } from "@/lib/gfx";
import {
  STACK_BOUNDARY,
  STACK_BY_ID,
  STACK_RAIL,
  STACK_REGIONS,
  type StackLayer,
} from "@/lib/world-stack";
import { GLOBE_BY_SLUG, GLOBE_DISTRICTS, globeChild as findGlobeChild, globeCrumbs, type GlobeOpen } from "@/lib/globe-nav";
import { scpLayer, scpView, useWorldLayer } from "@/features/world-globe/WorldLayerState";
import { CommandHUD } from "@/features/spatial-control-plane/CommandHUD";
import { WORLDQ_OBJECTS } from "@/features/spatial-control-plane/spatial-data";
import { DOCK_NOTE, FACILITY_BY_ID, SIM_AGENTS } from "@/lib/docking-district";
import { DockingCity } from "@/components/docking-city";
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
  globeDistrict?: string | null;
  globeChild?: string | null;
  onGlobe?: (id: string) => void;
};

export function WorldStack({
  onClose,
  onCity,
  onOpen,
  onPath,
}: {
  onClose: () => void;
  onCity: () => void;
  onOpen?: (open: GlobeOpen, districtId?: string, href?: string) => void;
  onPath?: (district: string | null, child: string | null) => void;
}) {
  const [World, setWorld] = useState<ComponentType<WorldProps> | null>(null);
  const [Canvas, setCanvas] = useState<ComponentType<{ killed: boolean }> | null>(null);
  const [paused, setPaused] = useState(false);
  const [inspectOpen, setInspectOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [dockPick, setDockPick] = useState("arrival");
  const [camMode, setCamMode] = useState<"overview" | "walk" | "accessible">("overview");
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
  const pickMission = useWorldLayer((s) => s.pickMission);
  const pickGlobe = useWorldLayer((s) => s.pickGlobe);
  const globeDistrict = useWorldLayer((s) => s.globeDistrict);
  const globeChild = useWorldLayer((s) => s.globeChild);
  const back = useWorldLayer((s) => s.back);
  const interruptCamera = useWorldLayer((s) => s.interruptCamera);
  const setFlag = useWorldLayer((s) => s.setFlag);
  const setDensity = useWorldLayer((s) => s.setDensity);
  const layer = scpLayer(zoom);
  const view = scpView(zoom);
  const mapMode = compute === "minimum" || !World;
  const worldq = view === "worldq";
  const current = STACK_BY_ID[layer];
  const selectedItem = WORLDQ_OBJECTS.find((o) => o.id === selectedObject) ?? null;
  const globeNode = globeDistrict ? GLOBE_BY_SLUG[globeDistrict] : null;
  const globeKid = findGlobeChild(globeDistrict ?? "", globeChild);
  const crumbs = globeCrumbs(globeDistrict, globeChild);
  const heroName = (globeKid?.name ?? globeNode?.name ?? current.name).toUpperCase();
  const heroParts = heroName.split(/\s+/);
  const heroA = heroParts.length > 1 ? heroParts.slice(0, Math.ceil(heroParts.length / 2)).join(" ") : heroName;
  const heroB = heroParts.length > 1 ? heroParts.slice(Math.ceil(heroParts.length / 2)).join(" ") : "";
  const heroStatus = globeKid?.status ?? globeNode?.status ?? "PREVIEW";
  const heroLine = globeKid?.line ?? globeNode?.line ?? current.line;

  const handleGlobe = (id: string) => {
    if (!globeDistrict || GLOBE_BY_SLUG[id]) {
      pickGlobe(id, null);
      onPath?.(id, null);
      return;
    }
    pickGlobe(globeDistrict, id);
    onPath?.(globeDistrict, id);
  };

  const descend = () => {
    const node = globeKid ?? globeNode;
    if (!node) {
      onCity();
      return;
    }
    if (node.open === "worldq") {
      pickMission("ms-hold");
      return;
    }
    if (node.open === "stay") return;
    if (globeNode?.id === "docking" && !globeKid) {
      setCityOpen(true);
      setInspectOpen(true);
      setCamMode(reduced ? "accessible" : "overview");
      return;
    }
    onOpen?.(node.open, "districtId" in node ? node.districtId : globeNode?.districtId, node.href);
  };

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
        "stack-root app-frame bg-[#02040a] text-cyan outline-none",
        contrast && "is-contrast",
        calm && "is-calm",
        density === "quiet" && "is-quiet",
      )}
      onWheel={onWheel}
      onKeyDown={onKey}
    >
      <div className="app-shell">
        <header className="shell-bar">
          <button type="button" data-stack-exit onClick={onClose} className="shell-hit font-display">
            City
          </button>
          <nav className="globe-crumb" aria-label="Hierarchy">
            {crumbs.map((c, i) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => {
                  if (i === 0) {
                    pickGlobe(null, null);
                    onPath?.(null, null);
                  } else if (i === 1) {
                    pickGlobe(c.slug, null);
                    onPath?.(c.slug, null);
                  }
                }}
              >
                {c.name}
              </button>
            ))}
          </nav>
          <button type="button" className="shell-hit shell-hud-btn" onClick={() => setInspectOpen((v) => !v)}>
            HUD
          </button>
          <button type="button" className="shell-hit shell-settings-btn" onClick={() => setSettingsOpen((v) => !v)}>
            Settings
          </button>
          <div className={cn("shell-tools", settingsOpen && "is-open")}>
            <button type="button" className="shell-hit" onClick={() => setFlag("calm", !calm)}>
              {calm ? "CALM ON" : "CALM"}
            </button>
            <button type="button" className="shell-hit shell-tool-secondary" onClick={() => setFlag("highContrast", !contrast)}>
              {contrast ? "HI-CON" : "CONTRAST"}
            </button>
            <button type="button" className="shell-hit shell-tool-secondary" onClick={() => setDensity(density === "quiet" ? "full" : "quiet")}>
              {density === "quiet" ? "QUIET" : "DENSITY"}
            </button>
            <ComputeDock value={compute} onChange={setCompute} />
          </div>
        </header>

        <div className={cn("shell-body", inspectOpen && "is-inspect")}>
          <nav className="shell-nav" aria-label="World stack altitude">
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
          </nav>

          <main className="shell-stage">
            <div className="shell-stage-world">
              {cityOpen && camMode !== "accessible" ? (
                <DockingCity gfx={gfx} reduced={reduced} mode={camMode} selected={dockPick} onSelect={setDockPick} />
              ) : cityOpen ? (
                <DockList selected={dockPick} onSelect={setDockPick} />
              ) : worldq && Canvas ? (
                <Canvas killed={killed} />
              ) : mapMode ? (
                <StackFallback layer={layer} region={region} onRegion={pickRegion} onGlobe={handleGlobe} globeDistrict={globeDistrict} />
              ) : World ? (
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
                  globeDistrict={globeDistrict}
                  globeChild={globeChild}
                  onGlobe={handleGlobe}
                />
              ) : (
                <div className="h-full w-full bg-[#02040a]" />
              )}
            </div>

            {!worldq ? (
              <section className={cn("shell-hero", cityOpen && "is-city")}>
                {cityOpen ? (
                  <div className="shell-cam" role="group" aria-label="Camera">
                    {(["overview", "walk", "accessible"] as const).map((id) => (
                      <button key={id} type="button" className={cn("shell-kid", camMode === id && "is-on")} onClick={() => setCamMode(id)}>
                        {id}
                      </button>
                    ))}
                    <button type="button" className="shell-kid" onClick={() => setCityOpen(false)}>
                      Back to globe
                    </button>
                  </div>
                ) : null}
                <label className="shell-layer-pick">
                  <span className="sr-only">Change layer</span>
                  <select value={layer} onChange={(e) => goLayer(e.target.value as StackLayer)} aria-label="Change layer">
                    {STACK_RAIL.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>
                <h1 className={cn("shell-hero-title", cityOpen && "is-city")}>
                  <span>{heroA}</span>
                  {heroB ? <span>{heroB}</span> : null}
                </h1>
                <p className="shell-status">{heroStatus}</p>
                <p className="shell-copy">{heroLine}</p>
                {globeNode?.children.length ? (
                  <div className="shell-kids" aria-label="Sub-districts">
                    {globeNode.children.map((d) => (
                      <button key={d.id} type="button" className={cn("shell-kid", globeChild === d.id && "is-on")} onClick={() => handleGlobe(d.id)}>
                        {d.name}
                      </button>
                    ))}
                  </div>
                ) : null}
                <div className="shell-actions">
                  {globeNode ? (
                    <button type="button" className="stack-cta shell-cta" data-stack-enter onClick={descend}>
                      {globeKid ? `ENTER ${globeKid.name}` : globeNode.open === "worldq" ? "ENTER WORLDQ / ASTRA" : "ENTER DISTRICT"}
                    </button>
                  ) : view === "district" ? (
                    <button type="button" className="stack-cta shell-cta" data-stack-enter onClick={() => pickMission("ms-hold")}>
                      ENTER WORLDQ
                    </button>
                  ) : view === "city" ? (
                    <button type="button" className="stack-cta shell-cta" onClick={() => goView("district")}>
                      OPEN DISTRICTS
                    </button>
                  ) : (
                    <button type="button" className="stack-cta shell-cta" data-stack-explore onClick={() => nudgeZoom(0.12)}>
                      EXPLORE THE WORLD
                    </button>
                  )}
                  <button type="button" className="stack-cta shell-cta is-ghost" onClick={onCity}>
                    ENTER AGENTROPOLIS
                  </button>
                </div>
                {layer === "grid" ? <p className="shell-note">{STACK_BOUNDARY}</p> : null}
                <p className="shell-note">DEMO · estimated · zoom {zoom.toFixed(2)}</p>
              </section>
            ) : null}
          </main>

          <aside className="shell-inspect" aria-label="Inspector">
            {cityOpen ? <DockInspect pick={dockPick} /> : null}
            <CommandHUD
              layer={layer}
              view={view}
              district={globeNode?.name ?? district}
              mission={mission}
              item={selectedItem}
              compute={compute}
              agents={killed ? 0 : 2}
              killed={killed}
              onKill={() => setKilled(true)}
              onBack={() => {
                if (!back()) onClose();
              }}
            />
          </aside>
        </div>
      </div>
    </div>
  );
}

function DockList({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="dock-list">
      <p>{DOCK_NOTE}</p>
      {Object.values(FACILITY_BY_ID).map((f) => (
        <button key={f.id} type="button" className={cn("shell-kid", selected === f.id && "is-on")} onClick={() => onSelect(f.id)}>
          {f.name} · {f.provenance}
        </button>
      ))}
    </div>
  );
}

function DockInspect({ pick }: { pick: string }) {
  const facility = FACILITY_BY_ID[pick];
  const agent = SIM_AGENTS.find((a) => a.id === pick) ?? SIM_AGENTS.find((a) => a.facilityId === pick);
  return (
    <div className="dock-inspect">
      <p className="shell-status">{facility?.provenance ?? agent?.provenance ?? "UNKNOWN"}</p>
      <p className="shell-copy">{facility?.name ?? agent?.name}</p>
      <p className="shell-note">{facility?.role ?? "Simulated agent. Not a live runtime."}</p>
      {agent ? (
        <dl className="dock-dl">
          <div><dt>Activity</dt><dd>{agent.activity}</dd></div>
          <div><dt>Mandate</dt><dd>{agent.mandate}</dd></div>
          <div><dt>Policy</dt><dd>{agent.policy}</dd></div>
          <div><dt>Receipt</dt><dd>{agent.receipt}</dd></div>
        </dl>
      ) : null}
      <p className="shell-note">{DOCK_NOTE}</p>
    </div>
  );
}

function StackFallback({
  layer,
  region,
  onRegion,
  onGlobe,
  globeDistrict,
}: {
  layer: StackLayer;
  region: string | null;
  onRegion: (id: string) => void;
  onGlobe?: (id: string) => void;
  globeDistrict?: string | null;
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
        {GLOBE_DISTRICTS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => onGlobe?.(d.id)}
            className={cn("stack-fall-pin", globeDistrict === d.id && "is-on", d.id === "hermes" && "is-city")}
            style={{ left: `${((d.lon + 180) / 360) * 100}%`, top: `${((90 - d.lat) / 180) * 100}%` }}
          >
            {d.name}
          </button>
        ))}
        {STACK_REGIONS.filter((r) => r.kind === "city").map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onRegion(r.id)}
            className={cn("stack-fall-pin is-city", region === r.id && "is-on")}
            style={{ left: `${((r.lon + 180) / 360) * 100}%`, top: `${((90 - r.lat) / 180) * 100}%` }}
          >
            {r.name}
          </button>
        ))}
      </div>
    </div>
  );
}
