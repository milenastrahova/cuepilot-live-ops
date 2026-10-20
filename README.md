# CuePilot — Live Production Control

**[🚀 Live demo](https://cuepilot-live-ops.vercel.app/) · [Source code](https://github.com/milenastrahova/cuepilot-live-ops)**

> **Broadcast-ready run-of-show planning, preflight safety checks and a simulated live control desk.** An interactive operations app built as an AI-assisted software-development portfolio project for live sports production workflows.

**React 19 · TypeScript · Tailwind CSS 4 · Vite · Recharts · Node.js test runner**

## What problem does it solve?

A live broadcast production involves more than a staff roster: producers need an accurate show rundown, technical resource bookings, readiness sign-offs and a shared record of incidents. CuePilot combines those workflows into a demo-ready *local-first* dashboard.

**Important distinction:** The live transmission screen is an **interactive simulation**. CuePilot does **not** connect to a real broadcast SDI/NDI/RTMP feed, control cameras, access a backend, or call an LLM. Data belongs to your current browser only. All sample productions and operators are fictional.

## Features

| Module | Features |
| --- | --- |
| Production overview | Live/next show indicators, upcoming lineup, airtime chart, readiness summary and attention queue. |
| Rundown builder | Create/edit/remove/reorder cues, per-cue source and owner, planned start times, cumulative duration and expected end time. |
| Live control desk | Guarded Go Live, current/next cue, next cue, Hold/Resume, End transmission, simulated clock and audit log. |
| Resource planner | Assign broadcast equipment, manage maintenance, prevent double booking for overlapping production windows. |
| Preflight readiness | Categorized checks, critical task flags, progress meter, explainable blocker list, guarded Go Live action. |
| Incident center | Log incidents with severity and production, resolve/reopen issues with timestamps, critical incident blocks Go Live. |
| Reports & backup | Production runtime/budget estimates, CSV exports, Excel-friendly semicolon CSV, JSON backup/restore, demo reset. |

### Scheduling/safety automation

The business logic is **deterministic and explainable**. The frontend is backed by a pure TypeScript engine that:

1. Projects cue timing across a rundown and recalculates it after reordering or editing.
2. Detects double bookings of the same resource when production dates and scheduled windows overlap.
3. Blocks Go Live when critical preflight tasks remain open, critical incidents exist, resources are in maintenance, rundown cues are invalid or bookings conflict.
4. Advances cue state transitions in order and keeps a browser-local activity log.
5. Offers separate standards-oriented CSV and European Excel-friendly export formats, with cell escaping and CSV formula-injection precautions.

**No fake AI claims:** CuePilot was designed with an AI-assisted coding workflow, but there is no runtime generative AI component. Its safety engine is explicit logic that can be independently unit-tested.

## Requirements

- Node.js **22.12+** and npm
- A modern browser, internet connection for first-time dependency installation

### Running locally

On Windows, unzip the project and double-click **`START_HERE.bat`**. Or from a terminal in the `cuepilot` folder:

```bash
npm install
npm run dev
```

Open **http://localhost:5174**.

### Tests and production build

```bash
npm test
npm run typecheck
npm run build
npm run preview
```

The `tests/` directory includes domain-engine and backup validation tests. There is also `.github/workflows/ci.yml` to run tests and a production build after upload to GitHub.

**Verification:** 29/29 automated unit tests and isolated domain TypeScript typechecking passed during packaging. The complete Vite production build was subsequently completed successfully on Vercel, and the application UI and key operator workflows were manually checked in a browser. The project remains a demonstration prototype, not production-grade broadcast software.

## 4-minute portfolio demonstration

1. Open **Overview** and introduce the sample broadcast productions.
2. Open **Rundown builder**, edit or reorder two cues, note how all downstream cue start times change.
3. Go to **Preflight checks** for the ready basketball event; it has all checks completed.
4. Open **Live control desk**, click **Go Live**, then **Take next cue** twice. Try **Hold / Resume** and observe the audit log.
5. Switch to the football final; its missing critical backup check prevents going live.
6. Open **Resource allocation**, try booking equipment already reserved for another show on an overlapping date. The action is rejected.
7. Report a **critical incident**, then return to Preflight and observe the safety blocker; resolve it to remove the blocker.
8. Export an Excel-ready CSV or a JSON backup from **Reports**.

For a strictly reproducible demo, reset sample data under **Reports → Reset workspace** first. See [`MANUAL_QA.md`](MANUAL_QA.md) for comprehensive validation.

## Code architecture

```text
src/
  App.tsx                    Operations dashboard + functional UI flows
  styles.css                 Responsive broadcast-console design
  main.tsx                   React entry point
  lib/
    types.ts                 Typed show, cue, resource, incident models
    engine.ts                Pure business rules, timeline, overlaps, CSV
    seed.ts                  Fictional sports production data
    storage.ts               Validated, versioned browser persistence
public/favicon.svg
examples/
tests/                        Automated Node-native tests
.github/workflows/ci.yml
```

## Data & constraints

- Browser `localStorage` only: no database, server synchronization, user accounts, authentication or role permissions. Do not enter real employee or client data.
- No real timecode synchronization, broadcast device control or stream connection. The On Air timer advances only while the browser tab is open and runs as a **simulation**.
- Studio/equipment reservations are illustrative and use scheduled windows computed from cue duration. Real operational software requires timezones, buffers, setup/tear-down durations and concurrency controls enforced on the server.
- All budget figures are **illustrative**, based on a flat demo estimate of €420 per planned hour, not actual invoices or payroll.
- JSON import is structurally validated; it is not a replacement for schema versioning, authentication, CSP and backend authorization.
- This application is a *portfolio prototype*, not a certified broadcast-safe system. It must not be used as a live production control system.

## Live demo and deployment

- **Live application:** https://cuepilot-live-ops.vercel.app/
- **Source repository:** https://github.com/milenastrahova/cuepilot-live-ops

CuePilot is deployed to **Vercel** from the public GitHub repository's `main` branch. The Vite project builds with `npm run build` to `dist/`. The production deployment completed successfully on Vercel. New commits to `main` can trigger subsequent deployments.

**Reviewer note:** This is a local-first demo, so each browser starts with fictional sample data. Any changes stay in that browser's localStorage. The Live Control Desk simulates controls and does not transmit an actual broadcast.

## Suggested portfolio description

> CuePilot — Live Production Control: designed and built a React/TypeScript broadcast operations console with an editable rundown, simulated on-air controls, validated resource allocation, preflight safety gates, incident management and analytics. Implemented independently testable timing/booking/validation rules, browser-local persistence, CSV/JSON portability and automated tests. Created through an AI-assisted development workflow and verified with rule tests and manual operator scenarios.

## Case study & author

Portfolio by **Milena Strakhova** (AI-assisted implementation).

A dedicated [`PORTFOLIO_CASE_STUDY.md`](PORTFOLIO_CASE_STUDY.md) and [`MANUAL_QA.md`](MANUAL_QA.md) describe design decisions, validation and production limitations.

## License

MIT — see [LICENSE](LICENSE).
