# Mobile Web Apps for Data-Heavy Products

## Context

This report consolidates `web-report1.md`, `web-report2.md`, and `web-report3.md` into one practical reference for modern in-browser mobile web apps on current iPhone and Android phones.

The focus is not generic marketing sites. It is dense products with charts, tables, filters, controls, drill-down views, editing flows, and app-like navigation.

## Executive Summary

The right mental model is not "make the desktop dashboard responsive." It is "design a touch-first data product that happens to share business logic with desktop."

For this category of app, the biggest mobile wins are:

- build around dynamic viewports, safe areas, and software keyboards
- reduce simultaneous density and move secondary detail into drill-down flows
- use native scrolling and browser gestures wherever possible
- treat tables and charts as specialized mobile interaction systems, not shrunk desktop widgets
- optimize for mid-tier Android performance and Safari memory limits

The biggest failure modes are:

- `100vh` layouts
- hover-dependent UI
- nested scrolling everywhere
- tiny controls and dense toolbars
- desktop modal patterns on phones
- large DOM trees for rows, cells, and SVG points
- custom gestures that fight browser back, zoom, or vertical scrolling

## Platform Reality

### iPhone

- Safari defines the platform behavior in practice.
- Browser engine behavior is relatively consistent because iOS browsers are still largely constrained by WebKit platform behavior.
- Home Screen web apps have become more capable, including Web Push and badging, but they still require more deliberate user opt-in than Android.
- Safari is less tolerant of memory-heavy pages and long-lived leaking views than Chrome on Android.

### Android

- Chrome is the main target, but device and browser variation are wider.
- Installability and PWA behavior are stronger and more straightforward.
- Keyboard behavior, viewport changes, and performance variability are more fragmented across OEM devices.
- Mid-range phones expose main-thread and rendering problems much faster than flagship test devices.

### Practical takeaway

If a feature is fragile under:

- dynamic toolbars
- changing visual viewport height
- virtual keyboard appearance
- weak CPU / weak GPU conditions

then it is not yet production-ready for mobile web.

## What To Avoid

### 1. Desktop compression

Do not preserve the desktop information architecture on a phone by shrinking everything.

Avoid:

- wide multi-pane dashboards
- 8-12 visible table columns
- chart + filter rail + inspector all on one screen
- icon-only action clusters

Replace with one primary task per screen:

- scan
- filter
- compare
- inspect
- edit

### 2. Hover as a core interaction

Do not hide critical information behind hover:

- chart values
- row actions
- sort affordances
- secondary controls

Phones need visible defaults, tap-reveal, or pinned states.

### 3. Nested scroll containers by default

Nested scrolling creates gesture ambiguity and broken context. It is acceptable only for clearly bounded surfaces such as:

- horizontally scrollable comparison tables
- zoomable charts
- dedicated sheets with finite content

Everything else should usually collapse back to page scroll.

### 4. Complex work in small centered modals

For mobile:

- bottom sheets are for selection and short tasks
- full-screen routes are for editing, filtering, reviewing, or multi-step work
- dialogs are for confirmation only

Centered desktop-style modals are usually the wrong primitive.

### 5. Gesture hijacking

Avoid blocking:

- vertical scroll
- pinch zoom
- edge back swipe
- pull-to-refresh unless there is a strong reason

If you must take control, scope it tightly with `touch-action`.

### 6. `100vh`

Do not use `100vh` for app shells or full-height panels on phones. URL bars and keyboards make it unreliable.

Use:

- `100dvh` for layouts that should track the visible viewport
- `100svh` for a stable minimum visible height
- `100lvh` only when you intentionally want the largest possible viewport state

### 7. Animating layout-triggering properties

Animating `width`, `height`, `top`, `left`, `margin`, or `padding` forces layout and paint on every frame. On mobile GPUs this causes dropped frames even on modern devices.

Only animate `transform` and `opacity` — these are compositor-only and do not trigger layout.

