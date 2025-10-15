# Home Dashboard & Rule Selection

**Priority:** Core Feature
**Estimated Time:** 2-3 days
**Dependencies:** Database Schema, Authentication, Content Seeding

## Overview
Create the main dashboard where users land after authentication. Includes rule selection, quiz history, streak display, and welcome states for new users.

## Tasks

### 4.1 Create Dashboard Route
- **Description:** Create dashboard route `/dashboard` with loader for user data
- **Acceptance Criteria:**
  - Route loader fetches user's quiz history
  - Route loader fetches available Tajweed rules
  - Route loader fetches user's current streaks
  - Proper error handling and loading states
  - TypeScript types for all loader data
- **Files to Create:**
  - `app/routes/_protected.dashboard.tsx`
  - `app/lib/dashboard.ts` (loader functions)

### 4.2 Design Dashboard Layout
- **Description:** Design responsive dashboard UI with rule selection and user stats
- **Acceptance Criteria:**
  - Clean, focused layout with clear sections
  - Mobile-responsive design
  - Consistent with app design system
  - Proper loading and empty states
- **Components to Create:**
  - Main dashboard container
  - Rule selection section
  - Stats overview section
  - Recent activity section

### 4.3 Build Rule Selection Component
- **Description:** Create rule selection dropdown with quiz start functionality
- **Acceptance Criteria:**
  - Dropdown shows all active Tajweed rules
  - Rule descriptions visible on selection
  - "Start Quiz" button enables when rule selected
  - Visual feedback for user interactions
  - Keyboard accessibility support
- **Files to Create:**
  - `app/components/dashboard/RuleSelector.tsx`
  - `app/components/ui/Select.tsx` (if not exists)

### 4.4 Create Attempt History Display
- **Description:** Display user's recent attempt history with scores and dates
- **Acceptance Criteria:**
  - Shows last 10 attempts chronologically
  - Displays rule name, score, and completion date
  - Visual score indicators (badges, colors)
  - Links to detailed results for each attempt
  - Pagination for users with many attempts
- **Files to Create:**
  - `app/components/dashboard/AttemptHistory.tsx`
  - `app/components/dashboard/AttemptCard.tsx`

### 4.5 Build Streak Display
- **Description:** Show current streak information per rule
- **Acceptance Criteria:**
  - Displays current streak length for each rule
  - Shows longest streak achieved
  - Visual streak indicators (fire emoji, progress bars)
  - Streak continuation logic (daily attempts)
  - Motivational messaging for streaks
- **Files to Create:**
  - `app/components/dashboard/StreakDisplay.tsx`
  - `app/components/dashboard/StreakCard.tsx`

### 4.6 Create Welcome State
- **Description:** Add welcome state for new users with no attempts
- **Acceptance Criteria:**
  - Friendly onboarding message for new users
  - Clear call-to-action to start first quiz
  - Brief explanation of how the app works
  - Tips for getting started with Tajweed
- **Files to Create:**
  - `app/components/dashboard/WelcomeState.tsx`

### 4.7 Add Dashboard Stats
- **Description:** Create overview stats section with user progress
- **Acceptance Criteria:**
  - Total quizzes completed
  - Overall average score
  - Best performing rule
  - Longest streak across all rules
  - Visual progress indicators
- **Files to Create:**
  - `app/components/dashboard/StatsOverview.tsx`
  - `app/components/dashboard/StatCard.tsx`

### 4.8 Implement Quick Actions
- **Description:** Add quick action buttons for common user tasks
- **Acceptance Criteria:**
  - "Continue Last Rule" button (if applicable)
  - "Random Quiz" button for any rule
  - "Review Weaknesses" button (rules with low scores)
  - Clear visual hierarchy for actions
- **Files to Create:**
  - `app/components/dashboard/QuickActions.tsx`

## Dashboard Layout Structure

```
┌─────────────────────────────────────┐
│ Header with User Profile            │
├─────────────────────────────────────┤
│ Welcome Message / Stats Overview    │
├─────────────────────────────────────┤
│ Rule Selection & Start Quiz         │
├─────────────────────────────────────┤
│ Current Streaks                     │
├─────────────────────────────────────┤
│ Recent Attempt History              │
├─────────────────────────────────────┤
│ Quick Actions                       │
└─────────────────────────────────────┘
```

## User States to Handle

### New User (No Attempts)
- Welcome message with app explanation
- Prominent rule selection
- Getting started tips
- No history or streak sections

### Active User (Has Attempts)
- Stats overview with progress
- All sections visible
- Personalized recommendations
- Continue/retry suggestions

### Returning User (Long Break)
- Welcome back message
- Streak recovery motivation
- Review of past performance
- Gentle re-engagement

## Responsive Design Requirements
- Mobile-first design approach
- Touch-friendly buttons and interactions
- Proper spacing for small screens
- Horizontal scrolling for streak cards on mobile
- Collapsible sections for better mobile UX

## Definition of Done
- Dashboard route fully functional
- All components responsive and accessible
- User data loads correctly
- Quiz navigation works from rule selection
- History and streaks display accurately
- Welcome state works for new users
- All interactions have proper feedback
- TypeScript types complete
- Error states handled gracefully