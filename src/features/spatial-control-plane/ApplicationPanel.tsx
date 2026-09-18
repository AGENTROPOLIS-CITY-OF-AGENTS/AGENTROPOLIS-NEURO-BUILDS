import type { EnvelopeReceipt } from "@/lib/worldq-envelope";
import type { SpatialObject } from "./spatial.types";

export function ApplicationPanel({
  item,
  receipt,
  busy,
  onSubmit,
}: {
  item: SpatialObject | null;
  receipt?: EnvelopeReceipt | null;
  busy?: boolean;
  onSubmit?: () => void;
}) {
  if (!item) return null;
  return (
    <div className="wq-side">
      <p className="font-mono text-2xs tracking-[0.16em] text-red">{item.provenance} · {item.type}</p>
      <h3 className="mt-1 font-display text-sm font-semibold text-cyan">{item.title}</h3>
      <p className="mt-1 text-xs text-mute">{item.memoryCapsule}</p>
      <dl className="wq-dl">
        <div><dt>Identity</dt><dd>{item.identity}</dd></div>
        <div><dt>Owner</dt><dd>{item.owner}</dd></div>
        <div><dt>Agent</dt><dd>{item.assignedAgent}</dd></div>
        <div><dt>App</dt><dd>{item.application}</dd></div>
        <div><dt>Repo</dt><dd>{item.repository}</dd></div>
        <div><dt>Permission</dt><dd>{item.permissions}</dd></div>
        <div><dt>Risk</dt><dd>{item.riskTier}</dd></div>
        <div><dt>Execute</dt><dd>{item.executionState}</dd></div>
        <div><dt>Receipt</dt><dd>{item.receiptStatus}</dd></div>
      </dl>
      {onSubmit ? (
        <button type="button" className="stack-cta mt-3 w-full" disabled={busy} onClick={onSubmit} data-wq-envelope>
          {busy ? "ENVELOPE…" : "SUBMIT ENVELOPE"}
        </button>
      ) : null}
      {receipt ? (
        <p className="mt-2 font-mono text-2xs leading-relaxed text-mute">
          {receipt.provenance} · {receipt.status} · {receipt.model}
          <span className="mt-1 block text-cyan">{receipt.reason}</span>
          {receipt.output ? <span className="mt-1 block">{receipt.output}</span> : null}
        </p>
      ) : null}
    </div>
  );
}
