# Authentication & User Management

**Priority:** Foundation (After Database)
**Estimated Time:** 1 day
**Dependencies:** Database Schema (Task 01)

## Overview
Configure Clerk authentication integration with React Router v7 and Convex. Set up user sync, protected routes, and authentication context.

## Tasks

### 3.1 Configure Clerk Webhook
- **Description:** Configure Clerk webhook to sync users to Convex on signup
- **Acceptance Criteria:**
  - Webhook endpoint created in Convex HTTP actions
  - Webhook validates Clerk signature for security
  - User record automatically created in Convex on Clerk signup
  - Handles user updates and deletions
- **Files to Create/Modify:**
  - `convex/http.ts` (webhook endpoint)
  - `convex/users.ts` (user sync functions)
  - Environment variables configured

### 3.2 Create User Profile Function
- **Description:** Create user profile creation function in Convex
- **Acceptance Criteria:**
  - Function creates user record from Clerk data
  - Extracts email, display name from Clerk token
  - Handles duplicate user creation gracefully
  - Returns user ID for session management
- **Files to Create/Modify:**
  - `convex/users.ts`

### 3.3 Set Up Protected Routes
- **Description:** Set up protected routes using Clerk + React Router v7
- **Acceptance Criteria:**
  - All quiz routes require authentication
  - Unauthenticated users redirect to sign-in
  - Proper loading states during auth checks
  - Clean redirect after successful login
- **Files to Create/Modify:**
  - `app/utils/auth.ts` (auth utilities)
  - `app/routes/_protected.tsx` (layout route)
  - Route protection middleware

### 3.4 Create Authentication Context
- **Description:** Create user authentication context/hooks
- **Acceptance Criteria:**
  - React context provides user state
  - Custom hooks for auth status checks
  - User profile data accessible throughout app
  - Automatic token refresh handling
- **Files to Create:**
  - `app/contexts/AuthContext.tsx`
  - `app/hooks/useAuth.ts`
  - `app/hooks/useUser.ts`

### 3.5 Configure Clerk Components
- **Description:** Configure Clerk sign-in/sign-up components with app styling
- **Acceptance Criteria:**
  - Sign-in modal matches app design
  - Sign-up flow is streamlined (email only)
  - User profile management component
  - Proper error handling and validation
- **Files to Create/Modify:**
  - `app/components/auth/SignInButton.tsx`
  - `app/components/auth/UserProfile.tsx`
  - Clerk appearance configuration

### 3.6 Set Up User Session Management
- **Description:** Set up proper user session management with Convex
- **Acceptance Criteria:**
  - Convex client configured with Clerk authentication
  - Automatic token passing to Convex functions
  - Session persistence across page reloads
  - Proper logout functionality
- **Files to Create/Modify:**
  - `app/lib/convex.ts` (Convex client setup)
  - Session management utilities

## Authentication Flow

### Sign-up Flow
1. User clicks "Get Started" on landing page
2. Clerk modal opens with email signup
3. User verifies email code
4. Clerk webhook triggers user creation in Convex
5. User redirected to dashboard

### Sign-in Flow
1. User clicks "Sign In"
2. Clerk handles authentication
3. User token validated with Convex
4. User redirected to last visited protected route or dashboard

### Protected Route Access
1. User navigates to protected route
2. Auth guard checks Clerk session
3. If authenticated, load route with user context
4. If not authenticated, redirect to sign-in

## Security Considerations
- All Convex functions validate user authentication
- Webhook signature validation for security
- User data isolation (users can only access their own data)
- Proper token expiration handling

## Environment Variables Required
```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
```

## Definition of Done
- Clerk authentication fully integrated
- User signup/signin flows working
- Protected routes properly secured
- User data syncs between Clerk and Convex
- Authentication context available throughout app
- All auth flows tested and working