```css
/* Bad */
.panel { transition: height 0.3s; }

/* Good */
.panel { transform: translateY(100%); transition: transform 0.3s; }
.panel.open { transform: translateY(0); }
```

### 8. Huge DOM and SVG trees

Avoid:

- thousands of mounted rows
- large always-live tab panels
- heavy SVG charts with many active nodes
- continuous resize and layout recomputation

Virtualize, defer, and unmount aggressively.

## Modern Techniques Worth Using

### Dynamic viewport units

These are baseline modern mobile web tools now:

- `svh`
- `lvh`
- `dvh`

Recommended pattern:

```css
.app-shell {
  min-height: 100dvh;
}

.empty-state,
.hero {
  min-height: 100svh;
}
```

### Safe areas and cutouts

Use `viewport-fit=cover` and safe-area environment variables.

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

```css
.app-chrome {
  padding-top: max(12px, env(safe-area-inset-top));
  padding-right: max(16px, env(safe-area-inset-right));
  padding-bottom: max(16px, env(safe-area-inset-bottom));
  padding-left: max(16px, env(safe-area-inset-left));
}
```

This matters for:

- notches and Dynamic Island
- rounded corners
- bottom home indicator areas
- landscape layouts on notched phones

### `VisualViewport` for keyboard-aware layout

Use `window.visualViewport` when layout must respond to the actual visible area after:

- keyboard open
- toolbar expansion or collapse
- pinch zoom

Typical use cases:

- bottom action bars
- sticky save bars
- focused inline editors
- full-screen filter flows

### `interactive-widget`

For layouts that should resize when the keyboard appears, use:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
```

This is especially useful for search-heavy and filter-heavy screens.

### Container queries

For dense products, component width is often more important than viewport width. Use container queries for:

- chart cards inside responsive grids
- toolbar reflow
- inspector panels
- filter summary bars

This prevents brittle global breakpoint logic.

### Modern top-layer UI

Prefer native platform primitives where they fit:

- `dialog` for confirmations
- `popover` for lightweight overlays

Still use route-based full-screen flows for larger tasks.

Popovers appear in the top layer — above all `position: fixed` elements, stacking contexts, and modals. They handle focus trapping and light-dismiss natively. Use `@starting-style` for entry animations on bottom sheets and drawers without JS class toggling:

```css
.sheet[popover]:popover-open {
  transform: translateY(0);
  opacity: 1;
  transition: transform 0.25s, opacity 0.2s;
}

