## 8. Implementation Checklist

Use this checklist when implementing or auditing a UI built with these patterns:

### Phase 1: Foundation
- [ ] **Design tokens defined** - All colors, spacing, radii, shadows in `:root`
- [ ] **Semantic naming** - Tokens use role names (`--accent-teal`, not `--color-1`)
- [ ] **No raw values** - Zero hex colors or px values outside `:root`
- [ ] **Animated background** - Two `::before`/`::after` pseudo-elements on body, animating over 20-30s
- [ ] **Background non-blocking** - Fixed positioning, `pointer-events: none`, `z-index: 0`

### Phase 2: Layout Primitives
- [ ] **Container system** - `.page-shell` for max-width + centering
- [ ] **Responsive grids** - `.split-grid`, `.stats-grid` using `auto-fit`
- [ ] **Utility classes** - Flex/spacing/alignment helpers (`.flex`, `.gap-md`, etc.)
- [ ] **Fluid typography** - All font sizes use `clamp(min, preferred, max)`
- [ ] **Minimal breakpoints** - 0-2 media queries for the entire site

### Phase 3: Glassmorphism
- [ ] **Backdrop filter** - `backdrop-filter: blur(24px)` on glass surfaces
- [ ] **Fallback** - `@supports` query with opaque background for older browsers
- [ ] **Border/shadow** - Subtle border and soft shadow for depth
- [ ] **Hover glow** - Optional `::after` pseudo-element with gradient
- [ ] **Pointer safety** - ALL decorative pseudo-elements have `pointer-events: none`

### Phase 4: Motion System
- [ ] **IntersectionObserver** - Scroll reveals use Observer, not scroll events
- [ ] **Fade-up utility** - `.fade-up` + `.is-visible` pattern implemented
- [ ] **Staggered delays** - `data-delay` attribute for sequential reveals
- [ ] **Reduced motion** - `@media (prefers-reduced-motion: reduce)` implemented
- [ ] **Runtime listener** - `MediaQueryList` change listener for accessibility toggle
- [ ] **GPU-friendly** - Only animating `transform` and `opacity`

### Phase 5: Components
- [ ] **Button variants** - `.btn-primary`, `.btn-secondary`, `.btn-danger`
- [ ] **Consistent timing** - All interactive elements use same transition token
- [ ] **Status badges** - Semantic color system (`.status-ready`, `.status-error`)
- [ ] **Form consistency** - Single `.form-group` governs all inputs
- [ ] **Focus states** - As prominent as hover states for keyboard users
- [ ] **Tables** - `border-collapse: separate` for rounded corners

### Phase 6: Accessibility
- [ ] **Color contrast** - WCAG AA minimum (4.5:1 for text)
- [ ] **Focus indicators** - Visible on all interactive elements
- [ ] **Motion preference** - Respects `prefers-reduced-motion`
- [ ] **Semantic HTML** - Proper heading hierarchy, landmarks
- [ ] **Alt text** - All images and icons have text alternatives

### Phase 7: Performance
- [ ] **CSS Triggers audit** - No animated properties that trigger layout/paint
- [ ] **Lighthouse score** - 90+ performance score
- [ ] **Bundle size** - CSS < 50KB compressed
- [ ] **Unused CSS** - PurgeCSS or similar removes dead code
- [ ] **Critical CSS** - Above-fold styles inlined

### Phase 8: Maintenance
- [ ] **Lint rules** - Stylelint configured to catch anti-patterns
- [ ] **No inline styles** - `grep -r 'style="'` returns zero results
- [ ] **Documentation** - Component library or style guide exists
- [ ] **HTMX hydration** - Icon/component initialization on `htmx:afterSwap`
- [ ] **Browser testing** - Tested in Chrome, Firefox, Safari (including fallbacks)
