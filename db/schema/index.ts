import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    displayName: v.string(),
  }).index("by_clerkId", ["clerkId"]).index("by_email", ["email"]),

  tajweedRules: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    isActive: v.boolean(),
  }).index("by_slug", ["slug"]).index("by_active", ["isActive"]),

  questions: defineTable({
    ruleId: v.id("tajweedRules"),
    prompt: v.string(),
    options: v.array(v.string()),
    correctOptionIndex: v.int64(),
    explanation: v.optional(v.string()),
    version: v.number(),
    isActive: v.boolean(),
  })
    .index("by_rule", ["ruleId", "isActive"])
    .index("by_rule_version", ["ruleId", "version"]),

  quizAttempts: defineTable({
    userId: v.id("users"),
    ruleId: v.id("tajweedRules"),
    scorePercent: v.number(),
    correctCount: v.int64(),
    totalCount: v.int64(),
    streakId: v.optional(v.id("streaks")),
  })
    .index("by_user_rule", ["userId", "ruleId"])
    .index("by_rule", ["ruleId", "_creationTime"])
    .index("by_user_time", ["userId", "_creationTime"]),

  attemptAnswers: defineTable({
    attemptId: v.id("quizAttempts"),
    questionId: v.id("questions"),
    selectedOptionIndex: v.optional(v.int64()),
    isCorrect: v.boolean(),
    skipped: v.boolean(),
  }).index("by_attempt", ["attemptId"]),

  streaks: defineTable({
    userId: v.id("users"),
    ruleId: v.id("tajweedRules"),
    currentLength: v.int64(),
    longestLength: v.int64(),
    lastAttemptId: v.optional(v.id("quizAttempts")),
  })
    .index("by_user_rule", ["userId", "ruleId"])
    .index("by_user", ["userId"]),

  analytics: defineTable({
    metric: v.string(),
    value: v.number(),
    date: v.string(),
  }).index("by_metric_date", ["metric", "date"]),
});

/**
 * Row-Level Security (conceptual policies for Supabase parity):
 * - users: users can select/update their own record via Clerk `clerkId`; admins (service role) can manage all.
 * - tajweedRules & questions: read-only for all authenticated users; insert/update restricted to service role.
 * - quizAttempts & attemptAnswers: users may insert/select rows where `userId` matches their profile; delete limited to service role.
 * - streaks: same as attempts; only owner or service role can read/write.
 * - analytics: readable by service role only; analytics aggregations run via backend service key.
 */

