// Get Clerk issuer domain from environment variable
// Use VITE_CLERK_FRONTEND_API_URL (set in Convex Dashboard)
// IMPORTANT: The domain must match EXACTLY what Clerk sends in the JWT token's "iss" claim
const clerkDomain =
  process.env.VITE_CLERK_FRONTEND_API_URL ||
  // Fallback to production domain (most likely for production deployments)
  "https://clerk.tajweedsimplified.com";

// Log the domain being used (for debugging in production)
// This helps diagnose "No auth provider found matching the given token" errors
console.log("[auth.config.ts] ========================================");
console.log("[auth.config.ts] Configuring Clerk auth provider");
console.log("[auth.config.ts] Primary Domain:", clerkDomain);
console.log("[auth.config.ts] Domain (no protocol):", clerkDomain.replace(/^https?:\/\//, ""));
console.log("[auth.config.ts] ApplicationID: convex");
console.log("[auth.config.ts] VITE_CLERK_FRONTEND_API_URL:", process.env.VITE_CLERK_FRONTEND_API_URL || "not set (using fallback)");
console.log("[auth.config.ts] ========================================");
console.log("[auth.config.ts] Configured providers:");
console.log("[auth.config.ts] 1. Domain:", clerkDomain, "| ApplicationID: convex");
console.log("[auth.config.ts] 2. Domain:", clerkDomain.replace(/^https?:\/\//, ""), "| ApplicationID: convex");
console.log("[auth.config.ts] 3. Domain: https://clerk.dev | ApplicationID: convex");
console.log("[auth.config.ts] 4. Domain: https://clerk.com | ApplicationID: convex");
console.log("[auth.config.ts] ========================================");
console.log("[auth.config.ts] If you see 'No auth provider found', check:");
console.log("[auth.config.ts] 1. Clerk JWT template issuer URL matches one of the domains above");
console.log("[auth.config.ts] 2. Token's 'iss' claim matches domain EXACTLY (including protocol)");
console.log("[auth.config.ts] 3. JWT template has 'aud': 'convex' claim");
console.log("[auth.config.ts] 4. Run debugAuthConfig query to see actual token issuer");
console.log("[auth.config.ts] ========================================");

export default {
  providers: [
    // Primary: Use the configured domain (from env var or production fallback)
    {
      domain: clerkDomain,
      applicationID: "convex",
    },
    // Fallback: Try without protocol (in case Clerk sends domain without https://)
    {
      domain: clerkDomain.replace(/^https?:\/\//, ""),
      applicationID: "convex",
    },
    // Fallback: Common Clerk development domains (for dev environments)
    {
      domain: "https://clerk.dev",
      applicationID: "convex",
    },
    {
      domain: "https://clerk.com",
      applicationID: "convex",
    },
  ]
};