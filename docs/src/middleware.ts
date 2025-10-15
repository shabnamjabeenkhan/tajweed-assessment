import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/docs(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Check if the request is for protected routes
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    
    // If user is not authenticated, redirect to sign-in
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    // Check subscription status
    try {
      const response = await fetch(`${req.nextUrl.origin}/api/subscription/status?userId=${userId}`, {
        headers: {
          'Cookie': req.headers.get('cookie') || '',
        },
      });
      
      if (response.ok) {
        const subscription = await response.json();
        
        if (!subscription.hasActiveSubscription) {
          // Redirect to subscription page
          const subscribeUrl = new URL('/subscribe', req.url);
          subscribeUrl.searchParams.set('redirect_url', req.url);
          return NextResponse.redirect(subscribeUrl);
        } else {
        }
      } else {
        // If we can't check subscription status, redirect to subscription page
        const subscribeUrl = new URL('/subscribe', req.url);
        subscribeUrl.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(subscribeUrl);
      }
    } catch (error) {
      // On error, redirect to subscription page
      const subscribeUrl = new URL('/subscribe', req.url);
      subscribeUrl.searchParams.set('redirect_url', req.url);
      return NextResponse.redirect(subscribeUrl);
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
