# Modern UI Field Guide (2025 Edition)

This repo is now organized around the workflows senior UI engineers actually follow: define primitives, assemble interactions, enforce quality gates, and dip into research dossiers when you need fresh references. Use this guide as your map.

## 1. Systems & Foundations (`/systems`)

| File | Purpose |
| --- | --- |
| [`systems/layered-foundations.md`](./systems/layered-foundations.md) | Design tokens, atmospheric backgrounds, pseudo-element etiquette. |
| [`systems/layout-and-surfaces.md`](./systems/layout-and-surfaces.md) | Combined layout primitives + glassmorphism/status recipes. |
| [`systems/accessibility-resilience.md`](./systems/accessibility-resilience.md) | Reduced-motion handling, HTMX hydration, and progressive enhancement. |

## 2. Interaction Playbooks (`/interaction`)

| File | Purpose |
| --- | --- |
| [`interaction/motion-feedback.md`](./interaction/motion-feedback.md) | Scroll timelines, view transitions, micro-interactions, QA guidance. |
| [`interaction/content-modules.md`](./interaction/content-modules.md) | Reusable hero, form, table, chat, and overlay shells. |

## 3. Quality Gates (`/quality`)

| File | Purpose |
| --- | --- |
| [`quality/anti-patterns.md`](./quality/anti-patterns.md) | Release blockers and legacy pitfalls to audit before launch. |
| [`quality/motion-qa.md`](./quality/motion-qa.md) | Required artifacts: Chromatic diffs, DevTools traces, reduced-motion captures. |

## 4. Research Dossiers (`/research`)

| File | Focus |
| --- | --- |
| [`research/animations-and-microinteractions.md`](./research/animations-and-microinteractions.md) | Native scroll/view-transition techniques, timeline-scope, API primers. |
| [`research/glassmorphism.md`](./research/glassmorphism.md) | Atmospheric materials, cursor/scroll dynamics, inspiration pulls. |
| [`research/modern-ui-libraries.md`](./research/modern-ui-libraries.md) | Curated tooling list: animation engines, headless kits, WebGL helpers. |

## 5. Inspiration Gallery (`/inspiration`)

| File | Contents |
| --- | --- |
| [`inspiration/inspirational-sites.md`](./inspiration/inspirational-sites.md) | Tagged gallery of production-grade sites worth dissecting. |

## 6. Workflow & Adoption (`/workflow`)

| File | Contents |
| --- | --- |
| [`workflow/audit-checklist.md`](./workflow/audit-checklist.md) | Phase-by-phase implementation checklist (tokens → motion → QA). |

## Start-Here Flows

| Goal | Jump to | Why |
| --- | --- | --- |
| “I need the design system primitives.” | `systems/` files | Tokens + layout + accessibility/resilience in one place. |
| “I’m shipping a cinematic interaction.” | `interaction/motion-feedback.md` then `quality/motion-qa.md` | Pair implementation guidance with the QA artifacts you must deliver. |
| “I want new motion inspiration.” | `research/animations-and-microinteractions.md` + `inspiration/inspirational-sites.md` | Deep dives plus live examples. |
| “I’m reviewing a launch.” | `workflow/audit-checklist.md` + `quality/anti-patterns.md` | Run the audit checklist, then sweep for release blockers. |

## Working Agreements

1. **No inline styling** — new values become tokens first (`systems/layered-foundations.md`).
2. **Motion = code + QA** — every animation change carries Chromatic/Playwright artifacts, DevTools traces, and reduced-motion captures (`quality/motion-qa.md`).
3. **Feature detection is non-negotiable** — scroll timelines, view transitions, and glass effects all degrade gracefully (`systems/accessibility-resilience.md`).
4. **Docs stay modular** — when posting new research, follow the dossier pattern (Context → Principles → Techniques → Anti-patterns → References) so future readers can skim fast.

## Contributing Checklist

- [ ] Update the relevant section in this Field Guide if you add/move files.
- [ ] Keep references repo-relative (e.g., `./interaction/motion-feedback.md`).
- [ ] Note any required QA artifacts in your PR template (`workflow/audit-checklist.md`).
- [ ] Add new inspiration entries to `inspiration/inspirational-sites.md` with tags for discoverability.
