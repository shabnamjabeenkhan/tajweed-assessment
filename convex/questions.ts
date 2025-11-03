import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all active questions for a rule
export const getQuestionsByRule = query({
  args: { ruleId: v.id("tajweedRules") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("questions")
      .withIndex("by_rule_active", (q) =>
        q.eq("ruleId", args.ruleId).eq("isActive", true)
      )
      .collect();
  },
});

// Alias for getQuestionsByRule
export const getByRule = getQuestionsByRule;

// Get a random set of questions for a quiz
export const getQuizQuestions = query({
  args: {
    ruleId: v.id("tajweedRules"),
    limit: v.optional(v.number()) // Default to 10
  },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_rule_active", (q) =>
        q.eq("ruleId", args.ruleId).eq("isActive", true)
      )
      .collect();

    const limit = args.limit || 10;

    // Use Fisher-Yates shuffle for better randomization
    const shuffled = [...questions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Return unique questions up to the limit
    return shuffled.slice(0, Math.min(limit, shuffled.length));
  },
});

// Create a new question
export const createQuestion = mutation({
  args: {
    ruleId: v.id("tajweedRules"),
    prompt: v.string(),
    options: v.array(v.string()),
    correctOptionIndex: v.number(),
    explanation: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate that correctOptionIndex is within bounds
    if (args.correctOptionIndex < 0 || args.correctOptionIndex >= args.options.length) {
      throw new Error("correctOptionIndex must be within the options array bounds");
    }

    return await ctx.db.insert("questions", {
      ruleId: args.ruleId,
      prompt: args.prompt,
      options: args.options,
      correctOptionIndex: args.correctOptionIndex,
      explanation: args.explanation,
      isActive: true,
      version: 1,
      createdAt: Date.now(),
    });
  },
});

// Update a question
export const updateQuestion = mutation({
  args: {
    id: v.id("questions"),
    prompt: v.optional(v.string()),
    options: v.optional(v.array(v.string())),
    correctOptionIndex: v.optional(v.number()),
    explanation: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // If updating options and correctOptionIndex, validate bounds
    if (updates.options && updates.correctOptionIndex !== undefined) {
      if (updates.correctOptionIndex < 0 || updates.correctOptionIndex >= updates.options.length) {
        throw new Error("correctOptionIndex must be within the options array bounds");
      }
    }

    return await ctx.db.patch(id, updates);
  },
});