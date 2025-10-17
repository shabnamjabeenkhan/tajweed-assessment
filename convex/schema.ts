import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.optional(v.string()), // Made optional for backward compatibility
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    name: v.optional(v.string()), // Keep old field for backward compatibility
    image: v.optional(v.string()),
    tokenIdentifier: v.string(),
    createdAt: v.optional(v.number()), // Made optional for backward compatibility
    updatedAt: v.optional(v.number()), // Made optional for backward compatibility
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // Tajweed Quiz Tables
  tajweedRules: defineTable({
    slug: v.string(),
    title: v.string(),
    description: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["isActive"]),

  questions: defineTable({
    ruleId: v.id("tajweedRules"),
    prompt: v.string(),
    options: v.array(v.string()),
    correctOptionIndex: v.number(),
    explanation: v.string(),
    isActive: v.boolean(),
    version: v.number(),
    createdAt: v.number(),
  })
    .index("by_rule", ["ruleId"])
    .index("by_rule_active", ["ruleId", "isActive"]),

  quizAttempts: defineTable({
    userId: v.id("users"),
    ruleId: v.id("tajweedRules"),
    scorePercent: v.number(),
    correctCount: v.number(),
    totalCount: v.number(),
    completedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_rule", ["userId", "ruleId"])
    .index("by_user_completed", ["userId", "completedAt"]),

  attemptAnswers: defineTable({
    attemptId: v.id("quizAttempts"),
    questionId: v.id("questions"),
    selectedOptionIndex: v.optional(v.number()),
    isCorrect: v.boolean(),
    skipped: v.boolean(),
  })
    .index("by_attempt", ["attemptId"])
    .index("by_question", ["questionId"]),

  streaks: defineTable({
    userId: v.id("users"),
    ruleId: v.id("tajweedRules"),
    currentLength: v.number(),
    longestLength: v.number(),
    lastAttemptId: v.optional(v.id("quizAttempts")),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_rule", ["userId", "ruleId"]),

  subscriptions: defineTable({
    userId: v.optional(v.string()),
    polarId: v.optional(v.string()),
    polarPriceId: v.optional(v.string()),
    currency: v.optional(v.string()),
    interval: v.optional(v.string()),
    status: v.optional(v.string()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    amount: v.optional(v.number()),
    startedAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
    canceledAt: v.optional(v.number()),
    customerCancellationReason: v.optional(v.string()),
    customerCancellationComment: v.optional(v.string()),
    metadata: v.optional(v.any()),
    customFieldData: v.optional(v.any()),
    customerId: v.optional(v.string()),
  })
    .index("userId", ["userId"])
    .index("polarId", ["polarId"]),
  payments: defineTable({
    polarId: v.string(),
    polarPriceId: v.string(),
    currency: v.string(),
    amount: v.number(),
    status: v.string(),
    productType: v.string(),
    paidAt: v.number(),
    metadata: v.optional(v.any()),
    customerId: v.optional(v.string()),
    userId: v.string(),
  })
    .index("userId", ["userId"])
    .index("polarId", ["polarId"]),
  webhookEvents: defineTable({
    id: v.optional(v.string()),
    type: v.string(),
    polarEventId: v.string(),
    createdAt: v.string(),
    modifiedAt: v.string(),
    data: v.any(),
    processed: v.optional(v.boolean()),
    created_at: v.optional(v.number()),
    webhookId: v.optional(v.string()),
    processingStatus: v.optional(v.string()),
    processedAt: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
  })
    .index("type", ["type"])
    .index("polarEventId", ["polarEventId"])
    .index("by_webhook_id", ["webhookId"]),
});
