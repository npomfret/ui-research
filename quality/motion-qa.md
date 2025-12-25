## Motion QA Playbook

This document centralizes the verification workflow we previously scattered across accessibility and tooling notes. Run it for every PR that touches animation tokens, scroll timelines, or view transitions.

### 1. Visual regression evidence
- Capture Chromatic (or Storybook screenshot) diffs with animations paused via the “Disable CSS animations” add-on.
- For flows that depend on motion, attach Playwright/Cypress video captures so reviewers can scrub frame-by-frame.

### 2. Performance traces
- Record Chrome DevTools Performance + Animations traces on high-end and throttled devices.
- Highlight scroll-driven timelines, dropped frames, and any long tasks >50 ms.
- When view transitions are involved, expand `document.activeViewTransition` in the console to prove shared elements are registered and reduced-motion short-circuits the API.

### 3. Reduced-motion validation
- Toggle OS-level `prefers-reduced-motion` (macOS Accessibility → Display, Windows Ease of Access → Display) and repeat the scenario; attach a short video or GIF.
- If the product exposes an in-app “Reduce motion” toggle, automate it via Cypress/Playwright and attach the recorded run.

### 4. Feature-detection tests
- Add unit/integration tests that stub `document.startViewTransition` and `CSS.supports('animation-timeline: scroll()')` to assert both enhanced and fallback paths render correctly.
- Ensure scroll timelines pause by setting `animation-timeline: none` inside the reduced-motion media query; include a DOM snapshot diff showing the pause state.

### 5. Reviewer checklist (drop these bullets into PR descriptions)
- [ ] Chromatic/Playwright artifacts attached
- [ ] DevTools trace uploaded (`.json` or `.trace`) showing no dropped frames
- [ ] Reduced-motion screen recording attached
- [ ] Tests cover enhanced + fallback paths
- [ ] Accessibility team (or QA lead) signed off on motion changes

### References
- [Chromatic docs: Animation testing](https://www.chromatic.com/docs/animation-testing)
- [Chrome DevTools Recorder: Scroll-driven animations](https://developer.chrome.com/docs/devtools/recorder/scroll-driven-animations/)
- [Chrome Animation Policy extension](https://chromewebstore.google.com/detail/animation-policy/ncigbofjfbodhkaffojakplpmnleeoee)
