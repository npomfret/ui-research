## 4. Motion & Feedback

### 4.1. Scroll-triggered reveals

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
- Scroll event listeners firing `classList` mutations on every frame
- Long-running animations (>1s) that compete with layout
- Animating properties other than `transform`/`opacity`
- Not providing `prefers-reduced-motion` escape hatch
- Chaining animations that require JavaScript orchestration

**References:**
- [MDN: IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) - API documentation
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) - Accessibility requirement
- [Scroll-Linked Animations Proposal](https://drafts.csswg.org/scroll-animations-1/) - Future native scroll-linked animations
- [Web.dev: IntersectionObserver](https://web.dev/intersectionobserver/) - Performance implications

### 4.2. Interaction states

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
