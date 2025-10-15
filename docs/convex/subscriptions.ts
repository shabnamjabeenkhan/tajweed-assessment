import { Polar } from "@polar-sh/sdk";
import { v } from "convex/values";
import { Webhook, WebhookVerificationError } from "standardwebhooks";
import { api } from "./_generated/api";
import { action, httpAction, mutation, query } from "./_generated/server";

export const checkUserSubscriptionStatus = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let tokenIdentifier: string;

    if (args.userId) {
      // Use provided userId directly as tokenIdentifier (they are the same)
      tokenIdentifier = args.userId;
    } else {
      // Fall back to auth context
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        return { hasActiveSubscription: false };
      }
      tokenIdentifier = identity.subject;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();

    if (!user) {
      return { hasActiveSubscription: false };
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", user.tokenIdentifier))
      .first();

    const hasActiveSubscription = subscription?.status === "active";
    return { hasActiveSubscription };
  },
});

export const checkUserSubscriptionStatusByClerkId = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("🔍 [checkUserSubscriptionStatusByClerkId] Starting check for clerkUserId:", args.clerkUserId);
    
    // Find user by Clerk user ID (tokenIdentifier is the Clerk user ID)
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.clerkUserId))
      .unique();

    console.log("👤 [checkUserSubscriptionStatusByClerkId] User lookup result:", user ? {
      _id: user._id,
      tokenIdentifier: user.tokenIdentifier,
      email: user.email,
      name: user.name
    } : "null");

    if (!user) {
      console.log("❌ [checkUserSubscriptionStatusByClerkId] No user found, returning no_user status");
      return { 
        hasActiveSubscription: false,
        subscription: null,
        payment: null,
        status: 'no_user'
      };
    }

    // Check for active subscriptions (we store Clerk tokenIdentifier in userId)
    console.log("📋 [checkUserSubscriptionStatusByClerkId] Checking subscriptions for userId:", user.tokenIdentifier);
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", user.tokenIdentifier))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    console.log("📋 [checkUserSubscriptionStatusByClerkId] Active subscription found:", subscription ? {
      _id: subscription._id,
      polarId: subscription.polarId,
      status: subscription.status,
      interval: subscription.interval,
      amount: subscription.amount,
      currentPeriodEnd: subscription.currentPeriodEnd
    } : "null");

    // Check for lifetime payments
    console.log("💳 [checkUserSubscriptionStatusByClerkId] Checking lifetime payments for userId:", user.tokenIdentifier);
    const lifetimePayment = await ctx.db
      .query("payments")
      .withIndex("userId", (q) => q.eq("userId", user.tokenIdentifier))
      .filter((q) => q.eq(q.field("productType"), "lifetime"))
      .first();

    console.log("💳 [checkUserSubscriptionStatusByClerkId] Lifetime payment found:", lifetimePayment ? {
      _id: lifetimePayment._id,
      polarId: lifetimePayment.polarId,
      productType: lifetimePayment.productType,
      status: lifetimePayment.status,
      amount: lifetimePayment.amount,
      paidAt: lifetimePayment.paidAt
    } : "null");

    // Check for 1-year payments that haven't expired
    console.log("📅 [checkUserSubscriptionStatusByClerkId] Checking 1-year payments for userId:", user.tokenIdentifier);
    const oneYearPayment = await ctx.db
      .query("payments")
      .withIndex("userId", (q) => q.eq("userId", user.tokenIdentifier))
      .filter((q) => q.eq(q.field("productType"), "1-year"))
      .first();

    console.log("📅 [checkUserSubscriptionStatusByClerkId] 1-year payment found:", oneYearPayment ? {
      _id: oneYearPayment._id,
      polarId: oneYearPayment.polarId,
      productType: oneYearPayment.productType,
      status: oneYearPayment.status,
      amount: oneYearPayment.amount,
      paidAt: oneYearPayment.paidAt
    } : "null");

    // Check if 1-year payment is still valid (not expired)
    const now = Date.now();
    const oneYearExpired = oneYearPayment?.paidAt && (oneYearPayment.paidAt + (365 * 24 * 60 * 60 * 1000)) < now;
    
    console.log("⏰ [checkUserSubscriptionStatusByClerkId] Time calculations:", {
      now: now,
      oneYearPaymentPaidAt: oneYearPayment?.paidAt,
      oneYearExpired: oneYearExpired,
      subscriptionCurrentPeriodEnd: subscription?.currentPeriodEnd,
      subscriptionExpired: subscription?.currentPeriodEnd && subscription.currentPeriodEnd < now
    });

    // Determine access status
    const allowedStatuses = new Set(["completed", "paid", "succeeded"]);

    if (lifetimePayment && (!lifetimePayment.status || allowedStatuses.has(lifetimePayment.status))) {
      console.log("✅ [checkUserSubscriptionStatusByClerkId] GRANTING ACCESS: Lifetime payment found");
      return {
        hasActiveSubscription: true,
        subscription: null,
        payment: lifetimePayment,
        status: 'lifetime'
      };
    }

    if (subscription) {
      const isExpired = subscription.currentPeriodEnd && subscription.currentPeriodEnd < now;
      const isCancelled = subscription.cancelAtPeriodEnd && subscription.currentPeriodEnd && subscription.currentPeriodEnd < now;

      console.log("📋 [checkUserSubscriptionStatusByClerkId] Subscription status check:", {
        isExpired: isExpired,
        isCancelled: isCancelled,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd
      });

      if (isExpired || isCancelled) {
        console.log("❌ [checkUserSubscriptionStatusByClerkId] DENYING ACCESS: Subscription expired or cancelled");
        return {
          hasActiveSubscription: false,
          subscription,
          payment: null,
          status: 'expired'
        };
      }

      console.log("✅ [checkUserSubscriptionStatusByClerkId] GRANTING ACCESS: Active subscription");
      return {
        hasActiveSubscription: true,
        subscription,
        payment: null,
        status: 'active'
      };
    }

    if (oneYearPayment && (!oneYearPayment.status || allowedStatuses.has(oneYearPayment.status)) && !oneYearExpired) {
      console.log("✅ [checkUserSubscriptionStatusByClerkId] GRANTING ACCESS: Valid 1-year payment");
      return {
        hasActiveSubscription: true,
        subscription: null,
        payment: oneYearPayment,
        status: 'one_year'
      };
    }

    console.log("❌ [checkUserSubscriptionStatusByClerkId] DENYING ACCESS: No valid subscription or payment found");
    return {
      hasActiveSubscription: false,
      subscription: null,
      payment: null,
      status: 'no_access'
    };
  },
});

