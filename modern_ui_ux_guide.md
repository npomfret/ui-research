# Modern UI/UX Reference (Engineering Edition)

A condensed field guide for engineers who need to ship cinematic, high-trust web interfaces without resorting to ad‑hoc styling. The goal of this repository is simple: capture research into modern web UI techniques so future projects can copy proven patterns rather than rediscover them.

## How to Navigate This Research

### Core Playbook 
- [Layered Foundations](./layered-foundations.md) — design tokens, atmospheric backgrounds, and the primitives every other pattern relies on.
- [Surfaces, Depth, and Hierarchy](./surfaces-depth.md) — glassmorphism recipes, elevation cues, and status-aware micro-components.
- [Layout System](./layout-system.md) — container primitives, utility philosophy, and fluid responsive strategy.
- [Motion & Feedback](./motion-feedback.md) — scroll-triggered reveals, interaction states, new native transition APIs, and reduced-motion handling.
- [Content Modules](./content-modules.md) — reusable hero, form, table, chat, and spatial overlay shells.
- [Accessibility, Resilience & Tooling](./accessibility-resilience-tooling.md) — progressive enhancement, HTMX hydration, automation/linting safeguards.
- [Anti-Patterns to Avoid](./anti-patterns.md) — release-blocking issues (inline styles, pointer-blocking overlays, perf regressions, etc.).
- [Implementation Checklist](./implementation-checklist.md) — step-by-step audit flow; run it when bringing a surface up to spec.
- [Conclusion](./conclusion.md) — why the discipline pays off and how to socialize these standards with stakeholders.

### Supplemental Research Files
- [inspirational-website-designs.md](./inspirational-website-designs.md) — a curated list of websites that showcase best-in-class design and provide inspiration for modern UI/UX.
- [animation-and-microinteractions-research.md](./animation-and-microinteractions-research.md) — a deep dive into the principles, best practices, and tools for creating effective UI animations and micro-interactions.
- [glassmorphism-research.md](./glassmorphism-research.md) — deep dive on atmospheric materials, cursor/scroll dynamics, and inspiration pulled from visionOS.
- [modern-ui-libraries.md](./modern-ui-libraries.md) — curated tooling list (animation engines, headless UI kits, state libraries, and WebGL helpers) for when you need production-ready building blocks.

Treat these notes as modular—jump into whatever topic you need, and lean on the supplemental files when you want extra depth, vendor options, or competitive references. `anti-patterns.md` now includes both release blockers and broader industry pitfalls.
