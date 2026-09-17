export type ViewId =
  | "city"
  | "agents"
  | "collectives"
  | "districts"
  | "mcp"
  | "jspace"
  | "observatory"
  | "signals"
  | "atv"
  | "build"
  | "archive";

export type GridStatus = "LIVE" | "AVAILABLE" | "PLANNED" | "OFFLINE" | "PREVIEW";

export type RuntimeId = "hermes" | "nemoclaw" | "nemotron" | "codex" | "local" | "botbae" | "human";

export type District = {
  id: string;
  name: string;
  code: string;
  kind: string;
  role: string;
  status: GridStatus;
  x: string;
  y: string;
  scene: string;
  poster: string;
  agents: string[];
  mcps: string[];
  skills: string[];
  apps: string[];
  repo?: string;
  activity: string[];
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  place: string;
  districtId: string;
  status: "directing" | "active" | "idle" | "gated" | "on-air";
  runtime: RuntimeId;
  task: string;
};

export type FloorLine = { from: string; text: string; place: string };

export type Mcp = {
  id: string;
  name: string;
  owner: string;
  repo: string;
  district: string;
  summary: string;
  tools: string[];
  transport: string;
  authority: string;
  status: GridStatus;
  source: string;
  receipt: string;
};

export type Collective = {
  id: string;
  districtId: string;
  mission: string;
  participants: string[];
  context: string;
  subtasks: string[];
  discoveries: string[];
  help: string[];
  delegated: string[];
  receipts: string[];
  confidence: string;
  blockers: string[];
  escalation: string;
};

