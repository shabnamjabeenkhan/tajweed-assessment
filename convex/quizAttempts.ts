import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Get user's quiz history
export const getUserQuizHistory = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    const offset = args.offset || 0;

    const attempts = await ctx.db
      .query("quizAttempts")
      .withIndex("by_user_completed", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit + offset);

    // Get the attempts for this page
    const pageAttempts = attempts.slice(offset, offset + limit);

    // Enrich with rule information
    const enrichedAttempts = await Promise.all(
      pageAttempts.map(async (attempt) => {
        const rule = await ctx.db.get(attempt.ruleId);
        return {
          ...attempt,
          rule: rule ? { title: rule.title, slug: rule.slug } : null,
        };
      })
    );

    return {
      attempts: enrichedAttempts,
      hasMore: attempts.length > offset + limit,
    };
  },
});

// Get user's attempts for a specific rule
export const getUserRuleAttempts = query({
  args: {
    userId: v.id("users"),
    ruleId: v.id("tajweedRules"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizAttempts")
      .withIndex("by_user_rule", (q) =>
        q.eq("userId", args.userId).eq("ruleId", args.ruleId)
      )
      .order("desc")
      .collect();
  },
});

// Get quiz attempt details with answers
export const getAttemptDetails = query({
  args: { attemptId: v.id("quizAttempts") },
  handler: async (ctx, args) => {
    const attempt = await ctx.db.get(args.attemptId);
    if (!attempt) return null;

    // Get the rule information
    const rule = await ctx.db.get(attempt.ruleId);

    // Get all answers for this attempt
    const answers = await ctx.db
      .query("attemptAnswers")
      .withIndex("by_attempt", (q) => q.eq("attemptId", args.attemptId))
      .collect();

    // Enrich answers with question information
    const enrichedAnswers = await Promise.all(
      answers.map(async (answer) => {
        const question = await ctx.db.get(answer.questionId);
        return {
          ...answer,
          question,
        };
      })
    );

    return {
      ...attempt,
      rule,
      answers: enrichedAnswers,
    };
  },
});

// Create a new quiz attempt
export const createQuizAttempt = mutation({
  args: {
    userId: v.id("users"),
    ruleId: v.id("tajweedRules"),
    answers: v.array(
      v.object({
        questionId: v.id("questions"),
        selectedOptionIndex: v.optional(v.number()),
        skipped: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Calculate the score
    let correctCount = 0;
    const totalCount = args.answers.length;

    // Process each answer and determine correctness
    const processedAnswers = await Promise.all(
      args.answers.map(async (answer) => {
        if (answer.skipped) {
          return {
            questionId: answer.questionId,
            selectedOptionIndex: answer.selectedOptionIndex,
            isCorrect: false,
            skipped: true,
          };
        }

        // Get the question to check correctness
        const question = await ctx.db.get(answer.questionId);
        if (!question) {
          throw new Error(`Question ${answer.questionId} not found`);
        }

        const isCorrect = answer.selectedOptionIndex === question.correctOptionIndex;
        if (isCorrect) correctCount++;

        return {
          questionId: answer.questionId,
          selectedOptionIndex: answer.selectedOptionIndex,
          isCorrect,
          skipped: false,
        };
      })
    );

    const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    // Create the quiz attempt
    const attemptId = await ctx.db.insert("quizAttempts", {
      userId: args.userId,
      ruleId: args.ruleId,
      scorePercent,
      correctCount,
      totalCount,
      completedAt: Date.now(),
    });

    // Insert all the answers
    await Promise.all(
      processedAnswers.map((answer) =>
        ctx.db.insert("attemptAnswers", {
          attemptId,
          ...answer,
        })
      )
    );

    // Update user streaks
    await ctx.scheduler.runAfter(0, internal.streaks.updateStreak, {
      userId: args.userId,
      ruleId: args.ruleId,
      attemptId,
      scorePercent,
    });

    return attemptId;
  },
});