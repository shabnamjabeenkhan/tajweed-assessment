import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { convex, api } from '@/lib/convex-server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userIdParam = url.searchParams.get('userId');
    
    let userId: string | null = null;
    
    if (userIdParam) {
      // Use userId from query parameter (from middleware)
      userId = userIdParam;
    } else {
      // Fall back to auth() for direct API calls
      const authResult = await auth();
      userId = authResult.userId;
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get subscription status from Convex
    const subscriptionStatus = await convex.query(api.subscriptions.checkUserSubscriptionStatusByClerkId, {
      clerkUserId: userId
    });
    
    return NextResponse.json(subscriptionStatus);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
