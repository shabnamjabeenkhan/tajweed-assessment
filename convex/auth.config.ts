// Get Clerk issuer domain from environment variable
// Use VITE_CLERK_FRONTEND_API_URL (set in Convex Dashboard)
// IMPORTANT: The domain must match EXACTLY what Clerk sends in the JWT token's "iss" claim
const clerkDomain =
  process.env.VITE_CLERK_FRONTEND_API_URL ||
  process.env.CLERK_FRONTEND_API_URL ||
  // Try multiple common Clerk domains until we find the right one
  "https://clerk.com" ||
  "https://clerk.dev" ||
  "https://clerk.tajweedsimplified.com";

// Log the domain being used (for debugging in production)
// This helps diagnose "No auth provider found matching the given token" errors
console.log("[auth.config.ts] ========================================");
console.log("[auth.config.ts] Configuring Clerk auth provider");
console.log("[auth.config.ts] Domain:", clerkDomain);
console.log("[auth.config.ts] ApplicationID: convex");
console.log("[auth.config.ts] VITE_CLERK_FRONTEND_API_URL:", process.env.VITE_CLERK_FRONTEND_API_URL || "not set (using fallback)");
console.log("[auth.config.ts] ========================================");
console.log("[auth.config.ts] If you see 'No auth provider found', check:");
console.log("[auth.config.ts] 1. Clerk JWT template issuer URL matches the domain above");
console.log("[auth.config.ts] 2. Token's 'iss' claim matches domain exactly (including protocol)");
console.log("[auth.config.ts] 3. JWT template has 'aud': 'convex' claim");
console.log("[auth.config.ts] ========================================");

export default {
  providers: [
    // Try the configured domain first
    {
      domain: clerkDomain,
      applicationID: "convex",
    },
    // Fallback to common Clerk domains
    {
      domain: "https://clerk.dev",
      applicationID: "convex",
    },
    {
      domain: "https://clerk.com",
      applicationID: "convex",
    },
    // Also try without subdomain
    {
      domain: "clerk.tajweedsimplified.com",
      applicationID: "convex",
    },
  ]
};