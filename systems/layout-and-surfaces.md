## Layout & Surfaces System

The structural layer of this design language has two responsibilities:

1. **Surfaces, depth, and hierarchy** — how cards, banners, and micro-components express elevation (originally `surfaces-depth.md`).
2. **Layout primitives** — the container/grid utilities every page composes (originally `layout-system.md`).

The sections below keep both perspectives intact, with minimal editing so you can continue to copy existing recipes.

---

### Part 1 — Surfaces, Depth, and Hierarchy

#### Glassmorphism with restraint

**Why:** A frosted card instantly communicates elevation and interaction priority. Glassmorphism creates visual hierarchy through transparency and blur—foreground elements feel physically "above" the background. But restraint is critical: if everything is glass, nothing stands out.

> Want to push beyond the baseline recipes here? See [`research/glassmorphism.md`](../research/glassmorphism.md) for supplemental experiments (scroll-reactive blur, cursor-driven auroras, visionOS-inspired depth) and inspiration sources.

**How:**
```css
.glass-panel {
  backdrop-filter: blur(24px);
  background: var(--bg-elevated); /* rgba(9, 11, 25, 0.65) */
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
}

/* Optional hover glow */
.glass-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 60%);
  opacity: 0;
  transition: opacity var(--transition);
  pointer-events: none; /* CRITICAL: Don't block interaction */
}

.glass-panel:hover::after {
  opacity: 1;
}

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(1px)) {
  .glass-panel {
    background: rgba(9, 11, 25, 0.95); /* More opaque when blur unavailable */
  }
}
```

**Why 24px blur?** Smaller values (≤12px) look pixelated; larger values (≥40px) obscure content. 20–30px is the sweet spot for readability over complex backgrounds.

**The pointer-events gotcha:** We spent an hour debugging "buttons not working" because `.glass-panel::after` covered interactive elements. Always set `pointer-events: none` on decorative overlays. This is the #1 glassmorphism bug in production.

**Anti-patterns:**
- Applying glass effect to every surface (use sparingly for elevation hierarchy)
- Forgetting `@supports` fallback for Firefox < 103, Safari < 9
- Overlays without `pointer-events: none` (blocks all interaction)
- Using blur on elements that animate or scroll (causes stuttering)

#### Status-aware micro components

**Why:** Small, repeatable badges and alerts reduce bespoke CSS and keep state changes obvious. Status indicators are the "LEDs" of your UI—they should be instantly scannable without reading text.

**How:**
```css
/* Badge system */
.status-badge {
  display: inline-flex;
  padding: 0.2rem 0.75rem;
  font-size: 0.7rem;
  border-radius: 999px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.status-ready {
  background: rgba(52, 211, 153, 0.15);
  color: #a7f3d0;
}

.status-error {
  background: rgba(248, 113, 113, 0.18);
  color: #fecaca;
}

/* Alert system */
.alert {
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}

.alert.success {
  border-color: rgba(52, 211, 153, 0.4);
  background: rgba(52, 211, 153, 0.12);
  color: #d1fae5;
}
```

**Design principle:** Use color + text, never color alone (WCAG requirement). "Ready" status should be green AND say "Ready" for colorblind users.

**DOM manipulation:** Toggle classes, don't mutate inline styles:
```javascript
// Good
element.classList.toggle('is-hidden');
element.classList.add('status-error');

// Bad - inline styles are hard to audit and override
element.style.display = 'none';
element.style.color = '#f43f5e';
```

---

### Part 2 — Layout System & Responsive Strategy

#### Container primitives

**Why:** Reusable layout primitives eliminate "one-off" containers that drift over time. Define your grid and spacing system once, compose everywhere.

**How:**
```css
/* Main container with sensible width constraints */
.page-shell {
  position: relative;
  z-index: 1;
  width: min(1200px, 95vw);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* Auto-responsive grids */
.split-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.75rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
}

/* Utility classes for flex layouts */
.flex { display: flex; }
.flex-column { flex-direction: column; }
.align-center { align-items: center; }
.gap-md { gap: 1rem; }
```

#### Responsive strategy

**Why:** Fluid dimensions via `clamp()` and intrinsic grids eliminate 90% of breakpoints.

**How:**
```css
h1 {
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  line-height: 1.05;
}

body {
  padding: clamp(1.5rem, 4vw, 3rem);
}

@media (max-width: 768px) {
  .hero-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .button-row {
    flex-direction: column;
    align-items: stretch;
  }
}
```

#### Bento grid layouts

Use `grid-auto-rows` to create a rhythm, span standout panels with utility classes (e.g., `.wide`, `.tall`), and collapse spans under ~768px so cards stack in DOM order. Progressive enhancement ensures browsers without `subgrid` still see a clean stacked layout.
