/** AGENTROPOLIS holofoil documentary. NEURO is the architect on camera, not the plot. */

export type Provenance =
  | "VERIFIED"
  | "PERSONAL TESTIMONY"
  | "ARCHIVAL EVIDENCE"
  | "CREATIVE REENACTMENT"
  | "UNVERIFIED"
  | "PRIVATE / DO NOT PUBLISH";

export type Capability = "now" | "prototype" | "build" | "research" | "vision";

export type NeuroAvatar = {
  id: string;
  name: string;
  src: string;
  era: string;
  role: string;
  wardrobe: string;
  hair: string;
  embodiment: "human";
  skin: string;
  eyes: string;
  voice: string;
  emotion: string[];
  permitted: string[];
  prohibited: string[];
  provenance: Provenance;
};

export const NX_LOCK = {
  subject: "NEURO META X",
  identity: "One person. Multiple approved states. Never interchangeable models.",
  voice: "West Coast. Adult. Unsterilized. California base. Black American woman. Gen X.",
  rule: "Do not lighten skin, masculinize, thin, or replace the subject.",
};

export const NX_AVATARS: NeuroAvatar[] = [
  {
    id: "architect",
    name: "Faculty / Architect",
    src: "/media/archive/nx-au-admin.jpg",
    era: "Present",
    role: "Present-day narrator · systems architect",
    wardrobe: "Black faculty suit, red tie, lime pocket square, Agentropolis University pin",
    hair: "Shoulder-length waves",
    embodiment: "human",
    skin: "Deep brown. Unchanged.",
    eyes: "Brown",
    voice: "ursa",
    emotion: ["authority", "warmth", "precision"],
    permitted: ["grid intro", "governance", "horizon"],
    prohibited: ["childhood fiction", "unrelated model", "sexualized restyle"],
    provenance: "CREATIVE REENACTMENT",
  },
  {
    id: "chief",
    name: "Chaos Academy Chief",
    src: "/media/archive/nx-ca-chief.jpg",
    era: "Present",
    role: "Archive guide",
    wardrobe: "Black faculty suit, Chaos Academy pin",
    hair: "Shoulder-length waves",
    embodiment: "human",
    skin: "Deep brown. Unchanged.",
    eyes: "Brown",
    voice: "ursa",
    emotion: ["clarity", "invitation"],
    permitted: ["prologue", "academy", "method"],
    prohibited: ["childhood fiction", "unrelated model"],
    provenance: "CREATIVE REENACTMENT",
  },
  {
    id: "staff",
    name: "Chief of Staff",
    src: "/media/archive/nx-a-staff.jpg",
    era: "Present",
    role: "Present-day narrator",
    wardrobe: "Black faculty suit, Agentropolis A pin",
    hair: "Shoulder-length waves",
    embodiment: "human",
    skin: "Deep brown. Unchanged.",
    eyes: "Brown",
    voice: "ursa",
    emotion: ["confidence", "directness"],
    permitted: ["direction", "solo", "close"],
    prohibited: ["childhood fiction"],
    provenance: "CREATIVE REENACTMENT",
  },
  {
    id: "world",
    name: "World Stack presenter",
    src: "/media/archive/nx-a-world.jpg",
    era: "Present",
    role: "Systems architect",
    wardrobe: "Black hoodie and bomber, Agentropolis A mark",
    hair: "Shoulder-length waves",
    embodiment: "human",
    skin: "Deep brown. Unchanged.",
    eyes: "Brown",
    voice: "ursa",
    emotion: ["exposition", "command"],
    permitted: ["world stack", "city visible"],
    prohibited: ["claim live satellite feeds"],
    provenance: "CREATIVE REENACTMENT",
  },
  {
    id: "knots",
    name: "Builder · knots",
    src: "/media/archive/nx-ca-knots.jpg",
    era: "Present",
    role: "Builder under pressure",
    wardrobe: "Chaos Academy hoodie under black bomber, cyan piping, red lining",
    hair: "Bantu knots",
    embodiment: "human",
    skin: "Deep brown. Unchanged.",
    eyes: "Brown",
    voice: "ursa",
    emotion: ["focus", "resolve"],
    permitted: ["wired chaos", "solo"],
    prohibited: ["mascot treatment"],
    provenance: "CREATIVE REENACTMENT",
  },
  {
    id: "wrap",
    name: "Creative director · wrap",
    src: "/media/archive/nx-ca-wrap.jpg",
    era: "Present",
    role: "Creative director · urban scholar",
    wardrobe: "Black blazer, cyan/red lapel piping, gold chain, Chaos Academy tank",
    hair: "Black head wrap with cyan and red piping",
    embodiment: "human",
    skin: "Deep brown. Unchanged.",
    eyes: "Brown",
    voice: "ursa",
    emotion: ["authority", "poise"],
    permitted: ["culture", "broadcast", "brand"],
    prohibited: ["costume joke"],
    provenance: "CREATIVE REENACTMENT",
  },
  {
    id: "puff",
    name: "Pattern matcher",
    src: "/media/archive/nx-a-puff.jpg",
    era: "Present",
    role: "Internal pattern matcher",
    wardrobe: "Black techwear hoodie, red/cyan seams, Agentropolis wordmark",
    hair: "Afro puffs",
    embodiment: "human",
    skin: "Deep brown. Unchanged.",
    eyes: "Brown",
    voice: "ursa",
    emotion: ["scrutiny", "wit"],
    permitted: ["mind rooms", "method"],
    prohibited: ["medical spectacle"],
    provenance: "CREATIVE REENACTMENT",
  },
  {
    id: "tech",
    name: "Operator",
    src: "/media/archive/nx-a-tech.jpg",
    era: "Present",
    role: "Builder · operator",
    wardrobe: "Black hoodie under bomber, Agentropolis A patches, red zipper pulls",
    hair: "Shoulder-length waves",
    embodiment: "human",
    skin: "Deep brown. Unchanged.",
    eyes: "Brown",
    voice: "ursa",
    emotion: ["ease", "command"],
    permitted: ["agents", "receipts"],
    prohibited: ["unrelated model"],
    provenance: "CREATIVE REENACTMENT",
  },
];

