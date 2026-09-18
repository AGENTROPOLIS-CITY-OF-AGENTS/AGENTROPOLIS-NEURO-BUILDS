import type { SpatialObject } from "./spatial.types";

const WORLD = 2200;

export function SpatialMinimap({
  objects,
  pan,
  scale,
  selected,
  onJump,
}: {
  objects: SpatialObject[];
  pan: { x: number; y: number };
  scale: number;
  selected: string | null;
  onJump: (x: number, y: number) => void;
}) {
  return (
    <button
      type="button"
      className="wq-mini"
      aria-label="WORLDQ minimap"
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width) * WORLD;
        const ny = ((e.clientY - r.top) / r.height) * WORLD;
        onJump(-nx * scale + r.width * 2, -ny * scale + r.height);
      }}
    >
      {objects.map((o) => (
        <span
          key={o.id}
          className={o.id === selected ? "is-on" : undefined}
          style={{
            left: `${(o.coordinates.x / WORLD) * 100}%`,
            top: `${(o.coordinates.y / WORLD) * 100}%`,
          }}
        />
      ))}
      <i
        className="wq-mini-view"
        style={{
          left: `${(-pan.x / scale / WORLD) * 100}%`,
          top: `${(-pan.y / scale / WORLD) * 100}%`,
        }}
      />
    </button>
  );
}
