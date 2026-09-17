import { useId } from "react";
import { cn } from "@/lib/utils";

type HubNode = {
  id: string;
  label: string;
  district: string;
  x: number;
  y: number;
  path: string;
};

const NODES: HubNode[] = [
  { id: "hermes", label: "HERMES", district: "hermes", x: 110, y: 90, path: "M 270 205 V 105 Q 270 90 255 90 H 110" },
  { id: "street", label: "STREET", district: "street", x: 360, y: 70, path: "M 294 205 V 85 Q 294 70 309 70 H 360" },
  { id: "build", label: "BUILD", district: "construct", x: 160, y: 205, path: "M 250 205 H 160" },
  { id: "parallax", label: "PX", district: "parallax", x: 480, y: 205, path: "M 314 205 H 480" },
  { id: "neuro", label: "NEURO", district: "street", x: 282, y: 360, path: "M 282 205 V 360" },
  { id: "holofoil", label: "FOIL", district: "holofoil", x: 460, y: 340, path: "M 314 215 V 325 Q 314 340 329 340 H 460" },
];

function HubPath({ d, gid }: { d: string; gid: string }) {
  return (
    <>
      <path d={d} stroke="currentColor" strokeWidth="1" fill="none" className="text-line" />
      <path d={d} stroke={`url(#${gid})`} strokeWidth="2" fill="none" className="hub-dash" />
    </>
  );
}

export function GridHub({
  onPick,
  onCenter,
}: {
  onPick: (districtId: string) => void;
  onCenter: () => void;
}) {
  const uid = useId().replace(/:/g, "");
  return (
    <div className="hub-visual" data-grid-hub>
      <div className="hub-dots" aria-hidden />
      <div className="hub-fade" aria-hidden />
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 564 410" fill="none" aria-hidden>
        <defs>
          {NODES.map((n) => (
            <linearGradient key={n.id} id={`${uid}-${n.id}`} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#19E6E6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          ))}
        </defs>
        {NODES.map((n) => (
          <HubPath key={n.id} d={n.path} gid={`${uid}-${n.id}`} />
        ))}
      </svg>
      <button type="button" className="hub-core" onClick={onCenter} aria-label="Enter the city">
        <img src="/favicon.svg" alt="" width={36} height={36} />
        <span className="hub-pulse" aria-hidden />
      </button>
      {NODES.map((n) => (
        <button
          key={n.id}
          type="button"
          className="hub-node"
          style={{ left: `${(n.x / 564) * 100}%`, top: `${(n.y / 410) * 100}%` }}
          onClick={() => onPick(n.district)}
          aria-label={n.label}
        >
          <span>{n.label}</span>
        </button>
      ))}
    </div>
  );
}

export function HubCard({
  onPick,
  onCenter,
  onWorld,
  onSignal,
  className,
}: {
  onPick: (districtId: string) => void;
  onCenter: () => void;
  onWorld?: () => void;
  onSignal?: () => void;
  className?: string;
}) {
  return (
    <article className={cn("hub-card", className)} data-hub-card>
      <GridHub onPick={onPick} onCenter={onCenter} />
      <div className="hub-copy">
        <h2 className="hub-title">FROM CITY STREETS TO ORBITAL SPACE</h2>
        <p className="hub-body">AGENTROPOLIS is being built as one connected intelligence civilization.</p>
        <div className="flex flex-wrap gap-2">
          {onSignal ? (
            <button type="button" className="hub-go" onClick={onSignal} data-signal-open="">
              Watch Agentropolis
            </button>
          ) : null}
          {onWorld ? (
            <button type="button" className={cn("hub-go", onSignal && "hub-go-ghost")} onClick={onWorld} data-stack-open="">
              Explore the world
            </button>
          ) : null}
          <button type="button" className="hub-go hub-go-ghost" onClick={onCenter} data-start-enter="">
            Enter Agentropolis
          </button>
        </div>
      </div>
    </article>
  );
}
