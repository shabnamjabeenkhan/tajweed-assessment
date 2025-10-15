'use client';

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function AuthNav() {
  return (
    <div className="flex items-center gap-2">
      <SignedIn>
        <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: 'h-8 w-8' } }} />
      </SignedIn>
      <SignedOut>
        <Link
          href="/sign-in"
          className="hidden sm:inline-flex items-center rounded-md border border-fd-border bg-fd-background px-3 py-1.5 text-sm text-fd-foreground hover:bg-fd-accent hover:text-fd-accent-foreground"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="inline-flex items-center rounded-md bg-fd-primary px-3 py-1.5 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90"
        >
          Sign Up
        </Link>
      </SignedOut>
    </div>
  );
}