export const fetchUserSubscription = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", user.tokenIdentifier))
      .first();

    return subscription;
  },
});

export const debugAllSubscriptions = query({
  handler: async (ctx) => {
    console.log("🔍 [debugAllSubscriptions] Fetching all subscriptions");
    const allSubscriptions = await ctx.db.query("subscriptions").collect();
    console.log("🔍 [debugAllSubscriptions] Found", allSubscriptions.length, "subscriptions");
    console.log("🔍 [debugAllSubscriptions] All subscriptions:", allSubscriptions.map(sub => ({
      _id: sub._id,
      userId: sub.userId,
      status: sub.status,
      polarId: sub.polarId,
      interval: sub.interval,
      amount: sub.amount,
      currentPeriodEnd: sub.currentPeriodEnd
    })));
    return allSubscriptions;
  },
});

export const debugAllPayments = query({
  handler: async (ctx) => {
    console.log("💳 [debugAllPayments] Fetching all payments");
    const allPayments = await ctx.db.query("payments").collect();
    console.log("💳 [debugAllPayments] Found", allPayments.length, "payments");
    console.log("💳 [debugAllPayments] All payments:", allPayments.map(payment => ({
      _id: payment._id,
      userId: payment.userId,
      productType: payment.productType,
      status: payment.status,
      amount: payment.amount,
      polarId: payment.polarId,
      paidAt: payment.paidAt
    })));
    return allPayments;
  },
});

