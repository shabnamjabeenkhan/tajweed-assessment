'use client';

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Subscription {
  _id: string;
  status: string;
  amount: number;
  currency: string;
  interval: string; // 'year' | 'lifetime'
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  customerId: string;
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscription/status');
        if (response.ok) {
          const data = await response.json();
          if (data.hasActiveSubscription) {
            if (data.subscription) {
              setSubscription({
                _id: data.subscription._id,
                status: data.subscription.status,
                amount: data.subscription.amount,
                currency: data.subscription.currency,
                interval: data.subscription.interval,
                currentPeriodStart: data.subscription.currentPeriodStart,
                currentPeriodEnd: data.subscription.currentPeriodEnd,
                cancelAtPeriodEnd: data.subscription.cancelAtPeriodEnd,
                customerId: data.subscription.customerId,
              });
            } else if (data.payment) {
              // Lifetime one-time payment path
              setSubscription({
                _id: data.payment._id,
                status: 'active',
                amount: data.payment.amount || 0,
                currency: (data.payment.currency || 'usd').toLowerCase(),
                interval: 'lifetime',
                // Use paidAt as a reference timestamp; UI will hide period for lifetime
                currentPeriodStart: data.payment.paidAt || Date.now(),
                currentPeriodEnd: data.payment.paidAt || Date.now(),
                cancelAtPeriodEnd: false,
                customerId: data.payment.customerId || '',
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleManageBilling = async () => {
    if (!subscription?.customerId) return;
    
    setPortalLoading(true);
    try {
      const response = await fetch('/api/subscription/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId: subscription.customerId }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.open(url, '_blank');
      } else {
        console.error('Failed to create customer portal session');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    } finally {
      setPortalLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen bg-fd-background">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">Billing & Subscription</h1>
          </div>
        
          <SignedOut>
            <div className="rounded-lg border bg-fd-card p-6 text-center">
              <p className="mb-6 text-fd-muted-foreground">
                Please sign in to view your billing information.
              </p>
              <SignInButton mode="modal">
                <button className="rounded-md bg-fd-primary px-6 py-3 text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>
        
          <SignedIn>
            {loading ? (
              <div className="rounded-lg border bg-fd-card p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fd-primary mx-auto"></div>
                <p className="mt-4 text-fd-muted-foreground">Loading subscription...</p>
              </div>
            ) : subscription ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Current Subscription */}
                <div className="rounded-lg border bg-fd-card p-6">
                  <h2 className="mb-6 text-xl font-semibold">Current Subscription</h2>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="text-fd-muted-foreground">Plan</span>
                      <span className="font-medium">
                        {subscription.interval === 'year' ? '1 Year Membership' : 'Lifetime Membership'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="text-fd-muted-foreground">Status</span>
                      <span className={`font-medium ${
                        subscription.status === 'active' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                      <span className="text-fd-muted-foreground">Amount</span>
                      <span className="font-medium">
                        {formatAmount(subscription.amount, subscription.currency)}
                        {subscription.interval === 'year' && ' / year'}
                      </span>
                    </div>
                    {subscription.interval !== 'lifetime' && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <span className="text-fd-muted-foreground">Current Period</span>
                        <span className="font-medium text-sm">
                          {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                        </span>
                      </div>
                    )}
                    {subscription.cancelAtPeriodEnd && (
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                        <span className="text-fd-muted-foreground">Cancellation</span>
                        <span className="font-medium text-red-600 text-sm">
                          Ends on {formatDate(subscription.currentPeriodEnd)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleManageBilling}
                      disabled={portalLoading}
                      className="flex-1 rounded-md bg-fd-primary px-4 py-3 text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {portalLoading ? 'Opening Portal...' : 'Manage Billing'}
                    </button>
                    <Link
                      href="/subscribe"
                      className="flex-1 rounded-md border px-4 py-3 text-center text-fd-foreground hover:bg-fd-muted transition-colors"
                    >
                      Change Plan
                    </Link>
                  </div>
                </div>

                {/* Billing History */}
                <div className="rounded-lg border bg-fd-card p-6">
                  <h2 className="mb-6 text-xl font-semibold">Billing History</h2>
                  <p className="text-fd-muted-foreground">
                    Billing history will be available through the customer portal.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border bg-fd-card p-8 text-center">
                <p className="mb-6 text-fd-muted-foreground">
                  You don't have an active subscription.
                </p>
                <Link
                  href="/subscribe"
                  className="inline-block rounded-md bg-fd-primary px-6 py-3 text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors"
                >
                  Subscribe Now
                </Link>
              </div>
            )}
            
            <div className="mt-8 text-center">
              <Link 
                href="/docs" 
                className="inline-flex items-center text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
              >
                ← Back to Documentation
              </Link>
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
