import { redirect, useLoaderData } from "react-router";
import { AppSidebar } from "~/components/dashboard/app-sidebar";
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

  // 2. Subscription check removed: dashboard is accessible regardless of subscription status

  return { user, authEnabled, paymentsEnabled };
}

export default function DashboardLayout() {
  const { user, authEnabled } = useLoaderData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        {authEnabled && isClient && <UserSync />}
        <SiteHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
