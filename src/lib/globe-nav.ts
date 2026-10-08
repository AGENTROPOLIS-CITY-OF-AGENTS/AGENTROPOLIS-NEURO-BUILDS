import type { GridStatus } from "@/lib/grid";

export type GlobeOpen =
  | "city"
  | "worldq"
  | "protocol"
  | "campus"
  | "street"
  | "holofoil"
  | "external"
  | "stay";

export type GlobeChild = {
  id: string;
  slug: string;
  name: string;
  line: string;
  status: GridStatus;
  districtId?: string;
  open: GlobeOpen;
  href?: string;
};

export type GlobeDistrict = {
  id: string;
  slug: string;
  name: string;
  line: string;
  status: GridStatus;
  lat: number;
  lon: number;
  poster: string;
  districtId?: string;
  open: GlobeOpen;
  href?: string;
  children: GlobeChild[];
};

/** Top-level globe plates. Apps and sub-brands live under a parent, never as peers. */
export const GLOBE_DISTRICTS: GlobeDistrict[] = [
  {
    id: "atg",
    slug: "atg",
    name: "ATG",
    line: "Agent Transaction Grammar. Who acts, what is allowed, what receipt survives.",
    status: "AVAILABLE",
    lat: 38.9,
    lon: -77,
    poster: "/media/stills/live/atg-pages.jpg",
    districtId: "atg",
    open: "protocol",
    children: [
      { id: "atralith", slug: "atralith", name: "ATRALITH", line: "Implements the standard.", status: "AVAILABLE", districtId: "atg", open: "protocol" },
      { id: "receipts", slug: "receipts", name: "RECEIPTS", line: "What survives the act.", status: "AVAILABLE", districtId: "atg", open: "city" },
    ],
  },
  {
    id: "docking",
    slug: "docking",
    name: "DOCKING DISTRICT",
    line: "BYOE, BYOK, BYOH. External runtimes arrive here. No automatic authority.",
    status: "AVAILABLE",
    lat: 1.3,
    lon: 103.8,
    poster: "/media/stills/wallet.jpg",
    districtId: "dock",
    open: "city",
    children: [
      { id: "arubik-world", slug: "arubik-world", name: "ARUBIK WORLD", line: "Docked world. Not a globe peer.", status: "PREVIEW", districtId: "dock", open: "stay" },
      { id: "asimov", slug: "asimov", name: "ASIMOV", line: "Embodied agents. Simulation first.", status: "AVAILABLE", districtId: "asimov", open: "city" },
      { id: "offgrid", slug: "offgrid", name: "OFFGRID PUB", line: "External host berth.", status: "AVAILABLE", districtId: "dock", open: "city" },
    ],
  },
  {
    id: "gaming",
    slug: "gaming",
    name: "GAMING",
    line: "Playable layers of the city. Not a product shelf on the globe.",
    status: "LIVE",
    lat: 35.68,
    lon: 139.76,
    poster: "/media/stills/octane/foil-card.jpg",
    districtId: "holofoil",
    open: "holofoil",
    children: [
      { id: "holofoil", slug: "holofoil", name: "HOLOFOIL", line: "Foil, cards, creatures, 3D stage.", status: "LIVE", districtId: "holofoil", open: "holofoil" },
      { id: "chaos-rank", slug: "chaos-rank", name: "CHAOS RANK", line: "Ranked play surface.", status: "LIVE", open: "external", href: "https://agentropolis-city-of-agents.github.io/AGENTROPOLIS-CHAOS-RANK/" },
    ],
  },
  {
    id: "fashion",
    slug: "fashion",
    name: "FASHION",
    line: "Wardrobe, identity surface, material culture.",
    status: "PLANNED",
    lat: 45.46,
    lon: 9.19,
    poster: "/media/stills/octane/foil-plaza.jpg",
    open: "stay",
    children: [],
  },
  {
    id: "hermes",
    slug: "hermes",
    name: "HERMES CITY",
    line: "Operator-facing society. Identities, handoffs, memory.",
    status: "LIVE",
    lat: 38.58,
    lon: -121.49,
    poster: "/media/stills/live/hermes-pages.jpg",
    districtId: "hermes",
    open: "city",
    children: [
      { id: "buzz", slug: "buzz", name: "BUZZ", line: "Shared human/agent workspace.", status: "PLANNED", districtId: "buzz", open: "city" },
      { id: "social", slug: "social", name: "HERMES SOCIAL", line: "Society layer. Adapters planned.", status: "LIVE", districtId: "hermes", open: "city" },
    ],
  },
  {
    id: "worldq",
    slug: "worldq",
    name: "WORLDQ / ASTRA",
    line: "Mission canvas. Envelope, agent, receipt, audit.",
    status: "PREVIEW",
    lat: 0.2,
    lon: 18.4,
    poster: "/media/stills/px-world-01.jpg",
    open: "worldq",
    children: [
      { id: "mission", slug: "mission", name: "MISSION", line: "Current governed task.", status: "PREVIEW", open: "worldq" },
      { id: "agent", slug: "agent", name: "AGENT", line: "Presence. Not silent execute.", status: "PREVIEW", open: "worldq" },
      { id: "receipt", slug: "receipt", name: "RECEIPT", line: "What can be proven.", status: "PREVIEW", open: "worldq" },
      { id: "audit", slug: "audit", name: "AUDIT", line: "Corridor after the act.", status: "PREVIEW", open: "worldq" },
    ],
  },
  {
    id: "aquaduct",
    slug: "aquaduct",
    name: "AQUADUCT",
    line: "Resource routing across chains. Verified host, not a globe product tile.",
    status: "LIVE",
    lat: 41.9,
    lon: 12.5,
    poster: "/media/stills/live/aquaduct-pages.jpg",
    open: "external",
    href: "https://agentropolis-city-of-agents.github.io/AGENTROPOLIS-AQUADUCT/",
    children: [],
  },
  {
    id: "mcp",
    slug: "mcp",
    name: "AGENT MCP",
    line: "Tool permission plane. J-Space deliberates through it.",
    status: "AVAILABLE",
    lat: 37.44,
    lon: -122.14,
    poster: "/media/stills/live/mcp-pages.jpg",
    districtId: "jspace",
    open: "city",
    children: [
      { id: "jspace", slug: "jspace", name: "J-SPACE", line: "Cognitive commons. Hidden CoT stays off the floor.", status: "AVAILABLE", districtId: "jspace", open: "city" },
    ],
  },
  {
    id: "base",
    slug: "base",
    name: "BASE",
    line: "Identity and smart-wallet rail. People first. Rails underneath.",
    status: "PLANNED",
    lat: 37.77,
    lon: -122.42,
    poster: "/media/stills/px-auth.jpg",
    districtId: "identity",
    open: "city",
    children: [
      { id: "identity", slug: "identity", name: "IDENTITY PLAZA", line: "Local name. Bind. Revoke.", status: "PLANNED", districtId: "identity", open: "city" },
    ],
  },
  {
    id: "parallax",
    slug: "parallax",
    name: "PARALLAX",
    line: "See. Act. See again. Prove it.",
    status: "AVAILABLE",
    lat: 34.05,
    lon: -118.24,
    poster: "/media/stills/live/parallax-pages.jpg",
    districtId: "parallax",
    open: "city",
    children: [
      { id: "inspect", slug: "inspect", name: "INSPECT", line: "Observe before act.", status: "AVAILABLE", districtId: "parallax", open: "city" },
      { id: "verify", slug: "verify", name: "VERIFY", line: "Generated is not verified.", status: "AVAILABLE", districtId: "parallax", open: "city" },
    ],
  },
  {
    id: "creator",
    slug: "creator",
    name: "CREATOR CORE",
    line: "World building. BOTBAE is live. The first build is not the city.",
    status: "LIVE",
    lat: 51.5,
    lon: -0.12,
    poster: "/media/stills/live/creator-pages.jpg",
    districtId: "construct",
    open: "city",
    children: [
      { id: "botbae", slug: "botbae", name: "BOTBAE", line: "Visual builder. Skills, memory, receipts.", status: "LIVE", districtId: "construct", open: "city" },
      { id: "origin", slug: "origin", name: "ORIGIN ENGINE", line: "Utility campus. Mock generate. No mint.", status: "PREVIEW", districtId: "utility", open: "campus" },
      { id: "film", slug: "film", name: "FILM DISTRICT", line: "Governed production. Distinct from ATV air.", status: "AVAILABLE", districtId: "film", open: "city" },
    ],
  },
];

