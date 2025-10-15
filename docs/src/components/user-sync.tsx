'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEffect } from 'react';

export function UserSync() {
  const { isSignedIn, userId } = useAuth();
  const upsertUser = useMutation(api.users.upsertUser);

  useEffect(() => {
    if (isSignedIn && userId) {
      // Sync user to Convex database
      upsertUser().catch((error) => {
        console.error('Failed to sync user:', error);
      });
    }
  }, [isSignedIn, userId, upsertUser]);

  return null; // This component doesn't render anything
}
