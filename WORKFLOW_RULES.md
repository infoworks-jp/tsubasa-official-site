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
6. If execution stops between states, status is STOPPED/INCOMPLETE, never IN_PROGRESS.
7. Completion evidence must include commit SHA, deployed public URL, and visual verification result.

## Image replacement gate
For a requested image replacement, completion requires all of:
- requested image blob exists in this repository;
- page source references that repository asset;
- public URL serves the new asset;
- PC 1440px screenshot visibly uses it;
- mobile 390px screenshot visibly uses it.

## Animation gate
For hero animation, capture 0s, 1s, 3s, 5s and verify actual pixel/style changes. A CSS declaration alone is not evidence.

## Operator rule
Do not end an execution turn after an intermediate write if further required repository operations are available. Continue until VISUAL_VERIFIED or a concrete blocking error is reached.
