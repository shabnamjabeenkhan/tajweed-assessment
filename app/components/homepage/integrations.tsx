import { Link } from "react-router";
import { ArrowRight } from 'lucide-react';
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
      <div className="relative w-full bg-neutral-950">
        <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <section className="relative z-1 mx-auto max-w-full">
          <div className="pointer-events-none absolute h-full w-full overflow-hidden opacity-50 [perspective:200px]">
            <div className="absolute inset-0 [transform:rotateX(35deg)]">
              <div className="animate-grid [inset:0%_0px] [margin-left:-50%] [height:300vh] [width:600vw] [transform-origin:100%_0_0] [background-image:linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)] [background-size:120px_120px] [background-repeat:repeat]"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent to-90%"></div>
          </div>

          <div className="z-10 mx-auto max-w-screen-xl gap-8 lg:gap-12 px-4 py-16 sm:py-28 text-gray-600 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Tajweed Rules Visual - Left Side */}
              <div className="order-2 lg:order-1">
                <div className="relative p-4 sm:p-8">
                  <div className="mx-auto mb-0.5 sm:mb-4 flex w-fit justify-center gap-px xs:gap-0.5 sm:gap-3">
                    <GlowCard customSize width={120} height={120} glowColor="green" className="!w-[70px] !h-[70px] [--size:70] [@media(min-width:361px)]:!w-[100px] [@media(min-width:361px)]:!h-[100px] [@media(min-width:361px)]:[--size:100] [@media(min-width:426px)]:!w-[120px] [@media(min-width:426px)]:!h-[120px] [@media(min-width:426px)]:[--size:120]">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-[9px] [@media(min-width:361px)]:text-xs sm:text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                          إِدْغَام
                        </div>
                        <div className="text-[7px] [@media(min-width:361px)]:text-[10px] sm:text-xs font-medium" style={{ color: '#114b3c' }}>
                          Idgham
                        </div>
                      </div>
                    </GlowCard>
                    <GlowCard customSize width={120} height={120} glowColor="green" className="!w-[70px] !h-[70px] [--size:70] [@media(min-width:361px)]:!w-[100px] [@media(min-width:361px)]:!h-[100px] [@media(min-width:361px)]:[--size:100] [@media(min-width:426px)]:!w-[120px] [@media(min-width:426px)]:!h-[120px] [@media(min-width:426px)]:[--size:120]">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-[9px] [@media(min-width:361px)]:text-xs sm:text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                          إِخْفَاء
                        </div>
                        <div className="text-[7px] [@media(min-width:361px)]:text-[10px] sm:text-xs font-medium" style={{ color: '#114b3c' }}>
                          Ikhfa
                        </div>
                      </div>
                    </GlowCard>
                  </div>
                  <div className="mx-auto my-0.5 sm:my-4 flex w-fit justify-center gap-px xs:gap-0.5 sm:gap-3">
                    <GlowCard customSize width={120} height={120} glowColor="green" className="!w-[70px] !h-[70px] [--size:70] [@media(min-width:361px)]:!w-[100px] [@media(min-width:361px)]:!h-[100px] [@media(min-width:361px)]:[--size:100] [@media(min-width:426px)]:!w-[120px] [@media(min-width:426px)]:!h-[120px] [@media(min-width:426px)]:[--size:120]">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-[9px] [@media(min-width:361px)]:text-xs sm:text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                          قَلْقَلَة
                        </div>
                        <div className="text-[7px] [@media(min-width:361px)]:text-[10px] sm:text-xs font-medium" style={{ color: '#114b3c' }}>
                          Qalqalah
                        </div>
                      </div>
                    </GlowCard>
                    <GlowCard customSize width={120} height={120} glowColor="green" className="!w-[70px] !h-[70px] [--size:70] [@media(min-width:361px)]:!w-[100px] [@media(min-width:361px)]:!h-[100px] [@media(min-width:361px)]:[--size:100] [@media(min-width:426px)]:!w-[120px] [@media(min-width:426px)]:!h-[120px] [@media(min-width:426px)]:[--size:120]">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-[9px] [@media(min-width:361px)]:text-xs sm:text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                          مَدّ
                        </div>
                        <div className="text-[7px] [@media(min-width:361px)]:text-[10px] sm:text-xs font-medium" style={{ color: '#114b3c' }}>
                          Madd
                        </div>
                      </div>
                    </GlowCard>
                    <GlowCard customSize width={120} height={120} glowColor="green" className="!w-[70px] !h-[70px] [--size:70] [@media(min-width:361px)]:!w-[100px] [@media(min-width:361px)]:!h-[100px] [@media(min-width:361px)]:[--size:100] [@media(min-width:426px)]:!w-[120px] [@media(min-width:426px)]:!h-[120px] [@media(min-width:426px)]:[--size:120]">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-[9px] [@media(min-width:361px)]:text-xs sm:text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                          غُنَّة
                        </div>
                        <div className="text-[7px] [@media(min-width:361px)]:text-[10px] sm:text-xs font-medium" style={{ color: '#114b3c' }}>
                          Ghunna
                        </div>
                      </div>
                    </GlowCard>
                  </div>
                  <div className="mx-auto flex w-fit justify-center gap-px xs:gap-0.5 sm:gap-3">
                    <GlowCard customSize width={120} height={120} glowColor="green" className="!w-[70px] !h-[70px] [--size:70] [@media(min-width:361px)]:!w-[100px] [@media(min-width:361px)]:!h-[100px] [@media(min-width:361px)]:[--size:100] [@media(min-width:426px)]:!w-[120px] [@media(min-width:426px)]:!h-[120px] [@media(min-width:426px)]:[--size:120]">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-[9px] [@media(min-width:361px)]:text-xs sm:text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                          نُون سَاكِنَة
                        </div>
                        <div className="text-[7px] [@media(min-width:361px)]:text-[10px] sm:text-xs font-medium" style={{ color: '#114b3c' }}>
                          Noon Sakinah
                        </div>
                      </div>
                    </GlowCard>
                    <GlowCard customSize width={120} height={120} glowColor="green" className="!w-[70px] !h-[70px] [--size:70] [@media(min-width:361px)]:!w-[100px] [@media(min-width:361px)]:!h-[100px] [@media(min-width:361px)]:[--size:100] [@media(min-width:426px)]:!w-[120px] [@media(min-width:426px)]:!h-[120px] [@media(min-width:426px)]:[--size:120]">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-[9px] [@media(min-width:361px)]:text-xs sm:text-lg font-bold font-arabic" style={{ color: '#114b3c' }}>
                          تَنْوِين
                        </div>
                        <div className="text-[7px] [@media(min-width:361px)]:text-[10px] sm:text-xs font-medium" style={{ color: '#114b3c' }}>
                          Tanween
                        </div>
                      </div>
                    </GlowCard>
                  </div>
                </div>
              </div>

              {/* Main Content - Right Side */}
              <div className="order-1 lg:order-2 space-y-5 text-center lg:text-left px-4 sm:px-0">
                <h2 className="font-geist mx-auto lg:mx-0 bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl sm:text-4xl lg:text-6xl tracking-tighter text-transparent">
                  Master Your{' '}
                  <span className="bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">
                    Tajweed Rules
                  </span>
                </h2>

                <p className="mx-auto lg:mx-0 max-w-2xl text-sm sm:text-base text-gray-300 px-4 sm:px-0">
                  Unlock your Tajweed potential through interactive quizzes that highlight what to work on next, helping you progress with confidence - completely free.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 gap-x-3 px-4 sm:px-0">
                  <span className="relative inline-block overflow-hidden rounded-full p-[1.5px] w-full sm:w-auto">
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#10b981_0%,#059669_50%,#10b981_100%)]" />
                    <div className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 text-xs font-medium text-gray-50 backdrop-blur-3xl">
                      <Link
                        to="/dashboard"
                        className="group border-input inline-flex w-full items-center justify-center rounded-full border-[1px] bg-gradient-to-tr from-zinc-300/5 via-emerald-400/20 to-transparent px-10 py-4 text-center text-white transition-colors hover:bg-transparent/90 sm:w-auto"
                      >
                        Start Assessment
                      </Link>
                    </div>
                  </span>
                  <Link
                    to="#features"
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border-[1px] border-gray-600 bg-transparent px-10 py-4 text-center text-gray-300 transition-colors hover:border-gray-400 hover:text-white"
                  >
                    How It Works
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    </section>
  );
}


