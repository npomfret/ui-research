## Surfaces, Depth, and Hierarchy

### Glassmorphism with restraint

**Why:** A frosted card instantly communicates elevation and interaction priority. Glassmorphism creates visual hierarchy through transparency and blur—foreground elements feel physically "above" the background. But restraint is critical: if everything is glass, nothing stands out.

> Want to push beyond the baseline recipes here? See [`glassmorphism-research.md`](./glassmorphism-research.md) for supplemental experiments (scroll-reactive blur, cursor-driven auroras, visionOS-inspired depth) and inspiration sources.

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

**Why 24px blur?** Smaller values (≤12px) look pixelated; larger values (≥40px) obscure content. 20-30px is the sweet spot for readability over complex backgrounds.

**The pointer-events gotcha:** We spent an hour debugging "buttons not working" because `.glass-panel::after` covered interactive elements. Always set `pointer-events: none` on decorative overlays. This is the #1 glassmorphism bug in production.

**Anti-patterns:**
- Applying glass effect to every surface (use sparingly for elevation hierarchy)
- Forgetting `@supports` fallback for Firefox < 103, Safari < 9
- Overlays without `pointer-events: none` (blocks all interaction)
- Using blur on elements that animate or scroll (causes stuttering)

**Browser support:** `backdrop-filter` is ~94% global support as of 2024 but requires `-webkit-` prefix for Safari. Always test fallback on Firefox ESR.

**References:**
- [MDN: backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter) - Browser support and syntax
- [Can I Use: backdrop-filter](https://caniuse.com/css-backdrop-filter) - Current browser support
- [Glassmorphism Generator](https://hype4.academy/tools/glassmorphism-generator) - Visual tool for tuning parameters
- [Apple Human Interface Guidelines: Materials](https://developer.apple.com/design/human-interface-guidelines/materials) - Source of glassmorphism design language

### Status-aware micro components

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

**Design principle:** Use color + text, never color alone (WCAG 2.1 requirement). "Ready" status should be green AND say "Ready" for colorblind users.

**DOM manipulation:** Toggle classes, don't mutate inline styles:
```javascript
// Good
element.classList.toggle('is-hidden');
element.classList.add('status-error');

// Bad - inline styles are hard to audit and override
element.style.display = 'none';
element.style.color = '#f43f5e';
```

**Anti-patterns:**
- Custom inline color tweaks (impossible to theme or audit)
- Using color as the only status indicator (fails accessibility)
- Decorative pseudo-elements without `pointer-events: none`
- Relying on JavaScript for state that CSS classes can handle

**References:**
- [WCAG 2.1: Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html) - Why color alone isn't enough
- [Tailwind Status Colors](https://tailwindcss.com/docs/customizing-colors#color-palette-reference) - Well-designed semantic color system
- [Inclusive Components: Notifications](https://inclusive-components.design/notifications/) - Accessible alert patterns
