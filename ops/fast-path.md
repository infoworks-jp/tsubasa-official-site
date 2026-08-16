# Fast execution protocol

Goal: eliminate idle waiting and false progress.

1. First write within the same execution turn. No STARTED claim before a successful write response.
2. One requested change = one narrow commit whenever practical. Do not improve unrelated areas.
3. Immediately read back every write that matters.
4. Push triggers deployment/verification automatically; no manual hourly polling as the primary mechanism.
5. Hard time budgets: asset sanity <=10s, deploy visibility <=60s, browser visual verification <=120s, whole QA job <=5m.
6. Fail fast: 404, tiny/corrupt asset, wrong hash, timeout, missing evidence, stale deployment, console/page errors => FAILED immediately, never WAITING.
7. While deployment runs, prepare only checks needed for the same request; do not start unrelated redesign/refactoring.
8. Completion report is allowed only after acceptance-gate passes. Otherwise report the exact failed gate, not a generic progress claim.
9. If a workflow exceeds its expected budget, watchdog/result-gate marks it failed; do not wait for the user to ask.
10. Exact supplied assets are immutable source-of-truth. Never generate substitutes unless explicitly requested.
