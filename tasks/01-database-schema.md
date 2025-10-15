# Database Schema & Convex Functions

**Priority:** Foundation (Start First)
**Estimated Time:** 2-3 days
**Dependencies:** None

## Overview
Set up the core database schema and Convex functions for the Tajweed Quiz MVP. This includes all tables for users, rules, questions, attempts, and streak tracking.

## Tasks

### 1.1 Create Users Table Schema
- **Description:** Create `users` table schema in Convex with Clerk integration
- **Acceptance Criteria:**
  - Table includes: `clerkId`, `email`, `displayName`, `createdAt`, `updatedAt`
  - Proper indexes on `clerkId` and `email`
  - Integration with Clerk webhook for auto-creation
- **Files to Create/Modify:**
  - `convex/schema.ts`
  - `convex/users.ts`

### 1.2 Create Tajweed Rules Table
- **Description:** Create `tajweedRules` table with slug, title, description, isActive fields
- **Acceptance Criteria:**
  - Table includes: `slug`, `title`, `description`, `isActive`, `createdAt`
  - Unique index on `slug`
  - Index on `isActive` for filtering
- **Files to Create/Modify:**
  - `convex/schema.ts`
  - `convex/tajweedRules.ts`

### 1.3 Create Questions Table
- **Description:** Create `questions` table with ruleId FK, prompt, options array, correctOptionIndex, explanation
- **Acceptance Criteria:**
  - Table includes: `ruleId`, `prompt`, `options`, `correctOptionIndex`, `explanation`, `isActive`, `version`
  - Foreign key to `tajweedRules`
  - Composite index on (`ruleId`, `isActive`)
- **Files to Create/Modify:**
  - `convex/schema.ts`
  - `convex/questions.ts`

### 1.4 Create Quiz Attempts Table
- **Description:** Create `quizAttempts` table with userId, ruleId, scorePercent, correctCount, totalCount
- **Acceptance Criteria:**
  - Table includes: `userId`, `ruleId`, `scorePercent`, `correctCount`, `totalCount`, `completedAt`
  - Indexes on (`userId`, `ruleId`) and (`userId`, `completedAt`)
  - Foreign keys to `users` and `tajweedRules`
- **Files to Create/Modify:**
  - `convex/schema.ts`
  - `convex/quizAttempts.ts`

### 1.5 Create Attempt Answers Table
- **Description:** Create `attemptAnswers` table with attemptId, questionId, selectedOptionIndex, isCorrect, skipped
- **Acceptance Criteria:**
  - Table includes: `attemptId`, `questionId`, `selectedOptionIndex`, `isCorrect`, `skipped`
  - Index on `attemptId`
  - Foreign keys to `quizAttempts` and `questions`
- **Files to Create/Modify:**
  - `convex/schema.ts`
  - `convex/attemptAnswers.ts`

### 1.6 Create Streaks Table
- **Description:** Create `streaks` table with userId, ruleId, currentLength, longestLength
- **Acceptance Criteria:**
  - Table includes: `userId`, `ruleId`, `currentLength`, `longestLength`, `lastAttemptId`, `updatedAt`
  - Composite unique index on (`userId`, `ruleId`)
  - Foreign keys properly configured
- **Files to Create/Modify:**
  - `convex/schema.ts`
  - `convex/streaks.ts`

### 1.7 Write Quiz Attempt Mutation
- **Description:** Write Convex mutation for creating quiz attempts
- **Acceptance Criteria:**
  - Function accepts quiz answers and calculates score
  - Creates both `quizAttempts` and `attemptAnswers` records
  - Updates user streaks
  - Returns attempt ID for results page
- **Files to Create/Modify:**
  - `convex/quizAttempts.ts`

### 1.8 Write Quiz Answer Recording
- **Description:** Write Convex mutation for recording quiz answers
- **Acceptance Criteria:**
  - Validates answer format and question existence
  - Calculates correctness automatically
  - Handles skipped questions properly
- **Files to Create/Modify:**
  - `convex/attemptAnswers.ts`

### 1.9 Write Quiz History Query
- **Description:** Write Convex query for fetching user's quiz history
- **Acceptance Criteria:**
  - Returns paginated attempt history for user
  - Includes rule information and scores
  - Sorted by most recent first
- **Files to Create/Modify:**
  - `convex/quizAttempts.ts`

### 1.10 Write Streak Calculation
- **Description:** Write Convex query for calculating streaks
- **Acceptance Criteria:**
  - Calculates current and longest streaks per rule
  - Updates automatically when new attempts are made
  - Handles streak breaks (missed days)
- **Files to Create/Modify:**
  - `convex/streaks.ts`

## Definition of Done
- All tables created with proper schema
- Indexes created for performance
- All mutations and queries tested
- TypeScript types exported for frontend use
- Basic data validation in place