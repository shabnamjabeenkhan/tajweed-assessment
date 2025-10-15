import { Polar } from "@polar-sh/sdk";
import { v } from "convex/values";
import { Webhook, WebhookVerificationError } from "standardwebhooks";
import { api } from "./_generated/api";
import { action, httpAction, mutation, query } from "./_generated/server";

const createCheckout = async ({
  customerEmail,
  productPriceId,
  successUrl,
  metadata,
}: {
  customerEmail: string;
  productPriceId: string;
  successUrl: string;
  metadata?: Record<string, string>;
}) => {
  // Check if required Polar environment variables are configured
  if (!process.env.POLAR_ACCESS_TOKEN) {
    throw new Error("POLAR_ACCESS_TOKEN is not configured");
  }
  
  if (!process.env.POLAR_ORGANIZATION_ID) {
    throw new Error("POLAR_ORGANIZATION_ID is not configured");
  }

  const polar = new Polar({
    server: (process.env.POLAR_SERVER as "sandbox" | "production") || "sandbox",
    accessToken: process.env.POLAR_ACCESS_TOKEN,
  });

  // Get product ID from price ID
  const { result: productsResult } = await polar.products.list({
    organizationId: process.env.POLAR_ORGANIZATION_ID,
    isArchived: false,
  });

  let productId = null;
  for (const product of productsResult.items) {
    const hasPrice = product.prices.some(
      (price: any) => price.id === productPriceId
    );
    if (hasPrice) {
      productId = product.id;
      break;
    }
  }

  if (!productId) {
    throw new Error(`Product not found for price ID: ${productPriceId}`);
  }

  const checkoutData = {
    products: [productId],
    successUrl: successUrl,
    customerEmail: customerEmail,
    metadata: {
      ...metadata,
      priceId: productPriceId,
    },
  };

  console.log(
    "Creating checkout with data:",
    JSON.stringify(checkoutData, null, 2)
  );

  const result = await polar.checkouts.create(checkoutData);
  return result;
};

export const getAvailablePlansQuery = query({
  handler: async (ctx) => {
    const polar = new Polar({
      server: (process.env.POLAR_SERVER as "sandbox" | "production") || "sandbox",
      accessToken: process.env.POLAR_ACCESS_TOKEN,
    });

    const { result } = await polar.products.list({
      organizationId: process.env.POLAR_ORGANIZATION_ID,
      isArchived: false,
    });

    // Transform the data to remove Date objects and keep only needed fields
    const cleanedItems = result.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      isRecurring: item.isRecurring,
      prices: item.prices.map((price: any) => ({
        id: price.id,
        amount: price.priceAmount,
        currency: price.priceCurrency,
        interval: price.recurringInterval,
      })),
    }));

    return {
      items: cleanedItems,
      pagination: result.pagination,
    };
  },
});

export const getAvailablePlans = action({
  handler: async (ctx) => {
    const polar = new Polar({
      server: (process.env.POLAR_SERVER as "sandbox" | "production") || "sandbox",
      accessToken: process.env.POLAR_ACCESS_TOKEN,
    });

    const { result } = await polar.products.list({
      organizationId: process.env.POLAR_ORGANIZATION_ID,
      isArchived: false,
    });

    // Transform the data to remove Date objects and keep only needed fields
    const cleanedItems = result.items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      isRecurring: item.isRecurring,
      prices: item.prices.map((price: any) => ({
        id: price.id,
        amount: price.priceAmount,
        currency: price.priceCurrency,
        interval: price.recurringInterval,
      })),
    }));

    return {
      items: cleanedItems,
      pagination: result.pagination,
    };
  },
});

