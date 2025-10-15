# Tajweed Quiz MVP – UI/UX Outline

## Layout Principles
- Mobile-first responsive grid using Tailwind breakpoints (`sm`, `md`, `lg`), ensuring quiz UI fits on small screens without horizontal scroll.
- Consistent spacing scale (Tailwind `space-y-4`, `space-y-6`) and rounded cards for clarity.
- Dark-on-light theme with accent color for primary actions and progress indicators.

## Core Screens
### Dashboard/Home
- **Hero Card:** Welcome message, streak badge, CTA to start quiz.
- **Rule Selector:** Combobox with search + quick descriptions; uses shadcn `Command` component for accessibility.
- **Attempt History:** Vertical list with score chips, timestamps, and streak highlights.

### Quiz Screen
- **Progress Header:** Displays `Question 3 of 10` + percentage bar (Tailwind `bg-primary` progress). Sticky on mobile.
- **Question Card:** Prompt text, audio icon placeholder (future), and multiple-choice buttons styled as large tappable cards.
- **Controls Row:** `Skip` (ghost button) and `I don’t know` (destructive ghost) left-aligned; `Submit` primary button right-aligned.
- **Form Mechanics:** React Hook Form ensures keyboard navigation, Enter key submission, and validation (must choose or explicitly skip).

### Results Screen
- **Score Banner:** Large percentage, contextual message (“Review Idgham”) with subtle icon.
- **Weakness Radar:** Chart.js radar chart (for single rule, only highlights segments; ready for multi-rule future).
- **Attempts Accordion:** Each attempt entry expands to show per-question breakdown; correct answers in green, incorrect in red with explanation copy.
- **CTA Buttons:** `Retake Rule` primary, `Choose Another Rule` secondary.

## Components & Interactions
- Buttons follow shadcn button variants for consistency.
- Accordion and Combobox rely on Radix primitives for keyboard + screen reader support.
- Progress bar uses `aria-valuenow` attributes; chart includes text alternative for accessibility.
- Toast notifications (shadcn) confirm submissions or show validation errors.

## Accessibility
- All interactive elements accessible via keyboard (tab order, Enter/Space activation).
- Color palette respects WCAG AA contrast; rely on more than color (icons/labels) for correct vs incorrect states.
- Provide screen-reader friendly text summarizing quiz result (“Score 70 percent, 7 correct, 3 incorrect, streak at 2”).
- Ensure form fields have proper `aria-describedby` for explanations.

## Responsive Strategy
- Mobile: single-column layout; quiz options stacked full-width; results accordion collapses by default.
- Tablet: two-column results (score/weakness left, answers right), grid attempt history.
- Desktop: widen content to max-width `max-w-5xl`, keep comfortable line lengths (~65ch).

## Future Enhancements (Post-MVP)
- Inline audio playback for rules, spaced repetition suggestions, celebratory animations on streak milestones.
- Personalization banner recommending next rules based on weak areas.

