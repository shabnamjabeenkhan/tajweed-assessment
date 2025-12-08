# Bug Report: All Users Display Identical Dashboard Statistics

## 1. Error Description

**Error Type:** Data Isolation Bug / Test User Hardcoding Issue

**Description:**

Every user account (signed up or logged in) displays the same dashboard metrics regardless of their actual quiz performance. This occurs because the dashboard is querying statistics for a single hardcoded test user instead of the currently authenticated user.

**Observed Behavior:**

- Badges Earned: **9** (same for all users)
- Average Score: **29%** (same for all users)
- Quizzes Completed: **18** (same for all users)
- All other dashboard stats are identical across different user accounts

---

## 2. User Journey

The user signs up or logs in, when they go to the dashboard, they see identical data such as:

**Dashboard Metrics (Same for Every User):**

- **Quizzes Completed:** 18
- **Average Score:** 29%
- **Badges Earned:** 9
- **Weekly Progress:** (derived from the 18 attempts)
- **Score Improvement:** +18% (improvement metric)

All users see these exact same statistics regardless of their actual quiz performance.

---

## 3. Jam.dev Replay

**Replay Link:** https://jam.dev/c/702ff598-c954-4059-aaa6-c66785317e34

---

## 4. Screenshots

*Screenshots attached showing identical dashboard statistics across multiple user accounts*

---

## 5. Client-side Logs

*Client-side console logs available in Jam.dev replay*

---

## 6. Network Tab

*Network requests available in Jam.dev replay*

---

## 7. Code Snippets

### Problem: Dashboard Uses Test User for All Sessions

**File: `app/routes/dashboard/index.tsx` (lines 14-28)**

```typescript
// Get test user ID for MVP
const testUserId = useQuery(api.testUser.getTestUser);
const createTestUser = useMutation(api.testUser.getOrCreateTestUser);

// Create test user if it doesn't exist
useEffect(() => {
  if (testUserId === null) {
    createTestUser();
  }
}, [testUserId, createTestUser]);

// Get dashboard stats in real-time (only when we have a user)
const statsQuery = useQuery(api.quizAttempts.getDashboardStats,
  testUserId ? { userId: testUserId } : "skip"
);
```

**File: `convex/testUser.ts` (lines 34-44)**

```typescript
export const getTestUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", "test-user-mvp"))
      .unique();

    return user?._id || null;
  },
});
```

**File: `convex/testUser.ts` (lines 47-72)**

```typescript
export const getOrCreateTestUser = mutation({
  args: {},
  handler: async (ctx) => {
    // First try to get existing user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", "test-user-mvp"))
      .unique();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new test user if doesn't exist
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: "test-user-mvp",
      name: "MVP Test User",
      email: "test@example.com",
      displayName: "MVP Test User",
      clerkId: "test-clerk-mvp",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});
```

**File: `convex/quizAttempts.ts` (lines 61-68)**

```typescript
export const getDashboardStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const attempts = await ctx.db
      .query("quizAttempts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
```

### Root Cause

- Dashboard always queries the same hardcoded test user (`"test-user-mvp"`)
- All users see stats from this single test user account
- `getDashboardStats` query in `convex/quizAttempts.ts` correctly filters by `userId`, but receives the same `userId` for everyone

### Solution Required

Replace the test user system with proper user authentication that:

1. Gets the actual logged-in user's ID
2. Queries stats specific to that user
3. Shows personalized data for each user session

---

## 8. Environment

- **Development:** ✅ Reproducible
- **Production:** ✅ Reproducible

---

## 9. Reproduction Steps

### Setup (First Time)

1. Start the development server: `bun run dev`
2. The test user (`test-user-mvp`) is automatically created on first dashboard load

### Step 1: First User

1. Open the app in a browser (or incognito window)
2. Sign up or log in with any account (Account A)
3. Navigate to `/dashboard`
4. **Note the dashboard stats:**
   - Quizzes Completed: **18**
   - Average Score: **29%**
   - Badges Earned: **9**

### Step 2: Second User

1. Open a new incognito/private browser window
2. Sign up or log in with a different account (Account B)
3. Navigate to `/dashboard`
4. **Observe the dashboard stats:**
   - Quizzes Completed: **18** ✓ (SAME as Account A)
   - Average Score: **29%** ✓ (SAME as Account A)
   - Badges Earned: **9** ✓ (SAME as Account A)

### Step 3: Third User (Optional)

1. Open another incognito/private browser window
2. Sign up or log in with a third account (Account C)
3. Navigate to `/dashboard`
4. **Confirm identical stats:**
   - Quizzes Completed: **18** ✓ (SAME as A and B)
   - Average Score: **29%** ✓ (SAME as A and B)
   - Badges Earned: **9** ✓ (SAME as A and B)

### Expected Result (Should Be)

Each user should see their own dashboard metrics based on their quiz attempts:

- Account A: 18 quizzes, 29%, 9 badges (if Account A took 18 quizzes)
- Account B: 0 quizzes, 0%, 0 badges (if Account B is new)
- Account C: Different stats based on their own quiz history

### Actual Result (Bug)

All three accounts see identical stats (18, 29%, 9) because they're all querying the same hardcoded test user's data.

---

## Summary

**Issue:** Complete loss of user data isolation - all authenticated users see identical dashboard statistics.

**Root Cause:** Hardcoded test user (`test-user-mvp`) is used for all dashboard queries instead of the actual authenticated user's ID.

**Impact:** 
- No user-specific data tracking
- Privacy/data isolation violation
- Multi-tenant functionality broken

**Priority:** High - Critical bug affecting core functionality