export const debugAllUsers = query({
  handler: async (ctx) => {
    console.log("👤 [debugAllUsers] Fetching all users");
    const allUsers = await ctx.db.query("users").collect();
    console.log("👤 [debugAllUsers] Found", allUsers.length, "users");
    console.log("👤 [debugAllUsers] All users:", allUsers.map(user => ({
      _id: user._id,
      tokenIdentifier: user.tokenIdentifier,
      email: user.email,
      name: user.name
    })));
    return allUsers;
  },
});

export const debugWebhookEvents = query({
  handler: async (ctx) => {
    console.log("🔗 [debugWebhookEvents] Fetching all webhook events");
    const allWebhooks = await ctx.db.query("webhookEvents").collect();
    console.log("🔗 [debugWebhookEvents] Found", allWebhooks.length, "webhook events");
    console.log("🔗 [debugWebhookEvents] All webhook events:", allWebhooks.map(webhook => ({
      _id: webhook._id,
      type: webhook.type,
      webhookId: webhook.webhookId,
      processingStatus: webhook.processingStatus,
      processed: webhook.processed,
      errorMessage: webhook.errorMessage,
      createdAt: webhook.createdAt
    })));
    return allWebhooks;
  },
});

export const fixSubscriptionUserId = mutation({
  handler: async (ctx) => {
    // Find subscription with wrong userId (Convex user ID instead of Clerk tokenIdentifier)
    const subscription = await ctx.db
      .query("subscriptions")
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    if (!subscription) {
      throw new Error("No active subscription found");
    }

    // Find the user by the wrong userId (which is actually the Convex _id)
    const user = await ctx.db.get(subscription.userId as any);
    
    if (!user || !('tokenIdentifier' in user)) {
      throw new Error("User not found for subscription");
    }

    // Update the subscription to use the correct tokenIdentifier
    await ctx.db.patch(subscription._id, {
      userId: user.tokenIdentifier
    });

    console.log("✅ Fixed subscription userId:", {
      from: subscription.userId,
      to: user.tokenIdentifier
    });

    return { 
      success: true, 
      from: subscription.userId, 
      to: user.tokenIdentifier 
    };
  },
});

export const getUserSubscriptionWithProduct = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      return null;
    }


    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", user.tokenIdentifier))
      .first();

    if (!subscription || subscription.status !== "active") {
      return null;
    }

    // Map Polar product IDs to our internal product IDs
    const productMap: Record<string, string> = {
      // Production product IDs
      'e0cad99e-b0d0-4489-9e85-dc028af8d0eb': '1-year',
      '7a2b5d36-9363-4b56-87e4-c99d9e65816f': 'lifetime',
      // Sandbox/test product IDs
      'b6bbf3a4-2b26-4889-9489-01a4b774faa6': '1-year',
      '8b37c090-f5a7-427a-b653-bc29055c0d4c': 'lifetime',
    };

    // Get the product ID from Polar metadata or try to match by polarId
    let productId = null;
    
    // First try to get from metadata
    if (subscription.metadata && typeof subscription.metadata === 'object') {
      const metadata = subscription.metadata as any;
      if (metadata.productId) {
        productId = metadata.productId;
      }
    }

    // If not found in metadata, try to match by polarId
    if (!productId && subscription.polarId) {
      productId = productMap[subscription.polarId];
    }

    // If still no productId, try to infer from interval
    if (!productId && subscription.interval) {
      if (subscription.interval === 'year') {
        productId = '1-year';
      } else if (subscription.interval === 'month') {
        productId = '1-year'; // Monthly subscriptions are also 1-year plans
      }
    }

    return {
      subscription,
      productId,
      isActive: subscription.status === "active"
    };
  },
});

