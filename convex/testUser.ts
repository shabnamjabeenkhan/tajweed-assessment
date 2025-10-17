import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a test user for MVP (temporary)
export const createTestUser = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if test user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", "test-user-mvp"))
      .unique();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new test user
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: "test-user-mvp",
      name: "MVP Test User",
      email: "test@example.com",
      displayName: "MVP Test User",
      clerkId: "test-clerk-mvp",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

// Get test user ID
export const getTestUser = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", "test-user-mvp"))
      .unique();

    return user?._id || null;
  },
});