export const createCheckoutSession = action({
  args: {
    priceId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // First check if user exists
    let user = await ctx.runQuery(api.users.findUserByToken, {
      tokenIdentifier: identity.subject,
    });

    // If user doesn't exist, create them
    if (!user) {
      user = await ctx.runMutation(api.users.upsertUser);

      if (!user) {
        throw new Error("Failed to create user");
      }
    }

    const checkout = await createCheckout({
      customerEmail: user.email!,
      productPriceId: args.priceId,
      successUrl: `${process.env.FRONTEND_URL}/success`,
      metadata: {
        userId: user.tokenIdentifier,
      },
    });

    return checkout.url;
  },
});

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
    // Find user by Clerk user ID (this assumes the tokenIdentifier contains the Clerk user ID)
    // In Clerk, the subject is typically in the format "user_xxxxx" where xxxxx is the Clerk user ID
    const tokenIdentifier = `user_${args.clerkUserId}`;

    let user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();

    // If not found with user_ prefix, try the raw userId
    if (!user) {
      user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.clerkUserId))
        .unique();
    }

    if (!user) {
      return { 
        hasActiveSubscription: false,
        subscription: null,
        payment: null,
        status: 'no_user'
      };
    }

    // Check for active subscriptions (we store Clerk tokenIdentifier in userId)
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("userId", (q) => q.eq("userId", user!.tokenIdentifier))
      .filter((q) => q.eq(q.field("status"), "active"))
      .first();

    // Check for lifetime payments
    const lifetimePayment = await ctx.db
      .query("payments")
      .withIndex("userId", (q) => q.eq("userId", user!.tokenIdentifier))
      .filter((q) => q.eq(q.field("productType"), "lifetime"))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .first();

    // Check for 1-year payments that haven't expired
    const oneYearPayment = await ctx.db
      .query("payments")
      .withIndex("userId", (q) => q.eq("userId", user!.tokenIdentifier))
      .filter((q) => q.eq(q.field("productType"), "1-year"))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .first();

    // Check if 1-year payment is still valid (not expired)
    const now = Date.now();
    const oneYearExpired = oneYearPayment?.paidAt && (oneYearPayment.paidAt + (365 * 24 * 60 * 60 * 1000)) < now;

    // Determine access status
    if (lifetimePayment) {
      return {
        hasActiveSubscription: true,
        subscription: null,
        payment: lifetimePayment,
        status: 'lifetime'
      };
    }

    if (subscription) {
      const isExpired = subscription.currentPeriodEnd;
      const isCancelled = subscription.cancelAtPeriodEnd && subscription.currentPeriodEnd && subscription.currentPeriodEnd < now;

      if (isExpired || isCancelled) {
        return {
          hasActiveSubscription: false,
          subscription,
          payment: null,
          status: 'expired'
        };
      }

      return {
        hasActiveSubscription: true,
        subscription,
        payment: null,
        status: 'active'
      };
    }

    if (oneYearPayment && !oneYearExpired) {
      return {
        hasActiveSubscription: true,
        subscription: null,
        payment: oneYearPayment,
        status: 'one_year'
      };
    }

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
    // Extract event type from webhook payload
    const eventType = args.body.type;
    // Polar sends the unique event ID in the `webhook-id` header, not in the body
    const webhookId = args.webhookId || args.body.id;

    // Check if this webhook has already been processed (deduplication)
    const existingWebhook = webhookId
      ? await ctx.db
      .query("webhookEvents")
      .withIndex("by_webhook_id", (q) => q.eq("webhookId", webhookId))
      .first()
      : null;

    if (existingWebhook) {
      console.log("⏭️ Webhook already processed, skipping:", webhookId || "unknown_id");
      return { success: true, message: "Webhook already processed", alreadyProcessed: true };
    }

    // Store webhook event with processing status
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

    try {

    switch (eventType) {
      case "payment.created":
        console.log("💳 Creating new payment record for userId:", args.body.data.metadata.userId);
        
        // Find the Convex user by Clerk user ID
        const paymentUser = await ctx.db
          .query("users")
          .withIndex("by_token", (q) => q.eq("tokenIdentifier", args.body.data.metadata.userId))
          .unique();
        
        if (!paymentUser) {
          console.log("❌ User not found in Convex database:", args.body.data.metadata.userId);
          throw new Error(`User not found: ${args.body.data.metadata.userId}`);
        }
        
        console.log("✅ Found user in Convex for payment:", paymentUser._id);
        
        // Determine product type from metadata or price ID
        const productType = args.body.data.metadata?.productType || 
          (args.body.data.price_id === 'e0cad99e-b0d0-4489-9e85-dc028af8d0eb' || args.body.data.price_id === 'b6bbf3a4-2b26-4889-9489-01a4b774faa6' ? '1-year' : 'lifetime');
        
        // Insert new payment
        await ctx.db.insert("payments", {
          polarId: args.body.data.id,
          polarPriceId: args.body.data.price_id,
          currency: args.body.data.currency,
          amount: args.body.data.amount,
          status: args.body.data.status,
          productType: productType,
          paidAt: args.body.data.created_at ? new Date(args.body.data.created_at).getTime() : Date.now(),
          metadata: args.body.data.metadata || {},
          customerId: args.body.data.customer_id,
          userId: paymentUser.tokenIdentifier, // Use Clerk user ID (tokenIdentifier) not Convex _id
        });
        console.log("✅ Payment record created successfully");
        break;

      case "subscription.created":
        console.log("📝 Creating new subscription record for userId:", args.body.data.metadata.userId);
        // Insert new subscription
        await ctx.db.insert("subscriptions", {
          polarId: args.body.data.id,
          polarPriceId: args.body.data.price_id,
          currency: args.body.data.currency,
          interval: args.body.data.recurring_interval,
          userId: args.body.data.metadata.userId,
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
        // Orders are handled through the subscription events
        break;

      default:
        console.log(`Unhandled event type: ${eventType}`);
        break;
    }

    // Mark webhook as successfully processed
    await ctx.db.patch(webhookEventId, {
      processingStatus: "completed",
      processedAt: Date.now(),
      processed: true,
    });

    console.log("✅ Webhook processed successfully:", webhookId);
    return { success: true, message: "Webhook processed successfully" };

    } catch (error) {
      // Mark webhook as failed
      await ctx.db.patch(webhookEventId, {
        processingStatus: "failed",
        processedAt: Date.now(),
        errorMessage: error instanceof Error ? error.message : String(error),
      });

      console.error("❌ Webhook processing failed:", error);
      throw error; // Re-throw to trigger Convex retry logic
    }
  },
});

