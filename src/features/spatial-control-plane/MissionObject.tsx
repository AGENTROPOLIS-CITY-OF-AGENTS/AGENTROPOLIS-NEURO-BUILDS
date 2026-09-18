import type { SpatialObject } from "./spatial.types";
import { cn } from "@/lib/utils";

const TYPE_MARK: Record<SpatialObject["type"], string> = {
  mission: "MSN",
  application: "APP",
  repository: "REPO",
  agent: "AGT",
  file: "FILE",
  buzz: "BUZZ",
  permission: "PERM",
  receipt: "RCPT",
};

export function MissionObject({
  item,
  selected,
  focused,
  onSelect,
  onMove,
}: {
  item: SpatialObject;
  selected: boolean;
  focused: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
}) {
  return (
    <button
      type="button"
      data-wq-object={item.id}
      className={cn("wq-obj", `is-${item.type}`, selected && "is-on", focused && "is-focus")}
      style={{ left: item.coordinates.x, top: item.coordinates.y, width: item.coordinates.w, height: item.coordinates.h }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect();
        const ox = e.clientX;
        const oy = e.clientY;
        const sx = item.coordinates.x;
        const sy = item.coordinates.y;
        const move = (ev: PointerEvent) => onMove(sx + (ev.clientX - ox), sy + (ev.clientY - oy));
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      }}
    >
      <span className="wq-obj-mark">{TYPE_MARK[item.type]} · {item.provenance}</span>
      <span className="wq-obj-title">{item.title}</span>
      <span className="wq-obj-meta">{item.executionState} · {item.permissions}</span>
      <span className="wq-obj-risk">{item.riskTier}</span>
    </button>
  );
}
