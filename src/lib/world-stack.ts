/** Canonical World Stack. Layers are not interchangeable. */

export type StackLayer = "orbit" | "atlas" | "grid" | "city" | "worldq";

export const STACK_LAYERS: {
  id: StackLayer;
  mark: string;
  name: string;
  line: string;
  knows: string;
  identity: string;
}[] = [
  {
    id: "orbit",
    mark: "01",
    name: "ORBITAL INTELLIGENCE",
    line: "See what moves above us.",
    knows: "satellites · constellations · launch · orbital infrastructure",
    identity: "Satellite, station, and space-weather layer. Not a government layer.",
  },
  {
    id: "atlas",
    mark: "02",
    name: "ATLAS",
    line: "Know where.",
    knows: "Earth · geography · borders · routes · spatial provenance",
    identity: "Geospatial intelligence. ATLAS knows WHERE.",
  },
  {
    id: "grid",
    mark: "03",
    name: "AGENTROPOLIS-WORLD-GRID",
    line: "Know who governs there.",
    knows: "Countries · governments · jurisdictions · regulators · treaties",
    identity: "International government and jurisdiction intelligence layer.",
  },
  {
    id: "city",
    mark: "04",
    name: "AGENTROPOLIS-WORLD",
    line: "See what is happening inside Agentropolis.",
    knows: "city-state · districts · buildings · agents · civic state",
    identity: "The persistent city. Descent enters the existing AGENTROPOLIS world.",
  },
  {
    id: "worldq",
    mark: "05",
    name: "WORLDQ",
    line: "Stream and reconstruct the world at the fidelity required.",
    knows: "LOD · streaming · reconstruction · spatial packaging",
    identity: "Infrastructure under the visual. Not a geographic place.",
  },
];

export const STACK_BY_ID = Object.fromEntries(STACK_LAYERS.map((l) => [l.id, l])) as Record<StackLayer, (typeof STACK_LAYERS)[number]>;

export const STACK_INTRO = "FROM CITY STREETS TO ORBITAL SPACE";
export const STACK_SECONDARY = "AGENTROPOLIS is being built as one connected intelligence civilization.";
export const STACK_START: StackLayer = "atlas";

export const STACK_RAIL: { id: StackLayer; label: string; sub: string }[] = [
  { id: "orbit", label: "ORBIT", sub: "ORBITAL INTELLIGENCE" },
  { id: "atlas", label: "GLOBE", sub: "ATLAS" },
  { id: "grid", label: "WORLD GRID", sub: "GOVERNANCE" },
  { id: "city", label: "CITY", sub: "AGENTROPOLIS WORLD" },
  { id: "worldq", label: "WORLDQ", sub: "STREAM" },
];

export const STACK_BOUNDARY =
  "WORLD GRID describes authority and jurisdiction context. It does not grant execution permission.";

export type StackMeta = {
  source: string;
  observed_at: string;
  retrieved_at: string;
  expires_at: string;
  confidence: "low" | "medium" | "high";
  precision: string;
  provider: string;
  provider_status: "DEMO" | "SIMULATED";
  is_estimated: true;
};

const META: StackMeta = {
  source: "AGENTROPOLIS World Stack prototype",
  observed_at: "2026-09-10T00:00:00Z",
  retrieved_at: "2026-09-10T00:00:00Z",
  expires_at: "2026-09-10T06:00:00Z",
  confidence: "low",
  precision: "regional",
  provider: "NEURO BUILDS · DEMO",
  provider_status: "DEMO",
  is_estimated: true,
};

export function stackMeta(): StackMeta {
  return META;
}

export type StackRegion = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  kind: "region" | "city";
  note: string;
};

