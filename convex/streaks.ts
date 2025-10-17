import { v } from "convex/values";
import { query, mutation, internalAction } from "./_generated/server";

// Get user's streaks for all rules
export const getUserStreaks = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const streaks = await ctx.db
      .query("streaks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Enrich with rule information
    return await Promise.all(
      streaks.map(async (streak) => {
        const rule = await ctx.db.get(streak.ruleId);
        return {
          ...streak,
          rule: rule ? { title: rule.title, slug: rule.slug } : null,
        };
      })
    );
  },
});

// Get user's streak for a specific rule
export const getUserRuleStreak = query({
  args: {
    userId: v.id("users"),
    ruleId: v.id("tajweedRules"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("streaks")
      .withIndex("by_user_rule", (q) =>
        q.eq("userId", args.userId).eq("ruleId", args.ruleId)
      )
      .first();
  },
});

// Update streak after a quiz attempt (internal)
export const updateStreak = internalAction({
  args: {
    userId: v.id("users"),
    ruleId: v.id("tajweedRules"),
    attemptId: v.id("quizAttempts"),
    scorePercent: v.number(),
  },
  handler: async (ctx, args) => {
    // Define what constitutes a successful attempt (e.g., 70% or higher)
    const STREAK_THRESHOLD = 70;
    const isSuccessful = args.scorePercent >= STREAK_THRESHOLD;

    // Get the current streak directly
    const existingStreak = await ctx.runQuery("streaks:getUserRuleStreak" as any, {
      userId: args.userId,
      ruleId: args.ruleId,
    });

    if (existingStreak) {
      // Update existing streak
      if (isSuccessful) {
        // Extend the streak
        const newCurrentLength = existingStreak.currentLength + 1;
        const newLongestLength = Math.max(existingStreak.longestLength, newCurrentLength);

        await ctx.runMutation("streaks:updateExistingStreak" as any, {
          streakId: existingStreak._id,
          currentLength: newCurrentLength,
          longestLength: newLongestLength,
          lastAttemptId: args.attemptId,
        });
      } else {
        // Break the streak
        await ctx.runMutation("streaks:updateExistingStreak" as any, {
          streakId: existingStreak._id,
          currentLength: 0,
          longestLength: existingStreak.longestLength, // Keep the longest
          lastAttemptId: args.attemptId,
        });
      }
    } else {
      // Create new streak
      await ctx.runMutation("streaks:createNewStreak" as any, {
        userId: args.userId,
        ruleId: args.ruleId,
        currentLength: isSuccessful ? 1 : 0,
        longestLength: isSuccessful ? 1 : 0,
        lastAttemptId: args.attemptId,
      });
    }
  },
});

// Helper mutation to update existing streak
export const updateExistingStreak = mutation({
  args: {
    streakId: v.id("streaks"),
    currentLength: v.number(),
    longestLength: v.number(),
    lastAttemptId: v.id("quizAttempts"),
  },
  handler: async (ctx, args) => {
    const { streakId, ...updates } = args;
    return await ctx.db.patch(streakId, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Helper mutation to create new streak
export const createNewStreak = mutation({
  args: {
    userId: v.id("users"),
    ruleId: v.id("tajweedRules"),
    currentLength: v.number(),
    longestLength: v.number(),
    lastAttemptId: v.id("quizAttempts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("streaks", {
      userId: args.userId,
      ruleId: args.ruleId,
      currentLength: args.currentLength,
      longestLength: args.longestLength,
      lastAttemptId: args.lastAttemptId,
      updatedAt: Date.now(),
    });
  },
});

// Get user's overall streak statistics
export const getUserOverallStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const streaks = await ctx.db
      .query("streaks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const totalCurrentStreak = streaks.reduce((sum, streak) => sum + streak.currentLength, 0);
    const totalLongestStreak = Math.max(...streaks.map(s => s.longestLength), 0);
    const activeStreaks = streaks.filter(s => s.currentLength > 0).length;

    return {
      totalCurrentStreak,
      totalLongestStreak,
      activeStreaks,
      totalRulesTracked: streaks.length,
    };
  },
});