@starting-style {
  .sheet[popover]:popover-open {
    transform: translateY(100%);
    opacity: 0;
  }
}
```

`@starting-style` is supported in Chrome 117+ and Safari 17.5+. Use as progressive enhancement.

### Responsiveness and scheduling

Use:

- containment
- `content-visibility`
- lazy rendering
- progressive hydration
- chunked client work
- `scheduler.yield()` as progressive enhancement where supported

The goal is better Interaction to Next Paint, not just faster first load.

## iPhone vs Android Differences That Matter

### Browser and engine behavior

- Safari and iOS browser behavior are tightly coupled to WebKit platform rules.
- Chrome Android is more permissive and often exposes newer capabilities earlier.
- Some CSS and scrolling behaviors are more predictable in Chrome; Safari still needs more cautious testing around fixed positioning, keyboard interactions, and long-lived heavy pages.

### Navigation gestures

- iPhone users strongly expect edge-swipe back.
- Android users may use either system back or edge gestures.

Do not place critical horizontal drag interactions on the extreme left or right edge unless you have tested gesture conflicts carefully.

### Keyboard behavior

- iOS is more likely to expose layout mistakes around fixed bottom controls and text inputs.
- iPhone also zooms focused inputs if text is below 16px.
- Android keyboards and resize behavior vary more across devices.

Minimum rule:

```css
input,
select,
textarea {
  font-size: 16px;
}
```

### Notifications and installability

- Android Chrome supports in-browser push and installation more directly.
- iPhone supports Web Push primarily through Home Screen web apps.
- Push should be treated as a secondary enhancement, not a required core workflow dependency.

### Privacy, storage, and resilience

Be more conservative on iPhone about:

- storage assumptions
- long-lived background behavior
- heavy offline caches
- memory-intensive views left open for long sessions

## Screen Size and Layout Strategy

Height is often the tighter constraint than width. Mobile data UIs fail because there is not enough vertical room for:

- browser bars
- safe areas
- sticky headers
- sticky action bars
- keyboards
- chart legends

Design around width bands, but budget even more carefully for visible height.

Useful practical width bands:

- ~320-389px: compact phones
- ~390-429px: common modern phones
- ~430px+: larger phones and some foldable narrow states

Do not optimize for exact devices. Optimize for component behavior under tight width and unstable height.

## Gestures and Touch

### Event model

Prefer the **Pointer Events API** (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) over legacy Touch Events for new interaction code. Pointer Events unify touch, mouse, and stylus and are fully supported in iOS Safari 13+. Use `pointer.pointerType` to distinguish `'touch'` from `'mouse'` or `'pen'`.

### `touch-action`

This is a high-value control surface. Set it explicitly on any element with custom interaction:

| Value | Effect |
|---|---|
| `auto` | Default; browser handles all gestures |
| `manipulation` | Allows pan and pinch, disables double-tap zoom |
| `pan-y` | Browser handles vertical pan; JS can handle horizontal |
| `pan-x` | Browser handles horizontal pan; JS can handle vertical |
| `pinch-zoom` | Browser handles pinch only |
| `none` | JS handles everything — use only on bounded custom surfaces |

```css
/* Carousel or swipeable card: preserve vertical page scroll */
.swipe-container { touch-action: pan-y; }

/* Standard buttons and controls: eliminate double-tap zoom delay */
button, a, [role="button"] { touch-action: manipulation; }

