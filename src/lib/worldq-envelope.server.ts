import { ENVELOPE_VERSION, type EnvelopeReceipt, type EnvelopeStatus, type EnvelopeSubmit } from "./worldq-envelope";

const PLACEHOLDER = new Set(["", "your_real_key_here", "changeme", "sk-placeholder"]);

function env(key: string, fallback = "") {
  return (typeof process !== "undefined" ? process.env[key]?.trim() : "") || fallback;
}

function apiKey() {
  const k = env("OPENAI_API_KEY");
  if (!k || PLACEHOLDER.has(k.toLowerCase()) || PLACEHOLDER.has(k)) return "";
  return k;
}

export function envelopeModel() {
  return env("OPENAI_MODEL", "gpt-6-astra");
}

export function envelopeVersion() {
  return env("ENVELOPE_VERSION", ENVELOPE_VERSION);
}

export function allowedOrigins(): string[] {
  return env(
    "ALLOWED_ORIGINS",
    "https://agentropolis-city-of-agents.github.io,http://localhost:5173,http://127.0.0.1:5173",
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function corsHeaders(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allow = allowedOrigins();
  const ok = origin && allow.includes(origin);
  const headers = new Headers();
  if (ok) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
    headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    headers.set("Access-Control-Allow-Headers", "content-type");
    headers.set("Access-Control-Max-Age", "600");
  }
  return headers;
}

export function envelopeStatus(): EnvelopeStatus {
  return {
    version: envelopeVersion(),
    model: envelopeModel(),
    configured: Boolean(apiKey()),
    execute: "gated-until-envelope",
  };
}

function receipt(
  status: EnvelopeReceipt["status"],
  provenance: EnvelopeReceipt["provenance"],
  reason: string,
  extra?: Partial<EnvelopeReceipt>,
): EnvelopeReceipt {
  return {
    id: `wq-${Date.now().toString(36)}`,
    version: envelopeVersion(),
    status,
    provenance,
    model: envelopeModel(),
    reason,
    output: null,
    tokens: null,
    issuedAt: new Date().toISOString(),
    ...extra,
  };
}

export async function runEnvelope(input: EnvelopeSubmit): Promise<{ status: number; body: EnvelopeReceipt }> {
  if (input.killed) {
    return {
      status: 409,
      body: receipt("QUARANTINED", "GATED", "Kill switch is set. Execute remains blocked. DEMO/LIVE both refuse."),
    };
  }
  if (!input.identity || !input.mandate) {
    return {
      status: 400,
      body: receipt("GATED", "GATED", "Envelope incomplete. Identity and mandate are required."),
    };
  }
  if (input.permissions !== "EXECUTE ENVELOPE") {
    return {
      status: 403,
      body: receipt(
        "GATED",
        "GATED",
        `Permission is ${input.permissions || "missing"}. Read/approval is not execute. No model call.`,
      ),
    };
  }
  const key = apiKey();
  if (!key) {
    return {
      status: 503,
      body: receipt(
        "UNAVAILABLE",
        "UNAVAILABLE",
        "OPENAI_API_KEY is not configured on the server. Envelope refused. Not live.",
      ),
    };
  }

  const base = env("OPENAI_BASE_URL", "https://api.openai.com/v1").replace(/\/+$/, "");
  const model = envelopeModel();
  const payload = {
    model,
    temperature: 0.2,
    max_tokens: 400,
    messages: [
      {
        role: "system",
        content:
          "You are the WORLDQ envelope clerk for AGENTROPOLIS. You do not grant authority. You inspect identity, mandate, plan, and permission. You return a short receipt in plain language. You never claim a tool ran. You never invent live telemetry.",
      },
      {
        role: "user",
        content: JSON.stringify({
          version: envelopeVersion(),
          identity: input.identity,
          mandate: input.mandate,
          plan: input.plan,
          permissions: input.permissions,
          district: input.district,
          mission: input.mission,
          objectId: input.objectId,
          title: input.title,
          objective: input.objective,
        }),
      },
    ],
  };

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as {
      error?: { message?: string };
      choices?: { message?: { content?: string } }[];
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    if (!res.ok) {
      return {
        status: 502,
        body: receipt("UNAVAILABLE", "UNAVAILABLE", json.error?.message || `Upstream ${res.status}. Envelope not issued.`),
      };
    }
    const text = json.choices?.[0]?.message?.content?.trim() || "";
    return {
      status: 200,
      body: receipt("ISSUED", "LIVE", "Envelope inspected. Receipt issued. This is not silent execute.", {
        output: text || null,
        tokens: {
          prompt: json.usage?.prompt_tokens ?? 0,
          completion: json.usage?.completion_tokens ?? 0,
        },
      }),
    };
  } catch {
    return {
      status: 502,
      body: receipt("UNAVAILABLE", "UNAVAILABLE", "Envelope upstream unreachable. No execute occurred."),
    };
  }
}
