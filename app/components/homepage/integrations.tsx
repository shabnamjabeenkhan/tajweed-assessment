import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Navbar } from "./navbar";
import { GlowCard } from "~/components/ui/spotlight-card";

export default function IntegrationsSection({
  loaderData,
}: {
  loaderData?: { isSignedIn: boolean; hasActiveSubscription: boolean };
}) {
  return (
    <section id="hero">
      <Navbar loaderData={loaderData} />
      <div className="py-24 md:py-32" style={{ backgroundColor: '#1b1c1d' }}>
        <div className="mx-auto max-w-5xl px-6 mt-[2rem]">
          <div className="grid items-center sm:grid-cols-2">
            <div className="dark:bg-muted/50 relative mx-auto w-fit">

              {/* Tajweed Rules Visual */}
              <div className="relative p-8">
                <div className="mx-auto mb-4 flex w-fit justify-center gap-3">
                  <GlowCard customSize width={128} height={128} glowColor="green" className="w-32 h-32">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                        إِدْغَام
                      </div>
                      <div className="text-xs font-medium" style={{ color: '#114b3c' }}>
                        Idgham
                      </div>
                    </div>
                  </GlowCard>
                  <GlowCard customSize width={128} height={128} glowColor="green" className="w-32 h-32">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                        إِخْفَاء
                      </div>
                      <div className="text-xs font-medium" style={{ color: '#114b3c' }}>
                        Ikhfa
                      </div>
                    </div>
                  </GlowCard>
                </div>
                <div className="mx-auto my-4 flex w-fit justify-center gap-3">
                  <GlowCard customSize width={128} height={128} glowColor="green" className="w-32 h-32">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                        قَلْقَلَة
                      </div>
                      <div className="text-xs font-medium" style={{ color: '#114b3c' }}>
                        Qalqalah
                      </div>
                    </div>
                  </GlowCard>
                  <GlowCard customSize width={128} height={128} glowColor="green" className="w-32 h-32">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                        مَدّ
                      </div>
                      <div className="text-xs font-medium" style={{ color: '#114b3c' }}>
                        Madd
                      </div>
                    </div>
                  </GlowCard>
                  <GlowCard customSize width={128} height={128} glowColor="green" className="w-32 h-32">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                        غُنَّة
                      </div>
                      <div className="text-xs font-medium" style={{ color: '#114b3c' }}>
                        Ghunna
                      </div>
                    </div>
                  </GlowCard>
                </div>
                <div className="mx-auto flex w-fit justify-center gap-3">
                  <GlowCard customSize width={128} height={128} glowColor="green" className="w-32 h-32">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                        نُون سَاكِنَة
                      </div>
                      <div className="text-xs font-medium" style={{ color: '#114b3c' }}>
                        Noon Sakinah
                      </div>
                    </div>
                  </GlowCard>
                  <GlowCard customSize width={128} height={128} glowColor="green" className="w-32 h-32">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                        تَنْوِين
                      </div>
                      <div className="text-xs font-medium" style={{ color: '#114b3c' }}>
                        Tanween
                      </div>
                    </div>
                  </GlowCard>
                </div>

              </div>
            </div>
            <div className="mx-auto mt-6 max-w-2xl space-y-6 text-center sm:mt-0 sm:text-left">
              <div className="space-y-4">
                <h1 className="text-balance text-4xl font-bold md:text-5xl lg:text-6xl">
                  Master Your
                  <span className="text-emerald-600 dark:text-emerald-400"> Tajweed Rules</span>
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                Unlock your Tajweed potential through interactive quizzes that highlight what to work on next, helping you progress with confidence - completely free.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-2 justify-center sm:justify-start">
                <Button size="lg" asChild style={{ backgroundColor: '#114b3c', borderColor: '#114b3c' }} className="hover:bg-[#0f3d32]">
                  <Link to="/dashboard">
                    Start Assessment
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


