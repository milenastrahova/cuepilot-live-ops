# CuePilot — Manual QA Checklist

Run this locally in Chrome or Edge after `npm install` and `npm run dev`. Reset demo data first in Reports.

- [ ] Overview loads three seed productions and expected KPIs without errors.
- [ ] Select a production in Rundown; title, time, timeline and total duration update.
- [ ] Create a 5-minute cue; verify timeline recalculation.
- [ ] Edit its title, source and duration; verify updates survive F5.
- [ ] Move cue up and down and verify scheduled start times change.
- [ ] Delete cue and confirm it disappears.
- [ ] First production: all preflight items checked. Go Live succeeds.
- [ ] Active cue is uniquely marked; Take Next Cue completes prior one and marks next.
- [ ] Hold freezes the clock; Resume advances again.
- [ ] End show asks for confirmation and changes status to Completed.
- [ ] Second production: critical backup check missing; Go Live refuses and explains it.
- [ ] Set a resource to Maintenance; assigned show now fails preflight safety gate.
- [ ] Add a Critical incident; Go Live refuses until it is resolved.
- [ ] Create an overlapping production with at least one cue, then try assigning equipment already booked in the first production. The assignment is rejected with a toast.
- [ ] Booking a resource on a different date succeeds.
- [ ] New production can be created, populated with cues, and saved across refreshes.
- [ ] Reports exports produce distinct column headers in European Excel format.
- [ ] JSON backup restores all three demo production records.
- [ ] An invalid JSON backup is rejected without overwriting workspace.
- [ ] Reset demo restores original shows and checks.
- [ ] All pages remain navigable and usable at desktop, tablet and mobile widths.
- [ ] Developer console has no uncaught errors.
- [ ] `npm test`, `npm run typecheck` and `npm run build` succeed.

## Constraints

- There is **no real broadcast feed**; Live Desk simulates operator inputs.
- There is **no real AI inference**; safeguards are a deterministic TS rule engine.
- There is **no multi-user backend**; data stays in the browser.
- Timekeeping pauses when the tab is suspended; browser timers are not suitable for time-critical transmission.

## Testing performed in generation environment

- 29/29 Node test cases passed.
- Pure domain engine passed `tsc -p tsconfig.engine.json`.
- JSX/TS syntactic parse and a supplementary static check passed.
- Full Vite build requires downloading npm packages. Network is restricted in generation environment, so the final build and browser E2E remain **unverified** pending local execution.
