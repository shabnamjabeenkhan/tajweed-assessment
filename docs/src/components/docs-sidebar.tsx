'use client';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { CreditCard } from 'lucide-react';

export function DocsSidebarBottom() {
  return (
    <div className="flex items-center gap-2 p-4 border-t border-fd-border mt-auto">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-sm font-medium text-fd-foreground hover:text-fd-muted-foreground">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Link 
          href="/billing"
          className="flex items-center gap-1 text-sm font-medium text-fd-foreground hover:text-fd-muted-foreground"
        >
          <CreditCard className="h-4 w-4" />
          Billing
        </Link>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
