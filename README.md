# AGENTROPOLIS-NEURO-BUILDS

Builder-facing reference assets for NEURO cognitive interfaces across AGENTROPOLIS.

## The profile is three-dimensional

A NEURO-aware surface should keep these controls independent:

| Axis | Values | Purpose |
|---|---|---|
| Technical presentation | MAIN_STREET / BUILDER / DEVELOPER | how technical the explanation is |
| Text verbosity | LOW / MEDIUM / HIGH | how long the response is |
| Workstyle | ARCHITECT / SPARK / ANCHOR / PHANTOM | how work is organized and presented |

## Workstyle modes

- **ARCHITECT**: map the system, dependencies, constraints, sequence, tradeoffs
- **SPARK**: generate options, branch quickly, capture ideas, then converge
- **ANCHOR**: use checklists, stable state, QA gates, and predictable next steps
- **PHANTOM**: minimize interruptions, allow bounded deep work, return a concise handoff and receipt

User selection wins. Modes may be blended or changed by task. Do not infer diagnosis.

## Canon

The semantic source of truth is `ATG:COGNITION` in AGENTROPOLIS-ATG.

This repository carries UI/builder-ready reference data in:
- `profiles/neuro-workstyles.json`

## Safety boundary

These modes personalize interaction and workflow support only. They do not grant authority and must not be used for candidate ranking, hiring, promotion, compensation, termination, eligibility, or automated performance scoring.


## Public Loop Engineering Baseline

NEURO public surfaces consume the AGENTROPOLIS bounded-cognition design contract:

**Cheap Gates → Reflex Decision → QRAG → Dense Feedback → Quantization Torque → Receipt → Audit**

QRAG is the **Quantized Retrieval-Augmented Generation Loop**:

> A bounded closed-loop retrieval architecture that iteratively retrieves, evaluates, executes, verifies, and re-queries under explicit token, cost, quality, and retry constraints.

For `neurobuilds.grok.me`, use the public-surface handoff in `docs/NEUROBUILDS-QRAG-PUBLIC-SURFACE.md` and the builder-ready prompt in `docs/GROK-QRAG-ROLLOUT-PROMPT.md`.

**Classifier output is evidence, not authority.** Public UI must not imply that a semantic score, confidence value, or model route grants execution permission.