export const GLOBE_BY_SLUG = Object.fromEntries(GLOBE_DISTRICTS.map((d) => [d.slug, d])) as Record<string, GlobeDistrict>;
export const GLOBE_BY_ID = Object.fromEntries(GLOBE_DISTRICTS.map((d) => [d.id, d])) as Record<string, GlobeDistrict>;

export function globeChild(districtSlug: string, childSlug: string | null) {
  const d = GLOBE_BY_SLUG[districtSlug];
  if (!d || !childSlug) return null;
  return d.children.find((c) => c.slug === childSlug) ?? null;
}

export function globeCrumbs(districtSlug: string | null, childSlug: string | null) {
  const parts = [{ slug: "globe", name: "GLOBE" }];
  const d = districtSlug ? GLOBE_BY_SLUG[districtSlug] : null;
  if (d) parts.push({ slug: d.slug, name: d.name });
  const c = d && childSlug ? d.children.find((x) => x.slug === childSlug) : null;
  if (c) parts.push({ slug: c.slug, name: c.name });
  return parts;
}

/** City districts that stay inside the city, not as globe peers. */
export const CITY_ONLY_DISTRICTS = [
  "mission",
  "street",
  "aegis",
  "sentinel",
  "t54",
  "atlas",
  "civic",
  "atv",
  "fm",
] as const;
