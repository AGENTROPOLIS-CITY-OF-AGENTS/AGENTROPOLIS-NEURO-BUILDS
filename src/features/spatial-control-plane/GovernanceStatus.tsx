import { CORRIDOR } from "@/lib/design-system";
import type { SpatialObject } from "./spatial.types";
import { cn } from "@/lib/utils";

function stepOn(item: SpatialObject | null, step: string) {
  if (!item) return step === "IDENTITY" || step === "MANDATE";
  if (step === "IDENTITY") return true;
  if (step === "MANDATE") return Boolean(item.mission);
  if (step === "PLAN") return item.executionState === "PLANNING" || item.executionState === "EXECUTING" || item.executionState === "COMPLETE";
  if (step === "POLICY") return item.permissions !== "READ";
  if (step === "EXECUTE") return item.executionState === "EXECUTING" || item.executionState === "COMPLETE";
  if (step === "RECEIPT") return item.receiptStatus !== "NONE";
  if (step === "AUDIT") return item.receiptStatus === "AUDITED";
  return false;
}

export function GovernanceStatus({ item }: { item: SpatialObject | null }) {
  return (
    <ol className="wq-corridor" aria-label="Governance corridor">
      {CORRIDOR.map((step) => (
        <li key={step} className={cn(stepOn(item, step) && "is-on")}>
          {step}
        </li>
      ))}
    </ol>
  );
}
