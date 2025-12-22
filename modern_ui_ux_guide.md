# Modern UI/UX Reference (Engineering Edition)

A condensed field guide for engineers who need to ship cinematic, high-trust web interfaces without resorting to ad‑hoc styling. The goal of this repository is simple: capture research into modern web UI techniques so future projects can copy proven patterns rather than rediscover them.

## How to Navigate This Research

### Core Playbook
1. [1. Layered Foundations](./01-foundations.md) — design tokens, atmospheric backgrounds, and the primitives every other pattern relies on.
2. [2. Surfaces, Depth, and Hierarchy](./02-surfaces.md) — glassmorphism recipes, elevation cues, and status-aware micro-components.
3. [3. Layout System](./03-layout.md) — container primitives, utility philosophy, and fluid responsive strategy.
4. [4. Motion & Feedback](./04-motion.md) — scroll-triggered reveals, interaction states, and reduced-motion handling.
5. [5. Content Modules](./05-content-modules.md) — reusable hero, form, table, and chat shells that slot into any product surface.
6. [6. Accessibility, Resilience & Tooling](./06-accessibility-resilience-tooling.md) — progressive enhancement, HTMX hydration, and linting/QA safeguards.
7. [7. Anti-Patterns to Avoid](./07-anti-patterns.md) — red flags that should block a release (inline styles, pointer-blocking overlays, perf regressions, etc.).
8. [8. Implementation Checklist](./08-checklist.md) — step-by-step audit flow; use it when bringing a screen to parity with the patterns above.
9. [9. Conclusion](./09-conclusion.md) — why the discipline pays off and how to socialize these standards with stakeholders.

### Supplemental Research Files
- [glassmorphism-research.md](./glassmorphism-research.md) — deep dive on atmospheric materials, cursor/scroll dynamics, and inspiration pulled from visionOS.
- [modern-ui-techniques-vol2.md](./modern-ui-techniques-vol2.md) — follow-up experiments covering Bento layouts, button micro-interactions, and scroll-driven CSS animations.
- [modern-ui-libraries.md](./modern-ui-libraries.md) — curated tooling list (animation engines, headless UI kits, state libraries, and WebGL helpers) for when you need production-ready building blocks.
- [ui-anti-patterns-and-mistakes.md](./ui-anti-patterns-and-mistakes.md) — broader industry anti-pattern catalogue; use it during legacy audits or when onboarding teams who are still shipping pre-token CSS.

Treat `01-09` as the canonical playbook for new work, and lean on the supplemental files when you need extra depth, vendor options, or competitive references.
