import type { SpatialObject } from "./spatial.types";

export function ReceiptPanel({ item }: { item: SpatialObject | null }) {
  return (
    <p className="wq-receipt">
      {item ? (
        <>
          Receipt {item.receiptStatus} · {item.provenance} · confidence {item.dataConfidence}
        </>
      ) : (
        <>No object selected. Execute remains gated.</>
      )}
    </p>
  );
}
