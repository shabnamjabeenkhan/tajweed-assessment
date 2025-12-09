# Authentication Error Debug Plan

## Problem
Users getting "Authentication error. Please sign out and sign back in." when completing quizzes in production.

## Root Cause Analysis (Confidence Levels)

### 🔴 High Confidence (90-95%)
1. **ConvexProviderWithClerk Token Passing**
   - `ConvexProviderWithClerk` uses Clerk's `getToken()` internally
   - If token fetch fails silently, Convex mutations receive no token
   - **Fix**: Added explicit token verification before calling `upsertUser`

2. **No Client-Side Token Verification**
   - No verification that Clerk is issuing tokens before Convex calls
   - **Fix**: Added `getToken({ template: "convex" })` check before mutations

### 🟡 Medium Confidence (70-80%)
3. **Token Lifetime (60s)**
   - Clerk JWT template has 60-second lifetime
   - If quiz takes >60s, token expires mid-submission
   - **Status**: Monitor - if issue persists, increase token lifetime in Clerk Dashboard

4. **Runtime Domain Mismatch**
   - `auth.config.ts` may not read env var correctly at runtime
   - **Fix**: Added comprehensive logging to see actual domain value

### 🟢 Lower Confidence (50-60%)
5. **Clerk Template Configuration**
   - Template name/applicationID mismatch
   - Missing required claims
   - **Status**: Verify in Clerk Dashboard

## Implemented Fixes

### 1. Enhanced Logging in `auth.config.ts`
```typescript
console.log("[auth.config.ts] Using Clerk domain:", clerkDomain);
console.log("[auth.config.ts] VITE_CLERK_FRONTEND_API_URL:", process.env.VITE_CLERK_FRONTEND_API_URL || "not set");
// ... more logs
```
**Purpose**: See what domain Convex is actually using in production logs

### 2. Client-Side Token Verification
```typescript
if (authEnabled && isSignedIn && getToken) {
  const token = await getToken({ template: "convex" });
  if (!token) {
    // Handle error - token not available
  }
}
```
**Purpose**: Verify Clerk token exists before calling Convex mutations

### 3. Enhanced Error Logging in `upsertUser`
```typescript
console.log("[upsertUser] Identity found:", {
  subject: identity.subject,
  issuer: identity.issuer,
  // ...
});
```
**Purpose**: See what identity Convex receives (or doesn't receive)

## Next Steps

1. **Deploy to Production**
   ```bash
   bunx convex deploy -y
   ```

2. **Test in Production**
   - Sign out and sign back in
   - Complete a quiz
   - Check browser console for new logs

3. **Check Convex Production Logs**
   - Go to Convex Dashboard → Production → Logs
   - Look for:
     - `[auth.config.ts] Using Clerk domain:` - confirms domain value
     - `[handleQuizSubmit] Clerk token obtained successfully` - confirms token fetch
     - `[upsertUser] Identity found:` - confirms Convex received identity

4. **If Still Failing**
   - Check Clerk Dashboard → JWT Templates → "convex"
   - Verify:
     - Token lifetime (increase if needed)
     - Issuer URL matches Convex env var
     - Template is enabled

5. **Verify Environment Variable**
   - Convex Dashboard → Production → Settings → Environment Variables
   - Confirm `VITE_CLERK_FRONTEND_API_URL` = `https://clerk.tajweedsimplified.com`

## Expected Behavior After Fix

✅ **Success Path:**
1. User completes quiz
2. `getToken({ template: "convex" })` succeeds
3. Token passed to Convex via `ConvexProviderWithClerk`
4. `upsertUser` receives identity from `ctx.auth.getUserIdentity()`
5. Quiz submission succeeds

❌ **Failure Path (with new logging):**
1. User completes quiz
2. `getToken()` fails → Error shown immediately
3. OR `getToken()` succeeds but `upsertUser` fails → Logs show why

## Debugging Commands

```bash
# Deploy Convex changes
bunx convex deploy -y

# Check Convex logs (in Convex Dashboard)
# Production → Logs → Filter: "auth.config" or "upsertUser"
```

## Files Modified

1. `convex/auth.config.ts` - Added runtime logging
2. `app/routes/quiz.$ruleSlug.tsx` - Added token verification
3. `convex/users.ts` - Enhanced error logging

