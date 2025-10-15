import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

export default function ContentSection() {
  return (
    <section id="features" className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-medium">
            Learn Tajweed Rules Effectively
          </h2>
          <div className="space-y-6">
            <p>
              <span className="font-bold">Focused Learning:</span> Each quiz targets a specific Tajweed rule, helping you master one concept at a time.
            </p>
            <p>
              Practice with <span className="font-bold">10 carefully crafted questions</span> per rule.
              Skip questions you're unsure about or mark them as "I don't know" for honest self-assessment.
            </p>
            <p>
              Get <span className="font-bold">instant feedback</span> on your performance.
              See which areas need improvement and track your progress over time.
            </p>

            <p>
              Build learning streaks and maintain consistency in your Tajweed practice.
              Review detailed explanations for every question to deepen your understanding.
            </p>

            <p>
              <span className="font-bold">Completely free, ad-free learning.</span>
              Focus on what matters most - improving your Quran recitation.
            </p>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="gap-1 pr-1.5"
            >
              <Link to="/dashboard">
                <span>Start Your First Quiz</span>
                <ChevronRight className="size-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
