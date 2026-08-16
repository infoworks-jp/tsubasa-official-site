# TSUBASA completion quality gates

A change MUST NOT be reported as complete until every applicable gate below passes.

1. Source-of-truth gate
   - Use the exact user-approved asset, not a substitute, placeholder, generated approximation, or filename-only reference.
   - Record expected asset byte size and SHA-256 when an exact visual asset matters.
2. Repository gate
   - Referenced assets must exist in the deployed branch.
   - Raster hero images must decode successfully and have realistic dimensions and byte size (>10 KB unless explicitly expected smaller).
3. Deployment gate
   - Public HTML must contain the intended code after deployment.
   - Every referenced image must return HTTP 200 and decode with naturalWidth/naturalHeight > 0.
4. Visual identity gate
   - For exact supplied hero assets, compare the deployed asset bytes/hash against the approved source. Filename equality is not evidence.
5. Desktop/mobile gate
   - Capture 1440px desktop and 390px mobile evidence after deployment.
   - Check crop, text overlap, broken images, horizontal overflow, and key animation state.
6. Completion-language gate
   - Never say "done", "complete", "passed", or equivalent from workflow success alone.
   - Completion requires the artifact/content identity gate plus deployed browser verification.
7. Failure behavior
   - Any failed gate means status is INCOMPLETE.
   - Fix first, rerun gates, then report.

Incident lesson 2026-08-15/16: a workflow passed while the intended Susukino hero file in the repository was only 30 bytes. The verifier checked that the filename appeared and that images decoded, but did not prove the deployed pixels were the user-approved source. This document makes exact asset identity a mandatory completion condition.