## Layered Foundations

### Design tokens first, pixels later

**Why:** Centralized tokens (`--accent-teal`, `--radius-lg`, `--shadow-soft`) guarantee visual coherence and make global tweaks (e.g., brand color shifts) cheap. Tokens enable systematic design changes without find-and-replace hell. When your PM wants to "make it more purple," you change one variable instead of hunting through 40 files.

**How:**
```css
:root {
  /* Semantic color system */
  --bg-base: #05060a;
  --bg-elevated: rgba(9, 11, 25, 0.65);
  --glass-border: rgba(255, 255, 255, 0.07);
  --text-primary: #f8fafc;
  --text-muted: rgba(248, 250, 252, 0.7);

  /* Accent palette */
  --accent-teal: #34d399;
  --accent-cyan: #22d3ee;

  /* Spatial system */
  --radius: 18px;
  --radius-lg: 28px;
  --shadow-soft: 0 20px 45px rgba(5, 6, 10, 0.45);

  /* Motion system */
  --transition: 320ms cubic-bezier(0.22, 1, 0.36, 1);
}
```

Use `clamp()` for fluid typography that responds to viewport without media queries:
```css
font-size: clamp(1.5rem, 5vw, 3.5rem); /* min, preferred, max */
padding: clamp(1.5rem, 4vw, 3rem);
```

**Anti-patterns:**
- Mixing raw hex values (`#34d399`) with tokens in the same codebase
- Defining tokens that never get used (lint for dead CSS variables)
- Over-tokenizing (don't create `--button-hover-shadow-on-tuesday`)

**Why this works:** Browsers optimize CSS custom property lookups. Tokens add negligible runtime cost while making theme switching, dark mode, and A/B testing trivial. See [CSS Custom Properties on MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for performance characteristics.

**References:**
- [Design Tokens W3C Community Group](https://design-tokens.github.io/community-group/format/) - Cross-platform token format specification
- [Style Dictionary](https://amzn.github.io/style-dictionary/) - Build system for design tokens
- [Open Props](https://open-props.style/) - Modern token system you can adopt wholesale

### Atmospheric backdrops without layout hacks

**Why:** Animated gradients plus blurred aurora layers create depth that makes glass surfaces meaningful. Static backgrounds feel flat; subtle motion adds life without distraction. The key is *subliminal* animation—users shouldn't consciously notice it, but should feel the UI is "alive."

**How:**
```css
body::before,
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none; /* Critical: don't block interaction */
  z-index: 0;
}

body::before {
  background:
    radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.4), transparent 55%),
    radial-gradient(circle at 80% 0%, rgba(236, 72, 153, 0.35), transparent 60%);
  filter: blur(25px);
}

body::after {
  background:
    radial-gradient(circle at 40% 80%, rgba(34, 211, 238, 0.35), transparent 60%),
    radial-gradient(circle at 80% 60%, rgba(52, 211, 153, 0.25), transparent 75%);
  animation: aurora 24s ease-in-out infinite alternate;
}

@keyframes aurora {
  0%   { transform: translateY(0); opacity: 0.8; }
  50%  { transform: translateY(-40px); opacity: 0.65; }
  100% { transform: translateY(20px); opacity: 0.85; }
}
```

**Why 24 seconds?** Anything faster feels jittery; anything slower feels static. 20-30s hits the sweet spot where motion is perceivable but not distracting.

**Anti-patterns:**
- Parallax scroll handlers that fire on every scroll event (causes jank)
- Animating `background-position` with `background-size: cover` (forces expensive repaints)
- Forgetting `pointer-events: none` (blocks all clicks on the page!)

**Performance notes:** Only animate `transform` and `opacity`—these are GPU-accelerated and don't trigger layout/paint. Check [CSS Triggers](https://csstriggers.com/) before animating any property. `transform` triggers composite only; `background-position` triggers paint on every frame.

**References:**
- [High Performance Animations](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/) - Why transform/opacity matter
- [CSS Triggers](https://csstriggers.com/) - Which CSS properties trigger layout/paint/composite
- [Stripe gradient backgrounds](https://stripe.com/) - Production example of animated gradients at scale
