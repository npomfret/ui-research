## Core UI & UX Principles

> "UI is the saddle, the stirrups, and the reins. UX is the feeling you get being able to ride the horse." — *Dain Miller*

At its simplest: **UI is how it looks; UX is how it works.**

### 1. The Core UI Principles (Visual Language)

Visual design is about creating a clear, efficient, and emotionally resonant interface.

#### Visual Hierarchy
The arrangement of elements to imply importance.
- **Scanning Patterns:** Design for the "Z-pattern" (scanning across and down) or the "F-pattern" (text-heavy content).
- **Attention Drivers:** Direct the user's eye using scale (larger = more important), weight, and high-contrast colors for Primary CTAs.
- **Isolation:** An element with plenty of whitespace around it gains importance.

#### Grids & Spacing
The structural foundation of the layout.
- **8pt Grid System:** All spacing and sizing should be in multiples of 8 (8, 16, 24, 32...). This ensures mathematical consistency across all screen sizes and simplifies the handoff between design and engineering.
- **The Proximity Principle:** Use whitespace to group related items. If elements are close together, users perceive them as related.
- **Breathing Room:** Don't fear "empty" space; it reduces cognitive load and prevents the UI from feeling cluttered.

#### Typography & Alignment
Legibility and hierarchy through text.
- **Type Scale:** Establish a strict scale (e.g., Major Third) for headings and body text.
- **Readability:** Maintain a minimum body size of 16px and a line-height of 1.5x (150%) for optimal reading.
- **Zoom Resilience:** Text should still work when users resize to 200% and when layouts reflow down to a 320 CSS pixel viewport at 400% zoom. Avoid clipping copy inside fixed-height wrappers.
- **Alignment:** Consistent alignment (usually left-aligned for text) creates a "line" for the eye to follow, making the interface feel organized.

#### Color Theory & Shadows
Using color and depth to communicate brand and state.
- **60-30-10 Rule:** 60% dominant neutral (backgrounds), 30% secondary (components/borders), 10% accent (CTAs/links).
- **Shadows as Affordance:** Use subtle, multi-layered shadows to create depth. Avoid pure black (`#000`); instead, use a darkened version of the background color for a natural look.
- **Contrast:** Always verify contrast ratios against WCAG 2.1 AA standards (4.5:1 for normal text).

---

### 2. The Core UX Principles (Behavioral Language)

User experience is about how the user interacts with the system and how they feel about it.

#### Affordances & Signifiers
- **Affordances:** Inherent properties of an element that suggest how it can be used (e.g., a button's shape suggests it can be pressed).
- **Signifiers:** Visual cues that communicate those affordances (e.g., a "Submit" label on a button, a shadow that makes it look clickable).
- **Rule:** If an element is interactive, it must *look* interactive.

#### Feedback & States
Users need immediate confirmation for every action.
- **Immediate Response:** Transitions should be fast but smooth—typically between **150ms and 300ms**.
- **The 4 Essential States:** (See [`interaction/motion-feedback.md`](../interaction/motion-feedback.md) for implementation details)
    1. **Default:** Standard appearance indicating clickability.
    2. **Hover:** Immediate feedback when a cursor moves over the element.
    3. **Active (Pressed):** Mimics a physical press (darkening or "depressing" the element).
    4. **Disabled:** Indicates the action is currently unavailable.
- **Focus is not optional:** Treat `:focus-visible` as a first-class interaction state, not an afterthought. Keyboard users need the same clarity mouse users get from hover.
- **Hover is conditional:** Ship hover-only affordances behind `@media (hover: hover)` so touch devices do not get sticky or misleading pseudo-hover states.

#### Micro-interactions
Small, single-purpose animations that occur during interaction.
- **Bridge the Gap:** They turn mundane tasks (like toggling a switch or liking a post) into delightful, tactile experiences.
- **Confirm Success:** A subtle "check" animation after a form submission confirms the action without needing a full-page reload.

#### Accessibility (A11y)
UX is for *everyone*.
- **Target Size:** WCAG 2.2 AA sets a minimum of **24x24 CSS pixels** or enough spacing between smaller targets. For primary or high-risk controls, aim for **44x44 CSS pixels** where space allows.
- **Keyboard Navigation:** Every interactive element must be reachable and operable via the keyboard (`Tab`, `Enter`, `Space`).
- **Semantic HTML:** Use the right tags for the right job (`<button>` for actions, `<a>` for navigation).
- **Visible Focus:** Focus indicators need enough area and contrast to remain obvious, and sticky UI should never fully obscure the focused control.
- **Accessible Names:** Icon-only controls need a real accessible name from visible text, `aria-label`, or `aria-labelledby` rather than tooltip-only labeling.

---

**References:**
- [W3C: Understanding SC 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text) - 200% text resizing without loss of content
- [W3C: Understanding SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow) - 320 CSS px / 400% zoom layout expectations
- [W3C: Understanding SC 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) - 24x24 CSS px AA target size and spacing exceptions
- [W3C: Understanding SC 2.5.5 Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced) - 44x44 CSS px AAA guidance for larger controls
- [MDN: `hover` media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover) - Detect whether the primary input can conveniently hover
- [MDN: `<button>` accessibility](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Button) - Accessible names and native button behavior
