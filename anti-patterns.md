## Anti-Patterns to Avoid

Understanding what NOT to do is as important as understanding best practices. These are the patterns that will bite you in production.

### Inline styles, one-off tweaks, and token drift

**Why it hurts:** Inline styles are impossible to audit, theme changes miss them, and token drift creates brand inconsistency. Every `style="margin-top: 10px"` is a snowflake that makes your codebase less maintainable.

**Example:**
```html
<!-- Bad -->
<div style="display: flex; gap: 1rem; align-items: center;">
  <button style="margin-right: 8px;">OK</button>
  <button style="margin-right: 10px;">Cancel</button>
</div>

<!-- Good -->
<div class="flex gap-md align-center">
  <button class="btn btn-primary">OK</button>
  <button class="btn btn-secondary">Cancel</button>
</div>
```

```css
/* Bad */
.btn-primary { background: #34d399; }
.status-ready { color: #22c55e; }

/* Good */
:root { --accent-teal: #34d399; }
.btn-primary, .status-ready { background: var(--accent-teal); }
```

**Remedy:** Ban inline styles, lint for `style="`, and add new colors/spacings only through the token system. If you need a new value, create the token first, then consume it.

### Outdated layout & tooling techniques

These relics still appear in legacy code reviews. Replace them before they rot the codebase.

| Outdated Technique | Problem | Modern Alternative |
| :--- | :--- | :--- |
| jQuery DOM manipulation | Imperative, verbose, impossible to optimize | Declarative frameworks (React, Vue, Svelte) |
| Table/floats for layout | Unsemantic, brittle, destroys responsiveness | CSS Grid + Flexbox |
| CSS sprites | Optimizing for HTTP/1 and bitmap icons | HTTP/2 multiplexing + SVG/modern formats |
| Manual bundling | No dependency graph, no code-splitting | Vite, Webpack, Parcel |
| Pixels everywhere | Ignores user prefs, not fluid | `rem`, `clamp()`, and tokens |

Also retire deeply nested selectors, magic-number spacing, and projects that omit a CSS reset. Adopt flat, class-based selectors, spacing scales, and a base reset/normalize.

### Pointer-blocking pseudo-elements

**Why it hurts:** Glassmorphism overlays that forget `pointer-events: none` block ALL interaction. This is a silent killer—UI looks perfect but nothing works.

```css
/* Bad */
.glass-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 60%);
  /* Missing pointer-events */
}

/* Good */
.glass-panel::after {
  pointer-events: none;
}
```

**Remedy:** ALL decorative pseudo-elements must have `pointer-events: none`. No exceptions.

### Scroll handlers and animation abuse

**Why it hurts:** Scroll handlers fire 60+ times per second and force layout calculations. Animating layout/paint properties (`margin`, `width`, `background`) causes stutter, especially atop glass surfaces. Modern browsers now ship scroll timelines and view transitions—if you stick to legacy patterns, you miss GPU-accelerated motion and end up polyfilling behavior the platform already solved.

```javascript
// Bad
window.addEventListener('scroll', () => {
  document.querySelectorAll('.fade-up').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('is-visible');
    }
  });
});

// Good
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible'));
});
```

```css
/* Bad */
.btn:hover {
  margin-top: -2px;
  width: 102%;
}

/* Good */
.btn:hover {
  transform: translateY(-2px) scale(1.02);
}
```

