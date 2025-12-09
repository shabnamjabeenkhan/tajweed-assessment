import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    // Get the user's identity from the auth context
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      // Log for debugging in production
      console.log("[getCurrentUser] No identity found - user may not be authenticated");
      return null;
    }

    // Check if we've already stored this identity before
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    return user || null;
  },
});

// Debug query to check auth configuration
export const debugAuthConfig = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const envVar = process.env.VITE_CLERK_FRONTEND_API_URL || process.env.CLERK_FRONTEND_API_URL || "not set";
    
    return {
      hasIdentity: !!identity,
      identitySubject: identity?.subject || null,
      identityIssuer: identity?.issuer || null,
      envVar: envVar,
      // Compare issuer vs env var to help diagnose mismatch
      issuerMatchesEnvVar: identity?.issuer === envVar,
      // Show what domain should be configured
      expectedDomain: envVar !== "not set" ? envVar : "https://clerk.tajweedsimplified.com",
    };
  },
});

export const findUserByToken = query({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, args) => {
    // Get the user's identity from the auth context
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    // Check if we've already stored this identity before
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (user !== null) {
      return user;
    }

    return null;
  },
});

export const upsertUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      // Enhanced logging for production debugging
      console.error("[upsertUser] No identity found - auth may not be configured correctly");
      console.error("[upsertUser] This usually means:");
      console.error("  1. Clerk JWT token is not being passed to Convex");
      console.error("  2. Convex auth.config.ts domain doesn't match Clerk issuer URL");
      console.error("  3. VITE_CLERK_FRONTEND_API_URL env var not set in Convex Dashboard");
      console.error("[upsertUser] Check Convex Production logs for auth.config.ts domain value");
      console.error("[upsertUser] Verify Clerk JWT template 'convex' exists and issuer URL matches");
      throw new Error("Authentication required. Please ensure you are signed in and try again.");
    }

    console.log("[upsertUser] Identity found:", {
      subject: identity.subject,
      issuer: identity.issuer,
      name: identity.name,
      email: identity.email,
    });

    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (existingUser) {
      // Update if needed
      // Check if we need to update (handle both old and new users)
      const currentName = existingUser.displayName || existingUser.name;
      if (
        currentName !== identity.name ||
        existingUser.email !== identity.email ||
        !existingUser.clerkId
      ) {
        await ctx.db.patch(existingUser._id, {
          clerkId: existingUser.clerkId || identity.subject,
          displayName: identity.name,
          email: identity.email,
          updatedAt: Date.now(),
        });
      }
      return existingUser;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      displayName: identity.name,
      email: identity.email,
      tokenIdentifier: identity.subject,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Schedule welcome email; internal function handles config gating
    await ctx.scheduler.runAfter(0, internal.sendEmails.sendWelcomeEmail, {
      email: identity.email!,
      name: identity.name!,
    });

    return await ctx.db.get(userId);
  },
});
