# Business Logic & Calculations

**Priority:** Core Feature
**Estimated Time:** 2 days
**Dependencies:** Database Schema

## Overview
Implement core business logic for quiz scoring, weakness detection, streak calculations, and user progress tracking. These functions form the intelligence behind the quiz feedback system.

## Tasks

### 8.1 Implement Quiz Scoring Algorithm
- **Description:** Create comprehensive quiz scoring system with percentage calculation
- **Acceptance Criteria:**
  - Calculates score as percentage (correct answers / total questions)
  - Handles skipped questions appropriately (marked as incorrect)
  - Handles "I don't know" responses (marked as incorrect but tracked separately)
  - Provides detailed breakdown of performance
  - Rounds to appropriate decimal places
- **Files to Create:**
  - `app/lib/scoring.ts`
  - `convex/lib/scoring.ts` (server-side validation)

### 8.2 Create Weakness Detection Logic
- **Description:** Analyze quiz performance to identify weak areas for improvement
- **Acceptance Criteria:**
  - Identifies rules/topics with <70% accuracy
  - Tracks patterns across multiple attempts
  - Provides specific improvement suggestions
  - Considers question difficulty and type
  - Generates actionable feedback messages
- **Files to Create:**
  - `app/lib/weakness-detection.ts`
  - `convex/lib/analytics.ts`

### 8.3 Build Streak Calculation System
- **Description:** Track and calculate user streaks for motivation and engagement
- **Acceptance Criteria:**
  - Calculates consecutive daily quiz attempts
  - Tracks current streak and longest streak per rule
  - Handles streak breaks (missed days) appropriately
  - Considers timezone differences for daily tracking
  - Updates streaks automatically after quiz completion
- **Files to Create:**
  - `app/lib/streaks.ts`
  - `convex/streaks.ts` (streak management functions)

### 8.4 Add Attempt History Aggregation
- **Description:** Aggregate and analyze user's attempt history for insights
- **Acceptance Criteria:**
  - Sorts attempts chronologically
  - Calculates trends and improvement over time
  - Identifies best and worst performing rules
  - Provides statistics for dashboard display
  - Supports pagination for users with many attempts
- **Files to Create:**
  - `app/lib/history-analysis.ts`
  - `convex/lib/aggregations.ts`

### 8.5 Implement Question Randomization
- **Description:** Ensure fair question selection and prevent memorization
- **Acceptance Criteria:**
  - Selects 10 random questions from available pool per rule
  - Ensures variety across question types/difficulty
  - Prevents same question appearing twice in one session
  - Tracks question usage to ensure fair distribution
  - Provides fallback for rules with limited questions
- **Files to Create:**
  - `app/lib/question-selection.ts`
  - `convex/lib/randomization.ts`

### 8.6 Create User Progress Tracking
- **Description:** Track overall user progress and learning journey
- **Acceptance Criteria:**
  - Calculates overall progress across all rules
  - Tracks time spent learning and quiz completion
  - Identifies mastered vs. struggling rules
  - Provides recommendations for next steps
  - Supports goal setting and achievement tracking
- **Files to Create:**
  - `app/lib/progress-tracking.ts`
  - `convex/lib/user-analytics.ts`

### 8.7 Build Performance Comparison Logic
- **Description:** Compare current performance with previous attempts
- **Acceptance Criteria:**
  - Compares current attempt with user's average
  - Shows improvement/decline trends
  - Identifies performance milestones
  - Provides motivational messaging based on trends
  - Handles edge cases (first attempt, irregular usage)
- **Files to Create:**
  - `app/lib/performance-comparison.ts`

### 8.8 Implement Achievement System
- **Description:** Create achievement/milestone system for user engagement
- **Acceptance Criteria:**
  - Defines achievement criteria (streaks, scores, completion)
  - Tracks achievement progress automatically
  - Provides notifications for earned achievements
  - Creates shareable achievement summaries
  - Supports different achievement types and levels
