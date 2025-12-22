# Web UI Anti-Patterns, Mistakes, and Outdated Techniques

Use this appendix when auditing legacy stacks or onboarding new teams. [anti-patterns.md](./anti-patterns.md) lists release-blocking issues specific to the modern UI playbook; this file zooms out to industry-wide pitfalls that still crop up in reviews.

---

## Outdated Techniques & Their Modern Alternatives

These are practices that were once common but have been largely replaced by better, more efficient, and more powerful methods.

| Outdated Technique | Problem | Modern Alternative |
| :--- | :--- | :--- |
| **jQuery for DOM Manipulation** | Imperative, verbose, and inefficient for complex UIs. Does not scale well. | **Declarative UI Frameworks** (React, Vue, Svelte) that manage the DOM for you, leading to more predictable and maintainable code. |
| **Table-Based Layouts** | Unsemantic, inflexible, and terrible for responsive design. | **CSS Grid & Flexbox**. Grid for two-dimensional page layouts and Flexbox for one-dimensional component alignment. |
| **Floats for Layout** | Prone to collapsing parent containers and complex clearing hacks (`clearfix`). | **CSS Grid & Flexbox**. These are designed for layout and handle alignment and positioning robustly. |
| **CSS Sprites** | Combining multiple images into one to reduce HTTP requests. | **HTTP/2**. With multiplexing, the overhead of multiple requests is negligible. Use SVGs for icons and optimized formats like WebP for images. |
| **Manual JS/CSS Bundling** | Using simple concatenation for files. Inefficient and hard to manage dependencies. | **Module Bundlers** (Vite, Webpack, Parcel). They handle dependency graphing, tree-shaking (removing unused code), and code-splitting automatically. |
| **Flash, Silverlight, Applets** | Proprietary, insecure, not supported on mobile, and now defunct. | **HTML5 `<canvas>`, WebGL, CSS Animations, and WASM**. These are powerful, open web standards for rich media and interactivity. |
| **Using `px` for Everything** | Not scalable or accessible. Font sizes and spacing don't adapt to user preferences or different viewports. | **Relative Units**. Use `rem` for font-sizes and spacing, `em` for context-specific sizing, and `clamp()` for fluid typography. Use `px` only for things that should never scale, like borders. |

---

## CSS & Layout Anti-Patterns

Mistakes in CSS that lead to fragile, hard-to-maintain stylesheets.

- **Overusing `!important`**: This is a code smell that indicates high specificity or a poorly structured cascade. It makes debugging a nightmare. **Solution:** Refactor CSS to use lower specificity selectors and proper cascade management.
- **Deeply Nested, High-Specificity Selectors**: `div.container #main .sidebar ul li a` is extremely brittle. A small HTML change can break the style. **Solution:** Use flat, class-based selectors (like BEM) to keep specificity low and styles reusable.
- **"Magic Numbers"**: Using arbitrary, hard-coded pixel values (e.g., `margin-top: 37px;`) that work for one specific case but break easily. **Solution:** Use layout tools (Grid, Flexbox), spacing systems based on tokens (`--space-md`), or relative units.
- **Not Using a CSS Reset/Normalizer**: Relying on default browser styles leads to inconsistencies across different browsers. **Solution:** Start every project with a modern CSS reset (like `modern-normalize`) to create a consistent baseline.
- **Mixing Concerns**: Using layout utilities for things other than layout (e.g. `.text-red-500`) can be a sign of poor abstraction, though this is the core of utility-first CSS. The anti-pattern is more about ad-hoc styling that doesn't fit into a design system. **Solution:** Adhere to a consistent methodology (Utility-first, BEM, CSS-in-JS, etc.)

---

## Performance Anti-Patterns

Common practices that degrade the user experience by making a site slow and unresponsive.

- **Render-Blocking Resources**: Placing `<script>` tags in the `<head>` without `defer` or `async`. The browser must download and execute the script before rendering any HTML. **Solution:** Always use `defer` for scripts that are needed but not critical for the initial paint. Place CSS in the `<head>` to avoid it blocking rendering later.
- **Unoptimized Images**: Shipping huge, uncompressed images is the #1 cause of slow websites. **Solution:** Use modern image formats like **WebP** or **AVIF**, compress images, and use the `<picture>` element or `srcset` to serve appropriately sized images for different devices. Lazy-load images that are off-screen.
- **Large JavaScript Bundles**: Shipping an entire application's JS on the initial page load, even code for routes the user hasn't visited. **Solution:** Implement **code-splitting** on a per-route or per-component basis. Use dynamic `import()` to load code only when it's needed.
- **No Caching Strategy**: Forcing users to re-download all assets on every visit. **Solution:** Configure server caching headers (`Cache-Control`) correctly for static assets. Use a CDN to cache assets at the edge, closer to the user.
- **Layout Thrashing**: Repeatedly and synchronously reading and then writing to the DOM in JavaScript (e.g., reading an element's `offsetHeight` inside a loop that also changes styles). This forces the browser into a cycle of expensive layout recalculations. **Solution:** Batch DOM reads and writes. Perform all reads first, then all writes.

---

## Accessibility (A11y) Common Mistakes

These mistakes can make your site unusable for people with disabilities.

- **Non-Semantic HTML**: Using `<div>` for everything, especially interactive elements like buttons (`<div onClick={...}>`). **Solution:** Always use the correct semantic HTML element for the job (`<button>`, `<nav>`, `<main>`, `<a>`). This provides accessibility and functionality for free.
- **Poor Color Contrast**: Text that is hard to read against its background. **Solution:** Use tools to ensure color contrast meets WCAG AA or AAA standards (4.5:1 for normal text).
- **Missing or Vague `alt` Text**: Images without descriptive alt text are invisible to screen reader users. `alt="image"` is useless. **Solution:** Write a concise description of the image's content and purpose. If the image is purely decorative, use an empty alt attribute: `alt=""`.
- **No Visible Focus State**: Removing the default `outline` on focused elements without providing a replacement. Keyboard users have no idea where they are on the page. **Solution:** Never remove outlines without a better alternative. Use the `:focus-visible` pseudo-class to style focus indicators only for keyboard users.
- **Inaccessible Forms**: Inputs without associated `<label>` tags. Screen readers cannot announce what the input is for. **Solution:** Always connect inputs to labels using `for` and `id` attributes, or by wrapping the input within the label.

---

## UI/UX Design Anti-Patterns

Design choices that actively frustrate or confuse users.

- **Cluttered & Overloaded Interfaces**: Trying to show everything at once. This leads to cognitive overload and makes it impossible for users to find what they need. **Solution:** Embrace whitespace. Prioritize information and use progressive disclosure to reveal complexity as needed.
- **Inconsistent Design**: Using different styles for the same type of element (e.g., buttons, links) across the site. This erodes trust and makes the UI unpredictable. **Solution:** Build and adhere to a strict design system, even a simple one.
- **"Mystery Meat" Navigation**: Using icons for navigation without text labels. Users shouldn't have to guess what an icon does. **Solution:** Always pair icons with clear, visible text labels, especially for primary navigation.
- **Content Carousels/Sliders**: They often have poor accessibility, hide information, and studies show users rarely interact with them beyond the first slide. **Solution:** A well-designed grid or a simple stack of content is almost always more effective.
- **Dark Patterns**: Deceptive UI designed to trick users into doing things they didn't mean to, like signing up for a newsletter or making a purchase. Examples include "Confirmshaming" ("No thanks, I hate saving money") or making it impossibly difficult to cancel a subscription. **Solution:** Be ethical. Prioritize user trust over short-term metrics.
