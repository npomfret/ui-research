## Layout System

### Container primitives

**Why:** Reusable layout primitives eliminate "one-off" containers that drift over time. Define your grid and spacing system once, compose everywhere. Every new layout request should combine existing primitives, not spawn new CSS.

**How:**
```css
/* Main container with sensible width constraints */
.page-shell {
  position: relative;
  z-index: 1;
  width: min(1200px, 95vw); /* Never wider than 1200px, but fluid on mobile */
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

**Why `auto-fit` grids?** They collapse intelligently without media queries. A 3-column grid becomes 2-column, then 1-column based on available space. No breakpoint math required.

**Utility class philosophy:** Utilities handle 80% of layout needs without writing new CSS. But don't become Tailwind—keep utilities semantic (`.gap-md` not `.gap-4`) and coarse-grained (`.flex` not `.flex-nowrap-reverse-row`). The goal is readable HTML, not inline styling in class names.

**Anti-patterns:**
- Writing one-off containers instead of composing primitives
- Inline styles (`style="display: flex; gap: 1rem"`) that can't be audited or themed
- Over-abstracting utilities (don't need `.margin-top-3px-on-tuesdays`)
- Duplicating markup for mobile/desktop (use CSS media queries instead)

**Linting rule:** Search codebase for `style="` should return zero results. If you find inline styles, convert to utility classes or component styles.

**References:**
- [Every Layout](https://every-layout.dev/) - Layout primitives as a design system
- [CSS Grid auto-fit vs auto-fill](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/) - Understanding responsive grids
- [Utopia Fluid Type Scale](https://utopia.fyi/) - Mathematical fluid typography and spacing

### Responsive strategy

**Why:** Fluid dimensions via `clamp()` and intrinsic grids eliminate 90% of breakpoints. Media queries become exception handling, not the foundation of responsive design.

**How:**
```css
/* Fluid typography (no media queries needed) */
h1 {
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  line-height: 1.05;
}

/* Fluid padding */
body {
  padding: clamp(1.5rem, 4vw, 3rem);
}

/* Single breakpoint for major layout shifts */
@media (max-width: 768px) {
  .hero-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .button-row {
    flex-direction: column;
    align-items: stretch;
  }

  .button-row .btn {
    width: 100%;
  }
}
```

**Mobile-first vs desktop-first?** Doesn't matter with fluid design. Start with sensible defaults that work everywhere, add breakpoints only when layout fundamentally changes (horizontal to vertical button rows, collapsing nav, etc.).

**The single breakpoint philosophy:** If you have more than 2-3 breakpoints, your layout primitives are wrong. Fluid grids + clamp() should handle the continuum; breakpoints handle discrete jumps (sidebar collapse, nav transformation).

**Anti-patterns:**
- Pixel-perfect desktop designs that assume 1920px screens
- Breakpoint soup (mobile, tablet, desktop, wide, ultrawide, retina...)
- Duplicating DOM for different screen sizes
- Fixed-width containers that overflow on small screens

**Testing strategy:** Resize browser from 320px to 2560px and watch for breaks. Should be smooth except at defined breakpoints.

**References:**
- [Smashing Magazine: Practical Aspects of Modern CSS Layouts](https://www.smashingmagazine.com/2023/05/practical-aspects-modern-css-layouts/) - Fluid layout patterns
- [Modern Fluid Typography](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/) - Math behind clamp()
- [Responsive Grid Without Media Queries](https://css-tricks.com/look-ma-no-media-queries-responsive-layouts-using-css-grid/) - Auto-fit grid deep dive