**View-transition killer:** Wrapping shared elements in `overflow: hidden` (or clipping them with mismatched radii) prevents the new `::view-transition-*` snapshots from rendering, producing hard cuts and flicker. Scope masks inside the transitioning element, or upgrade to nested `::view-transition-group()` plus `overflow: clip` so the browser can composite layers correctly (see [Chrome’s view-transition updates](https://developer.chrome.com/blog/view-transitions-updates/#nested-groups) and [community fixes](https://stackoverflow.com/questions/77476760/how-to-animate-clip-path-with-new-view-transitions-api)).

**Remedy:** Use IntersectionObserver or native scroll timelines, animate only `transform`/`opacity`, feature-detect `document.startViewTransition`, and consult [csstriggers.com](https://csstriggers.com/) before introducing motion. Ban `transition: all`.

### Performance regressions that sneak into launch

- **Render-blocking resources:** `<script>` in `<head>` without `defer/async` or CSS loaded late.
- **Unoptimized assets:** Huge bitmaps, missing `srcset`, no lazy-loading.
- **Bloated bundles:** No code-splitting, third-party scripts shipped to every route.
- **Zero caching strategy:** Static assets re-downloaded on each visit, no CDN, no cache headers.
- **Layout thrashing:** Alternating reads/writes in loops; fix with `requestAnimationFrame`, batch DOM writes, and ResizeObserver.

Treat Lighthouse/perf budgets as blocking checks, not “nice to have.”

### Accessibility gaps

- **Ignoring `prefers-reduced-motion`:** Triggers nausea/migraines and fails WCAG.
- **Poor contrast & missing focus states:** Killing readability and keyboard flow (never remove outlines without replacements).
- **Non-semantic HTML:** `<div onClick>` instead of `<button>` removes built-in a11y.
- **Missing/meaningless `alt` text:** Screen readers get zero context.

**Remedy:** Ship semantic HTML, pair iconography with text, and treat the accessibility tree as part of the UI surface. Listen for runtime changes to `prefers-reduced-motion` so toggles take effect immediately.

### UX & product dark patterns

- **Cluttered views:** Trying to show everything at once destroys scannability; use progressive disclosure.
- **Mystery-meat navigation:** Icons without labels slow users down.
- **Carousels for core content:** Users rarely interact past slide one; prefer grids/stacked cards.
- **Dark patterns (confirmshaming, hidden opt-outs):** Short-term metrics at the cost of user trust.

Keep the UI honest—prioritize comprehension and ethical flows over gimmicks.

### Breakpoint soup

**Why it hurts:** Maintenance nightmare. Every layout change requires updating 5+ breakpoints. Fluid design eliminates this.

```css
/* Bad */
.container { width: 1200px; }
@media (max-width: 1199px) { .container { width: 960px; } }
@media (max-width: 991px) { .container { width: 720px; } }

/* Good */
.container { width: min(1200px, 95vw); }
```

**Remedy:** Use `clamp()`, `min()`, `max()`, and auto-fit grids. Aim for 0-2 breakpoints max.

---

## Legacy & industry pitfalls

Use this section when auditing older stacks or onboarding teams who are still shipping pre-token CSS.

### Outdated techniques & their modern alternatives

| Outdated Technique | Problem | Modern Alternative |
| :--- | :--- | :--- |
| **jQuery for DOM manipulation** | Imperative, verbose, and inefficient for complex UIs. Does not scale well. | **Declarative UI frameworks** (React, Vue, Svelte) that manage the DOM for you. |
| **Table/Floats for layout** | Unsemantic, brittle, terrible for responsiveness. | **CSS Grid & Flexbox** for two- and one-dimensional layout. |
| **CSS sprites** | Optimized for HTTP/1 + bitmaps. | **HTTP/2** + SVG/modern formats. |
| **Manual JS/CSS bundling** | No dependency graph, no code splitting. | **Vite, Webpack, Parcel** or native ESM build pipelines. |
| **Flash/Silverlight/Applets** | Proprietary, insecure, unsupported on mobile. | **HTML5 canvas, WebGL, CSS animations, WASM.** |
| **Pixels everywhere** | Ignores user prefs, not fluid. | **Relative units** (`rem`, `em`, `clamp()`) plus design tokens. |

### CSS & layout mistakes

- **Overusing `!important`:** Signals a broken cascade. Lower specificity, refactor selectors.
- **Deep selector chains:** `div.container #main .sidebar ul li a` breaks whenever markup changes. Prefer flat, class-based selectors or BEM.
- **Magic numbers:** Random pixel tweaks mask layout issues. Use Grid/Flexbox utilities or tokenized spacing instead.
- **No CSS reset:** Baseline differences across browsers compound layout drift. Start with something like `modern-normalize`.
- **Mixed concerns:** Utility classes doing non-utility work (`.text-red-500` used for layout) create chaos. Stick to a single approach per layer.

### Performance anti-patterns

- **Render-blocking resources:** `<script>` tags in `<head>` without `defer/async` halt rendering.
- **Unoptimized images:** Ship WebP/AVIF via `<picture>` + `srcset`, lazy-load offscreen assets.
- **Bloated bundles:** Code split per route/component, use dynamic `import()` and monitor budgets.
- **No caching strategy:** Configure `Cache-Control`, leverage CDNs, fingerprint assets.
- **Layout thrashing:** Batch DOM reads/writes; use `requestAnimationFrame`, ResizeObserver, or virtualization.

### Accessibility (A11y) mistakes

- **Non-semantic HTML:** `<div onClick>` instead of `<button>` strips keyboard semantics.
- **Poor contrast:** Fails WCAG; test against AA/AAA ratios.
- **Missing/meaningless `alt` text:** Describe intent; use `alt=""` for decoratives.
- **Invisible focus states:** Never remove outlines without a better replacement (`:focus-visible`).
- **Label-less forms:** Tie inputs to labels via `for`/`id` or nesting so screen readers announce context.

### UX design anti-patterns

- **Cluttered interfaces:** Cognitive overload kills comprehension. Embrace whitespace and progressive disclosure.
- **Inconsistent patterns:** Multiple button styles for one action erode trust—enforce a design system.
- **Mystery meat nav:** Icons need labels. Pair glyphs with text, especially for primary nav.
- **Content carousels:** Poor engagement/accessibility; prefer grids or stacked cards with clear affordances.
- **Dark patterns:** Confirmshaming, hidden opt-outs, forced continuity—short-term gains that damage trust. Be explicit and reversible.
