## 6. Accessibility, Resilience & Tooling

### 6.1. Motion and accessibility preferences

**Why:** ~35% of users experience motion sensitivity, and WCAG 2.1 Level AA requires respecting `prefers-reduced-motion`. Failing this isn't just bad UX—it can trigger nausea, migraines, or seizures.

**How:** Default to animation, but provide escape hatch:
```css
@media (prefers-reduced-motion: reduce) {
  .fade-up,
  .btn,
  .tab-btn {
    transition: none !important;
    animation: none !important;
  }

  .fade-up {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

**Runtime changes:** Users can toggle accessibility settings without refreshing:
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const handleMotionPreference = (event) => {
  if (event.matches) {
    // User enabled reduced motion - reveal everything immediately
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('is-visible'));
  }
};

// Initial check
handleMotionPreference(prefersReducedMotion);

// Listen for changes
prefersReducedMotion.addEventListener('change', handleMotionPreference);
```

**Testing:** macOS: System Preferences → Accessibility → Display → Reduce motion. Windows: Settings → Ease of Access → Display → Show animations.

**References:**
- [WCAG 2.1: Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) - Compliance requirement
- [A11y Project: prefers-reduced-motion](https://www.a11yproject.com/posts/understanding-vestibular-disorders/) - Why it matters

### 6.2. Progressive enhancement with @supports

**Why:** `backdrop-filter` has 94% support but fails on older Firefox/Safari. Graceful degradation means your UI works everywhere, looks great on modern browsers.

**How:**
```css
.glass-panel {
  background: rgba(9, 11, 25, 0.95); /* Fallback: opaque */
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
}

@supports (backdrop-filter: blur(1px)) {
  .glass-panel {
    backdrop-filter: blur(24px);
    background: rgba(9, 11, 25, 0.65); /* Semi-transparent only if blur available */
  }
}
```

**Testing fallbacks:** Firefox DevTools → Responsive Design Mode → touch simulation disables backdrop-filter.

**References:**
- [MDN: @supports](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) - Feature queries
- [Can I Use: backdrop-filter](https://caniuse.com/css-backdrop-filter) - Browser support data

### 6.3. Pointer events safety

**Why:** Decorative overlays that cover interactive elements are the #1 glassmorphism bug. We spent an hour debugging "buttons not working" before discovering `.glass-panel::after` blocked all clicks.

**How:** Always set `pointer-events: none` on decorative pseudo-elements:
```css
.glass-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0.08), transparent 60%);
  pointer-events: none; /* CRITICAL */
}
```

**Testing:** Click buttons/links inside glass panels. If they don't work, check for overlays.

**Rule:** Pseudo-elements used for visual effects should NEVER intercept pointer events.

### 6.4. HTMX and partial page updates

**Why:** HTMX replaces DOM fragments, which means any JavaScript initialization (icon hydration, event listeners) must be idempotent and re-run after swaps.

**How:** Centralize initialization and hook into HTMX lifecycle:
```javascript
// Centralize all initialization
function initializePage() {
  lucide.createIcons();

  // Autoresize textareas
  document.querySelectorAll('textarea[data-auto-resize]').forEach(textarea => {
    const resize = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };
    textarea.addEventListener('input', resize);
    resize();
  });
}

// Initial page load
initializePage();

// After every HTMX swap
document.body.addEventListener('htmx:afterSwap', initializePage);
```

**Anti-pattern:** Initializing components once on page load, then wondering why dynamically loaded content is broken.

**References:**
- [HTMX Events](https://htmx.org/events/) - Lifecycle hooks
- [HTMX Examples](https://htmx.org/examples/) - Partial update patterns

### 6.5. Linting and styling debt

**Why:** Inline styles and raw hex values are technical debt that compounds over time. Enforce standards with linting.

**Rules:**
1. Search for `style="` should return zero results
2. Search for `#[0-9a-f]{6}` (hex colors) outside `:root` should return zero results
3. Unused CSS classes should be removed (use PurgeCSS or similar)

**Enforcement:**
```javascript
// .stylelintrc.json
{
  "rules": {
    "declaration-block-no-duplicate-properties": true,
    "color-named": "never",
    "color-no-hex": true, // Force use of CSS variables
    "selector-class-pattern": "^[a-z][a-z0-9-]*$" // kebab-case only
  }
}
```

**Audit commands:**
```bash
# Find inline styles
grep -r 'style="' views/

# Find hex colors outside :root
grep -rE '#[0-9a-fA-F]{6}' public/css/ | grep -v ':root'

# Find unused CSS classes (requires PurgeCSS)
purgecss --content 'views/**/*.html' --css 'public/css/style.css'
```

**References:**
- [Stylelint](https://stylelint.io/) - CSS linter with extensive rules
- [PurgeCSS](https://purgecss.com/) - Remove unused CSS
- [CSS Stats](https://cssstats.com/) - Analyze CSS complexity
