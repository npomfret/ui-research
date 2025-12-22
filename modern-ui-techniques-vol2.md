# Modern Web UI Techniques, Vol. 2

This document covers a new set of modern web UI techniques, expanding on our previous research into glassmorphism. The focus here is on advanced layout, interaction, and animation.

---

## 1. Bento Grid Layouts

A highly popular trend for dashboards and marketing pages, the Bento Grid is a layout that uses CSS Grid to arrange content into a structured, multi-size container system. It's excellent for presenting a variety of information in a visually engaging and organized manner.

**How It Works:**
The layout is primarily built with `display: grid`. Specific items within the grid are then made to span multiple columns or rows to create the characteristic asymmetrical, bento-box look.

**Example Code:**

**HTML:**
```html
<div class="bento-grid">
  <div class="bento-item tall wide">
    <h3>Main Feature</h3>
  </div>
  <div class="bento-item">
    <p>Metric 1</p>
  </div>
  <div class="bento-item">
    <p>Metric 2</p>
  </div>
  <div class="bento-item wide">
    <p>Full-width chart</p>
  </div>
</div>
```

**CSS:**
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* A 3-column grid */
  grid-auto-rows: 150px; /* Give rows a consistent base height */
  gap: 1rem;
  padding: 1rem;
}

.bento-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1rem;
}

/* Spanning classes */
.bento-item.wide {
  grid-column: span 2;
}

.bento-item.tall {
  grid-row: span 2;
}
```

**Responsiveness:**
For smaller screens, you can adjust the grid layout using media queries, often collapsing to a single-column layout.

```css
@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: 1fr; /* Stack everything in a single column */
  }

  /* Reset spans on mobile */
  .bento-item.wide, .bento-item.tall {
    grid-column: span 1;
    grid-row: span 1;
  }
}
```

---

## 2. Delightful Button Micro-interactions

Going beyond simple color changes, modern buttons provide tactile and engaging feedback. These "micro-interactions" make a UI feel more alive and responsive.

### Effect 1: 3D Press Effect

This gives the button a physical, satisfying "click" sensation.

```css
.button-3d {
  background-color: #6c63ff;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  /* The bottom border creates the 3D illusion */
  border-bottom: 4px solid #4a43b3;
  transition: transform 0.1s ease-out, box-shadow 0.1s ease-out;
}

.button-3d:hover {
  transform: translateY(-2px);
}

.button-3d:active {
  /* On click, move the button down and remove the shadow to make it look pressed */
  transform: translateY(2px);
  border-bottom-width: 2px;
}
```

### Effect 2: Background Fill on Hover

A smooth, directional background fill provides an elegant hover state. This is achieved with a pseudo-element that scales up from a hidden position.

```css
.button-fill {
  position: relative;
  padding: 12px 24px;
  border: 1px solid #34d399;
  color: #34d399;
  background: transparent;
  border-radius: 8px;
  overflow: hidden; /* Crucial for containing the pseudo-element */
  transition: color 0.4s ease-out;
  z-index: 1;
}

.button-fill::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #34d399;
  transform: scaleX(0); /* Start scaled to 0 width */
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  z-index: -1;
}

.button-fill:hover {
  color: white;
}

.button-fill:hover::before {
  transform: scaleX(1); /* Scale to full width on hover */
}
```

---

## 3. Native CSS Scroll-Driven Animations

This is a cutting-edge, highly performant way to create animations that are directly linked to scroll progress, without any JavaScript. It uses the new `animation-timeline` property. **Note:** Browser support is new, so always check for compatibility.

### Concept 1: Scroll Progress Timeline

This timeline is linked to the overall scroll progress of a container (e.g., the entire document). A perfect use case is a reading progress bar.

**Example: Reading Progress Bar**

**HTML:**
```html
<div class="progress-bar"></div>
<article>
  <!-- Long content here -->
</article>
```

**CSS:**
```css
@keyframes grow-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  width: 100%;
  background: var(--accent-teal);
  transform-origin: left;

  /* The magic happens here */
  animation: grow-progress linear;
  animation-timeline: scroll(root); /* Link animation to the root scroller */
}
```

### Concept 2: View Progress Timeline

This timeline is linked to an element's visibility within the scrollport (the visible area). It's a native CSS replacement for JavaScript's `IntersectionObserver` for animations.

**Example: Fade-in on Reveal**

**HTML:**
```html
<div class="content-grid">
  <div class="card fade-in">Card 1</div>
  <div class="card fade-in">Card 2</div>
  <div class="card fade-in">Card 3</div>
</div>
```

**CSS:**
```css
@keyframes fade-in-reveal {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  /* Link animation to this element's own visibility */
  animation: fade-in-reveal 1ms linear; /* Duration doesn't matter here */
  animation-timeline: view();
  
  /* Define the visibility range that the animation runs within */
  /* Starts when element enters (0%) and ends when it's 40% visible */
  animation-range: entry 0% cover 40%; 
}
```
This is a powerful, modern way to create performant scroll-based interactions declaratively.
