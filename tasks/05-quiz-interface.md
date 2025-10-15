# Quiz Interface & Experience

**Priority:** Core Feature
**Estimated Time:** 3-4 days
**Dependencies:** Database Schema, Authentication, Content Seeding

## Overview
Build the core quiz-taking experience with question display, answer selection, progress tracking, and quiz submission. This is the heart of the MVP.

## Tasks

### 5.1 Create Quiz Route & Loader
- **Description:** Create quiz route `/quiz/:ruleSlug` with loader for questions
- **Acceptance Criteria:**
  - Route loader fetches 10 random questions for the rule
  - Route validates rule exists and is active
  - Route initializes quiz state
  - Proper error handling for invalid rules
  - TypeScript types for quiz data
- **Files to Create:**
  - `app/routes/_protected.quiz.$ruleSlug.tsx`
  - `app/lib/quiz.ts` (quiz logic utilities)

### 5.2 Build Quiz Container Component
- **Description:** Create main quiz UI container with layout and navigation
- **Acceptance Criteria:**
  - Clean, focused layout for question display
  - Header with rule name and progress
  - Navigation controls (next/previous)
  - Exit quiz confirmation dialog
  - Mobile-responsive design
- **Files to Create:**
  - `app/components/quiz/QuizContainer.tsx`
  - `app/components/quiz/QuizHeader.tsx`

### 5.3 Create Question Display Component
- **Description:** Build component to display individual questions with options
- **Acceptance Criteria:**
  - Clear question text display
  - 4 multiple-choice options as buttons
  - Visual feedback for selected option
  - Arabic text support and proper RTL display
  - Accessibility support (keyboard navigation)
- **Files to Create:**
  - `app/components/quiz/QuestionCard.tsx`
  - `app/components/quiz/AnswerOption.tsx`

### 5.4 Implement Answer Selection Logic
- **Description:** Handle user answer selection and state management
- **Acceptance Criteria:**
  - Single option selection per question
  - Visual feedback for selected answers
  - State persists during quiz session
  - Option to change answer before proceeding
  - Clear visual hierarchy for options
- **Files to Create/Modify:**
  - `app/hooks/useQuizState.ts`
  - Answer selection logic in QuestionCard

### 5.5 Add Skip and "I Don't Know" Buttons
- **Description:** Implement skip functionality and explicit "don't know" option
- **Acceptance Criteria:**
  - "Skip" button moves to next question without answering
  - "I Don't Know" button explicitly marks uncertainty
  - Both options tracked differently in attempt data
  - Clear visual distinction between button types
  - Keyboard shortcuts for power users
- **Files to Create/Modify:**
  - Skip/IDK buttons in QuestionCard
  - State management for skipped questions

### 5.6 Create Progress Bar Component
- **Description:** Build progress indicator showing quiz completion status
- **Acceptance Criteria:**
  - Visual progress bar (e.g., "3/10 • 30%")
  - Smooth animations for progress updates
  - Color coding for completion status
  - Accessible progress announcements
  - Works on all screen sizes
- **Files to Create:**
  - `app/components/quiz/ProgressBar.tsx`
  - `app/components/ui/Progress.tsx` (if not exists)

### 5.7 Handle Quiz Navigation
- **Description:** Implement question-to-question navigation within quiz
- **Acceptance Criteria:**
  - "Next" button advances to next question
  - "Previous" button allows review (optional)
  - Question numbers for direct navigation
  - Prevents advancing without selection (configurable)
  - Smooth transitions between questions
- **Files to Create/Modify:**
  - Navigation logic in QuizContainer
  - `app/hooks/useQuizNavigation.ts`

### 5.8 Create Quiz Submission Action
- **Description:** Handle quiz completion and submission to Convex
- **Acceptance Criteria:**
  - Validates all answers before submission
  - Calculates score and correctness
  - Creates quiz attempt record
  - Creates individual answer records
  - Updates user streaks
  - Redirects to results page
- **Files to Create:**
  - Quiz action in route file
  - `app/lib/quiz-submission.ts`

### 5.9 Add Validation and Error Handling
- **Description:** Implement comprehensive validation and error states
- **Acceptance Criteria:**
  - Validates question data integrity
  - Handles network errors gracefully
  - Shows loading states during submission
  - Prevents duplicate submissions
  - Clear error messages for users
- **Files to Create/Modify:**
  - Error boundaries for quiz components
  - Validation utilities
  - Error state components

### 5.10 Implement Quiz State Management
- **Description:** Manage quiz state, answers, and navigation efficiently
- **Acceptance Criteria:**
  - Centralized state for current question, answers, progress
  - Persists state during quiz session
  - Prevents data loss on page refresh
  - Optimistic updates for better UX
  - Clean state reset between quizzes
- **Files to Create:**
  - `app/hooks/useQuizState.ts`
  - `app/contexts/QuizContext.tsx`

## Quiz Flow & User Experience

### Quiz Start
1. User arrives from dashboard with selected rule
2. Loader fetches 10 random questions for rule
3. Quiz initializes with first question
4. Progress bar shows "1/10 • 10%"

### Question Interaction
1. User reads question and 4 options
2. User selects option (visual feedback)
3. User can change selection before proceeding
4. User clicks "Next" or uses skip/IDK buttons
5. Progress updates and next question loads

### Quiz Completion
1. User answers/skips final question
2. Submission confirmation (optional)
3. Quiz data submitted to Convex
4. User redirected to results page

## Accessibility Requirements
- Keyboard navigation for all interactions
- Screen reader support for progress announcements
- High contrast mode support
- Focus management during navigation
- ARIA labels for interactive elements

## Mobile Optimization
- Touch-friendly button sizes (44px minimum)
- Swipe gestures for navigation (optional)
- Proper spacing for thumbs
- Landscape mode support
- Prevent accidental exits

## Performance Considerations
- Lazy load questions to reduce initial bundle
- Optimistic UI updates
- Debounced answer selection
- Efficient re-renders
- Proper cleanup on unmount

## Error States to Handle
- Network connectivity issues
- Invalid/missing questions
- Server errors during submission
- Browser refresh during quiz
- Concurrent quiz attempts

## Definition of Done
- Quiz route and loader working
- Question display with Arabic text support
- Answer selection with visual feedback
- Skip and "I don't know" functionality
- Progress tracking and display
- Navigation between questions
- Quiz submission and scoring
- Error handling and validation
- Mobile-responsive design
- Accessibility compliance
- State management working correctly
- Performance optimized