export const STACK_REGIONS: StackRegion[] = [
  { id: "americas", name: "Americas", lat: 15, lon: -90, kind: "region", note: "SIMULATED region. ATLAS read plane." },
  { id: "emea", name: "Eurasia", lat: 48, lon: 20, kind: "region", note: "SIMULATED region. ATLAS read plane." },
  { id: "africa", name: "Africa", lat: 2, lon: 22, kind: "region", note: "SIMULATED region. ATLAS read plane." },
  { id: "apac", name: "APAC", lat: 18, lon: 110, kind: "region", note: "SIMULATED region. ATLAS read plane." },
  {
    id: "agentropolis",
    name: "AGENTROPOLIS",
    lat: 38.58,
    lon: -121.49,
    kind: "city",
    note: "City-state pin. Descent enters the existing AGENTROPOLIS world.",
  },
];

export type GovNode = {
  id: string;
  regionId: string;
  name: string;
  kind: "sovereign" | "state" | "bloc" | "treaty" | "regulator" | "ministry";
  lat: number;
  lon: number;
};

export const STACK_GOV: GovNode[] = [
  { id: "gov-us", regionId: "americas", name: "Modeled US civic", kind: "sovereign", lat: 38.9, lon: -77 },
  { id: "gov-ca", regionId: "americas", name: "Modeled CA jurisdiction", kind: "state", lat: 38.58, lon: -121.49 },
  { id: "gov-br", regionId: "americas", name: "Modeled BR civic", kind: "sovereign", lat: -15.8, lon: -47.9 },
  { id: "gov-eu", regionId: "emea", name: "Modeled EU policy domain", kind: "bloc", lat: 50.8, lon: 4.3 },
  { id: "gov-un", regionId: "emea", name: "Modeled treaty desk", kind: "treaty", lat: 46.2, lon: 6.1 },
  { id: "gov-uk", regionId: "emea", name: "Modeled UK regulator", kind: "regulator", lat: 51.5, lon: -0.12 },
  { id: "gov-au", regionId: "africa", name: "Modeled AU desk", kind: "bloc", lat: 9.0, lon: 38.7 },
  { id: "gov-eg", regionId: "africa", name: "Modeled EG ministry", kind: "ministry", lat: 30.04, lon: 31.24 },
  { id: "gov-asean", regionId: "apac", name: "Modeled ASEAN desk", kind: "bloc", lat: 1.3, lon: 103.8 },
  { id: "gov-cn", regionId: "apac", name: "Modeled CN civic", kind: "sovereign", lat: 39.9, lon: 116.4 },
  { id: "gov-in", regionId: "apac", name: "Modeled IN ministry", kind: "ministry", lat: 28.6, lon: 77.2 },
];

export const STACK_TREATIES: [string, string][] = [
  ["gov-us", "gov-eu"],
  ["gov-eu", "gov-un"],
  ["gov-un", "gov-au"],
  ["gov-asean", "gov-eu"],
  ["gov-us", "gov-asean"],
  ["gov-cn", "gov-un"],
  ["gov-in", "gov-uk"],
];

export const STACK_POLICY: { id: string; name: string; regionId: string; lat: number; lon: number }[] = [
  { id: "pol-spectrum", name: "Spectrum / air", regionId: "americas", lat: 28, lon: -80 },
  { id: "pol-maritime", name: "Maritime zone", regionId: "africa", lat: 4, lon: 8 },
  { id: "pol-data", name: "Data residency", regionId: "emea", lat: 52, lon: 13 },
  { id: "pol-trade", name: "Trade corridor", regionId: "apac", lat: 12, lon: 102 },
];

export type SatNode = {
  id: string;
  name: string;
  plane: number;
  phase: number;
  alt: number;
};