/* Chart with custom pinch-zoom: full JS control */
.chart-canvas { touch-action: none; }
```

### Passive listeners

Touch event handlers that call `preventDefault()` block the browser scroll thread. Declare listeners as `passive: true` by default. Only use `passive: false` when you explicitly need to cancel a native gesture, and never on `document` or `body` unless strictly necessary.

### High-value rule

If a gesture is not obviously better than tap, scroll, or native browser navigation, do not add it.

## URL Bars, Notches, Bottom Insets, and Fixed UI

Assume the visible viewport is unstable.

That means:

- bottom bars can be covered
- fixed footers can collide with the keyboard
- full-screen panels can jump during toolbar transitions
- landscape on notched phones changes left and right safe-area requirements

Rules:

- prefer sticky over fixed where possible
- keep bottom-docked UI minimal
- test with URL bar visible and collapsed
- test with keyboard open
- always include safe-area padding on persistent chrome

## Notifications and App-Like Features

What translates well:

- installable PWA shell on Android
- Home Screen web app support on iPhone
- push as an opt-in enhancement
- IndexedDB-backed offline or warm-cache data
- manifest-driven icon and app naming

What to avoid:

- making install required for core use
- assuming push works the same on iPhone and Android
- assuming background processing or sync will behave like native apps

## Desktop Patterns That Do Not Translate Well

These usually fail on phones:

- multi-pane dashboards
- side-by-side compare-heavy views
- hover-driven chart exploration
- dense action toolbars
- desktop filter sidebars
- drag-and-drop as a primary operation
- large tables with unbounded horizontal scanning

## Patterns That Translate Well

These translate well when done deliberately:

- list -> detail flows
- segmented views for alternate lenses on the same data
- full-screen filter routes or tall sheets
- pinned summaries above deeper drill-down data
- sticky key metrics with collapsible secondary detail
- charts paired with explicit value summaries
- tables with deliberate mobile-specific reduction strategies

## Guidance for Charts

Charts on phones should optimize for interpretability, not maximum density.

### Recommended patterns

- use tap or drag scrubbing with a pinned readout
- place the tooltip or value summary away from the finger
- simplify legends and make series toggles explicit
- use sparklines in lists for glanceable trends only
- degrade to a compact summary plus drill-down route for detailed analysis

### Avoid

- hover-only tooltips
- tiny point targets
- multi-series charts with visually similar lines
- excessive annotation text inside the plot area
- large SVG render trees for dense datasets

### Chart library posture on mobile

**Apache ECharts** has the strongest mobile posture: built-in `dataZoom` for touch-driven zoom and pan, SVG renderer option (lower memory than canvas for moderate data), and native touch event handling. Remove desktop `toolbox` components on mobile — they are not thumb-friendly.

**Recharts** (`<ResponsiveContainer>`) handles width reflow via ResizeObserver but has no built-in pinch-zoom. Use `<Tooltip trigger="click">` rather than the default hover trigger on touch devices. Legends should use `layout="horizontal"` and `verticalAlign="bottom"` to avoid consuming chart width on narrow viewports.

**Chart.js** uses canvas by default. Always set `devicePixelRatio: window.devicePixelRatio` explicitly. Pinch-zoom requires the `chartjs-plugin-zoom` add-on. Always set `touch-action: none` on the chart container when pinch-zoom is active — but note this removes the container from native page scrolling, so keep chart height fixed and short enough that surrounding content stays reachable.

### Rendering choice

For larger data volumes and active pan/zoom behavior, canvas-based rendering is a better fit than SVG. SVG with hundreds of active nodes causes layout and paint on every pan frame. Switch to a canvas renderer when point count exceeds ~500 or when the chart must support touch-driven scrubbing at 60fps.

## Guidance for Tables

Do not force one desktop table pattern onto mobile.

Choose one strategy deliberately:

1. Horizontal scroll with sticky first column for comparison tasks.
2. Priority columns plus row drill-down for operational scanning.
3. Card or stacked row transform for record browsing.
4. Pivoted detail view where each row opens a dedicated record screen.

### Sticky headers and frozen columns

The CSS for a horizontally scrollable table with a frozen first column and sticky header:

```css
.table-container {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 60svh;
}

table {
  border-collapse: separate; /* required — sticky breaks silently with collapse */
  border-spacing: 0;
}

thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--surface); /* must be set — transparent cells show scroll-behind content */
}

td:first-child,
th:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  background: var(--surface);
}

