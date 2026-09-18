export type SpatialType =
  | "mission"
  | "application"
  | "repository"
  | "agent"
  | "file"
  | "buzz"
  | "permission"
  | "receipt";

export type RiskTier = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
export type ExecutionState =
  | "IDLE"
  | "GATED"
  | "PLANNING"
  | "EXECUTING"
  | "WAITING"
  | "COMPLETE"
  | "FAILED"
  | "QUARANTINED";
export type ReceiptStatus = "NONE" | "PENDING" | "ISSUED" | "AUDITED";
export type PermissionState = "READ" | "APPROVAL REQUIRED" | "TOOL BLOCKED" | "EXECUTE ENVELOPE";

export type SpatialObject = {
  id: string;
  type: SpatialType;
  title: string;
  identity: string;
  district: string;
  mission: string;
  owner: string;
  assignedAgent: string;
  application: string;
  repository: string;
  permissions: PermissionState;
  dependencies: string[];
  riskTier: RiskTier;
  executionState: ExecutionState;
  memoryCapsule: string;
  receiptStatus: ReceiptStatus;
  coordinates: { x: number; y: number; w: number; h: number };
  lastUpdated: string;
  dataConfidence: "low" | "medium";
  provenance: "DEMO" | "SIMULATED";
};

export type LayoutMap = Record<string, { x: number; y: number; w: number; h: number }>;
