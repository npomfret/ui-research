## Implementation Checklist

Use this checklist when implementing or auditing a UI built with these patterns:

### Phase 0: Design Process
- [ ] **Research mix chosen** - Generative and evaluative methods selected for the problem, not just a single validation pass
- [ ] **User Flow defined** - Story mapping complete, entry/exit points identified
- [ ] **Wireframes approved** - Functionality and hierarchy validated in low-fidelity
- [ ] **Design System synced** - Figma components match codebase tokens/components
- [ ] **Prototypes tested** - High-fidelity interactions validated with real users
- [ ] **Accessibility considered early** - Focus/Tab order and ARIA needs identified

### Phase 1: Foundation
- [ ] **8pt Grid System** - All spacing/sizing is in multiples of 8 (8, 16, 24, 32...)
- [ ] **Visual Hierarchy** - Scanning patterns (Z/F) and attention drivers (scale/weight) used
- [ ] **Design tokens defined** - All colors, spacing, radii, shadows in `:root`
- [ ] **Token tiers** - Raw/system, semantic, and component tokens have distinct jobs
- [ ] **Semantic naming** - Tokens use role names (`--accent-teal`, not `--color-1`)
- [ ] **No raw values** - Zero hex colors or px values outside `:root`
- [ ] **60-30-10 Color Rule** - 60% neutral, 30% secondary, 10% accent applied
- [ ] **Natural Shadows** - Multi-layered, low opacity, no pure black (`#000`)
- [ ] **Animated background** - Two `::before`/`::after` pseudo-elements on body, animating over 20-30s
- [ ] **Background non-blocking** - Fixed positioning, `pointer-events: none`, `z-index: 0`

### Phase 2: Layout Primitives
- [ ] **Container system** - `.page-shell` for max-width + centering
- [ ] **Responsive grids** - `.split-grid`, `.stats-grid` using `auto-fit`
- [ ] **Container queries** - Reusable modules respond to their parent width when viewport breakpoints are too coarse
- [ ] **Utility classes** - Flex/spacing/alignment helpers (`.flex`, `.gap-md`, etc.)
- [ ] **Fluid typography** - All font sizes use `clamp(min, preferred, max)`
- [ ] **Minimal breakpoints** - 0-2 media queries for the entire site
- [ ] **Reflow passes** - Ordinary content works at 320 CSS px / 400% zoom without two-dimensional scrolling

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
- [ ] **Hover gated** - Hover-only effects live inside `@media (hover: hover)`
- [ ] **Reduced motion** - `@media (prefers-reduced-motion: reduce)` implemented
- [ ] **Runtime listener** - `MediaQueryList` change listener for accessibility toggle
- [ ] **GPU-friendly** - Only animating `transform` and `opacity`
- [ ] **Scroll timelines** - `@scroll-timeline` / `animation-timeline` used where supported with `@supports` fallback to IntersectionObserver
- [ ] **View transitions gated** - `document.startViewTransition` feature-detected, wrapped in `prefers-reduced-motion` + escape hatch
- [ ] **Overflow-safe transitions** - No shared elements wrapped in `overflow: hidden`; use `overflow: clip` or nested `::view-transition-group()` when needed
- [ ] **Motion tokens** - Duration, easing, and keyframes centralized so hover, press, and scroll cues stay consistent
- [ ] **QA hooks** - Snapshot tooling (Chromatic/Playwright) configured to pause/compare motion states; Animations panel recordings captured for critical flows

### Phase 5: Components
- [ ] **Button states** - All 4 states (Default, Hover, Active, Disabled) implemented
- [ ] **Focus-visible state** - Keyboard focus styling is as clear as hover and survives custom theming
- [ ] **Feedback timing** - Interactions respond within 150-300ms
- [ ] **Button variants** - `.btn-primary`, `.btn-secondary`, `.btn-danger`
- [ ] **Consistent timing** - All interactive elements use same transition token
- [ ] **Disabled semantics** - Native controls use `disabled`; `aria-disabled` is reserved for discoverable custom or intentionally focusable controls
- [ ] **Status badges** - Semantic color system (`.status-ready`, `.status-error`)
- [ ] **Form consistency** - Single `.form-group` governs all inputs
- [ ] **Focus states** - Highly visible (3:1 contrast) and consistent with hover
- [ ] **Tables** - `border-collapse: separate` for rounded corners

### Phase 6: Accessibility
- [ ] **Touch Targets** - WCAG AA minimum 24x24 CSS px or sufficient spacing; aim for 44x44 on primary or risky actions
- [ ] **Semantic HTML** - `<button>` for actions, `<a>` for navigation
- [ ] **Accessible Names** - Icon-only buttons have visible text, `aria-label`, or `aria-labelledby`, not title-only labeling
- [ ] **Color contrast** - WCAG AA minimum (4.5:1 for text)
- [ ] **Focus indicators** - Visible on all interactive elements
- [ ] **Focus not obscured** - Sticky headers, snackbars, drawers, and chat widgets never fully hide the focused control
- [ ] **Motion preference** - Respects `prefers-reduced-motion`
- [ ] **Text resize** - 200% text enlargement does not clip or hide content
- [ ] **Zoom and reflow** - 400% zoom / 320 CSS px still preserves ordinary content and controls
- [ ] **Heading hierarchy** - Logical `<h1>`-`<h6>` structure
- [ ] **Alt text** - All images and icons have text alternatives

### Phase 7: Performance
- [ ] **CSS Triggers audit** - No animated properties that trigger layout/paint
- [ ] **Lighthouse score** - 90+ performance score
- [ ] **Bundle size** - CSS < 50KB compressed
- [ ] **Unused CSS** - PurgeCSS or similar removes dead code
- [ ] **Critical CSS** - Above-fold styles inlined
- [ ] **WSG alignment** - Map performance/infra work to the sustainability criteria in [`research/emerging-web-technologies.md`](../research/emerging-web-technologies.md#sustainable-web-development)

### Phase 8: Maintenance
- [ ] **Lint rules** - Stylelint configured to catch anti-patterns
- [ ] **No inline styles** - `grep -r 'style="'` returns zero results
- [ ] **Documentation** - Component library or style guide exists
- [ ] **HTMX hydration** - Icon/component initialization on `htmx:afterSwap`
- [ ] **Browser testing** - Tested in Chrome, Firefox, Safari (including fallbacks)
- [ ] **Motion QA artifacts** - Every motion change links Chromatic/Playwright snapshots, DevTools animation traces, and reduced-motion video captures (see [`quality/motion-qa.md`](../quality/motion-qa.md))
