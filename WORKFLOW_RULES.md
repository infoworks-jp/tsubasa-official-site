# TSUBASA SITE EXECUTION CONTRACT

This repository uses evidence-based completion. Conversation promises are never completion evidence.

## Mandatory state machine
REQUESTED -> WRITE_STARTED -> COMMITTED -> DEPLOYED -> VISUAL_VERIFIED

A task is COMPLETE only at VISUAL_VERIFIED.

## Non-negotiable rules
1. Never report started until a real repository write has succeeded.
2. Never report implemented from source code alone.
3. Never report complete from an Actions success alone.
4. Every user-requested visual change must be verified against the PUBLIC GitHub Pages URL.
5. Dynamic effects require timed browser evidence, not one static screenshot.
6. Completion evidence must include commit SHA, deployed public URL, and visual verification result.
7. Do not stop or report to the user merely because an intermediate method, connector, upload route, command, workflow, or implementation attempt failed.
8. On any recoverable execution failure, automatically diagnose the cause, select an available alternate route, repair/retry, and continue execution without asking the user to operate technical steps.
9. Intermediate technical failures are operator-internal. User-facing status should normally be sent only after VISUAL_VERIFIED, and should state the problem encountered only as completed history: what failed, how it was repaired, and that final verification passed.
10. Ask the user only when completion genuinely requires information, credentials, approval, or a source asset that cannot be recovered from available context/tools.
11. Never hand an internal blocker back to the user as an unexplained 'stuck' status when another available execution route can be attempted.

## Image replacement gate
For a requested image replacement, completion requires all of:
- requested image blob exists in this repository;
- page source references that repository asset;
- public URL serves the new asset;
- PC 1440px screenshot visibly uses it;
- mobile 390px screenshot visibly uses it.

## Animation gate
For hero animation, capture 0s, 1s, 3s, 5s and verify actual pixel/style changes. A CSS declaration alone is not evidence.

## Autonomous recovery rule
If execution fails before VISUAL_VERIFIED:
1. identify the concrete failing step;
2. attempt a technically valid alternate path using available tools/workflows;
3. repair repository automation when the failure class is likely to recur;
4. resume from the earliest failed state;
5. continue through DEPLOYED and VISUAL_VERIFIED;
6. only then report completion.

## Operator rule
Do not end an execution turn after an intermediate write if further required repository operations are available. Continue until VISUAL_VERIFIED or until every available recovery route has been exhausted and a truly external dependency is required.
