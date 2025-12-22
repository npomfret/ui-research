## 7. Anti-Patterns to Avoid

Understanding what NOT to do is as important as understanding best practices. These are the patterns that will bite you in production.

### 7.1. Inline styles and one-off tweaks

**Why it hurts:** Impossible to audit, theme changes miss them, can't be overridden with utility classes. Every `style="margin-top: 10px"` is a snowflake that makes your codebase less maintainable.

**Examples of pain:**
```html
<!-- Bad: inline styles scattered everywhere -->
<div style="display: flex; gap: 1rem; align-items: center;">
  <button style="margin-right: 8px;">OK</button>
  <button style="margin-right: 10px;">Cancel</button> <!-- Inconsistent! -->
</div>

<!-- Good: utility classes -->
<div class="flex gap-md align-center">
  <button class="btn btn-primary">OK</button>
  <button class="btn btn-secondary">Cancel</button>
</div>
```

**Remedy:** Ban inline styles. Use utilities for layout, tokens for styling. Lint for `style="` and fail CI if found.

### 7.2. Pointer-blocking pseudo-elements

**Why it hurts:** Glassmorphism overlays that forget `pointer-events: none` block ALL interaction. This is a silent killer—UI looks perfect but nothing works.

**The bug we hit:**
```css
/* Bad: blocks all clicks */
.glass-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 60%);
  /* Missing: pointer-events: none */
}

/* Good: decorative only */
.glass-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 60%);
  pointer-events: none; /* CRITICAL */
}
```

**Remedy:** ALL decorative pseudo-elements must have `pointer-events: none`. No exceptions.

### 7.3. Scroll event listeners for animations

**Why it hurts:** Fires 60+ times per second, blocks main thread, causes jank on scroll. Users on low-end devices will notice immediately.

**Performance comparison:**
```javascript
// Bad: synchronous scroll handler
window.addEventListener('scroll', () => {
  document.querySelectorAll('.fade-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('is-visible'); // Forces layout
    }
  });
}); // Runs 60+ times/second

// Good: async IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
});
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
// Only fires when elements cross threshold
```

**Remedy:** Use IntersectionObserver for scroll-triggered effects. Never use scroll event listeners.

### 7.4. Token drift and ad-hoc colors

**Why it hurts:** Brand inconsistency, impossible to theme, creates design debt that compounds over time.

**Example of drift:**
```css
/* Bad: colors defined all over */
.btn-primary { background: #34d399; }
.status-ready { color: #34d399; }
.link-green { color: #10b981; } /* Close but not identical */
.success-badge { background: #22c55e; } /* Also green-ish? */

/* Good: single source of truth */
:root {
  --accent-teal: #34d399;
}

.btn-primary { background: var(--accent-teal); }
.status-ready { color: var(--accent-teal); }
.link { color: var(--accent-teal); }
.success-badge { background: var(--accent-teal); }
```

**Remedy:** All colors must be tokens. Lint for hex values outside `:root`. Add new colors to the token system, never inline.

### 7.5. Ignoring motion preferences

**Why it hurts:** Triggers nausea/migraines in users with vestibular disorders. WCAG 2.1 Level AA violation. Could expose you to lawsuits.

**Statistics:** ~35% of users experience some motion sensitivity. 1 in 20 people will feel sick from your animations if you don't respect `prefers-reduced-motion`.

**Remedy:** Always implement `@media (prefers-reduced-motion: reduce)` and listen for runtime changes.

### 7.6. Breakpoint soup

**Why it hurts:** Maintenance nightmare. Every layout change requires updating 5+ breakpoints. Fluid design eliminates this.

**Example:**
```css
/* Bad: breakpoint soup */
.container { width: 1200px; }
@media (max-width: 1199px) { .container { width: 960px; } }
@media (max-width: 991px) { .container { width: 720px; } }
@media (max-width: 767px) { .container { width: 540px; } }
@media (max-width: 575px) { .container { width: 100%; } }

/* Good: fluid */
.container { width: min(1200px, 95vw); }
```

**Remedy:** Use `clamp()`, `min()`, `max()`, and auto-fit grids. Aim for 0-2 breakpoints max.

### 7.7. Animating expensive properties

**Why it hurts:** Forces layout/paint on every frame. Causes stuttering, drains battery, fails on low-end devices.

**Performance impact:**
```css
/* Bad: triggers layout on every frame */
.btn:hover {
  margin-top: -2px; /* Layout */
  width: 102%; /* Layout */
  background: #fff; /* Paint */
}

/* Good: only composite */
.btn:hover {
  transform: translateY(-2px) scale(1.02); /* Composite only */
}
```

**Remedy:** Only animate `transform` and `opacity`. Check [CSS Triggers](https://csstriggers.com/) before animating any property.

**References:**
- [Paul Irish: Why Moving Elements With Translate Is Better Than Pos](https://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/) - Transform performance
- [Google: Avoid Large, Complex Layouts](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing) - Layout thrashing
