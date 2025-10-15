# Tajweed Quiz MVP Technical Design

## Architectural Overview
- **App Shell:** React Router v7 with SSR for fast first paint and route-driven loaders/actions.
- **State & Forms:** React Hook Form manages quiz answers; Zod handles validation.
- **Styling:** Tailwind CSS + shadcn/Radix primitives for accessible UI patterns.
- **Data Layer:** Convex stores rules, questions, quiz attempts, and streak stats with real-time listeners for dashboards.
- **Auth:** Clerk front-end components + Convex auth integration for session verification.
- **Charts & Visualization:** Chart.js radar chart rendered via `react-chartjs-2` to highlight weak rules.
- **Notifications:** Resend for optional recap emails (MVP: manual trigger only).
- **Analytics:** Convex jobs aggregate WAU + streak metrics; optional export to Supabase or BigQuery via scheduled actions (post-MVP).

## Module Breakdown
### Frontend (React Router)
- `routes/home.tsx`: Rule selection, attempt history list, CTA to start quiz.
- `routes/quiz.tsx`: Quiz loader fetches 10 questions, action records answers, client component renders progress bar, skip/"I don’t know" controls, and form submission.
- `routes/results.tsx`: Loader pulls attempt summary and question breakdown; radar chart shows weaknesses; accordions reveal correct answers.
- Shared UI in `app/components/` for dropdowns, progress bars, accordion, and streak badge.

### Convex Functions
- `convex/rules.ts`: Queries for available rules; internal mutation to seed/update question bank (manual content entry).
- `convex/quizzes.ts`: Mutation to create quiz attempt, evaluate score, compute streaks; query for attempt history.
- `convex/feedback.ts`: Query to compute weak-rule summary and per-question insights.
- Schedulers: optional nightly aggregation job computing WAU via attempt timestamps.

### Auth Flow
- Clerk frontend handles sign-up; session token passed to Convex via middleware hook; Convex verifies session with Clerk backend.

### Data Validation
- Use `convex/values` with explicit validators for rule IDs, question structures, options array (length 4), and correct answer index.
- On the client, reuse Zod schemas mirroring Convex validators to ensure consistent form expectations.

### Deployment & Ops
- Deploy frontend on Vercel; Convex handles serverless backend.
- Environment variables managed with Vercel + Convex dashboard (Clerk keys, Resend key, optional OpenAI key).
- Observability via Sentry (frontend) and Logtail (Convex logs).

## Third-Party Libraries & Services
- React Router v7, React Hook Form, Zod, Tailwind CSS, shadcn/ui, Radix UI, Chart.js + react-chartjs-2.
- Clerk for auth, Convex for backend, Resend for email, Polar (future), Vercel for hosting.
- Testing: Vitest + React Testing Library for components, Convex test harness for functions (post-MVP optional).

