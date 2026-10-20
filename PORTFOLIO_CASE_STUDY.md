# CuePilot — Portfolio Case Study

## Challenge

A live sports production requires a detailed run-of-show and dependencies: camera feeds, audio, graphics, encoders, crew readiness, control-room actions and an auditable technical issue process. Teams can struggle with fragmented spreadsheets, manual timing updates and last-minute double bookings.

## Proposed solution

CuePilot is a compact internal operations prototype: create a production, assemble and re-sequence its cues, verify that all critical checks have passed, allocate resources without conflicts, run a simulated show, then export the resulting plan and incident record.

## Product decisions

- A broadcast-specific dark navigation paired with clean, high-contrast operations surfaces distinguishes rehearsal planning from live-control views.
- The current production is visible in navigation and shared across tools.
- A deterministic readiness engine explains why a show cannot start, instead of issuing an opaque score or relying on a hallucination-prone model.
- User changes are saved immediately in localStorage to make the portfolio demo self-contained and easy to review.
- Readiness gating is explicitly separate from the simulated transmission timer.

## Engineering

- React 19 component state and actions; TypeScript domain model.
- Pure scheduling validation and cue timeline functions, testable independently of React.
- Local JSON persistence with bounded structural backup import validation.
- Unit tests cover timing, overlapping intervals, critical check blockers, maintenance, live state transitions, CSV safety and backup recovery.
- Vercel-ready Vite build and GitHub Actions CI.

## AI-assisted development

The implementation was drafted with an AI development assistant. The application documents its actual runtime behavior honestly: it **does not contain a generative AI assistant**. Testing focuses on validating generated business logic and exposing critical failures before deployment. The applicant should be able to explain, debug and modify the implementation rather than claim to have handwritten every line unaided.

## What to show on interview

1. Editing a cue recalculates the entire show timing.
2. Failing a critical preflight check blocks Go Live.
3. Reserving equipment in an overlapping show is rejected.
4. Critical incidents have a measurable safety impact.
5. Simulated live cue transitions create an operator-facing event log.
6. Data portability and test evidence are visible in the repository.

## Limitations / production upgrade path

A real production-ready successor needs authentication, authorization, a server database with transactional booking constraints, timezone-aware slot allocation, a resilient device/stream adapter, real broadcast timecode, audit event signing, real-time collaboration, alerting and integration tests. The current prototype intentionally does not claim those capabilities.

## CV blurb

**CuePilot — Live Production Control** | React, TypeScript, Tailwind. Designed and implemented a broadcast operations console with rundown editing, explainable preflight blockers, resource collision detection, incident tracking, simulated cue playback, CSV/JSON export, browser persistence and automated rule tests.
