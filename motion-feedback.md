## Motion & Feedback

### Scroll-triggered reveals

**Why:** Guides attention, improves perceived performance when data arrives incrementally. Scroll-triggered animations create a sense of progression and make content feel "built for you" rather than dumped on the page. But the key is subtlety—users should notice the polish, not the animation.

**How:**
```javascript
// Use IntersectionObserver, never scroll events
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const target = entry.target;
      target.classList.add('is-visible');
      observer.unobserve(target); // One-time reveal
    }
  });
}, {
  threshold: 0.25, // Trigger when 25% of element is visible
  rootMargin: '0px 0px -10% 0px' // Offset trigger point
});

document.querySelectorAll('[data-animate]').forEach(node => {
  const delay = Number(node.dataset.delay || 0);
  node.style.transitionDelay = `${delay}ms`;
  observer.observe(node);
});
```

```css
/* Fade-up animation utility */
.fade-up {
  opacity: 0;
  transform: translateY(35px);
  transition: opacity 900ms ease, transform 900ms ease;
}

.fade-up.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered reveals via data-delay */
.fade-up[data-delay="100"] { transition-delay: 100ms; }
.fade-up[data-delay="200"] { transition-delay: 200ms; }
```

```css
/* Native scroll-driven reveal, with graceful fallback */
@scroll-timeline hero-timeline {
  source: auto;
  orientation: block;
}

.fade-up {
  animation: fade-up 0.9s ease both;
  animation-timeline: hero-timeline;
  animation-range: entry 20% exit 60%;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(35px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@supports not (animation-timeline: scroll()) {
  .fade-up {
    animation: none;
  }
}
```

Chrome/Edge/Safari 17.4+ now ship `@scroll-timeline`, `animation-timeline`, and `animation-range`, so you can scrub animations directly off scroll progress, while Chrome 145 layers on declarative scroll-triggered animations for once-per-section reveals. Scope complex narratives with `timeline-scope` so one timeline can orchestrate multiple elements. Treat these APIs as progressive enhancement—feature-detect them and fall back to the IntersectionObserver pattern above so older browsers still get reveals.