thead th:first-child { z-index: 3; } /* corner cell above both */
```

Critical: `position: sticky` requires `border-collapse: separate`. Use `border-spacing: 0` and apply borders to cells individually to replicate collapsed-border appearance. Sticky cells without an explicit `background-color` are transparent and content scrolls visibly behind them.

For large tables (500+ rows), combine CSS sticky headers with row virtualization via TanStack Virtual. Virtualize into `<tbody>`; headers in `<thead>` remain sticky naturally.

Provide a horizontal scroll affordance — a gradient fade at the right edge is a minimal, CSS-only signal:

```css
.table-wrapper {
  position: relative;
}
.table-wrapper::after {
  content: '';
  position: sticky;
  right: 0;
  display: block;
  width: 32px;
  height: 100%;
  background: linear-gradient(to left, var(--surface), transparent);
  pointer-events: none;
}
```

### Rules

- virtualize row rendering for datasets over ~50 rows
- keep sticky headers and sticky columns minimal
- show that horizontal scroll exists with a visual cue
- do not hide critical data permanently off-screen without a clear path to it

## Filters, Controls, and Data Entry

For mobile data products:

- filters should usually live in a dedicated mobile flow
- keep a compact applied-filter summary visible on the result screen
- use segmented controls instead of dropdowns for small option sets
- use native inputs where platform pickers are better than custom widgets
- keep edit flows route-based when the keyboard is central to the task

Avoid filter bars with:

- many small chips
- multiple inline dropdowns
- tiny date controls
- several competing sticky rows

### Touch targets

Minimum tap target size: **44×44px** (Apple HIG), **48×48dp** (Material Design). WCAG 2.5.8 sets a floor of 24×24px. The error rate for targets below 44px is meaningfully higher on phones.

For visually small controls, extend the tap area with padding or a pseudo-element without affecting layout:

```css
.icon-button {
  min-width: 44px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Extend tap area for a small icon without changing its visual size */
.small-close {
  position: relative;
}
.small-close::after {
  content: '';
  position: absolute;
  inset: -12px;
}
```

## Performance and Resilience

### Performance budget

A mid-range Android device has approximately 4× less CPU performance than a MacBook Pro. Set budgets against this baseline, not flagship devices.

Core Web Vitals targets for mobile:
- **LCP** < 2.5s
- **INP** < 200ms — measures interaction latency across the page lifetime, not just first input
- **CLS** < 0.1

For data-heavy apps, INP is the metric that most often fails in practice. Users notice when filters stall, charts freeze during scrub, or sorting locks the page for 300ms.

### `will-change` and compositor layers

Promote animated elements to their own compositor layer so the GPU can transform them without re-painting:

```css
.animated-panel { will-change: transform; }
```

**Avoid over-promoting.** Every compositor layer consumes GPU memory. Promoting hundreds of list items simultaneously can exhaust mobile GPU memory (often 256–512MB total), causing the browser to de-promote everything and fall back to software rendering. Apply `will-change` immediately before animation starts and remove it after:

```js
element.style.willChange = 'transform';
element.addEventListener('transitionend', () => {
  element.style.willChange = 'auto';
}, { once: true });
```

### Layout thrashing

Interleaving DOM reads and writes in a loop forces the browser to flush layout on every iteration. This is a common source of high INP in data-heavy UIs.

```js
// Bad: read forces layout flush before each write
items.forEach(el => {
  const h = el.offsetHeight;   // read triggers layout
  el.style.height = h + 'px';  // write
});

// Good: batch reads, then batch writes
const heights = items.map(el => el.offsetHeight);
items.forEach((el, i) => el.style.height = heights[i] + 'px');
```

### `content-visibility`

For long pages with off-screen sections, `content-visibility: auto` skips rendering until elements scroll into view — measurable 50–80% render time reductions on dense report pages:

```css
.report-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 400px; /* estimated height prevents layout shift */
}
```

Do not apply to elements that JS constantly measures with `getBoundingClientRect` or `offsetHeight`.

### Optimize for:

- INP under real touch interaction
- low memory pressure
- reduced JS per view
- smaller live DOM
- fewer active observers and resize handlers

Practical rules:

- unmount hidden heavy views
- virtualize long lists and tables
- debounce expensive chart recalculation
- animate `transform` and `opacity`, not layout properties
- test on mid-range Android hardware, not only desktop emulation
- test Safari with long sessions and repeated navigation

## Recommended Architecture for This Product Type

### Shell

- one primary content area
- minimal persistent chrome
- safe-area-aware spacing

### Navigation

- list -> detail -> edit
- explicit drill-down instead of multi-pane persistence

### Charts

- summary chart in context
- detailed chart on dedicated screen when needed
- pinned value readout during interaction

### Tables

- mobile-specific table mode, not desktop shrink
- virtualization as a baseline for larger sets

### Filters

- dedicated filter screen or tall sheet
- clear apply and reset actions
- persistent result summary on return

### Editing

- full-screen route for serious data entry
- keyboard-aware sticky action region only if tested carefully

## Final Recommendations

If this product is chart-heavy and table-heavy, the mobile version should be treated as a first-class product surface with its own rules:

- redesign layout around mobile tasks, not desktop density
- budget aggressively for vertical space and keyboard collisions
- use modern viewport and safe-area primitives everywhere
- keep gestures conservative and scoped
- favor route-based flows over layered overlays
- treat tables and charts as mobile-specific interaction systems
- build for imperfect Android hardware and Safari memory behavior from the start

That combination will do more for real mobile usability than any visual polish layer.

## Audit Checklist

Use when auditing or porting a desktop-first data UI to mobile.

### Viewport & Layout
- [ ] All `100vh` usages replaced with `100svh` (stable) or `100dvh` (dynamic, deliberate only)
- [ ] `viewport-fit=cover` added to viewport meta if using safe area insets
- [ ] `env(safe-area-inset-bottom)` applied to fixed/sticky bottom bars
- [ ] `env(safe-area-inset-top)` applied to full-bleed headers
- [ ] Layout tested at 320px viewport width (compact phone baseline)
- [ ] Layout tested in landscape with notch / Dynamic Island

### Input & Interaction
- [ ] All inputs have `font-size: 16px` minimum (prevents iOS auto-zoom on focus)
- [ ] `touch-action: manipulation` on all buttons and interactive controls
- [ ] No interactions gated solely on `:hover` — all affordances tap-accessible
- [ ] Touch targets are minimum 44×44px (extend with padding or pseudo-element if visually smaller)
- [ ] Custom swipe/drag implemented via Pointer Events, not Touch Events

### Scroll & Fixed Positioning
- [ ] No `position: fixed; bottom: 0` toolbars without iOS keyboard compensation
- [ ] No `overflow: hidden` on body/html for scroll locking on iOS (use JS lock)
- [ ] `overscroll-behavior: contain` on scroll containers that should not chain to body
- [ ] No `passive: false` touch listeners on document/body without strong justification

### Performance
- [ ] Animated properties limited to `transform` and `opacity`
- [ ] `will-change` applied only immediately before animation, removed after via `transitionend`
- [ ] Long lists and tables use row virtualization (TanStack Virtual or equivalent)
- [ ] `content-visibility: auto` applied to repeated off-screen sections where safe
- [ ] No layout thrashing (DOM reads and writes batched separately) in scroll or animation handlers
- [ ] Charts unmounted or suspended when not visible

### Data Tables
- [ ] Wide tables in a horizontally scrollable container
- [ ] Table uses `border-collapse: separate` with `border-spacing: 0` for sticky to function
- [ ] Sticky header: `position: sticky; top: 0` with explicit `background-color`
- [ ] Frozen column: `position: sticky; left: 0` with explicit `background-color`
- [ ] Horizontal scroll affordance visible (gradient fade edge or similar)
- [ ] Rows virtualized for datasets over ~50 rows

### Charts
- [ ] Chart tooltips use click/tap trigger, not hover
- [ ] Touch-driven scrub or dataZoom configured where applicable
- [ ] Chart container has `touch-action: none` if internal gesture handling is active
- [ ] Canvas renderer used for datasets over ~500 points or active pan/zoom
- [ ] Font sizes in chart labels use `rem` not `px`

### PWA & Notifications
- [ ] `manifest.json` present and valid for home screen installation
- [ ] Push notification permission gated behind explicit user gesture, not on load
- [ ] In-app prompt present explaining iOS \"Add to Home Screen\" flow
- [ ] `theme-color` meta set; `apple-mobile-web-app-status-bar-style` set if using `viewport-fit=cover`

### Testing
- [ ] Tested on Safari iPhone (current and one major version behind)
- [ ] Tested on mid-range Android Chrome (Snapdragon 665-class or equivalent)
- [ ] Tested with URL bar visible and collapsed
- [ ] Tested with software keyboard open
- [ ] Tested in landscape with safe-area constraints
- [ ] Performance profiled on throttled CPU (4× slowdown in DevTools)
