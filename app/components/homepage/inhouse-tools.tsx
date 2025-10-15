import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { BookOpen, Play, Award } from "lucide-react";

export default function InhouseToolsSection() {
  return (
    <section id="get-started" className="pt-8 pb-16 md:pt-12 md:pb-20 bg-emerald-50 dark:bg-emerald-950/20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h2 className="text-3xl font-semibold lg:text-4xl">
            Start Your Tajweed Journey Today
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of students who are improving their Quran recitation with our interactive quizzes.
            Perfect your pronunciation, one rule at a time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link to="/dashboard">
                <Play className="w-5 h-5 mr-2" />
                Start Learning Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
              <Link to="#features">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn More
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-muted-foreground mt-12">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>No Ads</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Track Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Instant Feedback</span>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white dark:bg-gray-900 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <p className="text-emerald-800 dark:text-emerald-200 font-medium">
              "The focused approach to learning individual Tajweed rules has transformed my recitation.
              The instant feedback helps me understand my mistakes immediately."
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
              - Ahmad, Student from London
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}