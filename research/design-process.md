## The Design Process: From Insight to Interface

The design process is a non-linear, iterative cycle that transforms user needs into functional, high-fidelity products.

---

### 1. User Research & Discovery
**Goal:** Understand the *who*, *what*, and *why*.
- **Discovery:** Identify user pain points and motivations through interviews and competitive analysis.
- **Research Mix:** Combine generative methods (interviews, surveys, landscape analysis) with evaluative methods (usability testing, content testing, analytics) as the product matures.
- **Outcome:** Defined user personas and customer journey maps that highlight critical touchpoints.

### 2. User Flow & Information Architecture
**Goal:** Map the logical path a user takes to complete a task.
- **Story Mapping:** Visualize the workflow before any visuals are created. Define entry points, decision nodes, and exit paths.
- **Risk Mapping:** Mark irreversible actions, confusing branches, and high-friction moments early. Those become the first scenarios you prototype and test.
- **UX Check:** Does the flow minimize friction? Are there unnecessary steps?

### 3. Wireframing (Low-Fidelity)
**Goal:** Create a skeletal blueprint focusing on functionality over aesthetics.
- **Process:** Use simple sketches or digital boxes to define content hierarchy and navigation.
- **Accessibility First Pass:** Validate heading order, tab sequence, form labels, and error recovery in low fidelity before visual polish locks the structure in.
- **Why:** Identifying structural gaps at this stage is 10x cheaper than changing a high-fidelity design.

### 4. Design Systems
**Goal:** Maintain consistency and scalability through reusable components.
- **Components:** A library of buttons, forms, and navigation governed by clear documentation (Design Tokens).
- **Single Source of Truth:** Ensure the design system in Figma matches the implementation in the codebase (CSS variables, React/Vue components).

### 5. Prototyping (High-Fidelity)
**Goal:** Create an interactive model that simulates the final product.
- **Fidelity Matching:** Match the detail level to the testing goal. Use realistic data to validate complex interactions and micro-animations.
- **Stress the Real States:** Prototype loading, empty, error, success, zoomed, and long-content states. Teams usually overfit to the happy path if those are missing.
- **Rapid Prototyping:** For engineering teams, building a functional prototype with a component library allows for early technical feasibility checks.

### 6. Testing & Iteration
**Goal:** Validate the design with real users.
- **The "Build-Measure-Learn" Loop:** Test the riskiest assumptions first. Use usability testing, A/B testing, and remote walkthroughs.
- **Test Access, Not Just Aesthetics:** Include keyboard-only flows, screen-reader labeling, 200% text resize, and 400% zoom/reflow checks in every serious prototype review.
- **Continuous Improvement:** Design is never "finished." Use data and user feedback to refine the experience.

---

### 7. Development Handoff
**Goal:** Provide developers with everything they need to build the validated design.
- **Deliverables:** Annotated wireframes, component inventories, accessibility requirements, and redlines (precise spacing/colors).
- **Acceptance Criteria:** Call out interaction semantics, target sizes, focus treatment, motion fallbacks, and responsive or container-query behavior explicitly so quality does not depend on memory.
- **Communication:** Walk through the handoff with the engineering team to ensure feasibility and clarity.

---

**References:**
- [USWDS: About Research](https://designsystem.digital.gov/about/research/) - Generative and evaluative methods used in practice
- [USWDS: Accessibility](https://designsystem.digital.gov/documentation/accessibility/) - Accessibility has to be tested in the context of the product, not assumed from the system alone
- [USWDS: Maturity Model](https://designsystem.digital.gov/maturity-model/) - Incremental adoption from principles to guidance to code
- [W3C: Understanding SC 1.4.4 Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text) - Prototype reviews should include 200% text scaling
- [W3C: Understanding SC 1.4.10 Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow) - Responsive behavior should hold at 320 CSS px / 400% zoom
