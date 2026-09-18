import { useEffect, useMemo, useRef, useState } from "react";
import { DISTRICT_BY_ID } from "@/lib/grid";
import { useWorldLayer } from "@/features/world-globe/WorldLayerState";
import { objectsForDistrict, WORLDQ_MISSIONS } from "./spatial-data";
import { MissionObject } from "./MissionObject";
import { ApplicationPanel } from "./ApplicationPanel";
import { AgentPresence } from "./AgentPresence";
import { SpatialMinimap } from "./SpatialMinimap";
import { submitWorldqEnvelope, type EnvelopeReceipt } from "@/lib/worldq-envelope";
import type { LayoutMap, SpatialObject } from "./spatial.types";
import { cn } from "@/lib/utils";

const LAYOUT_KEY = "agentropolis.worldq.layout";

function loadLayout(): LayoutMap {
  try {
    const raw = localStorage.getItem(LAYOUT_KEY);
    if (raw) return JSON.parse(raw) as LayoutMap;
  } catch {
    /* private */
  }
  return {};
}

function saveLayout(map: LayoutMap) {
  try {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function SpatialCanvas({ killed }: { killed: boolean }) {
  const district = useWorldLayer((s) => s.selectedDistrict);
  const mission = useWorldLayer((s) => s.selectedMission);
  const selected = useWorldLayer((s) => s.selectedObject);
  const pickObject = useWorldLayer((s) => s.pickObject);
  const pickMission = useWorldLayer((s) => s.pickMission);
  const goView = useWorldLayer((s) => s.goView);
  const density = useWorldLayer((s) => s.density);
  const base = useMemo(() => objectsForDistrict(district), [district]);
  const [layout, setLayout] = useState<LayoutMap>({});
  const [pan, setPan] = useState({ x: -280, y: -160 });
  const [scale, setScale] = useState(1);
  const [focus, setFocus] = useState(false);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState<EnvelopeReceipt | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLayout(loadLayout());
  }, []);

  const objects: SpatialObject[] = useMemo(() => {
    return base.map((o) => {
      const box = layout[o.id];
      const next = box ? { ...o, coordinates: { ...o.coordinates, ...box } } : o;
      if (killed && next.type === "agent") return { ...next, executionState: "QUARANTINED" };
      if (mission && next.mission !== mission && density === "quiet") return null;
      return next;
    }).filter((o): o is SpatialObject => Boolean(o));
  }, [base, layout, killed, mission, density]);

  const selectedItem = objects.find((o) => o.id === selected) ?? null;
  const agents = objects.filter((o) => o.type === "agent");
  const place = district ? DISTRICT_BY_ID[district] : null;

  const submitEnvelope = async () => {
    if (!selectedItem || busy) return;
    setBusy(true);
    try {
      const next = await submitWorldqEnvelope({
        version: "worldq-envelope-v1",
        identity: selectedItem.identity,
        mandate: selectedItem.mission,
        plan: selectedItem.memoryCapsule,
        permissions: selectedItem.permissions,
        district: selectedItem.district,
        mission: selectedItem.mission,
        objectId: selectedItem.id,
        objectType: selectedItem.type,
        title: selectedItem.title,
        objective: selectedItem.memoryCapsule,
        killed,
      });
      setReceipt(next);
    } finally {
      setBusy(false);
    }
  };

  const moveObj = (id: string, x: number, y: number) => {
    setLayout((prev) => {
      const cur = objects.find((o) => o.id === id)?.coordinates;
      if (!cur) return prev;
      const next = { ...prev, [id]: { ...cur, x, y } };
      saveLayout(next);
      return next;
    });
  };

  return (
    <div className="wq-root" data-worldq>
      <div
        ref={stage}
        className="wq-stage"
        onPointerDown={(e) => {
          if (e.target !== stage.current && !(e.target as HTMLElement).classList.contains("wq-world")) return;
          const ox = e.clientX;
          const oy = e.clientY;
          const sx = pan.x;
          const sy = pan.y;
          const move = (ev: PointerEvent) => setPan({ x: sx + (ev.clientX - ox), y: sy + (ev.clientY - oy) });
          const up = () => {
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
          };
          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", up);
        }}
        onWheel={(e) => {
          e.stopPropagation();
          const dir = e.deltaY > 0 ? 0.94 : 1.06;
          setScale((s) => Math.max(0.45, Math.min(1.8, s * dir)));
        }}
      >
        <div
          className="wq-world"
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
        >
          {objects.map((o) => (
            <MissionObject
              key={o.id}
              item={o}
              selected={selected === o.id}
              focused={focus && selected === o.id}
              onSelect={() => {
                pickObject(o.id);
                if (o.type === "mission") pickMission(o.mission);
              }}
              onMove={(x, y) => moveObj(o.id, x, y)}
            />
          ))}
        </div>
      </div>
      <div className="wq-chrome">
        <p className="font-mono text-2xs tracking-[0.16em] text-red">WORLDQ · DEMO / SIMULATED</p>
        <p className="mt-1 font-display text-sm text-cyan">
          {place ? place.name : "CITY-STATE WORKSPACE"} · infinite mission canvas
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {WORLDQ_MISSIONS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={cn("wq-chip", mission === m.id && "is-on")}
              onClick={() => pickMission(m.id)}
            >
              {m.title}
            </button>
          ))}
        </div>
        <AgentPresence agents={agents} />
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" className="stack-cta is-ghost" onClick={() => setFocus((v) => !v)}>
            {focus ? "FOCUS ON" : "FOCUS"}
          </button>
          <button
            type="button"
            className="stack-cta is-ghost"
            onClick={() => {
              setPan({ x: -280, y: -160 });
              setScale(1);
            }}
          >
            RESET VIEW
          </button>
          <button type="button" className="stack-cta is-ghost" onClick={() => goView("city")}>
            BACK TO CITY
          </button>
        </div>
      </div>
      <ApplicationPanel item={selectedItem} receipt={receipt} busy={busy} onSubmit={() => void submitEnvelope()} />
      <SpatialMinimap
        objects={objects}
        pan={pan}
        scale={scale}
        selected={selected}
        onJump={(x, y) => setPan({ x, y })}
      />
    </div>
  );
}