export const NX_BY_ID = Object.fromEntries(NX_AVATARS.map((a) => [a.id, a])) as Record<string, NeuroAvatar>;

export type ArchiveEvidence = {
  label: string;
  note: string;
  src?: string;
  kind: Provenance;
};

export type ArchiveChapter = {
  id: string;
  mark: string;
  title: string;
  kicker: string;
  line: string;
  body: string[];
  avatarId: string;
  still: string;
  video: string;
  filmChapter?: string;
  capability: Capability;
  evidence: ArchiveEvidence[];
};

export const ARCHIVE_TITLE = "AGENTROPOLIS";
export const ARCHIVE_SUB = "ANOMALOUS TRANSMISSION";
export const ARCHIVE_TAG = "THE INTELLIGENCE GRID DOCUMENTARY";
export const ARCHIVE_QUESTION =
  "What happens when a mind the world calls chaotic begins constructing its own operating environment?";
export const ARCHIVE_THESIS =
  "AGENTROPOLIS is the city that made that architecture visible. NEURO did not get saved by AI. She externalized the operating system already running in her head — then put limits on it.";

export const ARCHIVE_CHAPTERS: ArchiveChapter[] = [
  {
    id: "prologue",
    mark: "00",
    title: "THE SIGNAL",
    kicker: "Prologue",
    line: "Hear the city before anyone explains it.",
    body: [
      "Fragments first: terminals, districts, voice, unfinished worlds.",
      "AGENTROPOLIS is already transmitting. The question is not whether the city exists.",
      ARCHIVE_QUESTION,
    ],
    avatarId: "chief",
    still: "/media/stills/octane/hero.jpg",
    video: "/media/web/px-neuro-cinematic.mp4",
    filmChapter: "open",
    capability: "now",
    evidence: [
      { label: "Origin film open", note: "NEURO's recorded testimony. The city is the subject from the first line.", kind: "PERSONAL TESTIMONY", src: "/media/stills/px-lockup.jpg" },
      { label: "Approved avatar lock", note: "Chaos Academy faculty state. Creative reenactment, not historical footage.", kind: "CREATIVE REENACTMENT", src: "/media/archive/nx-ca-chief.jpg" },
    ],
  },
  {
    id: "grid",
    mark: "01",
    title: "THE GRID",
    kicker: "What the city is",
    line: "AGENTROPOLIS is the Intelligence Grid for accountable autonomous agents.",
    body: [
      "Not a dashboard. Not a chatbot skin. A city-state where agents, humans, and policy share one floor.",
      "Infrastructure, districts, applications, agents, memory, execution, receipts, audit.",
      "The city is the interface. The interface does not become the authority.",
    ],
    avatarId: "architect",
    still: "/media/stills/city-overview.jpg",
    video: "/media/web/city-overview.mp4",
    filmChapter: "systems",
    capability: "now",
    evidence: [
      { label: "City overview still", note: "Existing AGENTROPOLIS spatial record.", kind: "ARCHIVAL EVIDENCE", src: "/media/stills/city-overview.jpg" },
      { label: "Agentropolis University lockup", note: "Approved faculty collection. Brand evidence, not a claimed accredited university.", kind: "CREATIVE REENACTMENT", src: "/media/archive/look-au.jpg" },
    ],
  },
  {
    id: "direction",
    mark: "02",
    title: "DIRECTION",
    kicker: "How the problems changed",
    line: "Solving them became AGENTROPOLIS.",
    body: [
      "The work stopped being 'how do I build this app.'",
      "It became: who owns memory, which agent gets access, what stops an agent from exceeding its authority, and what a human needs to see to remain in control.",
      "Those were not vibe-coding problems. They were systems problems.",
    ],
    avatarId: "staff",
    still: "/media/stills/px-operator.jpg",
    video: "/media/web/px-neuro-cinematic.mp4",
    filmChapter: "systems",
    capability: "now",
    evidence: [
      { label: "Recorded testimony", note: "From the origin film. Personal testimony, dated to this production.", kind: "PERSONAL TESTIMONY" },
      { label: "Operator still", note: "Parallax / spatial loop used as visual method, not as a finished product claim.", kind: "ARCHIVAL EVIDENCE", src: "/media/stills/px-operator.jpg" },
    ],
  },
  {
    id: "stack",
    mark: "03",
    title: "WORLD STACK",
    kicker: "One continuous descent",
    line: "From orbital space into the city-state.",
    body: [
      "ORBITAL INTELLIGENCE sees what moves above us.",
      "ATLAS knows where. AGENTROPOLIS-WORLD-GRID knows who governs there — it does not grant permission.",
      "AGENTROPOLIS WORLD shows what is happening inside the city. WORLDQ streams and reconstructs at the fidelity required.",
    ],
    avatarId: "world",
    still: "/media/stills/px-world-01.jpg",
    video: "/media/web/px-world-01.mp4",
    filmChapter: "tour",
    capability: "prototype",
    evidence: [
      { label: "World Stack presenter plate", note: "Approved embodiment explaining the five-layer descent. Simulated overlay.", kind: "CREATIVE REENACTMENT", src: "/media/archive/nx-a-world.jpg" },
      { label: "Spatial still", note: "Prototype visualization. DEMO / SIMULATED telemetry in the live World Stack.", kind: "ARCHIVAL EVIDENCE", src: "/media/stills/px-world-01.jpg" },
    ],
  },
  {
    id: "city",
    mark: "04",
    title: "THE CITY BECOMES VISIBLE",
    kicker: "Districts are architecture",
    line: "Repositories, agents, broadcasts, and buildings are the same map.",
    body: [
      "HERMES CITY holds persistent identities. The Foundry assigns roles. Aegis decides who gets a lightsaber.",
      "Main Street is where people enter. Holofoil is material, not mint. 33.3 FM keeps the city on air.",
      "If it looks like an enterprise dashboard, the direction is wrong.",
    ],
    avatarId: "tech",
    still: "/media/stills/octane/foil-plaza.jpg",
    video: "/media/web/px-city.mp4",
    filmChapter: "shown",
    capability: "now",
    evidence: [
      { label: "Holofoil plaza", note: "Deterministic material system. No wallet required on this floor.", kind: "ARCHIVAL EVIDENCE", src: "/media/stills/octane/foil-plaza.jpg" },
      { label: "HERMES still", note: "Operator-facing society layer. Live hosts are labeled separately from planned adapters.", kind: "ARCHIVAL EVIDENCE", src: "/media/stills/live/hermes-pages.jpg" },
    ],
  },
  {
    id: "agents",
    mark: "05",
    title: "AGENTS ON PURPOSE",
    kicker: "Teams of intelligence",
    line: "The architect stays above the system.",
    body: [
      "One agent researches. Another implements. Another reviews. Another challenges the assumptions.",
      "HERMES coordinates. Coding agents work against repositories. Judgment is not delegated by default.",
      "Wake agents on purpose. Retrieve context on purpose. Load capability on purpose.",
    ],
    avatarId: "puff",
    still: "/media/stills/botbae-hero.jpg",
    video: "/media/web/botbae-hero.mp4",
    filmChapter: "method",
    capability: "now",
    evidence: [
      { label: "BOTBAE hero", note: "What it looks like when the grid is live: agents moving, receipts landing.", kind: "ARCHIVAL EVIDENCE", src: "/media/stills/botbae-hero.jpg" },
      { label: "Method testimony", note: "Direct, inspect, reject, change the architecture, build again.", kind: "PERSONAL TESTIMONY" },
    ],
  },
  {
    id: "receipts",
    mark: "06",
    title: "GENERATED ≠ VERIFIED",
    kicker: "Parallax law",
    line: "See. Act. See again. Prove it.",
    body: [
      "An agent can satisfy the requirements and still miss the idea.",
      "PARALLAX is the spatial proof loop: observe, act, see again, verify, leave a receipt.",
      "You do not hand somebody the Death Star and skip asking who has the keys.",
    ],
    avatarId: "knots",
    still: "/media/stills/px-verify.jpg",
    video: "/media/web/px-verify.mp4",
    filmChapter: "parallax",
    capability: "prototype",
    evidence: [
      { label: "Verify still", note: "Proof overlay from the Parallax record. Prototype, not a claimed production SLA.", kind: "ARCHIVAL EVIDENCE", src: "/media/stills/px-verify.jpg" },
      { label: "Chaos Academy kit", note: "Faculty collection. Brand work in the archive, not a purchased product catalog.", kind: "CREATIVE REENACTMENT", src: "/media/archive/look-ca.jpg" },
    ],
  },
  {
    id: "solo",
    mark: "07",
    title: "SOLO ARCHITECTURE",
    kicker: "Limited resources, full system",
    line: "There was not an engineering department waiting downstairs.",
    body: [
      "Solo founder constraint: limited capital, limited hardware, local-first tools, repeated iteration.",
      "The question became how much organizational capability one person can assemble using agents.",
      "Do not glamorize token waste. Labor is still the hidden layer behind 'AI made this.'",
    ],
    avatarId: "knots",
    still: "/media/stills/studio.jpg",
    video: "/media/web/studio.mp4",
    filmChapter: "solo",
    capability: "now",
    evidence: [
      { label: "Studio still", note: "Production environment used in the origin film.", kind: "ARCHIVAL EVIDENCE", src: "/media/stills/studio.jpg" },
      { label: "Solo testimony", note: "Recorded: 'I'm a solo founder.'", kind: "PERSONAL TESTIMONY" },
    ],
  },
  {
    id: "govern",
    mark: "08",
    title: "LIMITS ARE THE FEATURE",
    kicker: "Governance",
    line: "Autonomous systems need evidence and human control.",
    body: [
      "Identity → Mandate → Policy → Tool permission → Execution → Receipt → Audit.",
      "WORLD GRID describes authority and jurisdiction context. It does not grant execution permission.",
      "Architecture limits exposure. That is the point of the city.",
    ],
    avatarId: "wrap",
    still: "/media/stills/px-auth.jpg",
    video: "/media/web/hood.mp4",
    filmChapter: "lightsaber",
    capability: "now",
    evidence: [
      { label: "Aegis / keys", note: "Who gets a lightsaber. Who does not. Who thinks they should.", kind: "PERSONAL TESTIMONY" },
      { label: "Auth still", note: "Policy at the gate. Visual metaphor, labeled.", kind: "ARCHIVAL EVIDENCE", src: "/media/stills/px-auth.jpg" },
    ],
  },
  {
    id: "horizon",
    mark: "09",
    title: "STILL TRANSMITTING",
    kicker: "Epilogue",
    line: "The city is not complete. The signal is intentional.",
    body: [
      "Operational now: the city floor, protocol walk, receipts language, Holofoil campus, World Stack prototype.",
      "Under construction: live adapters, deeper reconstruction, governed execution at scale.",
      "Long-term vision is labeled vision. Planned technology is not presented as shipped.",
    ],
    avatarId: "architect",
    still: "/media/stills/agentropolis-lockup.jpg",
    video: "/media/web/agentropolis-lockup.mp4",
    filmChapter: "answer",
    capability: "vision",
    evidence: [
      { label: "Lockup", note: "AGENTROPOLIS mark used as closing title card.", kind: "ARCHIVAL EVIDENCE", src: "/media/stills/agentropolis-lockup.jpg" },
      { label: "Closing testimony", note: "The tour ends. The grid keeps running.", kind: "PERSONAL TESTIMONY" },
    ],
  },
];

export function archiveChapter(id: string) {
  return ARCHIVE_CHAPTERS.find((c) => c.id === id) ?? ARCHIVE_CHAPTERS[0]!;
}

export const CAPABILITY_LABEL: Record<Capability, string> = {
  now: "OPERATIONAL NOW",
  prototype: "PROTOTYPE",
  build: "UNDER CONSTRUCTION",
  research: "RESEARCH",
  vision: "LONG-TERM VISION",
};
