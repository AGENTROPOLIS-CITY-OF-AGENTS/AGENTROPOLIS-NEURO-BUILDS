# NEUROBUILDS × AGENTROPOLIS Loop Engineering Public Surface

Status: implementation handoff  
Target: `https://neurobuilds.grok.me/`  
Source of truth: AGENTROPOLIS-DESIGN-SYSTEM

## Purpose

Expose the AGENTROPOLIS bounded-cognition baseline across NEUROBUILDS without turning the site into a generic dashboard or falsely implying live runtime telemetry.

## Canonical architecture

```text
AGENTROPOLIS
    │
EXECUTION ENVELOPE
    │
CHEAP DETERMINISTIC GATES
    │
REFLEX DECISION LAYER
    │
CONFIDENCE + EVIDENCE THRESHOLD
    │
QRAG
RETRIEVE → EVALUATE → EXECUTE
   ↑                    ↓
RE-QUERY ← VERIFY ←─────┘
    │
DENSE FEEDBACK
    │
QUANTIZATION TORQUE
   ↙       ↓       ↘
INCREASE DECREASE REDIRECT
    │
VERITY
    │
RECEIPT
    │
AUDIT
```

## Exact QRAG definition

**AGENTROPOLIS QRAG Loop — Quantized Retrieval-Augmented Generation Loop**

> A bounded closed-loop retrieval architecture that iteratively retrieves, evaluates, executes, verifies, and re-queries under explicit token, cost, quality, and retry constraints.

## Required public UI

Every NEUROBUILDS public route SHOULD expose a small, non-blocking control labeled **QRAG BASELINE** or **BOUNDED COGNITION**.

When expanded, it must show:

1. Cheap deterministic gates before model spend.
2. Reflex decision layer with typed route / confidence where applicable.
3. QRAG states: Retrieve, Evaluate, Execute, Verify, Re-query.
4. Explicit constraints: Token Budget, Cost Budget, Quality Threshold, Retry Limit.
5. Dense Feedback as attributable measurements.
6. Quantization Torque outcomes: Increase, Decrease, Redirect.
7. VERITY / verification.
8. Receipt and Audit.
9. The rule: **Classifier output is evidence, not authority.**

## Terminal states

Use the canonical states:

- COMPLETED
- BLOCKED
- BUDGET_EXHAUSTED
- REVIEW_REQUIRED
- RETRY_ELIGIBLE
- FAILED

Do not collapse all non-success states into a generic error.

## Visual contract

- Obsidian = infrastructure / substrate.
- Cyan = authorized, connected, verified or active intelligence.
- Red = risk, denial, failure, approval required.
- Preserve NEURO / AGENTROPOLIS spatial-city presentation.
- Keep the disclosure compact; deeper detail belongs in an architecture route or drawer.
- Never communicate state by color alone.
- Do not fabricate live values. Static/explainer surfaces must label examples as architecture or demo state.

## Recommended architecture route

Add or update a public route such as:

`/architecture/qrag`

It should explain:

- Loop Engineering;
- deterministic cheap gates;
- reflex/System-One provider abstraction;
- QRAG;
- Dense Feedback;
- Quantization Torque;
- VERITY;
- Execution Envelope;
- Receipts / Audit.

## Provider boundary

Jev may implement the reflex layer, but NEUROBUILDS must present the layer as provider-pluggable:

```text
ReflexDecisionProvider
  ├─ deterministic rules
  ├─ Jev
  ├─ local classifier
  ├─ future System-One model
  └─ fallback reasoning model
```

No public copy should imply Jev is required for AGENTROPOLIS.

## Public disclosure source

GitHub Pages consumers may use:

`https://agentropolis-city-of-agents.github.io/AGENTROPOLIS-DESIGN-SYSTEM/js/loop-baseline.js`

NEUROBUILDS may implement the same component natively if Grok does not permit external script loading. Behavior and semantics must remain equivalent.

## Acceptance checks

- [ ] QRAG exact definition is present.
- [ ] Cheap gates appear before semantic/model routing.
- [ ] Reflex decision is provider-pluggable.
- [ ] Confidence does not visually imply authority.
- [ ] Token/cost/quality/retry constraints are visible.
- [ ] Terminal states are represented.
- [ ] Dense Feedback feeds Quantization Torque.
- [ ] Increase / Decrease / Redirect are all represented.
- [ ] VERITY / verification is explicit.
- [ ] Receipt and Audit terminate the consequential flow.
- [ ] Mobile layout remains legible.
- [ ] No fake live telemetry.
