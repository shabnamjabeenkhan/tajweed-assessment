import { memo } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Navbar } from "./navbar";

export default function IntegrationsSection({
  loaderData,
}: {
  loaderData?: { isSignedIn: boolean; hasActiveSubscription: boolean };
}) {
  return (
    <section id="hero">
      <Navbar loaderData={loaderData} />
      <div className="bg-muted dark:bg-background py-24 md:py-32">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 shadow-sm">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Free Interactive Tajweed Learning
            </span>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-6 mt-[2rem]">
          <div className="grid items-center sm:grid-cols-2">
            <div className="dark:bg-muted/50 relative mx-auto w-fit">
              <div className="bg-radial to-muted dark:to-background absolute inset-0 z-10 from-transparent to-75%"></div>

              {/* Tajweed Rules Visual */}
              <div className="relative p-8">
                <div className="mx-auto mb-4 flex w-fit justify-center gap-3">
                  <TajweedCard rule="إِدْغَام" name="Idgham" />
                  <TajweedCard rule="إِخْفَاء" name="Ikhfa" />
                </div>
                <div className="mx-auto my-4 flex w-fit justify-center gap-3">
                  <TajweedCard rule="قَلْقَلَة" name="Qalqalah" />
                  <TajweedCard
                    rule="مَدّ"
                    name="Madd"
                    highlight={true}
                  />
                  <TajweedCard rule="غُنَّة" name="Ghunna" />
                </div>
                <div className="mx-auto flex w-fit justify-center gap-3">
                  <TajweedCard rule="نُون سَاكِنَة" name="Noon Sakinah" />
                  <TajweedCard rule="تَنْوِين" name="Tanween" />
                </div>

                {/* Quiz Progress Indicator */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-full px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    Interactive Quizzes
                  </div>
                </div>
              </div>
            </div>
            <div className="mx-auto mt-6 max-w-2xl space-y-6 text-center sm:mt-0 sm:text-left">
              <div className="space-y-4">
                <h1 className="text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
                  Master Your
                  <span className="text-emerald-600 dark:text-emerald-400"> Tajweed</span>
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  Perfect your Quran recitation through interactive quizzes focused on individual Tajweed rules.
                  Practice, learn, and track your progress - completely free.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-2 justify-center sm:justify-start">
                <Button size="lg" asChild>
                  <Link to="/dashboard">
                    Start Learning Free
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="#features">
                    How It Works
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground justify-center sm:justify-start">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  Free Forever
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  No Ads
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  Track Progress
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const TajweedCard = memo(({
  rule,
  name,
  highlight = false,
}: {
  rule: string;
  name: string;
  highlight?: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-background relative flex flex-col items-center justify-center w-24 h-24 rounded-xl dark:bg-transparent hover:scale-105 transition-transform",
        highlight && "ring-2 ring-emerald-500 ring-offset-2 ring-offset-background"
      )}
    >
      <div
        role="presentation"
        className={cn(
          "absolute inset-0 rounded-xl border border-black/20 dark:border-white/25",
          highlight && "border-emerald-500/50"
        )}
      />
      <div className="relative z-20 text-center space-y-1">
        <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-arabic">
          {rule}
        </div>
        <div className="text-xs text-muted-foreground font-medium">
          {name}
        </div>
      </div>
    </div>
  );
});

