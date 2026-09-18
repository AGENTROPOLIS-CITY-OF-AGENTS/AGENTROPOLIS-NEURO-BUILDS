/** Client-safe WORLDQ envelope types. No secrets. */

export const ENVELOPE_VERSION = "worldq-envelope-v1";
export const ENVELOPE_PATH = "/api/worldq/envelope";

export type EnvelopeSubmit = {
  version: string;
  identity: string;
  mandate: string;
  plan: string;
  permissions: string;
  district: string;
  mission: string;
  objectId: string;
  objectType: string;
  title: string;
  objective: string;
  killed?: boolean;
};

export type EnvelopeReceipt = {
  id: string;
  version: string;
  status: "GATED" | "ISSUED" | "UNAVAILABLE" | "QUARANTINED";
  provenance: "LIVE" | "GATED" | "UNAVAILABLE";
  model: string;
  reason: string;
  output: string | null;
  tokens: { prompt: number; completion: number } | null;
  issuedAt: string;
};

export type EnvelopeStatus = {
  version: string;
  model: string;
  configured: boolean;
  execute: "gated-until-envelope";
};

export async function worldqEnvelopeStatus(): Promise<EnvelopeStatus> {
  const res = await fetch(ENVELOPE_PATH, { method: "GET" });
  if (!res.ok) {
    return {
      version: ENVELOPE_VERSION,
      model: "gpt-6-astra",
      configured: false,
      execute: "gated-until-envelope",
    };
  }
  return (await res.json()) as EnvelopeStatus;
}

export async function submitWorldqEnvelope(body: EnvelopeSubmit): Promise<EnvelopeReceipt> {
  const res = await fetch(ENVELOPE_PATH, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...body, version: ENVELOPE_VERSION }),
  });
  const data = (await res.json()) as EnvelopeReceipt;
  return data;
}
