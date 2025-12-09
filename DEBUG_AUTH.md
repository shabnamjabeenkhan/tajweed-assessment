# Debug Authentication in Production

## Method 1: Debug Page (Easiest - Recommended)

I've created a debug page route for you. Simply:

1. **Deploy the changes** (the debug route is already added)
2. **Visit in production**: `https://www.tajweedsimplified.com/debug-auth`
3. **View the results** - The page will show:
   - Whether Clerk token is available
   - Whether Convex found an identity
   - The actual token issuer vs configured domain
   - Clear error messages if there's a mismatch

The page will automatically highlight any issues and tell you exactly what to fix.

**After debugging, delete the route** by removing `route("debug-auth", "routes/debug-auth.tsx")` from `app/routes.ts` and deleting `app/routes/debug-auth.tsx`.

## Method 2: Browser Console (Alternative)

Open your production site (`https://www.tajweedsimplified.com`) and open the browser console (F12 or Cmd+Option+I), then paste and run this:

```javascript
// Step 1: Get Clerk token
const clerkToken = await window.Clerk?.session?.getToken({ template: "convex" });
if (!clerkToken) {
  console.error("❌ No Clerk token available. Make sure you're signed in.");
} else {
  console.log("✅ Clerk token obtained:", clerkToken.substring(0, 50) + "...");
}

// Step 2: Get Convex URL from the page
const convexUrl = import.meta?.env?.VITE_CONVEX_URL || 
                  window.__CONVEX_URL__ || 
                  document.querySelector('script[data-convex-url]')?.dataset?.convexUrl;

if (!convexUrl) {
  console.error("❌ Could not find Convex URL. Try Method 2.");
} else {
  console.log("✅ Convex URL:", convexUrl);
  
  // Step 3: Import Convex HTTP client and call query
  const { ConvexHttpClient } = await import('https://cdn.jsdelivr.net/npm/convex@latest/browser.js');
  const { api } = await import('/convex/_generated/api.js');
  
  const client = new ConvexHttpClient(convexUrl);
  
  // Set auth token if available
  if (clerkToken) {
    client.setAuth(clerkToken);
  }
  
  // Call debug query
  try {
    const result = await client.query(api.users.debugAuthConfig, {});
    console.log("🔍 Auth Debug Result:", result);
    console.log("\n📊 Analysis:");
    console.log("  - Has Identity:", result.hasIdentity ? "✅ Yes" : "❌ No");
    console.log("  - Token Issuer:", result.identityIssuer || "N/A");
    console.log("  - Env Var Value:", result.envVar);
    console.log("  - Issuer Matches Env Var:", result.issuerMatchesEnvVar ? "✅ Yes" : "❌ No");
    console.log("  - Expected Domain:", result.expectedDomain);
    
    if (!result.hasIdentity) {
      console.error("\n❌ PROBLEM: No identity found. This means:");
      console.error("  1. Token is not being passed to Convex");
      console.error("  2. Token issuer doesn't match any configured provider");
      console.error("  3. Check Convex Production logs for auth.config.ts domain value");
    } else if (!result.issuerMatchesEnvVar) {
      console.error("\n❌ PROBLEM: Issuer mismatch!");
      console.error("  Token issuer:", result.identityIssuer);
      console.error("  Configured domain:", result.envVar);
      console.error("  These must match EXACTLY (including protocol)");
    } else {
      console.log("\n✅ Everything looks good! Issuer matches configured domain.");
    }
  } catch (error) {
    console.error("❌ Error calling debug query:", error);
  }
}
```

## Method 3: Access React DevTools (Alternative)

If Method 1 doesn't work, you can access the Convex client from React DevTools:

1. Install React DevTools browser extension
2. Open DevTools → Components tab
3. Find the `ConvexProviderWithClerk` component
4. Inspect its props to find the `client` instance
5. Use that client to call the query

## Method 4: Use Convex MCP Server (If Available in Cursor)

Create a temporary debug route that displays this information:

1. Create `app/routes/debug-auth.tsx`
2. Use `useQuery(api.users.debugAuthConfig)` in the component
3. Display the results on the page
4. Visit `/debug-auth` in production
5. Delete the route after debugging


If you have Convex MCP server configured in Cursor:

```bash
# Run the debug query directly
mcp_convex_run --deploymentSelector <production-selector> --functionName "users:debugAuthConfig" --args "{}"
```

## What to Look For

The diagnostic query returns:
- `hasIdentity`: Whether Convex found an identity (should be `true`)
- `identityIssuer`: The actual issuer from the JWT token
- `envVar`: The configured domain from environment variable
- `issuerMatchesEnvVar`: Whether they match exactly
- `expectedDomain`: What domain should be configured

**Critical Check**: If `issuerMatchesEnvVar` is `false`, that's your problem! The token issuer must match the configured domain EXACTLY.