export const STACK_SATS: SatNode[] = [
  { id: "sat-01", name: "Constellation A", plane: 0, phase: 0.0, alt: 2.35 },
  { id: "sat-02", name: "Constellation A", plane: 0, phase: 0.25, alt: 2.35 },
  { id: "sat-03", name: "Constellation A", plane: 0, phase: 0.5, alt: 2.35 },
  { id: "sat-04", name: "Constellation A", plane: 0, phase: 0.75, alt: 2.35 },
  { id: "sat-05", name: "Constellation B", plane: 1, phase: 0.08, alt: 2.62 },
  { id: "sat-06", name: "Constellation B", plane: 1, phase: 0.33, alt: 2.62 },
  { id: "sat-07", name: "Constellation B", plane: 1, phase: 0.58, alt: 2.62 },
  { id: "sat-08", name: "Constellation B", plane: 1, phase: 0.83, alt: 2.62 },
  { id: "sat-09", name: "Relay C", plane: 2, phase: 0.12, alt: 2.9 },
  { id: "sat-10", name: "Relay C", plane: 2, phase: 0.45, alt: 2.9 },
  { id: "sat-11", name: "Relay C", plane: 2, phase: 0.7, alt: 2.9 },
  { id: "sat-12", name: "Weather desk", plane: 2, phase: 0.92, alt: 3.15 },
];

/** Same Earth through ATLAS and WORLD GRID. Grid is an overlay, not a new world. */
export const STACK_CAM: Record<StackLayer, { pos: [number, number, number]; look: [number, number, number]; fov: number }> = {
  orbit: { pos: [0.2, 1.6, 8.8], look: [0, 0, 0], fov: 42 },
  atlas: { pos: [2.15, 1.35, 5.05], look: [0, 0, 0], fov: 38 },
  grid: { pos: [1.95, 1.22, 4.55], look: [0, 0, 0], fov: 36 },
  city: { pos: [0.62, 0.42, 2.05], look: [0.38, 0.18, 0.02], fov: 32 },
  worldq: { pos: [0.15, -2.05, 2.6], look: [0, -0.35, 0], fov: 40 },
};

export const EARTH_R = 1.62;

export function latLonToVec(lat: number, lon: number, r = EARTH_R): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return [-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta)];
}

export function layerIndex(id: StackLayer) {
  return STACK_LAYERS.findIndex((l) => l.id === id);
}

export function layerByIndex(i: number): StackLayer {
  const n = STACK_LAYERS.length;
  const k = ((i % n) + n) % n;
  return STACK_LAYERS[k]!.id;
}

export function govById(id: string) {
  return STACK_GOV.find((g) => g.id === id);
}

/** Compact DEMO jurisdiction rings. Not legal borders. Not survey-grade. */
export type StackBound = {
  id: string;
  regionId: string;
  name: string;
  kind: "sovereign" | "state" | "bloc";
  path: [number, number][];
};