export const handleWebhookEvent = mutation({
  args: {
    body: v.any(),
    webhookId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    console.log("🔄 [handleWebhookEvent] Starting webhook processing");
    console.log("🔄 [handleWebhookEvent] Event type:", args.body.type);
    console.log("🔄 [handleWebhookEvent] Webhook ID:", args.webhookId);
    console.log("🔄 [handleWebhookEvent] Body ID:", args.body.id);
    
    // Extract event type from webhook payload
    const eventType = args.body.type;
    // Polar sends the unique event ID in the `webhook-id` header, not in the body
    const webhookId = args.webhookId || args.body.id;

    console.log("🔄 [handleWebhookEvent] Using webhook ID for deduplication:", webhookId);

    // Check if this webhook has already been processed (deduplication)
    const existingWebhook = webhookId
      ? await ctx.db
      .query("webhookEvents")
      .withIndex("by_webhook_id", (q) => q.eq("webhookId", webhookId))
      .first()
      : null;

    console.log("🔄 [handleWebhookEvent] Existing webhook check:", existingWebhook ? "FOUND" : "NOT FOUND");

    if (existingWebhook) {
      console.log("⏭️ [handleWebhookEvent] Webhook already processed, skipping:", webhookId || "unknown_id");
      return { success: true, message: "Webhook already processed", alreadyProcessed: true };
    }

    // Store webhook event with processing status
    console.log("💾 [handleWebhookEvent] Storing webhook event in database");
    const webhookEventId = await ctx.db.insert("webhookEvents", {
      id: args.body.id,
      type: eventType,
      polarEventId: args.body.data.id,
      createdAt: args.body.data.created_at,
      modifiedAt: args.body.data.modified_at || args.body.data.created_at,
      data: args.body.data,
      processed: false,
      created_at: Date.now(),
      // Deduplication fields
      webhookId: webhookId,
      processingStatus: "processing",
      processedAt: undefined,
      errorMessage: undefined,
    });

    console.log("💾 [handleWebhookEvent] Webhook event stored with ID:", webhookEventId);

    try {
    console.log("🎯 [handleWebhookEvent] Processing event type:", eventType);

    switch (eventType) {
      case "payment.created":
        // We rely on order.created/order.updated for one-time lifetime payments to avoid duplicates.
        console.log("💳 [handleWebhookEvent] PAYMENT.CREATED received — skipping insert to prevent duplicates (handled via order events)");
        break;

      case "subscription.created":
        console.log("📝 Creating new subscription record for userId:", args.body.data.metadata.userId);
        
        // Find the Convex user by Clerk user ID
        const user = await ctx.db
          .query("users")
          .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.body.data.metadata.userId))
          .unique();
        
        if (!user) {
          console.log("❌ User not found in Convex database:", args.body.data.metadata.userId);
          throw new Error(`User not found: ${args.body.data.metadata.userId}`);
        }
        
        console.log("✅ Found user in Convex:", user._id);
        
        // Insert new subscription
        await ctx.db.insert("subscriptions", {
          polarId: args.body.data.id,
          polarPriceId: args.body.data.price_id,
          currency: args.body.data.currency,
          interval: args.body.data.recurring_interval,
          userId: user.tokenIdentifier, // Use Clerk user ID (tokenIdentifier) not Convex _id
          status: args.body.data.status,
          currentPeriodStart: new Date(
            args.body.data.current_period_start
          ).getTime(),
          currentPeriodEnd: new Date(
            args.body.data.current_period_end
          ).getTime(),
          cancelAtPeriodEnd: args.body.data.cancel_at_period_end,
          amount: args.body.data.amount,
          startedAt: new Date(args.body.data.started_at).getTime(),
          endedAt: args.body.data.ended_at
            ? new Date(args.body.data.ended_at).getTime()
            : undefined,
          canceledAt: args.body.data.canceled_at
            ? new Date(args.body.data.canceled_at).getTime()
            : undefined,
          customerCancellationReason:
            args.body.data.customer_cancellation_reason || undefined,
          customerCancellationComment:
            args.body.data.customer_cancellation_comment || undefined,
          metadata: args.body.data.metadata || {},
          customFieldData: args.body.data.custom_field_data || {},
          customerId: args.body.data.customer_id,
        });
        console.log("✅ Subscription record created successfully");
        break;

      case "subscription.updated":
        // Find existing subscription
        const existingSub = await ctx.db
          .query("subscriptions")
          .withIndex("polarId", (q) => q.eq("polarId", args.body.data.id))
          .first();

        if (existingSub) {
          await ctx.db.patch(existingSub._id, {
            amount: args.body.data.amount,
            status: args.body.data.status,
            currentPeriodStart: new Date(
              args.body.data.current_period_start
            ).getTime(),
            currentPeriodEnd: new Date(
              args.body.data.current_period_end
            ).getTime(),
            cancelAtPeriodEnd: args.body.data.cancel_at_period_end,
            metadata: args.body.data.metadata || {},
            customFieldData: args.body.data.custom_field_data || {},
          });
        }
        break;

      case "subscription.active":
        // Find and update subscription
        const activeSub = await ctx.db
          .query("subscriptions")
          .withIndex("polarId", (q) => q.eq("polarId", args.body.data.id))
          .first();

        if (activeSub) {
          await ctx.db.patch(activeSub._id, {
            status: args.body.data.status,
            startedAt: new Date(args.body.data.started_at).getTime(),
          });
        }
        break;

      case "subscription.canceled":
        // Find and update subscription
        const canceledSub = await ctx.db
          .query("subscriptions")
          .withIndex("polarId", (q) => q.eq("polarId", args.body.data.id))
          .first();

        if (canceledSub) {
          await ctx.db.patch(canceledSub._id, {
            status: args.body.data.status,
            canceledAt: args.body.data.canceled_at
              ? new Date(args.body.data.canceled_at).getTime()
              : undefined,
            customerCancellationReason:
              args.body.data.customer_cancellation_reason || undefined,
            customerCancellationComment:
              args.body.data.customer_cancellation_comment || undefined,
          });
        }
        break;

      case "subscription.uncanceled":
        // Find and update subscription
        const uncanceledSub = await ctx.db
          .query("subscriptions")
          .withIndex("polarId", (q) => q.eq("polarId", args.body.data.id))
          .first();

        if (uncanceledSub) {
          await ctx.db.patch(uncanceledSub._id, {
            status: args.body.data.status,
            cancelAtPeriodEnd: false,
            canceledAt: undefined,
            customerCancellationReason: undefined,
            customerCancellationComment: undefined,
          });
        }
        break;

      case "subscription.revoked":
        // Find and update subscription
        const revokedSub = await ctx.db
          .query("subscriptions")
          .withIndex("polarId", (q) => q.eq("polarId", args.body.data.id))
          .first();

        if (revokedSub) {
          await ctx.db.patch(revokedSub._id, {
            status: "revoked",
            endedAt: args.body.data.ended_at
              ? new Date(args.body.data.ended_at).getTime()
              : undefined,
          });
        }
        break;

      case "order.created":
      case "order.updated": {
        console.log(`🧾 [handleWebhookEvent] ${eventType} received`);
        const data = args.body.data;
        // Only process paid orders
        if (!data?.paid && data?.status !== "paid") {
          console.log("🧾 [handleWebhookEvent] Order not paid, skipping", { status: data?.status, paid: data?.paid });
          break;
        }
        const productId: string | undefined = data?.product_id;
        const productPriceId: string | undefined = data?.product_price_id;
        const customerId: string | undefined = data?.customer_id;
        const metadata: any = data?.metadata || {};
        console.log("🧾 [handleWebhookEvent] Order details:", { productId, productPriceId, customerId, metadata });

        // Attempt to resolve user from metadata first (set during checkout)
        const userToken = metadata?.userId;
        if (!userToken) {
          console.log("⚠️ [handleWebhookEvent] No userId in order metadata; cannot attribute payment to a user. Skipping insert.");
          break;
        }

        const paymentUser = await ctx.db
          .query("users")
          .withIndex("by_token", (q) => q.eq("tokenIdentifier", userToken))
          .unique();

        if (!paymentUser) {
          console.log("❌ [handleWebhookEvent] User from metadata not found in Convex:", userToken);
          break;
        }

        // Determine lifetime vs 1-year using the product_id mapping (prod) or metadata
        const lifetimeProductIds = new Set<string>([
          "7a2b5d36-9363-4b56-87e4-c99d9e65816f", // production lifetime
          "8b37c090-f5a7-427a-b653-bc29055c0d4c", // sandbox lifetime
        ]);
        const oneYearProductIds = new Set<string>([
          "e0cad99e-b0d0-4489-9e85-dc028af8d0eb", // production 1-year (as productId mapping)
          "b6bbf3a4-2b26-4889-9489-01a4b774faa6", // sandbox 1-year
        ]);

        let productType: "lifetime" | "1-year" = "lifetime";
        if (metadata?.productType === "1-year") productType = "1-year";
        else if (metadata?.productType === "lifetime") productType = "lifetime";
        else if (productId && oneYearProductIds.has(productId)) productType = "1-year";
        else if (productId && lifetimeProductIds.has(productId)) productType = "lifetime";
        console.log("🏷️ [handleWebhookEvent] Resolved productType for order:", productType);

        // Upsert by order id (polarId)
        const existingPayment = await ctx.db
          .query("payments")
          .withIndex("polarId", (q) => q.eq("polarId", data.id))
          .first();

        if (existingPayment) {
          await ctx.db.patch(existingPayment._id, {
            polarPriceId: productPriceId,
            currency: data.currency,
            amount: data.total_amount ?? data.net_amount ?? existingPayment.amount,
            status: data.status || existingPayment.status,
            productType,
            paidAt: data.created_at ? new Date(data.created_at).getTime() : existingPayment.paidAt,
            metadata,
            customerId,
            userId: paymentUser.tokenIdentifier,
          });
          console.log("✅ [handleWebhookEvent] Updated existing payment for order", data.id);
        } else {
          const paymentId = await ctx.db.insert("payments", {
            polarId: data.id,
            polarPriceId: productPriceId,
            currency: data.currency,
            amount: data.total_amount ?? data.net_amount ?? 0,
            status: data.status || "paid",
            productType,
            paidAt: data.created_at ? new Date(data.created_at).getTime() : Date.now(),
            metadata,
            customerId,
            userId: paymentUser.tokenIdentifier,
          });
          console.log("✅ [handleWebhookEvent] Inserted payment from order with ID:", paymentId);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${eventType}`);
        break;
    }

    // Mark webhook as successfully processed
    console.log("✅ [handleWebhookEvent] Marking webhook as completed");
    await ctx.db.patch(webhookEventId, {
      processingStatus: "completed",
      processedAt: Date.now(),
      processed: true,
    });

    console.log("✅ [handleWebhookEvent] Webhook processed successfully:", webhookId);
    return { success: true, message: "Webhook processed successfully" };

    } catch (error) {
      console.error("❌ [handleWebhookEvent] Webhook processing failed:", error);
      console.error("❌ [handleWebhookEvent] Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        eventType: eventType,
        webhookId: webhookId
      });
      
      // Mark webhook as failed
      await ctx.db.patch(webhookEventId, {
        processingStatus: "failed",
        processedAt: Date.now(),
        errorMessage: error instanceof Error ? error.message : String(error),
      });

      console.error("❌ [handleWebhookEvent] Webhook marked as failed in database");
      throw error; // Re-throw to trigger Convex retry logic
    }
  },
});

// Use our own validation similar to validateEvent from @polar-sh/sdk/webhooks
// The only difference is we use btoa to encode the secret since Convex js runtime doesn't support Buffer
const validateEvent = (
  body: string | Buffer,
  headers: Record<string, string>,
  secret: string
) => {
  const base64Secret = btoa(secret);
  const webhook = new Webhook(base64Secret);
  webhook.verify(body, headers);
};

export const createCustomerPortalUrl = action({
  args: {
    customerId: v.string(),
  },
  handler: async (ctx, args) => {
    const polar = new Polar({
      server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      accessToken: process.env.POLAR_API_KEY!,
    });

    try {
      const result = await polar.customerSessions.create({
        customerId: args.customerId,
      });

      // Only return the URL to avoid Convex type issues
      return { url: result.customerPortalUrl };
    } catch (error) {
      console.error("Error creating customer session:", error);
      throw new Error("Failed to create customer session");
    }
  },
});

export const paymentWebhook = httpAction(async (ctx, request) => {
  try {
    console.log("🔗 [paymentWebhook] Webhook received at:", new Date().toISOString());
    console.log("🔗 [paymentWebhook] Request URL:", request.url);
    console.log("🔗 [paymentWebhook] Request method:", request.method);
    
    // Check if required Polar environment variables are configured
    if (!process.env.POLAR_API_KEY) {
      console.log("❌ [paymentWebhook] Polar not configured - missing POLAR_API_KEY");
      return new Response(JSON.stringify({ message: "Polar not configured" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!process.env.POLAR_WEBHOOK_SECRET) {
      console.log("❌ [paymentWebhook] Polar not configured - missing POLAR_WEBHOOK_SECRET");
      return new Response(JSON.stringify({ message: "Polar webhook secret not configured" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const rawBody = await request.text();
    console.log("📦 [paymentWebhook] Webhook body length:", rawBody.length);
    console.log("📦 [paymentWebhook] Webhook body preview:", rawBody.substring(0, 500));

    // Internally validateEvent uses headers as a dictionary e.g. headers["webhook-id"]
    // So we need to convert the headers to a dictionary
    // (request.headers is a Headers object which is accessed as request.headers.get("webhook-id"))
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    console.log("🔐 [paymentWebhook] Headers received:", Object.keys(headers));
    console.log("🔐 [paymentWebhook] Webhook-ID header:", headers["webhook-id"] || headers["webhook_id"] || headers["x-webhook-id"]);

    // Validate the webhook event
    console.log("🔐 [paymentWebhook] Validating webhook signature...");
    validateEvent(rawBody, headers, process.env.POLAR_WEBHOOK_SECRET);
    console.log("✅ [paymentWebhook] Webhook signature validated successfully");

    const body = JSON.parse(rawBody);
    console.log("🎯 [paymentWebhook] Webhook event type:", body.type);
    console.log("🎯 [paymentWebhook] Webhook event ID:", body.id);
    console.log("🎯 [paymentWebhook] Webhook data preview:", JSON.stringify(body.data, null, 2).substring(0, 1000));

    // Get webhook ID from headers for deduplication (reuse headers already created above)
    const webhookIdHeader = headers["webhook-id"] || headers["webhook_id"] || headers["x-webhook-id"];
    console.log("🔄 [paymentWebhook] Calling handleWebhookEvent with webhookId:", webhookIdHeader);

    // track events and based on events store data
    const result = await ctx.runMutation(api.subscriptions.handleWebhookEvent, {
      body,
      webhookId: webhookIdHeader,
    });

    console.log("✅ [paymentWebhook] Webhook processed successfully, result:", result);
    return new Response(JSON.stringify({ message: "Webhook received!", result }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return new Response(
        JSON.stringify({ message: "Webhook verification failed" }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(JSON.stringify({ message: "Webhook failed" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});