// Use our own validation similar to validateEvent from @polar-sh/sdk/webhooks
// The only diffference is we use btoa to encode the secret since Convex js runtime doesn't support Buffer
const validateEvent = (
  body: string | Buffer,
  headers: Record<string, string>,
  secret: string
) => {
  const base64Secret = btoa(secret);
  const webhook = new Webhook(base64Secret);
  webhook.verify(body, headers);
};

export const paymentWebhook = httpAction(async (ctx, request) => {
  try {
    console.log("🔗 Webhook received at:", new Date().toISOString());
    
    // Check if required Polar environment variables are configured
    if (!process.env.POLAR_ACCESS_TOKEN || !process.env.POLAR_ORGANIZATION_ID) {
      console.log("❌ Polar not configured - missing environment variables");
      return new Response(JSON.stringify({ message: "Polar not configured" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const rawBody = await request.text();
    console.log("📦 Webhook body length:", rawBody.length);

    // Internally validateEvent uses headers as a dictionary e.g. headers["webhook-id"]
    // So we need to convert the headers to a dictionary
    // (request.headers is a Headers object which is accessed as request.headers.get("webhook-id"))
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    // Validate the webhook event
    if (!process.env.POLAR_WEBHOOK_SECRET) {
      throw new Error(
        "POLAR_WEBHOOK_SECRET environment variable is not configured"
      );
    }
    validateEvent(rawBody, headers, process.env.POLAR_WEBHOOK_SECRET);

    const body = JSON.parse(rawBody);
    console.log("🎯 Webhook event type:", body.type);

    // Get webhook ID from headers for deduplication (reuse headers already created above)
    const webhookIdHeader = headers["webhook-id"] || headers["webhook_id"] || headers["x-webhook-id"];

    // track events and based on events store data
    await ctx.runMutation(api.subscriptions.handleWebhookEvent, {
      body,
      webhookId: webhookIdHeader,
    });

    console.log("✅ Webhook processed successfully");
    return new Response(JSON.stringify({ message: "Webhook received!" }), {
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

export const createCustomerPortalUrl = action({
  handler: async (ctx, args: { customerId: string }) => {
    const polar = new Polar({
      server: (process.env.POLAR_SERVER as "sandbox" | "production") || "sandbox",
      accessToken: process.env.POLAR_ACCESS_TOKEN,
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
