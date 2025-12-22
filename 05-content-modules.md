## 5. Content Modules

> Need more experimental component ideas? See [`modern-ui-techniques-vol2.md`](./modern-ui-techniques-vol2.md) for Bento layouts and advanced micro-interactions before porting them into the patterns below.

### 5.1. Hero blocks & call-to-actions

**Why:** Hero sections set the tone—they're the first thing users see. Compose from tokens + utilities instead of writing bespoke CSS so your hero stays consistent with the rest of the UI.

**How:**
```css
.hero {
  padding: clamp(2rem, 5vw, 3.5rem);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.35), rgba(236, 72, 153, 0.2));
  backdrop-filter: blur(18px);
  box-shadow: var(--shadow-soft);
}

.hero h1 {
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  line-height: 1.05;
}

.hero h1 span {
  background: linear-gradient(120deg, var(--accent-teal), var(--accent-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.75rem;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.4em;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.eyebrow.tight {
  margin-bottom: 0.35rem;
}
```

**Icon hydration pattern:** When using icon libraries (Lucide, Feather, etc.) with dynamic content, re-run hydration after DOM updates:
```javascript
// Centralize icon hydration
document.body.addEventListener('htmx:afterSwap', () => {
  lucide.createIcons();
});

// Initial page load
lucide.createIcons();
```

**Anti-patterns:**
- Embedding SVGs inline without idempotent hydration
- Bespoke hero CSS per page (reuse `.hero` + modifiers)
- Forgetting to hydrate icons after HTMX swaps

### 5.2. Forms

**Why:** Forms are where users interact most directly with your app. Inconsistent spacing or focus states make forms feel broken even when they work perfectly.

**How:**
```css
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  width: 100%;
  border-radius: var(--radius);
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(2, 6, 23, 0.65);
  color: var(--text-primary);
  padding: 0.85rem 1rem;
  font-size: 1rem;
  transition: border-color var(--transition), box-shadow var(--transition);
  font-family: inherit; /* Critical: don't let inputs use system font */
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--accent-teal);
  box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.35);
}

.button-row {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.button-row.align-start {
  justify-content: flex-start;
}
```

**Autoresize textareas:** Prevent fixed-height textareas that cut off content:
```javascript
document.querySelectorAll('textarea[data-auto-resize]').forEach(textarea => {
  const resize = () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  textarea.addEventListener('input', resize);
  resize(); // Initial sizing
});
```

**Anti-patterns:**
- Varying padding/font between form elements (users notice subconsciously)
- Custom inline `style="justify-content:flex-start"` instead of utility classes
- Missing focus states or inconsistent focus rings
- System fonts in inputs (use `font-family: inherit`)

**References:**
- [Inclusive Components: A Complete Guide to Buttons](https://inclusive-components.design/buttons/) - Form button patterns
- [Web.dev: Building a Textarea Component](https://web.dev/building-a-textarea-component/) - Auto-resize implementation

### 5.3. Tables & data panes

**Why:** Tables display dense information—inconsistent styling makes them unreadable. HTMX partial updates should slot in seamlessly without post-processing.

**How:**
```css
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: var(--radius);
  overflow: hidden;
  background: rgba(4, 7, 20, 0.9);
  border: 1px solid var(--glass-border-strong);
}

thead {
  background: rgba(148, 163, 184, 0.08);
}

thead th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 0.85rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background var(--transition);
}

tbody tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

tbody td {
  padding: 1.1rem 1.25rem;
  vertical-align: middle;
}

/* Action column with vertical buttons */
.actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: stretch;
}

.actions .btn {
  width: 100%;
  min-width: 120px;
  justify-content: flex-start;
}
```

**Destructive actions:** Make delete/destroy actions visually distinct:
```css
.btn-danger {
  background: linear-gradient(135deg, var(--danger), var(--danger-hover));
  border: none;
  color: #fff5f6;
}
```

**Anti-patterns:**
- Using `border-collapse: collapse` (can't apply border-radius)
- Inconsistent padding between columns
- Destructive actions that look like primary actions
- Not confirming destructive actions (use `hx-confirm`)

### 5.4. Chat/terminal surfaces

**Why:** Chat interfaces need clear visual distinction between user and system messages. Scroll containers must handle dynamic content without layout shifts.

**How:**
```css
.chat-messages {
  max-height: 55vh;
  overflow-y: auto;
  padding: 1.5rem;
  border-radius: var(--radius);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(2, 6, 23, 0.55);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  padding: 1rem 1.25rem;
  border-radius: var(--radius);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
}

.message.user {
  border-color: rgba(52, 211, 153, 0.35);
  background: rgba(16, 185, 129, 0.08);
}

.message.model {
  border-color: rgba(59, 130, 246, 0.35);
  background: rgba(37, 99, 235, 0.08);
}

.message-time {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}
```

**Auto-scroll to bottom after new messages:**
```javascript
document.body.addEventListener('htmx:afterSwap', () => {
  const messages = document.getElementById('messages');
  if (messages) {
    messages.scrollTop = messages.scrollHeight;
  }
});
```

**Enter to submit (Shift+Enter for newline):**
```javascript
textarea.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    e.target.closest('form').requestSubmit();
  }
});
```

**Anti-patterns:**
- No visual distinction between message authors
- Fixed-height chat containers (prevents content from growing)
- Layout shifts when new messages arrive
- No loading states during AI responses

**References:**
- [Web.dev: Building a Chat Component](https://web.dev/building-a-chat-component/) - Scroll management patterns
- [Chat UI Kit](https://chatscope.io/) - Reference implementations
