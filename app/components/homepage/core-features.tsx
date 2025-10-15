import { BookOpen, Target, TrendingUp, Users, Award, Clock } from "lucide-react";

export default function CoreFeaturesSection() {
  const features = [
    {
      icon: <Target className="size-5 text-emerald-600" />,
      title: "Rule-Focused Quizzes",
      description: "Practice specific Tajweed rules with targeted questions.",
    },
    {
      icon: <TrendingUp className="size-5 text-emerald-600" />,
      title: "Instant Feedback",
      description: "Get immediate results and track your improvement.",
    },
    {
      icon: <BookOpen className="size-5 text-emerald-600" />,
      title: "Detailed Explanations",
      description: "Learn from every mistake with clear explanations.",
    },
    {
      icon: <Award className="size-5 text-emerald-600" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey and build streaks.",
    },
    {
      icon: <Clock className="size-5 text-emerald-600" />,
      title: "Self-Paced Learning",
      description: "Study at your own pace with no time pressure.",
    },
    {
      icon: <Users className="size-5 text-emerald-600" />,
      title: "Free for Everyone",
      description: "No subscriptions, no ads, just pure learning.",
    },
  ];
  return (
    <section id="core-features" className="py-16 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <h3 className="text-center text-xl font-medium mb-12 text-muted-foreground">
          Everything you need to <em>master Tajweed</em>.
        </h3>
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Tajweed Learning Graphic */}
          <div className="mx-auto w-full max-w-md">
            <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 text-center">
              <div className="text-6xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 font-arabic">
                تَجْوِيد
              </div>
              <div className="text-lg font-semibold text-emerald-800 dark:text-emerald-300">
                Tajweed
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Perfect Recitation
              </div>
              <div className="absolute top-4 right-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          {/* Feature list */}
          <ul className="grid gap-6 sm:grid-cols-2">
            {features.map((f, idx) => (
              <li key={idx} className="flex items-start gap-3">
                {f.icon}
                <div>
                  <h3 className="font-semibold leading-none mb-1">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {f.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
} 