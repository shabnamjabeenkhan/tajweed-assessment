import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { Polar } from '@polar-sh/sdk';
import { convex, api } from '@/lib/convex-server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { productId, successUrl } = await req.json();
    
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Initialize Polar client
    const polar = new Polar({
      server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
      accessToken: process.env.POLAR_API_KEY!,
    });

    // Map product IDs to actual Polar product IDs based on environment
    const productMap: Record<string, string> = process.env.NODE_ENV === 'production' 
      ? {
          // Production product IDs
          '1-year': 'e0cad99e-b0d0-4489-9e85-dc028af8d0eb',
          'lifetime': '7a2b5d36-9363-4b56-87e4-c99d9e65816f',
        }
      : {
          // Sandbox/test product IDs
          '1-year': 'b6bbf3a4-2b26-4889-9489-01a4b774faa6', 
          'lifetime': '8b37c090-f5a7-427a-b653-bc29055c0d4c', 
        };

    // Determine upgrade context for metadata (used by webhooks and analytics)
    let upgradeFrom: '1-year' | undefined = undefined;
    try {
      const status = await convex.query(api.subscriptions.checkUserSubscriptionStatusByClerkId, {
        clerkUserId: userId,
      });
      if (productId === 'lifetime' && (status?.status === 'one_year' || status?.subscription?.interval === 'year' || status?.payment?.productType === '1-year')) {
        upgradeFrom = '1-year';
      }
    } catch {}

    // Discounted Lifetime product for upgrades from 1-year
    const discountedLifetimeId = process.env.NODE_ENV === 'production'
      ? (process.env.POLAR_LIFETIME_DISCOUNTED_PRODUCT_ID || '')
      : '9cd9a861-2894-46ba-93d4-c77d60fdf547';

    const isLifetimeUpgrade = productId === 'lifetime' && upgradeFrom === '1-year' && discountedLifetimeId;
    const selectedPolarProductId = isLifetimeUpgrade ? discountedLifetimeId : productMap[productId];

    if (!selectedPolarProductId) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    // Create checkout session and redirect back to docs after success
    const origin = req.nextUrl.origin;
    const defaultSuccessUrl = `${origin}/docs`;
    const checkoutSession = await polar.checkouts.create({
      products: [selectedPolarProductId],
      successUrl: successUrl || defaultSuccessUrl,
      metadata: {
        userId: userId,
        productType: productId,
        ...(upgradeFrom ? { upgradeFrom } : {}),
        ...(isLifetimeUpgrade ? { discounted: true } : {}),
      },
    });
    
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
