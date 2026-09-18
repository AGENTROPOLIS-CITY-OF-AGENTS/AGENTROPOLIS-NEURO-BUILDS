import { createFileRoute } from "@tanstack/react-router";
import {
  corsHeaders,
  envelopeStatus,
  runEnvelope,
} from "@/lib/worldq-envelope.server";
import { ENVELOPE_VERSION, type EnvelopeSubmit } from "@/lib/worldq-envelope";

function json(req: Request, status: number, body: unknown) {
  const headers = corsHeaders(req);
  headers.set("content-type", "application/json; charset=utf-8");
  headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(body), { status, headers });
}

export const Route = createFileRoute("/api/worldq/envelope")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        return new Response(null, { status: 204, headers: corsHeaders(request) });
      },
      GET: async ({ request }) => {
        return json(request, 200, envelopeStatus());
      },
      POST: async ({ request }) => {
        let input: EnvelopeSubmit;
        try {
          input = (await request.json()) as EnvelopeSubmit;
        } catch {
          return json(request, 400, {
            id: "wq-bad",
            version: ENVELOPE_VERSION,
            status: "GATED",
            provenance: "GATED",
            model: envelopeStatus().model,
            reason: "Envelope body was not JSON.",
            output: null,
            tokens: null,
            issuedAt: new Date().toISOString(),
          });
        }
        const result = await runEnvelope(input);
        return json(request, result.status, result.body);
      },
    },
  },
});
