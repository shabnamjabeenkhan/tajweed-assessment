export default {
  providers: [
    {
      domain: process.env.VITE_CLERK_FRONTEND_API_URL || "https://clerk.tajweedsimplified.com",
      applicationID: "convex",
    },
  ]
};