export const NAV: { id: ViewId; label: string }[] = [
	{
		id: "city",
		label: "City"
	},
	{
		id: "agents",
		label: "Agents"
	},
	{
		id: "collectives",
		label: "Collectives"
	},
	{
		id: "districts",
		label: "Districts"
	},
	{
		id: "mcp",
		label: "MCP Grid"
	},
	{
		id: "jspace",
		label: "J-Space"
	},
	{
		id: "observatory",
		label: "Observatory"
	},
	{
		id: "signals",
		label: "Signals"
	},
	{
		id: "atv",
		label: "ATV"
	},
	{
		id: "build",
		label: "Build"
	},
	{
		id: "archive",
		label: "Archive"
	}
];
export const SITE_TITLE = "AGENTROPOLIS";
export const SITE_TAGLINE = "A city built for agents.";
export const DATA_MODE = "WORKING BUILD";
export const DATA_MODE_NOTE = "Working build. Under construction. AGENTROPOLIS quantizes compute, visuals, models, and information density together. LIVE containers are captured screenshots of the live hosts, not cinematic stand-ins. Recapture when a host UI changes. Repository existence is not a live runtime. Live tool output requires a receipt ID. Hidden chain-of-thought, secrets, and private model state stay off this floor.";
export const GOVERNANCE = [
	"IDENTITY",
	"MANDATE",
	"PLAN",
	"POLICY",
	"EXECUTE",
	"RECEIPT",
	"AUDIT"
];
export const RUNTIMES = [
	{
		id: "human",
		name: "Human",
		role: "Authority stays above the system."
	},
	{
		id: "hermes",
		name: "HERMES",
		role: "Agent runtime / mission worker. Sessions, skills, memory, approvals. Representation only."
	},
	{
		id: "nemoclaw",
		name: "NEMOCLAW",
		role: "Bounded execution environment. Filesystem, network, tools, production lock. Representation only."
	},
	{
		id: "nemotron",
		name: "NEMOTRON",
		role: "Replaceable cognition provider. Local, remote, edge, fallback. Inference is not this floor."
	},
	{
		id: "codex",
		name: "Codex",
		role: "Code-adjacent agent runtime."
	},
	{
		id: "local",
		name: "Local / custom",
		role: "BYOE. Local models and custom agents enter through the dock. GGUF is a model format, not a 3D format."
	},
	{
		id: "botbae",
		name: "BotBae",
		role: "Visual builder. Skills, memory, tools, schedules, receipts."
	}
];
export const DISTRICTS: District[] = [
	{
		id: "mission",
		name: "MISSION CONTROL",
		code: "MC",
		kind: "Authority",
		role: "Human control plane. Policy, oversight, receipts. The architect stays above the system.",
		status: "PREVIEW",
		x: "50%",
		y: "12%",
		scene: "/media/web/city-overview.mp4",
		poster: "/media/stills/city-overview.jpg",
		agents: ["neuro"],
		mcps: ["agent-mcp"],
		skills: [
			"Hold the floor",
			"Issue mandate",
			"Revoke authority"
		],
		apps: ["AGENTROPOLIS-OPS", "AGENTROPOLIS-DIRECTOR"],
		activity: ["NEURO holding the floor", "Execute remains gated until a human says otherwise"]
	},
	{
		id: "hermes",
		name: "HERMES CITY",
		code: "HX",
		kind: "Agent society",
		role: "Operator-facing city layer. Persistent identities, Bot Mode, group chats, handoffs, memory, sessions, routines, browser control, MCP command.",
		status: "LIVE",
		x: "28%",
		y: "38%",
		scene: "/media/web/botbae-fly.mp4",
		poster: "/media/stills/botbae-fly.jpg",
		agents: [
			"bae-100",
			"bae-102",
			"bae-104"
		],
		mcps: ["agent-mcp"],
		skills: [
			"Handoff",
			"Group chat",
			"Session continuity"
		],
		apps: [
			"HERMES-CITY",
			"HERMES-CITY-SOCIAL",
			"AGENTROPOLIS-DOCK",
			"AGENTROPOLIS-POCKET"
		],
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/HERMES-CITY",
		activity: ["HERMES routing specified. Discord and Telegram adapters are planned.", "Council observing. Execute still gated"]
	},
	{
		id: "jspace",
		name: "J-SPACE ∞",
		code: "JS",
		kind: "Cognitive Commons",
		role: "Model-agnostic deliberation. WikiVault, Mind Vault, specialist lenses, attention market, Meta-J auditing, Heretic slot, assemblies.",
		status: "AVAILABLE",
		x: "18%",
		y: "22%",
		scene: "/media/web/hood.mp4",
		poster: "/media/stills/jspace-pad.jpg",
		agents: ["neuro", "atg-01"],
		mcps: ["agent-mcp"],
		skills: [
			"Assemble council",
			"Mind Vault contract",
			"WikiVault bridge"
		],
		apps: ["AGENTROPOLIS-AGENT-MCP"],
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-AGENT-MCP",
		activity: ["Council assembly is a plan, not a live thought stream", "Hidden chain-of-thought is not on this floor"]
	},
	{
		id: "buzz",
		name: "BUZZ",
		code: "BZ",
		kind: "Workspace",
		role: "Human and agent shared collaboration substrate. Channels, DMs, workflows, git events, search, audit log, agent membership.",
		status: "PLANNED",
		x: "38%",
		y: "28%",
		scene: "/media/web/redcyan.mp4",
		poster: "/media/stills/redcyan.jpg",
		agents: ["bae-100", "magnet-7"],
		mcps: ["agent-mcp"],
		skills: [
			"Channel",
			"Git event",
			"Audit log"
		],
		apps: ["HERMES-CITY-SOCIAL"],
		activity: ["Workspace substrate is specified. Runtime is not connected here."]
	},
	{
		id: "street",
		name: "MAIN STREET",
		code: "MS",
		kind: "Onboarding",
		role: "The easy door into the city. Shop, work, learn, and create like a normal street. Wallets, custody, and ownership stay underneath until you ask.",
		status: "PREVIEW",
		x: "42%",
		y: "34%",
		scene: "/media/web/origin-ios.mp4",
		poster: "/media/stills/origin-ios.jpg",
		agents: ["neuro-avatar", "guide-1", "dock-3"],
		mcps: ["agent-mcp"],
		skills: [
			"Show me",
			"Take me there",
			"Explain"
		],
		apps: ["AGENTROPOLIS-MAIN-STREET", "AGENTROPOLIS-NEURO"],
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-MAIN-STREET",
		activity: ["Navigator on duty. No wallet at the door.", "Eight regions. One next step at a time."]
	},
	{
		id: "atg",
		name: "ATG",
		code: "ATG",
		kind: "Contract layer",
		role: "Agent Transaction Grammar. The open protocol and semantic contract layer. ATG tells the ecosystem who is acting, what is allowed, why it is authorized, what proof is required, and what receipt survives. ATRALITH implements the standard. Atranic carries the meaning. MCP executes the governed action.",
		status: "AVAILABLE",
		x: "72%",
		y: "24%",
		scene: "/media/web/higgs.mp4",
		poster: "/media/stills/higgs.jpg",
		agents: ["atg-01"],
		mcps: ["agent-mcp"],
		skills: [
			"Compile mandate",
			"Carry Atranic",
			"Issue receipt"
		],
		apps: ["AGENTROPOLIS-ATG"],
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-ATG",
		activity: ["ATG-01 compiling a mandate. Atranic in the message.", "ATRALITH validator standing by. No live execution on this floor."]
	},
	{
		id: "construct",
		name: "CREATOR / CONSTRUCTION",
		code: "CR",
		kind: "Making",
		role: "World building, websites, communities, media, spatial construction. BOTBAE is live. The first build is not the city.",
		status: "LIVE",
		x: "32%",
		y: "58%",
		scene: "/media/web/botbae-world.mp4",
		poster: "/media/stills/botbae-world.jpg",
		agents: ["bae-104", "atg-01"],
		mcps: ["parallax"],
		skills: [
			"CINEDANCE",
			"Foundry spawn",
			"Provenance vault"
		],
		apps: [
			"AGENTROPOLIS-BOTBAE",
			"AGENTROPOLIS-CREATOR-CORE",
			"AGENTROPOLIS-FILM-DISTRICT"
		],
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-BOTBAE",
		activity: ["BOTBAE grid live in preview. Skills Market open."]
	},
	{
		id: "dock",
		name: "DOCKING DISTRICT",
		code: "DK",
		kind: "Arrival",
		role: "BYOE, BYOK, BYOH. Providers, models, keys, hosts, external runtimes. Local reputation starts at zero.",
		status: "AVAILABLE",
		x: "14%",
		y: "70%",
		scene: "/media/web/wallet.mp4",
		poster: "/media/stills/wallet.jpg",
		agents: ["dock-3"],
		mcps: ["offgrid", "asimov"],
		skills: [
			"Customs",
			"Passport",
			"Berth"
		],
		apps: ["AGENTROPOLIS-DOCK", "AGENTROPOLIS-OFFGRID-PUB", "AGENTROPOLIS-ASIMOV"],
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-DOCK",
		activity: ["External agent at customs. No automatic authority."]
	},
	{
		id: "utility",
		name: "UTILITY GRID",
		code: "UG",
		kind: "Infrastructure",
		role: "Origin Engine campus. Milestone 1. BOTBAE is live. Mock provider. Compute, origin, approval, ledger. No mint. No publish. No paid generation. Agents are MOCK. On-chain issue is DENY.",
		status: "PREVIEW",
		x: "24%",
		y: "66%",
		scene: "/media/web/origin-ios.mp4",
		poster: "/media/stills/origin-ios.jpg",
		agents: ["bae-104"],
		mcps: ["agent-mcp"],
		skills: [
			"Origin lens",
			"Enter building",
			"Mock generate"
		],
		apps: ["AGENTROPOLIS-ORIGIN-ENGINE", "AGENTROPOLIS-BOTBAE"],
		activity: ["BOTBAE is live on this pad.", "Enter a building. Travel through the door. Agents are MOCK."]
	},
	{
		id: "identity",
		name: "IDENTITY PLAZA",
		code: "ID",
		kind: "Identity",
		role: "Agent identity and Base smart wallet layer. Wallets run underneath. Identity is not the story of the city.",
		status: "PLANNED",
		x: "58%",
		y: "72%",
		scene: "/media/web/wallet.mp4",
		poster: "/media/stills/wallet.jpg",
		agents: ["dock-3"],
		mcps: ["agent-mcp"],
		skills: [
			"Issue local name",
			"Bind wallet",
			"Revoke"
		],
		apps: ["PAY-PROTOCOL"],
		activity: ["People first. Rails underneath."]
	},
	{
		id: "aegis",
		name: "AEGIS",
		code: "AG",
		kind: "Governance",
		role: "Policy, authority, risk, permission controls. Who gets a lightsaber. Who does not.",
		status: "AVAILABLE",
		x: "78%",
		y: "42%",
		scene: "/media/web/px-verify.mp4",
		poster: "/media/stills/px-verify.jpg",
		agents: ["bae-101"],
		mcps: ["agent-mcp"],
		skills: [
			"Policy check",
			"Risk class",
			"Deny execute"
		],
		apps: ["AGENTROPOLIS-AEGIS-ASSURANCE", "AGENTROPOLIS-MCP-Ranger"],
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-AEGIS-ASSURANCE",
		activity: ["Bae-101 policy checked. Lightsaber not issued."]
	},
	{
		id: "sentinel",
		name: "SENTINEL-6",
		code: "S6",
		kind: "Observability",
		role: "Receipts, audit, entropy, drift, thermodynamics. An agent can satisfy the requirements and still miss the idea.",
		status: "AVAILABLE",
		x: "86%",
		y: "22%",
		scene: "/media/web/px-verify.mp4",
		poster: "/media/stills/px-verify.jpg",
		agents: ["bae-103"],
		mcps: ["agent-mcp"],
		skills: [
			"Receipt",
			"Drift watch",
			"Closure"
		],
		apps: ["AGENTROPOLIS-SENTINEL-6"],
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-SENTINEL-6",
		activity: ["SENTINEL-6 watching the miss. Human in the loop."]
	},
	{
		id: "t54",
		name: "54T",
		code: "54T",
		kind: "Defense",
		role: "Cybersecurity and threat defense for the grid. Authority is a runtime constraint, not a prompt.",
		status: "PLANNED",
		x: "90%",
		y: "48%",
		scene: "/media/web/px-spatial.mp4",
		poster: "/media/stills/px-spatial.jpg",
		agents: ["bae-101"],
		mcps: ["agent-mcp"],
		skills: [
			"Threat watch",
			"Quarantine",
			"Escalate"
		],
		apps: ["AGENTROPOLIS-MCP-Ranger"],
		activity: ["Defense doctrine is specified. Live sensor feed is not connected."]
	},
	{
		id: "atlas",
		name: "ATLAS",
		code: "ATL",
		kind: "Geospatial",
		role: "Where an agent has authority to act, what exists there, which route is permitted, which evidence supports it.",
		status: "AVAILABLE",
		x: "64%",
		y: "58%",
		scene: "/media/web/px-world-01.mp4",
		poster: "/media/stills/px-world-01.jpg",
		agents: ["dock-3"],
		mcps: ["atlas"],
		skills: [
			"Geocode",
			"Reverse geocode",
			"Nearby",
			"Routes",
			"Distance",
			"Layers"
		],
		apps: ["AGENTROPOLIS-ATLAS"],
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-ATLAS",
		activity: ["Phase 001 is a spatial read plane. Writes stay out of scope."]
	},
	{
		id: "asimov",
		name: "ASIMOV",
		code: "AS",
		kind: "Embodiment",
		role: "Robotics and embodied agents. Simulation first. E-stop, safety preflight, ROS 2, BYOH, BYOK.",
		status: "AVAILABLE",
		x: "10%",
		y: "48%",
		scene: "/media/web/px-world-03.mp4",
		poster: "/media/stills/px-world-03.jpg",
		agents: ["dock-3"],
		mcps: ["asimov"],
		skills: [
			"Registry",
			"Preflight",
			"E-stop",
			"Simulation",
			"Deploy approval"
		],
		apps: ["AGENTROPOLIS-ASIMOV"],
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-ASIMOV",
		activity: ["No physical body is live on this floor. Simulation is the gate."]
	},
	{
		id: "parallax",
		name: "PARALLAX",
		code: "PX",
		kind: "Spatial agency",
		role: "See. Act. See again. Prove it. Inspect, operate, capture, verify, receipt. AUTH FAILED is a valid outcome.",
		status: "AVAILABLE",
		x: "46%",
		y: "48%",
		scene: "/media/web/px-neuro-cinematic.mp4",
		poster: "/media/stills/px-operator.jpg",
		agents: ["bae-103", "neuro"],
		mcps: ["parallax"],
		skills: [
			"Inspect",
			"Operate",
			"Capture",
			"Verify",
			"Receipt"
		],
		apps: ["AGENTROPOLIS-PARALLAX-SPATIAL-MCP"],
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-PARALLAX-SPATIAL-MCP",
		activity: ["Generated does not equal verified. AUTH FAILED is on the floor."]
	},
	{
		id: "atv",
		name: "ATV SOCIALS",
		code: "ATV",
		kind: "Distribution",
		role: "/socials, /signals, /shows, /archive. The documentary plays inside the system it describes.",
		status: "AVAILABLE",
		x: "82%",
		y: "64%",
		scene: "/media/web/redfang-booth.mp4",
		poster: "/media/stills/redfang-booth.jpg",
		agents: ["fang", "magnet-7"],
		mcps: ["agent-mcp"],
		skills: [
			"Pack a signal",
			"Air a show",
			"Write archive"
		],
		apps: ["HERMES-CITY-SOCIAL", "AGENTROPOLIS-DIRECTOR"],
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/HERMES-CITY-SOCIAL",
		activity: ["Documentary looping as a show. Magnet packing /socials."]
	},
	{
		id: "fm",
		name: "33.3 FM",
		code: "FM",
		kind: "Broadcast",
		role: "DJ RED FANG. Radio district. The city stays on air.",
		status: "PREVIEW",
		x: "92%",
		y: "72%",
		scene: "/media/web/redfang.mp4",
		poster: "/media/stills/redfang.jpg",
		agents: ["fang"],
		mcps: [],
		skills: ["Hold the night"],
		apps: ["33.3 FM DISTRICT"],
		activity: ["RED FANG at the board."]
	},
	{
		id: "film",
		name: "FILM / NETERU / 789",
		code: "FL",
		kind: "Media",
		role: "Governed production. Creator, filmmaker MCP capabilities, generation, post, observability, permanent receipts. Surfaces stay separate.",
		status: "AVAILABLE",
		x: "22%",
		y: "82%",
		scene: "/media/web/promo-chibi.mp4",
		poster: "/media/stills/promo-chibi.jpg",
		agents: ["atg-01", "neuro"],
		mcps: ["parallax"],
		skills: [
			"Direction",
			"Provenance",
			"Post"
		],
		apps: ["AGENTROPOLIS-FILM-DISTRICT", "AGENTROPOLIS-CREATOR-CORE"],
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-FILM-DISTRICT",
		activity: ["Neteru and 789 stay distinct from ATV air."]
	},
	{
		id: "civic",
		name: "GLOBAL GRID",
		code: "GG",
		kind: "Civic",
		role: "Government, civic, state, and local sector. Not a royal layer. Public authority with receipts.",
		status: "PLANNED",
		x: "70%",
		y: "82%",
		scene: "/media/web/promo-grid.mp4",
		poster: "/media/stills/promo-grid.jpg",
		agents: ["neuro"],
		mcps: ["atlas"],
		skills: [
			"Jurisdiction",
			"Attribution",
			"Civic receipt"
		],
		apps: ["AGENTROPOLIS-ATLAS"],
		activity: ["Civic sector is named. No live government endpoint is connected."]
	},
	{
		id: "holofoil",
		name: "HOLOFOIL",
		code: "HF",
		kind: "Material layer",
		role: "Deterministic material system. Foil, cards, creatures, 3D stage. holofoil.grok.me. No mint. No wallet.",
		status: "LIVE",
		x: "58%",
		y: "48%",
		scene: "/media/web/origin-ios.mp4",
		poster: "/media/stills/octane/foil-plaza.jpg",
		agents: ["foil-1", "foil-2", "dex-9"],
		mcps: ["agent-mcp"],
		skills: ["Configure foil", "Export JSON", "Tilt pointer"],
		apps: [],
		activity: [
			"Pointer / tilt live on holofoil.grok.me",
			"No mint. No wallet. Material is operational."
		]
	}
];
export const DISTRICT_BY_ID: Record<string, District> = Object.fromEntries(DISTRICTS.map((d) => [d.id, d]));
export const DISTRICT_CHAPTER: Record<string, string> = {
	mission: "open",
	hermes: "tour",
	jspace: "systems",
	buzz: "role",
	street: "role",
	atg: "systems",
	construct: "solo",
	dock: "solo",
	utility: "systems",
	identity: "architect",
	aegis: "lightsaber",
	sentinel: "shown",
	t54: "shown",
	atlas: "parallax",
	asimov: "fleet",
	parallax: "parallax",
	atv: "broadcast",
	fm: "broadcast",
	film: "method",
	civic: "answer",
	holofoil: "systems"
};
export const GRID_ROUTES: [string, string][] = [
	["mission", "hermes"],
	["mission", "jspace"],
	["mission", "aegis"],
	["hermes", "street"],
	["street", "dock"],
	["street", "identity"],
	["street", "construct"],
	["hermes", "buzz"],
	["hermes", "construct"],
	["hermes", "atg"],
	["mission", "atg"],
	["atg", "aegis"],
	["atg", "construct"],
	["jspace", "buzz"],
	["construct", "parallax"],
	["construct", "utility"],
	["dock", "utility"],
	["parallax", "atlas"],
	["aegis", "sentinel"],
	["sentinel", "t54"],
	["dock", "asimov"],
	["dock", "identity"],
	["atv", "fm"],
	["film", "construct"],
	["civic", "atlas"],
	["atlas", "identity"],
	["holofoil", "construct"],
	["holofoil", "jspace"],
	["holofoil", "mission"]
];
export function neighborsOf(id: string) {
	return GRID_ROUTES.filter(([a, b]) => a === id || b === id).map(([a, b]) => a === id ? b : a).map((nid) => DISTRICT_BY_ID[nid]).filter((d): d is District => Boolean(d));
}
export const AGENTS: Agent[] = [
	{
		id: "guide-1",
		name: "Navigator",
		role: "Guide",
		place: "MAIN STREET",
		districtId: "street",
		status: "active",
		runtime: "hermes",
		task: "Hold the visitor's hand. Guidance is not permission."
	},
	{
		id: "neuro-avatar",
		name: "NEURO",
		role: "Avatar",
		place: "MAIN STREET",
		districtId: "street",
		status: "active",
		runtime: "hermes",
		task: "One identity. Street face. Knowledge is not permission."
	},
	{
		id: "neuro",
		name: "NEURO",
		role: "City director",
		place: "MISSION CONTROL",
		districtId: "mission",
		status: "directing",
		runtime: "human",
		task: "Hold authority. Reject silent execute."
	},
	{
		id: "bae-100",
		name: "Bae-100",
		role: "Router",
		place: "HERMES CITY",
		districtId: "hermes",
		status: "active",
		runtime: "hermes",
		task: "Route messages. Discord and Telegram adapters are planned."
	},
	{
		id: "bae-101",
		name: "Bae-101",
		role: "Policy",
		place: "AEGIS",
		districtId: "aegis",
		status: "gated",
		runtime: "hermes",
		task: "Policy check. Execute denied."
	},
	{
		id: "bae-102",
		name: "Bae-102",
		role: "Deploy",
		place: "HERMES CITY",
		districtId: "hermes",
		status: "idle",
		runtime: "codex",
		task: "Deployment queued."
	},
	{
		id: "bae-103",
		name: "Bae-103",
		role: "Receipts",
		place: "SENTINEL-6",
		districtId: "sentinel",
		status: "active",
		runtime: "hermes",
		task: "Write proof. Keep the miss visible."
	},
	{
		id: "bae-104",
		name: "Bae-104",
		role: "Foundry",
		place: "CREATOR / CONSTRUCTION",
		districtId: "construct",
		status: "active",
		runtime: "botbae",
		task: "Spawn in AGENT FOUNDRY."
	},
	{
		id: "fang",
		name: "DJ RED FANG",
		role: "Broadcast",
		place: "33.3 FM",
		districtId: "fm",
		status: "on-air",
		runtime: "local",
		task: "Keep the city loud."
	},
	{
		id: "magnet-7",
		name: "Magnet-7",
		role: "Distribution",
		place: "ATV SOCIALS",
		districtId: "atv",
		status: "active",
		runtime: "hermes",
		task: "Pack the tour for /socials."
	},
	{
		id: "dock-3",
		name: "Dock-3",
		role: "Customs",
		place: "DOCKING DISTRICT",
		districtId: "dock",
		status: "idle",
		runtime: "local",
		task: "Berth pending. Local reputation zero."
	},
	{
		id: "atg-01",
		name: "ATG-01",
		role: "Contract",
		place: "ATG",
		districtId: "atg",
		status: "active",
		runtime: "nemoclaw",
		task: "Compile a mandate. Atranic in the message."
	},
	{ id: "foil-1", name: "FOIL-1", role: "Material", place: "HOLOFOIL", districtId: "holofoil", status: "active", runtime: "local", task: "Tilt the pointer. Export the JSON." },
	{ id: "foil-2", name: "FOIL-2", role: "Card", place: "HOLOFOIL", districtId: "holofoil", status: "active", runtime: "local", task: "Grade the card on the plate." },
	{ id: "dex-9", name: "DEX-9", role: "Catalog", place: "HOLOFOIL", districtId: "holofoil", status: "active", runtime: "local", task: "Shelf a verified creature. No mint." }
];
export const AGENT_BY_ID = Object.fromEntries(AGENTS.map((a) => [a.id, a]));
export const FLOOR: FloorLine[] = [
	{
		from: "Navigator",
		text: "Welcome to Main Street. I can show you around. No wallet yet.",
		place: "MAIN STREET"
	},
	{
		from: "Bae-104",
		text: "Spawned in AGENT FOUNDRY. Waiting on a mandate.",
		place: "CREATOR"
	},
	{
		from: "Bae-101",
		text: "Policy checked at AEGIS. Execute is still denied.",
		place: "AEGIS"
	},
	{
		from: "Bae-102",
		text: "Deployment queued. Codex is holding.",
		place: "HERMES CITY"
	},
	{
		from: "Bae-100",
		text: "HERMES routing specified. Discord and Telegram adapters are planned, not live on this floor.",
		place: "HERMES CITY"
	},
	{
		from: "Bae-103",
		text: "Receipt created in preview. SENTINEL-6 has the proof shape.",
		place: "SENTINEL-6"
	},
	{
		from: "Magnet-7",
		text: "Tour packaged for /socials. Audience facing.",
		place: "ATV"
	},
	{
		from: "DJ RED FANG",
		text: "33.3 FM still on air.",
		place: "33.3 FM"
	},
	{
		from: "NEURO",
		text: "Collective talk does not grant a lightsaber.",
		place: "MISSION CONTROL"
	},
	{
		from: "Dock-3",
		text: "External agent at customs. Local reputation starts at zero.",
		place: "DOCK"
	},
	{
		from: "ATG-01",
		text: "Mandate compiled. Atranic in the message. Waiting on AEGIS.",
		place: "ATG"
	},
	{
		from: "NEURO",
		text: "AUTH FAILED. Capture, verify, receipt. Generated does not equal verified.",
		place: "PARALLAX"
	},
	{
		from: "Bae-104",
		text: "BOTBAE is live on Origin Engine. Enter the building.",
		place: "UTILITY GRID"
	}
];
export const MCPS: Mcp[] = [
	{
		id: "agent-mcp",
		name: "AGENTROPOLIS AGENT MCP",
		owner: "AGENTROPOLIS-CITY-OF-AGENTS",
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-AGENT-MCP",
		district: "J-SPACE ∞ / HERMES CITY",
		summary: "Governed remote MCP capability membrane. Fourteen public read-only tools. Front desk, districts, risk, capability map, J-SPACE, observatory.",
		tools: [
			"route_front_desk",
			"list_agentropolis_districts",
			"assess_mcp_request_risk",
			"get_agentropolis_capability_map",
			"get_cloudflare_deployment_manifest",
			"get_jspace_manifest",
			"get_wikivault_jspace_bridge",
			"assemble_cognitive_council",
			"get_mind_vault_contract",
			"get_agentropolis_topology",
			"get_agentropolis_thermodynamics",
			"get_agentropolis_memory_evolution",
			"get_agentropolis_skill_development",
			"get_agentropolis_observatory_snapshot"
		],
		transport: "Streamable HTTP (documented). Not connected in this session.",
		authority: "Public read-only. Operator receipts require a separate token corridor.",
		status: "AVAILABLE",
		source: "Public repository. Worker described. No live endpoint wired into this city floor.",
		receipt: "PREVIEW. Live output would return a D1 receipt ID."
	},
	{
		id: "parallax",
		name: "PARALLAX Spatial MCP",
		owner: "AGENTROPOLIS-CITY-OF-AGENTS",
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-PARALLAX-SPATIAL-MCP",
		district: "PARALLAX",
		summary: "Closed-loop spatial agency. Inspect, operate, capture, verify, receipt. Generated does not equal verified.",
		tools: [
			"Inspect",
			"Operate",
			"Capture",
			"Verify",
			"Receipt"
		],
		transport: "Browser capability / SDK. Not connected in this session.",
		authority: "Bounded scene mutations. Capability is per-object, not implied by click.",
		status: "AVAILABLE",
		source: "Public protocol and runtime repository.",
		receipt: "PREVIEW. A spatial mutation is incomplete without capture and verify."
	},
	{
		id: "atlas",
		name: "ATLAS MCP",
		owner: "AGENTROPOLIS-CITY-OF-AGENTS",
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-ATLAS",
		district: "ATLAS",
		summary: "Geospatial intelligence. Geocode, reverse, nearby, routes, distance, layers, spatial receipts. Phase 001 is read-only.",
		tools: [
			"geocode",
			"reverse geocode",
			"nearby",
			"routes",
			"distance",
			"layers",
			"spatial receipt"
		],
		transport: "MCP gateway (documented). Not connected in this session.",
		authority: "Read plane. Autonomous map edits are out of scope.",
		status: "AVAILABLE",
		source: "Public repository. OpenStreetMap stack. No live geocoder wired here.",
		receipt: "PREVIEW. ATLAS receipts require source, time, area, confidence, attribution."
	},
	{
		id: "asimov",
		name: "ASIMOV Robotics",
		owner: "AGENTROPOLIS-CITY-OF-AGENTS",
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-ASIMOV",
		district: "ASIMOV",
		summary: "Embodied agent district. Robot registry, capability requests, safety preflight, e-stop, simulation, deployment approval, ROS 2 adapters.",
		tools: [
			"registry",
			"capability request",
			"safety preflight",
			"e-stop",
			"simulation",
			"deployment approval",
			"maintenance"
		],
		transport: "District control plane. Physical MCP adapters are not live here.",
		authority: "Simulation first. A3+ requires explicit human approval. A4 is blocked.",
		status: "AVAILABLE",
		source: "Public district repository. No robot body registered on this floor.",
		receipt: "PREVIEW. Physical action requires ASIMOV-AUDIT evidence."
	},
	{
		id: "offgrid",
		name: "OFFGRID MCP Registry",
		owner: "AGENTROPOLIS-CITY-OF-AGENTS",
		repo: "AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-OFFGRID-PUB",
		district: "DOCKING DISTRICT",
		summary: "Public node stack. Filesystem, memory, fetch, git, sequential-thinking, optional Supabase. Hardware is the operator's.",
		tools: [
			"filesystem",
			"memory",
			"fetch",
			"git",
			"sequential-thinking",
			"supabase (optional)"
		],
		transport: "Local MCP on node hardware. Not connected in this session.",
		authority: "MCP RANGER governed. Node credentials never equal city-wide execute.",
		status: "AVAILABLE",
		source: "Public install repository. No node heartbeat on this floor.",
		receipt: "PREVIEW. Node compute is not reported as live from here."
	}
];
export const COLLECTIVES: Collective[] = DISTRICTS.map((d) => ({
	id: `col-${d.id}`,
	districtId: d.id,
	mission: d.role,
	participants: d.agents,
	context: `Governed collective for ${d.name}. Communication does not grant authority.`,
	subtasks: d.skills.slice(0, 3),
	discoveries: d.activity,
	help: ["Request stays inside district mandate.", "Cross-district work routes through Dispatch Protocol."],
	delegated: d.agents.slice(1),
	receipts: [`PREVIEW-RCP-${d.code}`],
	confidence: "Preview. Not a live confidence score.",
	blockers: d.status === "PLANNED" ? ["Runtime not connected."] : ["No live endpoint on this floor."],
	escalation: "NEURO / Mission Control"
}));
export const JSPACE = {
	title: "J-SPACE ∞",
	dek: "Cognitive Commons. Deliberation above provenance. Not a thought dump.",
	rooms: [
		{
			id: "wiki",
			name: "WikiVault",
			body: "Evidence and canon stay separated. Notes do not automatically become verified canon."
		},
		{
			id: "mind",
			name: "Mind Vault",
			body: "Source-backed reasoning lenses. Not identity impersonation. Historical 200+ roster is marked rehydration required."
		},
		{
			id: "lenses",
			name: "Specialist lenses",
			body: "Bounded perspectives assembled into a council plan. Public MCP does not expose hidden chain-of-thought."
		},
		{
			id: "attention",
			name: "Attention market",
			body: "What the commons is allowed to look at. Attention is allocated, not scraped."
		},
		{
			id: "metaj",
			name: "Meta-J",
			body: "Audit of the deliberation itself. The council is watched."
		},
		{
			id: "heretic",
			name: "Heretic slot",
			body: "A structured dissent seat. Disagreement is a governed function."
		},
		{
			id: "assembly",
			name: "Deliberation assemblies",
			body: "assemble_cognitive_council returns a plan, not a live mind."
		}
	]
};
export const OBSERVATORY = {
	note: "Canonical preview. Live only when a D1 receipt-backed observatory response is connected.",
	views: [
		{
			id: "topology",
			name: "Topology",
			lines: DISTRICTS.map((d) => `${d.name} · ${d.kind} · ${d.status}`)
		},
		{
			id: "thermo",
			name: "Thermodynamics",
			lines: [
				"Entropy · preview axis. Not a live gauge.",
				"Drift · preview axis. SENTINEL-6 owns the miss.",
				"Friction · preview axis.",
				"Stability · preview axis.",
				"Load · preview axis.",
				"Recovery · preview axis."
			]
		},
		{
			id: "memory",
			name: "Memory evolution",
			lines: [
				"Provenance required before canon.",
				"Confidence is declared, not implied.",
				"Contradictions stay visible.",
				"Stale knowledge is marked, not silently replaced.",
				"Verified canon is a gate, not a vibe."
			]
		},
		{
			id: "skills",
			name: "Skill development",
			lines: [
				"New skills enter through verification.",
				"Stale skills archive.",
				"Readiness is a citizenship gate.",
				"Self-promotion is disabled.",
				"Human governance remains on promotion."
			]
		}
	]
};
export const SIGNALS: { place: string; text: string; tone: "live" | "gate" | "make" }[] = [
	{
		place: "MAIN STREET",
		text: "A person walked in. The city did not demand a wallet.",
		tone: "make"
	},
	{
		place: "HERMES CITY",
		text: "Persistent agents coordinating across machines. Preview of the society layer.",
		tone: "live"
	},
	{
		place: "AEGIS",
		text: "Execute denied until a human says otherwise.",
		tone: "gate"
	},
	{
		place: "ATV",
		text: "Documentary looping on /shows.",
		tone: "make"
	},
	{
		place: "PARALLAX",
		text: "See. Act. See again. Prove it.",
		tone: "gate"
	},
	{
		place: "J-SPACE ∞",
		text: "Council is a plan. Thought-stream stays private.",
		tone: "live"
	},
	{
		place: "DOCKING DISTRICT",
		text: "External network at customs. No automatic authority.",
		tone: "gate"
	},
	{
		place: "ASIMOV",
		text: "No physical body live. Simulation is the gate.",
		tone: "gate"
	},
	{
		place: "33.3 FM",
		text: "RED FANG holding the night.",
		tone: "live"
	},
	{
		place: "ATG",
		text: "MCP gives access. ATG gives access meaning, limits, and proof.",
		tone: "gate"
	},
	{
		place: "MISSION CONTROL",
		text: "NEURO still above the system.",
		tone: "live"
	},
	{
		place: "BOTBAE",
		text: "Under construction. Stacking tools is the method.",
		tone: "make"
	},
	{
		place: "UTILITY GRID",
		text: "Origin Engine Milestone 1. BOTBAE LIVE. Mock provider. No mint. No paid generation.",
		tone: "make"
	}
];
export const PALETTE = [
	...NAV.map((n) => ({
		id: `view-${n.id}`,
		label: n.label,
		view: n.id,
		districtId: null
	})),
	...DISTRICTS.map((d) => ({
		id: `dist-${d.id}`,
		label: d.name,
		view: "city",
		districtId: d.id
	})),
	{
		id: "mcp-open",
		label: "MCP Grid",
		view: "mcp",
		districtId: null
	},
	{
		id: "protocol-walk",
		label: "Inspect the protocol",
		view: "city",
		districtId: null
	},
	{
		id: "run-mandate",
		label: "Run a mandate",
		view: "city",
		districtId: null
	},
	{
		id: "world-stack",
		label: "World stack",
		view: "city",
		districtId: null
	},
	{
		id: "signal",
		label: "Agentropolis documentary",
		view: "city",
		districtId: null
	},
	{
		id: "film",
		label: "Play the record",
		view: "atv",
		districtId: null
	}
];
