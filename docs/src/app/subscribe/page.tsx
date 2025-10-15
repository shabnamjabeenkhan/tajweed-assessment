'use client';

import { SignedIn, SignedOut, SignInButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function SubscribePage() {
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const { isLoaded } = useAuth();
  const userSubscription = useQuery(api.subscriptions.getUserSubscriptionWithProduct);
  const [isNavLoading, setIsNavLoading] = useState(false);
  const router = useRouter();

  const handleNavigate = (href: string) => {
    setIsNavLoading(true);
    router.push(href);
  };

  const Check = ({ className = '' }: { className?: string }) => (
    <svg
      className={`h-4 w-4 shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );

  const Benefit = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-3">
      <Check className="text-green-500 mt-1" />
      <span>{children}</span>
    </li>
  );

  const Plus = ({ className = '' }: { className?: string }) => (
    <svg
      className={`h-5 w-5 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );

  const createCheckoutSession = async (productId: string) => {
    setLoadingProductId(productId);
    try {
    const response = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          // Do NOT send successUrl so Polar shows the post-purchase benefits screen
          // Users can accept Discord/GitHub benefits there before returning
          // failureUrl intentionally omitted as it's not used by our API route
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        // Add welcome=1 to the success redirect so we can show a one-time banner
        try {
          const u = new URL(url);
          const s = u.searchParams.get('success_url');
          if (s) {
            const sUrl = new URL(s);
            sUrl.searchParams.set('welcome', '1');
            u.searchParams.set('success_url', sUrl.toString());
          }
          window.location.href = u.toString();
        } catch {
          window.location.href = url;
        }
      } else {
        console.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
    } finally {
      setLoadingProductId(null);
    }
  };

  // Show loading state until Clerk is loaded
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-3/4 mx-auto animate-pulse"></div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="space-y-2 mb-6">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="rounded-lg border p-6 relative animate-pulse">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="space-y-2 mb-6">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-screen-xl mx-auto text-center px-4">
        <h1 className="mb-4 text-3xl font-bold">Access Accelerator</h1>
        
        <SignedOut>
          <p className="mb-6 text-fd-muted-foreground">
            Please sign in to access the Accelerator resources.
          </p>
          <SignInButton mode="modal">
            <button className="rounded-md bg-fd-primary px-4 py-2 text-fd-primary-foreground hover:bg-fd-primary/90">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        
        <SignedIn>
          <p className="mb-6 text-fd-muted-foreground">
            Choose your membership plan to gain full access.
          </p>
          
          {userSubscription === undefined ? (
            // Loading skeleton - match final layout to avoid CLS
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full max-w-screen-xl mx-auto px-4 md:px-8">
              {/* 1 Year Membership Skeleton */}
              <div className="relative flex flex-col w-full rounded-2xl border-2 p-6 sm:p-8 animate-pulse min-h-[420px] sm:min-h-[480px]">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-auto h-10 bg-gray-200 rounded"></div>
              </div>
              
              {/* Lifetime Membership Skeleton */}
              <div className="relative flex flex-col w-full rounded-2xl border-2 p-6 sm:p-8 animate-pulse min-h-[420px] sm:min-h-[480px]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="mt-auto h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full max-w-screen-xl mx-auto px-4 md:px-8">
            {/* 1 Year Membership */}
            <div className={`relative flex flex-col w-full min-h-[420px] sm:min-h-[480px] rounded-2xl border-2 p-6 sm:p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              userSubscription?.productId === '1-year' 
                ? 'border-green-500 bg-gradient-to-br from-green-50/10 to-green-100/5 shadow-green-500/20 shadow-lg' 
                : 'border-gray-200/20 bg-gradient-to-br from-gray-50/5 to-gray-100/5 hover:border-gray-300/30 hover:shadow-gray-500/10'
            } backdrop-blur-sm`}>
              <h2 className="mb-2 text-xl font-semibold">1 Year Membership</h2>
              <p className="mb-4 text-sm text-fd-muted-foreground">
                12 months of builder membership access
              </p>
              {/* Price */}
              <div className="mb-4 text-center">
                <div className="inline-flex items-end gap-1">
                  <span className="text-3xl font-bold">$99</span>
                  <span className="text-xs text-fd-muted-foreground mb-1">/year</span>
                </div>
              </div>
              <ul className="mb-6 space-y-3 text-sm text-left mx-auto max-w-[44rem]">
                <Benefit>Launch your first Startup in 30 days</Benefit>
                <Benefit>Access to production-ready codebases for building Web Apps</Benefit>
                <Benefit>High-quality practical video course (minimal theory)</Benefit>
                <Benefit>Private Discord community Access</Benefit>
                <Benefit>Over $1,000 in custom tools and resources</Benefit>
              </ul>
              <button
                onClick={() => createCheckoutSession('1-year')}
                disabled={loadingProductId !== null || userSubscription?.productId === '1-year' || userSubscription?.productId === 'lifetime'}
                className={`mt-auto block w-full rounded-xl px-6 py-3 text-center font-semibold transition-all duration-300 ${
                  userSubscription?.productId === '1-year'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed shadow-lg shadow-green-500/25'
                    : userSubscription?.productId === 'lifetime'
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-fd-primary to-fd-primary/90 text-fd-primary-foreground hover:from-fd-primary/90 hover:to-fd-primary hover:shadow-lg hover:shadow-fd-primary/25 hover:scale-105'
                } disabled:opacity-50`}
              >
                {loadingProductId === '1-year' 
                  ? 'Creating checkout session...' 
                  : userSubscription?.productId === '1-year'
                    ? 'Current plan'
                    : userSubscription?.productId === 'lifetime'
                    ? 'Already have Lifetime'
                    : 'Subscribe for 1 Year'
                }
              </button>
            </div>
            
            {/* Lifetime Membership */}
            <div className={`relative flex flex-col w-full min-h-[420px] sm:min-h-[480px] rounded-2xl border-2 p-6 sm:p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
              userSubscription?.productId === 'lifetime' 
                ? 'border-green-500 bg-gradient-to-br from-green-50/10 to-green-100/5 shadow-green-500/20 shadow-lg' 
                : 'border-gray-200/20 bg-gradient-to-br from-gray-50/5 to-gray-100/5 hover:border-gray-300/30 hover:shadow-gray-500/10'
            } backdrop-blur-sm`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25">
                  Popular
                </span>
              </div>
              <h2 className="mb-2 text-xl font-semibold">Lifetime Membership</h2>
              <p className="mb-4 text-sm text-fd-muted-foreground">
                One-time lifetime access to the builder membership
              </p>
              {/* Price */}
              <div className="mb-4 text-center">
                {userSubscription?.productId === '1-year' ? (
                  <div className="flex flex-col items-center gap-1">
                    <div className="inline-flex items-end gap-2">
                      <span className="text-xl line-through opacity-60">$249</span>
                      <span className="text-3xl font-bold text-green-400">$150</span>
                    </div>
                    <span className="text-xs text-fd-muted-foreground">Upgrade price for current 1-Year members</span>
                  </div>
                ) : (
                  <div className="inline-flex items-end gap-1">
                    <span className="text-3xl font-bold">$249</span>
                    <span className="text-xs text-fd-muted-foreground mb-1">one-time</span>
                  </div>
                )}
              </div>
              <div className="mb-4 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-white/5 px-4 py-2">
                  <span className="text-sm font-semibold">Everything in 1 Year Membership</span>
                </div>
                <div className="mt-2 flex justify-center">
                  <Plus className="text-fd-muted-foreground" />
                </div>
              </div>

              <ul className="mb-6 space-y-3 text-sm text-left mx-auto max-w-[44rem]">
                <Benefit>Access to production-ready codebases for building Mobile Apps</Benefit>
                <Benefit>Weekly accountability coaching</Benefit>
                <Benefit>Priority Access to Hijrah Pipeline</Benefit>
                <Benefit>Priority 1-1 support</Benefit>
              </ul>
              <button
                onClick={() => createCheckoutSession('lifetime')}
                disabled={loadingProductId !== null || userSubscription?.productId === 'lifetime'}
                className={`mt-auto block w-full rounded-xl px-6 py-3 text-center font-semibold transition-all duration-300 ${
                  userSubscription?.productId === 'lifetime'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-not-allowed shadow-lg shadow-green-500/25'
                    : 'bg-gradient-to-r from-fd-primary to-fd-primary/90 text-fd-primary-foreground hover:from-fd-primary/90 hover:to-fd-primary hover:shadow-lg hover:shadow-fd-primary/25 hover:scale-105'
                } disabled:opacity-50`}
              >
                {loadingProductId === 'lifetime' 
                  ? 'Creating Checkout Session...' 
                  : userSubscription?.productId === 'lifetime'
                    ? 'Currently on this plan'
                    : userSubscription?.productId === '1-year'
                    ? 'Upgrade to Lifetime'
                    : 'Get Lifetime Access'
                }
              </button>
            </div>
          </div>
          )}
          
          <div className="mt-8 text-center">
            <button
              onClick={() => handleNavigate('/')}
              disabled={isNavLoading}
              className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground hover:text-fd-foreground px-3 py-1.5 rounded-md border border-transparent hover:border-fd-border disabled:opacity-70"
            >
              {isNavLoading ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <span>←</span>
              )}
              <span>Back to Home</span>
            </button>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}