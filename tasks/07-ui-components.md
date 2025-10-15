# UI/UX Components & Design System

**Priority:** Supporting
**Estimated Time:** 2-3 days
**Dependencies:** None (can be developed in parallel)

## Overview
Build reusable UI components using shadcn/ui and Radix primitives. Create a consistent design system for the Tajweed Quiz application with focus on accessibility and mobile responsiveness.

## Tasks

### 7.1 Set Up Design System Foundation
- **Description:** Establish design tokens, color scheme, and typography system
- **Acceptance Criteria:**
  - CSS custom properties for colors, spacing, typography
  - Light/dark theme support (using next-themes)
  - Consistent spacing scale (4px, 8px, 16px, 24px, 32px)
  - Typography scale with Arabic text support
  - Responsive breakpoint system
- **Files to Create/Modify:**
  - `app/app.css` (global styles and design tokens)
  - `tailwind.config.ts` (theme configuration)

### 7.2 Create Quiz Question Card Component
- **Description:** Build reusable quiz question display component
- **Acceptance Criteria:**
  - Clean card layout with proper spacing
  - Support for Arabic text and RTL layout
  - Multiple choice option buttons
  - Progress indicator integration
  - Mobile-responsive design
  - Accessibility support (ARIA labels)
- **Files to Create:**
  - `app/components/quiz/QuestionCard.tsx`
  - Supporting styles in component

### 7.3 Build Progress Indicator Component
- **Description:** Create flexible progress bar component for quiz navigation
- **Acceptance Criteria:**
  - Percentage-based progress display
  - Customizable color themes
  - Animated progress updates
  - Text labels (e.g., "3/10 • 30%")
  - Accessible progress announcements
- **Files to Create:**
  - `app/components/ui/Progress.tsx`
  - `app/components/quiz/QuizProgress.tsx`

### 7.4 Design Score Display Component
- **Description:** Create visually appealing score visualization component
- **Acceptance Criteria:**
  - Large percentage display
  - Circular progress indicator
  - Color-coded performance levels
  - Animated score reveal
  - Responsive sizing
- **Files to Create:**
  - `app/components/ui/CircularProgress.tsx`
  - `app/components/results/ScoreDisplay.tsx`

### 7.5 Create Attempt History Card
- **Description:** Build card component for displaying quiz attempt history
- **Acceptance Criteria:**
  - Date and time display
  - Score badge with color coding
  - Rule name and description
  - Click-to-view details functionality
  - Consistent card styling
- **Files to Create:**
  - `app/components/dashboard/AttemptCard.tsx`
  - `app/components/ui/Badge.tsx` (if not exists)

### 7.6 Build Rule Selection Dropdown
- **Description:** Create accessible dropdown for Tajweed rule selection
- **Acceptance Criteria:**
  - Search/filter functionality
  - Rule descriptions on hover/focus
  - Keyboard navigation support
  - Clear visual hierarchy
  - Loading and empty states
- **Files to Create:**
  - `app/components/dashboard/RuleSelector.tsx`
  - Enhanced Select component

### 7.7 Design Responsive Layout System
- **Description:** Create responsive layout components for mobile and desktop
- **Acceptance Criteria:**
  - Mobile-first responsive design
  - Consistent spacing and grid system
  - Touch-friendly interactive elements (44px minimum)
  - Proper content hierarchy on small screens
  - Landscape mode optimization
- **Files to Create:**
  - `app/components/layout/Container.tsx`
  - `app/components/layout/Grid.tsx`
  - `app/components/layout/Stack.tsx`

### 7.8 Add Loading States and Skeletons
- **Description:** Create loading components for better perceived performance
- **Acceptance Criteria:**
  - Skeleton loaders for all major components
  - Spinner for quick operations
  - Progressive loading for lists
  - Consistent loading state patterns
  - Smooth transitions between states
- **Files to Create:**
  - `app/components/ui/Skeleton.tsx`
  - `app/components/ui/Spinner.tsx`
  - Loading variants for each major component

### 7.9 Implement Error Boundaries and States
- **Description:** Create error handling components with user-friendly messaging
- **Acceptance Criteria:**
  - Global error boundary for app crashes
  - Component-level error states
  - Network error handling
  - User-friendly error messages
  - Recovery actions where possible
- **Files to Create:**
  - `app/components/ErrorBoundary.tsx`
  - `app/components/ui/ErrorState.tsx`
  - `app/components/ui/NetworkError.tsx`

### 7.10 Create Accessibility Helpers
- **Description:** Build accessibility-focused components and utilities
- **Acceptance Criteria:**
  - Screen reader announcements for dynamic content
  - Focus management utilities
  - Keyboard navigation helpers
  - Color contrast compliance
  - ARIA label and description utilities
- **Files to Create:**
  - `app/components/a11y/ScreenReaderOnly.tsx`
  - `app/components/a11y/FocusTrap.tsx`
  - `app/hooks/useAnnouncement.ts`

## Design System Specifications

### Color Palette
```css
/* Primary - Islamic Green Theme */
--primary: 142 76% 36%;          /* Deep green */
--primary-foreground: 355 100% 97%;

/* Secondary - Gold Accents */
--secondary: 45 93% 58%;         /* Warm gold */
--secondary-foreground: 45 5% 11%;

/* Success/Error/Warning */
--success: 142 76% 36%;
--error: 0 84% 60%;
--warning: 38 92% 50%;

/* Neutral Grays */
--background: 0 0% 100%;
--foreground: 240 10% 3.9%;
--muted: 240 4.8% 95.9%;
--border: 240 5.9% 90%;
```

### Typography Scale
```css
/* Arabic & English Text Support */
--font-arabic: 'Amiri', 'Times New Roman', serif;
--font-english: 'Inter', system-ui, sans-serif;

/* Scale */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
```

### Spacing Scale
```css
/* 4px base unit */
--space-1: 0.25rem;     /* 4px */
--space-2: 0.5rem;      /* 8px */
--space-3: 0.75rem;     /* 12px */
--space-4: 1rem;        /* 16px */
--space-6: 1.5rem;      /* 24px */
--space-8: 2rem;        /* 32px */
```

## Component Library Structure

### Base Components (shadcn/ui)
- Button variants (primary, secondary, outline, ghost)
- Input components with validation states
- Card layouts with consistent spacing
- Modal/Dialog components
- Dropdown/Select components

### Quiz-Specific Components
- QuestionCard with Arabic text support
- AnswerOption buttons with selection states
- ProgressBar with animations
- ScoreDisplay with celebrations

### Dashboard Components
- StatCard for metrics display
- AttemptCard for history
- StreakBadge for achievements
- RuleSelector for quiz selection

## Responsive Breakpoints
```css
/* Mobile first approach */
sm: '640px',    /* Small tablets */
md: '768px',    /* Tablets */
lg: '1024px',   /* Small laptops */
xl: '1280px',   /* Desktops */
2xl: '1536px'   /* Large screens */
```

## Accessibility Standards
- WCAG 2.1 AA compliance
- Minimum 4.5:1 color contrast ratio
- Keyboard navigation for all interactive elements
- Screen reader support with proper ARIA labels
- Focus indicators for all interactive elements

## Performance Considerations
- Tree-shakable component exports
- CSS-in-JS optimization
- Lazy loading for heavy components
- Efficient re-render patterns
- Minimal bundle size impact

## Definition of Done
- Design system documentation complete
- All components built with TypeScript
- Mobile-responsive on all screen sizes
- Accessibility standards met
- Performance optimized
- Consistent styling across app
- Error states and loading states implemented
- Components work with Arabic text
- Dark/light theme support
- Proper component composition patterns