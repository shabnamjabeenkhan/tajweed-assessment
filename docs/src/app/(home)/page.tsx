"use client";
import Link from 'next/link';
import { ArrowRight, Rocket, Building, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HomePage() {
  const router = useRouter();
  const [isCtaLoading, setIsCtaLoading] = useState(false);

  const handleStartBuilding = () => {
    if (isCtaLoading) return;
    setIsCtaLoading(true);
    router.push('/docs');
  };

  return (
    <main className="flex flex-1 flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center rounded-full border border-fd-border bg-fd-muted px-3 py-1 text-sm font-medium text-fd-muted-foreground mb-6">
            <Rocket className="mr-2 h-4 w-4" />
            Startup Accelerator Program
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-fd-foreground sm:text-5xl lg:text-6xl">
            Become a High-Performance Technical Founder in{' '}
            <span className="text-fd-primary">
              Weeks
              <br />
              Not Years
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-lg text-fd-muted-foreground sm:text-xl lg:text-2xl max-w-3xl mx-auto">
            If you're ambitious, this is everything you need to become an AI-forward Product Engineer. 
            From idea validation to production deployment.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleStartBuilding}
              disabled={isCtaLoading}
              className="inline-flex items-center justify-center rounded-md bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground shadow transition-colors hover:bg-fd-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fd-ring disabled:opacity-80"
            >
              Start Building
              {isCtaLoading ? (
                <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </button>
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center rounded-md border border-fd-border bg-fd-background px-6 py-3 text-sm font-medium text-fd-foreground shadow-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fd-ring"
            >
              Get Premium Access
            </Link>
          </div>

          {/* Value Propositions */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-fd-border bg-fd-card">
              <Building className="h-8 w-8 text-fd-primary mb-3" />
              <h3 className="font-semibold text-fd-foreground mb-2">Company Building</h3>
              <p className="text-sm text-fd-muted-foreground">
                Complete guide to running a successful tech company from setup to exit
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-fd-border bg-fd-card">
              <Rocket className="h-8 w-8 text-fd-primary mb-3" />
              <h3 className="font-semibold text-fd-foreground mb-2">Product Development</h3>
              <p className="text-sm text-fd-muted-foreground">
                Build products from 0 to 1 with production-ready tech stacks and best practices
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-fd-border bg-fd-card sm:col-span-2 lg:col-span-1">
              <Brain className="h-8 w-8 text-fd-primary mb-3" />
              <h3 className="font-semibold text-fd-foreground mb-2">AI Engineering</h3>
              <p className="text-sm text-fd-muted-foreground">
                Learn to tastefully embed AI into your products with modern frameworks
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
