# Tajweed Quiz MVP – User Flows

## 1. Sign-Up & Onboarding
1. Visit landing/dashboard → click "Get started".
2. Clerk modal → enter email → verify code → profile auto-provisioned in Convex `users` table.
3. Redirect to dashboard with welcome state (no attempts yet).

## 2. Select Rule & Start Quiz
1. Dashboard loads available `tajweedRules` (active=true).
2. User picks rule from dropdown → `Start Quiz` button enables.
3. Client navigates to `/quiz/:ruleSlug` → loader fetches rule metadata + 10 random active questions.

## 3. Complete Quiz
1. Questions displayed one per view with progress bar (e.g., `3/10 • 30%`).
2. User answers via multiple-choice buttons or taps `Skip` / `I don’t know`.
3. On final question submission → form posts to action.
4. Server validates payload, computes score, writes `quizAttempts` + `attemptAnswers`, updates streak.

## 4. Review Feedback
1. Redirect to `/results/:attemptId`.
2. Loader fetches attempt summary, streak info, weak rule points, and answer breakdown.
3. Results page shows score %, radar chart for rule performance (MVP single rule), weakness banner, and attempt history list.
4. User expands accordions for each missed/skipped question to view correct answer + explanation.

## 5. Repeat Quiz / Explore History
1. From results, call-to-action allows retaking same rule or returning home.
2. Dashboard history section lists attempts chronologically with score badges and streak indicator.
3. Selecting an attempt opens the detailed results page.

## 6. Account Management (Future friendly)
1. User opens account menu (Clerk control) to manage email, sign out.
2. Optional setting for reminder emails toggled once Resend flows exist (post-MVP).