export const STACK_BOUNDS: StackBound[] = [
  {
    id: "bound-us",
    regionId: "americas",
    name: "US",
    kind: "sovereign",
    path: [
      [48.0, -124.5], [42.0, -124.4], [32.5, -117.1], [31.3, -108.0], [25.9, -97.2],
      [29.2, -89.4], [25.2, -81.0], [30.7, -81.4], [35.2, -75.5], [44.8, -66.9],
      [47.3, -68.2], [45.0, -83.5], [49.0, -95.2], [49.0, -123.0],
    ],
  },
  {
    id: "bound-ca",
    regionId: "americas",
    name: "CA",
    kind: "state",
    path: [
      [42.0, -124.4], [42.0, -120.0], [39.0, -120.0], [35.0, -114.6], [32.7, -114.5],
      [32.5, -117.1], [34.5, -120.5], [40.4, -124.3],
    ],
  },
  {
    id: "bound-br",
    regionId: "americas",
    name: "BR",
    kind: "sovereign",
    path: [
      [5.2, -60.0], [2.8, -50.8], [-7.4, -34.8], [-22.9, -42.0], [-33.7, -53.4],
      [-27.5, -58.4], [-11.0, -70.0], [-7.5, -73.9], [2.1, -69.6],
    ],
  },
  {
    id: "bound-eu",
    regionId: "emea",
    name: "EU",
    kind: "bloc",
    path: [
      [70.0, 25.0], [58.0, 24.0], [54.4, 10.0], [51.2, 3.2], [43.2, -8.8],
      [36.0, -5.6], [37.0, 15.0], [41.0, 28.8], [46.0, 30.0], [54.0, 24.0], [66.0, 28.0],
    ],
  },
  {
    id: "bound-uk",
    regionId: "emea",
    name: "UK",
    kind: "sovereign",
    path: [
      [58.6, -5.0], [58.5, -3.0], [55.8, -2.0], [52.9, 1.7], [50.1, -5.2],
      [51.7, -5.3], [54.8, -4.8], [56.8, -6.1],
    ],
  },
  {
    id: "bound-eg",
    regionId: "africa",
    name: "EG",
    kind: "sovereign",
    path: [
      [31.6, 25.0], [31.5, 32.3], [29.5, 32.6], [22.0, 36.9], [22.0, 25.0], [29.2, 25.0],
    ],
  },
  {
    id: "bound-et",
    regionId: "africa",
    name: "AU desk",
    kind: "bloc",
    path: [
      [14.8, 36.0], [14.2, 42.0], [8.0, 47.5], [3.5, 41.8], [4.4, 34.0], [12.5, 36.0],
    ],
  },
  {
    id: "bound-cn",
    regionId: "apac",
    name: "CN",
    kind: "sovereign",
    path: [
      [53.4, 123.0], [47.6, 134.0], [42.5, 130.0], [37.5, 122.0], [23.4, 117.0],
      [21.5, 108.0], [24.0, 98.0], [39.0, 74.0], [47.8, 87.0], [49.1, 87.8],
    ],
  },
  {
    id: "bound-in",
    regionId: "apac",
    name: "IN",
    kind: "sovereign",
    path: [
      [35.0, 74.5], [34.9, 78.0], [27.7, 88.1], [22.0, 92.0], [8.1, 77.5],
      [15.0, 73.7], [23.7, 68.2], [28.6, 71.0], [32.5, 74.5],
    ],
  },
  {
    id: "bound-asean",
    regionId: "apac",
    name: "ASEAN",
    kind: "bloc",
    path: [
      [21.0, 100.0], [21.0, 107.5], [10.2, 109.0], [1.3, 104.0], [-8.5, 140.5],
      [-10.0, 141.0], [-8.2, 115.0], [1.0, 100.5], [7.5, 96.0], [13.5, 98.0],
    ],
  },
];

function nlerp(a: [number, number, number], b: [number, number, number], t: number, r: number): [number, number, number] {
  const x = a[0] + (b[0] - a[0]) * t;
  const y = a[1] + (b[1] - a[1]) * t;
  const z = a[2] + (b[2] - a[2]) * t;
  const m = Math.hypot(x, y, z) || 1;
  return [(x / m) * r, (y / m) * r, (z / m) * r];
}

/** Sphere-hugging segment list for a closed lat/lon ring. */
export function boundSegments(path: [number, number][], r = EARTH_R + 0.014, stepDeg = 4): Float32Array {
  const pts: number[] = [];
  const n = path.length;
  if (n < 2) return new Float32Array(0);
  for (let i = 0; i < n; i++) {
    const a = path[i]!;
    const b = path[(i + 1) % n]!;
    const va = latLonToVec(a[0], a[1], r);
    const vb = latLonToVec(b[0], b[1], r);
    const ang = Math.acos(Math.min(1, Math.max(-1, (va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]) / (r * r))));
    const segs = Math.max(1, Math.ceil((ang * 180) / Math.PI / stepDeg));
    for (let k = 0; k < segs; k++) {
      const p0 = nlerp(va, vb, k / segs, r);
      const p1 = nlerp(va, vb, (k + 1) / segs, r);
      pts.push(p0[0], p0[1], p0[2], p1[0], p1[1], p1[2]);
    }
  }
  return new Float32Array(pts);
}
