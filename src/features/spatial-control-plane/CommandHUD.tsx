import { useEffect, useState } from "react";
import { MODEL_FOR_WEIGHT, type ComputeWeight } from "@/lib/design-system";
import { STACK_BY_ID, type StackLayer } from "@/lib/world-stack";
import type { SemanticView } from "@/features/world-globe/world-globe.types";
import { worldqEnvelopeStatus, type EnvelopeStatus } from "@/lib/worldq-envelope";
import type { SpatialObject } from "./spatial.types";
import { GovernanceStatus } from "./GovernanceStatus";
import { ReceiptPanel } from "./ReceiptPanel";
import { cn } from "@/lib/utils";

export function CommandHUD({
  layer,
  view,
  district,
  mission,
  item,
  compute,
  agents,
  onKill,
  onBack,
  killed,
  compact = false,
}: {
  layer: StackLayer;
  view: SemanticView;
  district: string | null;
  mission: string | null;
  item: SpatialObject | null;
  compute: ComputeWeight;
  agents: number;
  onKill: () => void;
  onBack: () => void;
  killed: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(!compact);
  const [gate, setGate] = useState<EnvelopeStatus | null>(null);
  useEffect(() => {
    setOpen(!compact);
  }, [compact]);
  useEffect(() => {
    void worldqEnvelopeStatus().then(setGate).catch(() => setGate(null));
  }, []);
  const cur = STACK_BY_ID[layer];
  return (
    <div className={cn("cmd-hud", !open && "is-min")} data-cmd-hud>
      <div className="flex items-center gap-2">
        <button type="button" className="cmd-tog" onClick={() => setOpen((v) => !v)}>
          {open ? "HUD" : "NEURO"}
        </button>
        <p className="min-w-0 truncate font-mono text-2xs tracking-[0.14em] text-cyan">
          {cur.mark} · {view.toUpperCase()}
        </p>
        <button type="button" className="cmd-tog" onClick={onBack}>
          BACK
        </button>
      </div>
      {open ? (
        <>
          <p className="mt-2 text-xs text-cyan">{cur.line}</p>
          <p className="mt-1 font-mono text-2xs text-mute">
            District {district ?? "—"} · Mission {mission ?? "—"} · Agents {agents} DEMO
          </p>
          <p className="mt-1 font-mono text-2xs text-mute">
            Runtime {gate?.model ?? MODEL_FOR_WEIGHT[compute]} · {gate?.configured ? "key on server" : "key missing"} · {gate?.version ?? "worldq-envelope-v1"}
          </p>
          <p className="mt-1 font-mono text-2xs text-mute">
            Permission {item?.permissions ?? "APPROVAL REQUIRED"} · risk {item?.riskTier ?? "HIGH"}
          </p>
          <GovernanceStatus item={item} />
          <ReceiptPanel item={item} />
          <button
            type="button"
            className={cn("cmd-kill", killed && "is-on")}
            onClick={onKill}
            data-kill-switch
          >
            {killed ? "QUARANTINE SET · DEMO" : "KILL SWITCH · DEMO"}
          </button>
        </>
      ) : null}
    </div>
  );
}
