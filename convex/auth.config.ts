// Get Clerk issuer domain from environment variable
// Use VITE_CLERK_FRONTEND_API_URL (set in Convex Dashboard)
const clerkDomain = 
  process.env.VITE_CLERK_FRONTEND_API_URL || 
  "https://clerk.tajweedsimplified.com";

// Log the domain being used (for debugging in production)
console.log("[auth.config.ts] Using Clerk domain:", clerkDomain);
console.log("[auth.config.ts] VITE_CLERK_FRONTEND_API_URL:", process.env.VITE_CLERK_FRONTEND_API_URL || "not set (using fallback)");

export default {
  providers: [
    {
      domain: clerkDomain,
      applicationID: "convex",
    },
  ]
};