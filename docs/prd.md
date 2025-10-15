# Tajweed Quiz MVP PRD

## Introduction
Beginner Quran students who self-study often bounce off noisy, ad-heavy apps when they just want targeted Tajweed drills. The MVP delivers a focused, repeatable quiz for each rule so learners see their score immediately, understand weak spots, and retry without friction.

## Objectives & Goals
- Validate that niche, rule-specific quizzes drive repeat usage (100 WAU completing at least one quiz weekly).
- Provide instant feedback that highlights weak Tajweed rules so learners know what to review.
- Capture attempt history and streaks to surface retention signals for future product decisions.

## Target Users & Roles
- **Learner (primary):** Signs up, selects a Tajweed rule, runs quizzes, reviews feedback, and tracks streaks.
- **Admin/Content Creator (internal):** Seeds and updates the rule/question bank, monitors aggregate performance to refine content.

## Core Features for MVP
- **Rule-Focused Quizzes:** Select one of 3–5 Tajweed rules, answer 10 multiple-choice questions with skip/"I don’t know" controls, and see a progress bar.
- **Attempt Feedback Dashboard:** Show score percentage, flag weak rules, list attempt history, and allow expanding each weak area to view correct answers and explanations.

## Future Scope
- Adaptive difficulty, spaced repetition, and larger rule catalog.
- Instructor insights, audio pronunciation checks, social study groups.
- Premium add-ons once engagement proves sticky (advanced rule packs, guided study plans).

## User Journey
1. **Onboarding:** Learner signs up with email via Clerk, lands on the home dashboard.
2. **Rule Selection:** Chooses a Tajweed rule from the dropdown populated from the content catalog.
3. **Quiz Run:** Completes 10-question quiz with progress indicator, using skip or "I don’t know" when needed.
4. **Feedback Review:** Sees overall score, highlighted weaknesses, expandable sections listing missed questions and correct answers, plus attempt history with dates and streaks.
5. **Repeat:** Relaunches the quiz for the same or another rule to try for a higher score.

## Tech Stack
- **Frontend:** React Router v7 (SSR), TypeScript, Tailwind CSS, React Hook Form, Chart.js (radar chart for weaknesses), Radix UI/shadcn for components.
- **Backend:** Convex (quiz data, attempts, streaks).
- **Auth & Identity:** Clerk (email-based sign-up, GDPR compliant).
- **Emails:** Resend (optional notifications/reminders).
- **Payments:** None for MVP (remain free by design).
- **AI (Optional):** OpenAI (future coaching tips).
- **Hosting & Ops:** Vercel for app deployment, Convex managed runtime, Logtail/Sentry for monitoring.

