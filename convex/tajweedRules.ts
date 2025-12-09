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

// Get only the four main Tajweed rules in the correct order
export const getMainRules = query({
  args: {},
  handler: async (ctx) => {
    const mainRuleSlugs = ["ith-har", "idghaam", "iqlaab", "ikhfaa"];
    const rules = await Promise.all(
      mainRuleSlugs.map(slug =>
        ctx.db
          .query("tajweedRules")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .first()
      )
    );
    // Filter out any null results and return only active rules
    // Promise.all preserves order, so we just need to filter
    return rules.filter((rule): rule is NonNullable<typeof rule> => 
      rule !== null && rule.isActive
    );
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

// Alias for getRuleBySlug
export const getBySlug = getRuleBySlug;

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
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

// Fix slug mismatches - update idgham -> idghaam and ikhfa -> ikhfaa
export const fixSlugMismatches = mutation({
  args: {},
  handler: async (ctx) => {
    // Find rules with old slugs
    const idghamRule = await ctx.db
      .query("tajweedRules")
      .withIndex("by_slug", (q) => q.eq("slug", "idgham"))
      .first();
    
    const ikhfaRule = await ctx.db
      .query("tajweedRules")
      .withIndex("by_slug", (q) => q.eq("slug", "ikhfa"))
      .first();

    const updates = [];
    
    if (idghamRule) {
      await ctx.db.patch(idghamRule._id, { slug: "idghaam" });
      updates.push("idgham -> idghaam");
    }
    
    if (ikhfaRule) {
      await ctx.db.patch(ikhfaRule._id, { slug: "ikhfaa" });
      updates.push("ikhfa -> ikhfaa");
    }

    return { success: true, updates };
  },
});