- **Files to Create:**
  - `app/lib/achievements.ts`
  - `convex/achievements.ts`

### 8.9 Add Analytics and Insights Generation
- **Description:** Generate personalized insights from user data
- **Acceptance Criteria:**
  - Analyzes learning patterns and preferences
  - Identifies optimal quiz timing and frequency
  - Provides personalized study recommendations
  - Generates weekly/monthly progress reports
  - Supports A/B testing for feature improvements
- **Files to Create:**
  - `app/lib/insights-generator.ts`
  - `convex/lib/analytics-engine.ts`

### 8.10 Create Data Validation and Integrity
- **Description:** Ensure data consistency and prevent gaming/cheating
- **Acceptance Criteria:**
  - Validates quiz submission timing and sequence
  - Prevents duplicate submissions
  - Detects unusual patterns (too fast completion)
  - Maintains data integrity across operations
  - Provides audit trail for important actions
- **Files to Create:**
  - `app/lib/validation.ts`
  - `convex/lib/integrity-checks.ts`

## Scoring Algorithm Details

### Basic Scoring
```typescript
interface QuizScore {
  percentage: number;           // 0-100
  correctCount: number;         // Number correct
  totalCount: number;          // Total questions
  skippedCount: number;        // Skipped questions
  dontKnowCount: number;       // "I don't know" responses
  timeSpent: number;           // Seconds spent
}

function calculateScore(answers: QuizAnswer[]): QuizScore {
  // Implementation details
}
```

### Performance Categories
- **Mastery (90-100%):** Rule is well understood
- **Proficient (70-89%):** Good understanding with minor gaps
- **Developing (50-69%):** Basic understanding, needs practice
- **Struggling (<50%):** Fundamental concepts need review

## Streak Calculation Logic

### Daily Streak Rules
- Quiz must be completed within calendar day (user timezone)
- Minimum one quiz per day to maintain streak
- Multiple quizzes on same day don't multiply streak
- Streak breaks reset to 0 but longest streak is preserved

### Streak Types
- **Daily Quiz Streak:** Consecutive days with at least one quiz
- **Rule Mastery Streak:** Consecutive quizzes with >80% score
- **Learning Streak:** Consecutive days of improvement

## Weakness Detection Criteria

### Weakness Indicators
- Score below 70% on recent attempts
- Declining performance over time
- Consistent errors on specific question types
- Long time between attempts (forgotten material)

### Improvement Suggestions
- Specific topic review recommendations
- Practice frequency suggestions
- Learning resource links (future)
- Study buddy connections (future)

## Analytics Metrics to Track

### User Engagement
- Quiz completion rate
- Time between attempts
- Streak lengths and breaks
- Feature usage patterns

### Learning Effectiveness
- Score improvement over time
- Retention rates between sessions
- Question difficulty correlation with accuracy
- Time spent vs. performance correlation

### Content Quality
- Question accuracy rates
- Commonly missed questions
- Rule difficulty rankings
- Content gaps identification

## Performance Considerations
- Cache frequently calculated metrics
- Batch database operations for efficiency
- Use appropriate indexes for analytics queries
- Implement background jobs for heavy calculations

## Future Enhancement Hooks
- Machine learning for personalized recommendations
- Adaptive difficulty based on performance
- Social features (leaderboards, challenges)
- Integration with external learning resources

## Definition of Done
- All scoring algorithms implemented and tested
- Weakness detection provides actionable insights
- Streak calculations work correctly across timezones
- Attempt history analysis provides meaningful trends
- Question randomization ensures fairness
- Progress tracking gives users clear sense of advancement
- Performance comparisons motivate continued learning
- Achievement system engages users appropriately
- Analytics provide insights for product improvement
- Data validation prevents gaming and ensures integrity
- All business logic is thoroughly tested
- TypeScript types are complete and accurate