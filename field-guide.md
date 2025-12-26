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
| [`research/emerging-web-technologies.md`](./research/emerging-web-technologies.md) | Signals on AI-native UI, Wasm 3.0, edge runtimes, sustainability mandates. |

## 5. Standout Feature Playbooks

Four patterns show up across every award deck we track. Use these summaries as an index into the deeper research + inspiration assets.

### Cinematic & Choreographed Motion

Modern scroll stories like Flighty or 1.amsterdam treat motion as narrative glue—scroll position triggers scene swaps, view transitions bridge page states, and physics-based easing keeps things legible. Pair `interaction/motion-feedback.md` (implementation) with `research/animations-and-microinteractions.md` (principles) for orchestration recipes, and log QA captures per `quality/motion-qa.md`.

**Key traits**
- Scroll-powered reveals that sync copy, data viz, and 3D renders so the story unfolds at the user’s pace.
- Orchestrated state changes and hover details that guide focus instead of distracting.
- Physics-aware easing (Material emphasized curves, GSAP spring presets) that reinforces hierarchy.

**Tech stack to study**
- GSAP, Framer Motion, CSS Scroll-Driven Animations (`research/modern-ui-libraries.md`).
- View Transitions API + reduced-motion handling (`systems/accessibility-resilience.md`).

### Interactive & Responsive Glassmorphism

Glass surfaces moved beyond static blur—visionOS-style panels now react to depth, cursor, and scroll context. Ground yourself in `systems/layout-and-surfaces.md` for tokens + structure, then dive into `research/glassmorphism.md` for liquid glass experiments and WebGL distortions.

**Key traits**
- Liquid glass that distorts based on cursor or scroll input.
- Context-aware blur/opacity shifts to signal depth and focus.
- Spatial layering with parallax, depth-of-field, and translucent cards.

**Tech stack to study**
- `backdrop-filter`, CSS custom properties, and GPU-friendly transforms.
- WebGL / React Three Fiber augmentations when you need refraction or lensing.

### Generative & AI-Driven UI

Interfaces increasingly adapt layouts, tone, and content in real time. Use `research/emerging-web-technologies.md` for AI signals, `research/modern-ui-libraries.md` for SDKs like Vercel AI, and `interaction/content-modules.md` to see how we structure components the AI can safely assemble.

**Key traits**
- AI-personalized copy/layout with tight guardrails.
- Natural-language entry points feeding structured UI responses.
- Streaming UI updates with clear fallbacks when AI is offline.

**Tech stack to study**
- Vercel AI SDK, CopilotKit, OpenAI tool schemas.
- Observability + moderation hooks defined in `workflow/audit-checklist.md`.

### Headless & Composable Architectures

Award-winning commerce and editorial builds (DVF.com, Schumacher House) lean on headless CMS + API-driven components to inject rich interactions anywhere in the narrative. Review `research/modern-ui-libraries.md` for headless UI kits, `systems/layered-foundations.md` for tokens, and `workflow/audit-checklist.md` for adoption steps.

**Key traits**
- Frontend/backend decoupling so editorial storytelling and commerce logic can co-exist.
- API-driven content modeling powering any device or channel.
- Reusable, accesible primitives (Radix UI, shadcn) styled to match our system.

**Tech stack to study**
- Contentful/Strapi/Sanity with Next.js, Remix, or Astro frontends.
- Design-system owned component libraries + Storybook coverage.

For living examples, see the expanded case studies in [`inspiration/inspirational-sites.md`](./inspiration/inspirational-sites.md).

## 6. Inspiration Gallery (`/inspiration`)

| File | Contents |
| --- | --- |
| [`inspiration/inspirational-sites.md`](./inspiration/inspirational-sites.md) | Tagged gallery of production-grade sites worth dissecting. |

## 7. Workflow & Adoption (`/workflow`)

| File | Contents |
| --- | --- |
| [`workflow/audit-checklist.md`](./workflow/audit-checklist.md) | Phase-by-phase implementation checklist (tokens → motion → QA). |

## Start-Here Flows

| Goal | Jump to | Why |
| --- | --- | --- |
| “I need the design system primitives.” | `systems/` files | Tokens + layout + accessibility/resilience in one place. |
| “I’m shipping a cinematic interaction.” | `interaction/motion-feedback.md` then `quality/motion-qa.md` | Pair implementation guidance with the QA artifacts you must deliver. |
| “I want standout feature inspiration.” | Field Guide §5 + `inspiration/inspirational-sites.md` | See the four core patterns and the live sites that execute them. |
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
