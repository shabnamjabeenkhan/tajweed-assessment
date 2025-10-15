# Database Schema – Notes

- **users**
  - Columns: `clerk_id`, `email`, `display_name`, timestamps.
  - Indexes: by `clerk_id`, by `email` for fast lookup.
  - RLS: user can read/update self; service role manages all.

- **tajweed_rules**
  - Columns: `slug`, `title`, `description`, `is_active`.
  - Index: by `slug`, by `is_active` for rule listing.
  - RLS: read for all authenticated; write restricted to admin/service role.

- **questions**
  - Columns: `rule_id` FK → `tajweed_rules`, `prompt`, `options` (JSONB array of 4), `correct_option_index`, `explanation`, `version`, `is_active`.
  - Indexes: (`rule_id`, `is_active`), (`rule_id`, `version`).
  - RLS: read for all authenticated; write only admin/service role.

- **quiz_attempts**
  - Columns: `user_id` FK → `users`, `rule_id` FK → `tajweed_rules`, `score_percent`, `correct_count`, `total_count`, timestamps.
  - Indexes: (`user_id`, `rule_id`), (`rule_id`, `created_at`), (`user_id`, `created_at`).
  - RLS: owner can insert/select/update; delete restricted to service role.

- **attempt_answers**
  - Columns: `attempt_id` FK → `quiz_attempts`, `question_id` FK → `questions`, `selected_option_index`, `is_correct`, `skipped`.
  - Index: `attempt_id`.
  - RLS: owner can read/insert; admin/service role can manage all.

- **streaks**
  - Columns: `user_id`, `rule_id`, `current_length`, `longest_length`, `last_attempt_id` (FK → `quiz_attempts`).
  - Indexes: (`user_id`, `rule_id`), (`user_id`).
  - RLS: owner read/update; admin/service role full access.

- **analytics** (aggregated metrics)
  - Columns: `metric`, `value`, `date` (ISO string).
  - Index: (`metric`, `date`).
  - RLS: service role only.

## Relationships & Cascades
- Deleting a `tajweed_rule` cascades to `questions`, `quiz_attempts`, `streaks`, `attempt_answers` via cascading foreign keys.
- Deleting a `user` cascades to `quiz_attempts`, `attempt_answers`, `streaks` to prevent orphan data.
- Updates on `questions` versioned via `version` field rather than direct mutation; set `is_active=false` for retired questions to preserve history.

## Usage Notes
- Application writes performed via Convex functions; Supabase RLS rules defined to mirror above when syncing data downstream.
- For WAU aggregation, nightly job stores metrics in `analytics` with `metric='wau'` and ISO week start date.

