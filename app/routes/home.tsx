import { isFeatureEnabled, isServiceEnabled } from "../../config";
import Integrations from "~/components/homepage/integrations";
import { api } from "../../convex/_generated/api";
import type { Route } from "./+types/home";
import { Suspense, lazy } from 'react';
import { ContentSkeleton } from '~/components/ui/skeleton';

// Lazy load components below the fold
const ContentSection = lazy(() => import("~/components/homepage/content"));
const Footer = lazy(() => import("~/components/homepage/footer"));

export function meta({}: Route.MetaArgs) {
  const title = "Tajweed Quiz - Master Your Quran Recitation";
  const description =
    "Learn and practice Tajweed rules with interactive quizzes. Perfect your Quran recitation through focused, rule-specific practice sessions.";
  const keywords = "Tajweed, Quran, Recitation, Islamic Learning, Arabic, Prayer, Tilawah";
  const siteUrl = "https://www.tajweed-quiz.com/";
  const imageUrl = "/tajweed-logo.svg";

  return [
    { title },
    {
      name: "description",
      content: description,
    },

    // Open Graph / Facebook
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:url", content: siteUrl },
    { property: "og:site_name", content: "Tajweed Quiz" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    {
      name: "twitter:description",
      content: description,
    },
    { name: "twitter:image", content: imageUrl },
    {
      name: "keywords",
      content: keywords,
    },
    { name: "author", content: "Tajweed Quiz" },
    { name: "favicon", content: imageUrl },
  ];
}

export async function loader(args: Route.LoaderArgs) {
  const authEnabled = isFeatureEnabled("auth") && isServiceEnabled("clerk");
  const convexEnabled = isFeatureEnabled("convex") && isServiceEnabled("convex");
  const paymentsEnabled = isFeatureEnabled("payments") && isServiceEnabled("polar");

  // 1. Auth: get userId if auth enabled, else null
  let userId: string | null = null;
  if (authEnabled) {
    const { getAuth } = await import("@clerk/react-router/ssr.server");
    ({ userId } = await getAuth(args));
  }

  // 2. Fetch subscription status & plans only if Convex enabled
  let subscriptionData: { hasActiveSubscription: boolean } | null = null;
  let plans: any = null;

  if (convexEnabled) {
    const { fetchQuery, fetchAction } = await import("convex/nextjs");

    const promises: Promise<any>[] = [
      userId
        ? fetchQuery(api.subscriptions.checkUserSubscriptionStatus, {
            userId,
          }).catch((error: unknown) => {
            console.error("Failed to fetch subscription data:", error);
            return null;
          })
        : Promise.resolve(null),
    ];

    // Only fetch plans if payments are enabled
    if (paymentsEnabled) {
      promises.push(fetchAction(api.subscriptions.getAvailablePlans));
    } else {
      promises.push(Promise.resolve(null));
    }

    [subscriptionData, plans] = await Promise.all(promises);
  }

  return {
    isSignedIn: !!userId,
    hasActiveSubscription: subscriptionData?.hasActiveSubscription || false,
    plans,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Integrations loaderData={loaderData} />
      <Suspense fallback={<ContentSkeleton />}>
        <ContentSection />
      </Suspense>
      <Suspense fallback={<div className="h-32 bg-muted" />}>
        <Footer />
      </Suspense>
    </>
  );
}
