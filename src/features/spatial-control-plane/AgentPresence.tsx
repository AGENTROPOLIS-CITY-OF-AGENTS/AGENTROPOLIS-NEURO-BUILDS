import type { SpatialObject } from "./spatial.types";

export function AgentPresence({ agents }: { agents: SpatialObject[] }) {
  return (
    <div className="wq-agents" aria-label="Agent presence">
      {agents.map((a) => (
        <span key={a.id} className={a.executionState === "QUARANTINED" ? "is-kill" : undefined}>
          {a.title}
          <em>{a.executionState}</em>
        </span>
      ))}
    </div>
  );
}
