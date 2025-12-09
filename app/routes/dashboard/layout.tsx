import { redirect, useLoaderData } from "react-router";
import { AppSidebar } from "~/components/dashboard/app-sidebar";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { SiteHeader } from "~/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import type { Route } from "./+types/layout";
import { Outlet } from "react-router";
import { isFeatureEnabled, isServiceEnabled, getServiceConfig } from "../../../config";
import { UserSync } from "~/components/dashboard/user-sync";
import { useEffect, useState } from "react";

export async function loader(args: Route.LoaderArgs) {
  const authEnabled = isFeatureEnabled("auth") && isServiceEnabled("clerk");
  const paymentsEnabled = isFeatureEnabled("payments");
  const convexEnabled = isFeatureEnabled("convex") && isServiceEnabled("convex");

  let userId: string | null = null;
  let user: any = null;
  let stats = null;

  // 1. Authentication
  if (authEnabled) {
    const { getAuth } = await import("@clerk/react-router/ssr.server");
    const { createClerkClient } = await import("@clerk/react-router/api.server");

    const auth = await getAuth(args);
    userId = auth.userId;

    // Redirect to sign-in if not authenticated
    if (!userId) {
      throw redirect("/sign-in");
    }

    // Fetch user details (required for sidebar)
    const clerkConfig = getServiceConfig('clerk');
    if (!clerkConfig?.secretKey) {
      throw new Error('CLERK_SECRET_KEY is required when auth is enabled');
    }

    user = await createClerkClient({
      secretKey: clerkConfig.secretKey,
    }).users.getUser(userId);
  }

  // 2. Fetch dashboard stats for sidebar
  try {
    const convexUrl = process.env.VITE_CONVEX_URL;
    if (convexUrl) {
      const convexClient = new ConvexHttpClient(convexUrl);
      const testUserId = "jd76h3qestqer1vh269vd9wh317sme1k" as any;

      stats = await convexClient.query(api.quizAttempts.getDashboardStats, {
        userId: testUserId
      });
    }
  } catch (error) {
    console.error("Error loading dashboard stats in layout:", error);
    stats = {
      quizzesCompleted: 0,
      averageScore: 0,
      currentStreak: 0,
      badgesEarned: 0,
      weeklyProgress: 0,
      scoreImprovement: 0,
    };
  }

  return { user, authEnabled, paymentsEnabled, stats };
}

export default function DashboardLayout() {
  const { user, authEnabled, stats } = useLoaderData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <SidebarProvider
        className="min-h-screen bg-gray-950"
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" user={user} stats={stats} />
        <SidebarInset className="bg-gray-950">
          {authEnabled && isClient && <UserSync />}
          <SiteHeader />
          <div className="bg-gray-950">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}