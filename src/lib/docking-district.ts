/** Surface map for the Docking District. Not a live runtime projection. */

export type Provenance = "LIVE" | "SIMULATED" | "STATIC" | "UNKNOWN";

export type DockFacility = {
  id: string;
  name: string;
  role: string;
  x: number;
  z: number;
  h: number;
  tone: "cyan" | "red" | "lime";
  kind: "dock" | "utility";
  provenance: Provenance;
};

export type SimAgent = {
  id: string;
  name: string;
  activity: "idle" | "moving" | "working" | "meeting" | "reviewing" | "blocked" | "resetting";
  facilityId: string;
  mandate: string;
  policy: string;
  receipt: string;
  provenance: "SIMULATED";
};

export const DOCK_FACILITIES: DockFacility[] = [
  { id: "arrival", name: "Arrival Gate", role: "Entry. No authority is granted here.", x: 0, z: 16, h: 3.2, tone: "cyan", kind: "dock", provenance: "SIMULATED" },
  { id: "customs", name: "Identity Customs", role: "External identity stays separate from Agentropolis credentials.", x: -9, z: 8, h: 4.4, tone: "red", kind: "dock", provenance: "SIMULATED" },
  { id: "quarantine", name: "Quarantine Bay", role: "Hold. Approval required before any berth.", x: 9, z: 8, h: 3.6, tone: "red", kind: "dock", provenance: "SIMULATED" },
  { id: "passport", name: "Passport Hall", role: "Local name only. Not a credential store.", x: -9, z: 0, h: 5.2, tone: "cyan", kind: "dock", provenance: "SIMULATED" },
  { id: "commons", name: "Social Commons", role: "Read-only spectator space.", x: 0, z: 0, h: 2.8, tone: "cyan", kind: "dock", provenance: "SIMULATED" },
  { id: "berth", name: "Berth Exchange", role: "BYOE, BYOK, BYOH. Reputation starts at zero.", x: 9, z: 0, h: 4.8, tone: "lime", kind: "dock", provenance: "SIMULATED" },
  { id: "dispatch", name: "Dispatch Concourse", role: "Task routing. Execute stays gated.", x: -9, z: -8, h: 4.1, tone: "cyan", kind: "dock", provenance: "SIMULATED" },
  { id: "gallery", name: "Observation Gallery", role: "Public view. No private memory.", x: 0, z: -8, h: 6.2, tone: "cyan", kind: "dock", provenance: "SIMULATED" },
  { id: "audit", name: "Audit Terminal", role: "Receipts land here. Sentinel-6 is not connected.", x: 9, z: -8, h: 5.4, tone: "red", kind: "dock", provenance: "SIMULATED" },
  { id: "return", name: "Return Gate", role: "Exit to the globe. Authority does not persist.", x: 0, z: -16, h: 3.2, tone: "lime", kind: "dock", provenance: "SIMULATED" },
];

export const UTILITY_FACILITIES: DockFacility[] = [
  { id: "context", name: "Context Rail", role: "Catalog only. No context payload is loaded.", x: -18, z: 6, h: 3.4, tone: "cyan", kind: "utility", provenance: "STATIC" },
  { id: "recency", name: "Recency", role: "Catalog only.", x: -18, z: -2, h: 2.6, tone: "cyan", kind: "utility", provenance: "STATIC" },
  { id: "video", name: "Video Intelligence", role: "Catalog only.", x: -18, z: -10, h: 3.8, tone: "cyan", kind: "utility", provenance: "STATIC" },
  { id: "motion", name: "Spatial Motion", role: "Catalog only.", x: 18, z: 6, h: 3.1, tone: "cyan", kind: "utility", provenance: "STATIC" },
  { id: "comms", name: "Realtime Communications", role: "Catalog only. No socket.", x: 18, z: -2, h: 4.2, tone: "red", kind: "utility", provenance: "STATIC" },
  { id: "compute", name: "Generative Compute", role: "Catalog only. No model call.", x: 18, z: -10, h: 5, tone: "cyan", kind: "utility", provenance: "STATIC" },
  { id: "foundry", name: "Model Foundry", role: "Catalog only.", x: -14, z: 14, h: 3.5, tone: "cyan", kind: "utility", provenance: "STATIC" },
  { id: "fabric", name: "Media Intelligence Fabric", role: "Catalog only.", x: 14, z: 14, h: 3.5, tone: "cyan", kind: "utility", provenance: "STATIC" },
];

export const ALL_FACILITIES = [...DOCK_FACILITIES, ...UTILITY_FACILITIES];

export const SIM_AGENTS: SimAgent[] = [
  {
    id: "sim-dock-3",
    name: "DOCK-3",
    activity: "blocked",
    facilityId: "customs",
    mandate: "None issued",
    policy: "APPROVAL REQUIRED",
    receipt: "none",
    provenance: "SIMULATED",
  },
  {
    id: "sim-berth-1",
    name: "BERTH-1",
    activity: "idle",
    facilityId: "berth",
    mandate: "None issued",
    policy: "READ ONLY",
    receipt: "none",
    provenance: "SIMULATED",
  },
  {
    id: "sim-audit-0",
    name: "AUDIT-0",
    activity: "reviewing",
    facilityId: "audit",
    mandate: "Watch the miss. Not a live receipt.",
    policy: "VERIFY",
    receipt: "SIM-RECEIPT-0",
    provenance: "SIMULATED",
  },
];

export const FACILITY_BY_ID = Object.fromEntries(ALL_FACILITIES.map((f) => [f.id, f])) as Record<string, DockFacility>;

export const DOCK_CONTRACT = "agentropolis.spatial-runtime.v1";
export const DOCK_NOTE = "Renderer is a surface. This diorama is SIMULATED. It is not the Intelligence Grid runtime.";