```css
/* timeline-scope drives multiple child timelines from one section */
.feature-section {
  timeline-scope: --cards, --progress;
}

@scroll-timeline --cards {
  source: selector(.feature-section);
  orientation: block;
}

.feature-card {
  animation: float-in 0.8s cubic-bezier(0.2, 0.8, 0.3, 1) both;
  animation-timeline: --cards;
  animation-range: entry 10% exit 70%;
}

@keyframes float-in {
  from { opacity: 0; transform: translateY(40px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

**Respecting motion preferences:** Always provide escape hatch for users with vestibular disorders:
```css
@media (prefers-reduced-motion: reduce) {
  .fade-up {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

When you opt into scroll timelines, remember you can also short-circuit them with `animation-timeline: none` (or `animation: none`) inside the same media query to halt the timeline entirely for users who request reduced motion.

```javascript
// Listen for runtime changes to motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const handleMotionPreference = (event) => {
  if (event.matches) {
    // User enabled reduced motion
    document.querySelectorAll('.fade-up').forEach(el => el.classList.add('is-visible'));
  } else {
    // User disabled reduced motion - initialize animations
    animate();
  }
};

handleMotionPreference(prefersReducedMotion);
prefersReducedMotion.addEventListener('change', handleMotionPreference);
```

**Why IntersectionObserver?** Scroll event listeners fire 60+ times per second and force synchronous layout calculations. IntersectionObserver is async, batched, and doesn't block the main thread. Performance difference is dramatic on low-end devices.

**Anti-patterns:**
- Scroll event listeners firing `classList` mutations on every frame instead of IntersectionObserver or scroll timelines
- Long-running reveals (>1s) that compete with layout and overwhelm hierarchy
- Animating layout-affecting properties (`top`, `left`, `width`, `height`) rather than GPU-friendly transforms/opacity
- `overflow: hidden` on animated parents, which clips drop shadows/view-transition layers—use masks or wrappers instead
- Skipping `prefers-reduced-motion` escapes or runtime toggles
- Shipping scroll timelines/view transitions without `@supports`/feature detection fallbacks

**References:**
- [MDN: IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - API documentation
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) - Accessibility requirement
- [MDN: CSS scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) - `@scroll-timeline`, `animation-range`, `timeline-scope`
- [Chrome Developers: Scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations) - Native scroll narratives + reduced-motion guidance
- [Chromium Blog: Scroll-triggered animations in CSS](https://developer.chrome.com/blog/scroll-driven-animations-stable/) - Chrome 145 declarative triggers roadmap
- [Scroll-Linked Animations Proposal](https://drafts.csswg.org/scroll-animations-1/) - Spec text for future features
- [Web.dev: IntersectionObserver](https://web.dev/intersectionobserver/) - Performance implications

### Interaction states

**Why:** Consistent transitions create a cohesive "feel" across the entire interface. Users develop muscle memory for timing—when every button has different hover behavior, the UI feels janky even if each individual animation is polished.

**How:**
```css
/* Single transition token for entire app */
:root {
  --transition: 320ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* Button hover states */
.btn {
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.btn:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 15px 30px rgba(15, 23, 42, 0.35);
}

/* Tab hover states - same timing, different visual */
.tab-btn {
  transition: var(--transition);
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--accent-teal);
}
```

**Why these easing curves?**
- `cubic-bezier(0.22, 1, 0.36, 1)` - Natural "ease-out" that feels springy
- Default `ease` is too slow and linear
- `ease-in-out` is too symmetrical for UI (looks robotic)

**The 2px rule:** Hover transforms should be subtle. `translateY(-2px)` lifts the element just enough to notice; larger values feel cartoonish. Same principle as our 24s background animation—subliminal, not spectacular.

**Anti-patterns:**
- Inconsistent timing (some buttons 200ms, others 500ms)
- Spectacular hover effects on some controls, none on others
- Animating `box-shadow` alone (causes jitter)—combine with `transform`
- Using `transition: all` (animates everything, kills performance)
- Hover effects on mobile (no hover state exists—use `:active` instead)

**Accessibility note:** Ensure focus states are as prominent as hover states. Keyboard users deserve the same feedback as mouse users.

**References:**
- [Material Design: Motion](https://material.io/design/motion/understanding-motion.html) - Why timing matters
- [Cubic-bezier.com](https://cubic-bezier.com/) - Visual easing function editor
- [Val Head: Designing Safer Web Animation](https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/) - Motion sensitivity considerations
- [Josh Comeau: Animated Buttons](https://www.joshwcomeau.com/animation/css-transitions/) - Deep dive on button animations

### Native transition APIs (2025+)

CSS finally caught up with real app needs—use the new primitives instead of brittle JS class toggles.

**Entry/exit animations without hacks:** `@starting-style` lets you define the hidden state for elements toggled from `display: none`, while `transition-behavior: allow-discrete` makes `display`, `visibility`, and `content-visibility` animatable.
```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 280ms var(--transition),
    transform 280ms var(--transition),
    visibility 0s linear 280ms;
  transition-behavior: allow-discrete;
}

.toast[hidden] {
  visibility: hidden;
  opacity: 0;
  transform: translateY(12px);
}

@starting-style {
  .toast {
    opacity: 0;
    transform: translateY(12px);
  }
}
```

**Cross-document view transitions:** Chrome (and soon Firefox) now lets you animate full page navigations with a single API call:
```javascript
const supportsViewTransitions = typeof document.startViewTransition === 'function';

if (supportsViewTransitions) {
  document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', (event) => {
      const url = new URL(link.href, location.origin);
      if (url.origin !== location.origin) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      event.preventDefault();
      const transition = document.startViewTransition(() => router.navigate(url.pathname));

      transition.ready.then(() => {
        console.log('transition ready', document.activeViewTransition);
      });

      transition.finished.finally(() => {
        console.log('transition finished');
      });
    });
  });
}
```
Then style shared elements with `view-transition-name` and pseudo-elements:
```css
.hero-card {
  view-transition-name: hero-card;
}

::view-transition-old(hero-card),
::view-transition-new(hero-card) {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}
```

**Guidelines:**
- Always short-circuit transitions when `prefers-reduced-motion: reduce`.
- Keep navigation transitions under ~500 ms; the perceived “teleport” speed matters more than elaborate flourishes.
- IntersectionObserver still handles in-page reveals; view transitions shine when state spans routes, dialogs, or tab navigations.
- Avoid wrapping shared elements in `overflow: hidden` containers—clip paths break `::view-transition-*` snapshots. If you need reveal masks, place them inside the shared element or use nested `::view-transition-group()` scopes now available in Chrome 140+.
- Chrome 139+ exposes view-transition nodes in DevTools’ Animations panel, while Chrome 142 adds `document.activeViewTransition` for runtime introspection. Use these to debug paint flashes, z-index issues, and to ensure you pause transitions when reduced-motion is enabled.

**References:**
- [Web.dev: @starting-style](https://web.dev/articles/starting-style) - Animate elements entering the DOM
- [MDN: transition-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior) - Discrete property transitions
- [Chromium Blog: View Transitions API](https://developer.chrome.com/blog/view-transitions/) - Cross-document navigation animations
- [Chrome for Developers: Nested view-transition groups](https://developer.chrome.com/blog/view-transitions-updates/#nested-groups) - Scoped transitions + DevTools
- [Stack Overflow: View Transitions and `overflow: hidden`](https://stackoverflow.com/questions/77476760/how-to-animate-clip-path-with-new-view-transitions-api) - Why clipping breaks snapshots (and how to work around it)

### Motion QA & Tooling

Your motion system deserves the same QA discipline as any data path.

- **Automate visual regression checks:** Treat motion tokens like design tokens—capture before/after frames in Storybook and run Chromatic (or Playwright video captures) so animation tweaks surface as PR diffs. Chromatic’s “Disable CSS animations” add-on helps confirm static states still look good when motion is reduced.
- **Record timelines in DevTools:** Chrome’s Animations + Recorder panels log scroll timelines, view-transition stages, and dropped frames. Pair with throttled CPU/GPU profiles to ensure 60 fps on low-end hardware.
- **Toggle motion quickly:** Install the Chrome Accessibility Developer Tools or the official “Animation Policy” extension to pause, slow, or disable CSS animations on demand while testing scenarios like `prefers-reduced-motion`.
- **Test both enhanced and fallback paths:** Feature-detect scroll timelines and `document.startViewTransition` in integration tests so you explicitly assert that the IntersectionObserver fallback (or instant navigation) still works when the native API is absent.
- **Exercise runtime toggles:** If you expose a “Reduce motion” setting, write Cypress/Playwright tests that flip it mid-session and verify animations cancel (`animation-play-state: paused`) and then resume when toggled back on.

**References:**
- [Chromatic docs: Visual tests for animation-heavy UIs](https://www.chromatic.com/docs/animation-testing) - Strategies for consistent regression coverage
- [Chromatic blog: How to spot animation regressions](https://www.chromatic.com/blog/designers-guide-to-animation-testing/) - Practical heuristics + disable-animation tips
- [Chrome Web Store: Animation Policy extension](https://chromewebstore.google.com/detail/animation-policy/ncigbofjfbodhkaffojakplpmnleeoee) - Pause/slow CSS animations for debugging
- [Chrome DevTools Docs: Record scroll-driven animations](https://developer.chrome.com/docs/devtools/recorder/scroll-driven-animations/) - Profiling scroll timelines & view transitions
### Button micro-interactions

Micro interactions keep buttons feeling tactile:
- Layer two effects: a quick lift/scale plus a glow or gradient sweep. Keep movement under 2px so actions feel precise, not floaty.
- Drive highlights with pseudo-elements and CSS variables so every button variant shares the same timing token.
- Sequence states intentionally—hover (~180 ms) glides up, active (~80 ms) compresses back down, focus adds a high-contrast outline so keyboard flows feel equally rich.

Need inspiration? Check Josh Comeau’s “Tactile buttons” breakdown or search [CodePen’s button micro-interactions](https://codepen.io/search/pens?q=button%20microinteraction) to copy timing curves into your token set.

### CSS scroll-driven animations

Modern browsers ship scroll timelines so you can sync motion with scroll without JavaScript:
- Use `animation-timeline: scroll(block)` for progress bars, table-of-contents highlights, or hero masks that reveal as the reader advances.
- For card reveals, hook into `animation-timeline: view()` so each element animates as it enters the viewport; tune `animation-range` to cap how much motion occurs.
- Wrap timelines in `@supports (animation-timeline: scroll())` and fall back to the IntersectionObserver pattern above for browsers that haven’t caught up, and always disable scroll-linked motion when `prefers-reduced-motion: reduce`.

References: [MDN scroll-driven animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations) and the [Chrome samples](https://github.com/GoogleChromeLabs/web-animations-js) include runnable demos you can adapt.
