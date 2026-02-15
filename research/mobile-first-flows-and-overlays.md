# Mobile-First Flows and Overlay Strategy

## Context

Desktop-first UI systems frequently overuse centered modals on mobile. The result is stacked overlays, nested scroll containers, and unclear back-navigation behavior.

Project-level audit findings from this repo show the same pattern:

- Global modal body constraints at `max-h-[70vh]` can make long forms feel cramped on phones.
- Dashboard and group flows chain multiple overlays before users can complete one action.
- Some deep links open modals and then rewrite browser history back to parent pages.
- Mobile and desktop rendering are split in multiple branches, increasing drift risk.

The practical goal is to keep mobile task completion fast while reducing UI orchestration complexity.

## Principles

1. Route-first for complex tasks
Complex, keyboard-heavy, or multi-step work should be represented by full-screen routes on mobile.

2. Overlay types must be explicit
Use a small, fixed set of overlay presentations:
- `fullscreen` for long tasks
- `sheet` for short action picking
- `dialog` for confirmation only

3. Back behavior must be predictable
If the user starts a task from a URL, browser back should reverse task states naturally without manual history rewrites.

4. Reduce branch duplication
Prefer one section composition model with responsive presentation wrappers over separate mobile/desktop trees.

5. Keep state close to navigation
Route params should carry primary task state; modal stores should only hold transient overlay state.

## Techniques

### Technique A: Mobile route map for primary tasks

Define explicit mobile task routes for high-frequency actions:

- `/groups/:id/expenses/new`
- `/groups/:id/expenses/:expenseId/edit`
- `/groups/:id/settlements/new`
- `/groups/:id/settings`
- `/groups/:id/lists/:listId`
- `/groups/:id/polls/:pollId`

This keeps deep links canonical and reduces modal orchestration.

### Technique B: Single action launcher on mobile

Use one persistent launcher (FAB or sticky primary action) that opens an action sheet with top tasks. Do not stack popover -> chooser modal -> form modal for core actions.

### Technique C: One expanded section rule

In long mobile detail pages, allow only one major collapsible section expanded at a time. This limits vertical scanning fatigue and keeps context stable.

### Technique D: Shared data source for pickers

Avoid fetching duplicate group lists inside dedicated chooser overlays when an authoritative store already exists. Reuse shared store data for consistency and lower latency.

### Technique E: Presentation variants in one primitive

Implement `dialog | sheet | fullscreen` in the base modal primitive rather than ad-hoc per feature. Centralizing this lowers drift and keeps accessibility behavior consistent.

## Anti-patterns

- Centered, short-height modal for long forms on phones.
- Chaining 2-3 overlays before a user reaches the intended task.
- Opening modals from route deep links, then replacing history to hide task URLs.
- Separate mobile and desktop copies of entire page sections where a shared model would suffice.
- Modal state stores that become de facto routing systems.

## Practical Refactor Sequence

1. Add overlay variants to the shared modal primitive.
2. Convert expense and settlement mobile flows to full-screen task routes.
3. Replace multi-overlay quick actions with one mobile action sheet.
4. Remove deep-link modal rewrite logic.
5. Collapse duplicated mobile/desktop section trees where feasible.

## References

- WAI-ARIA Authoring Practices: Modal Dialog Pattern  
  https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI Modal Dialog Example (small-screen readability notes)  
  https://wai-aria-practices.netlify.app/aria-practices/examples/dialog-modal/dialog
- Material Design 1: Dialogs (full-screen dialogs for complex mobile tasks)  
  https://m1.material.io/components/dialogs.html
- Material Design 1: Bottom Sheets  
  https://www.mdui.org/en/design/1/components/bottom-sheets.html
- web.dev: Sign-in form best practices (mobile form ergonomics)  
  https://web.dev/articles/sign-in-form-best-practices

