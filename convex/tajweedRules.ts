import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all active Tajweed rules
export const getActiveRules = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tajweedRules")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("desc")
      .collect();
  },
});

// Get a single rule by slug
export const getRuleBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tajweedRules")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// Create a new Tajweed rule (admin only)
export const createRule = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tajweedRules", {
      slug: args.slug,
      title: args.title,
      description: args.description,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

// Update a rule
export const updateRule = mutation({
  args: {
    id: v.id("tajweedRules"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});