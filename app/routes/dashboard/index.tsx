"use client";
import { ChartAreaInteractive } from "~/components/dashboard/chart-area-interactive";
import { SectionCards } from "~/components/dashboard/section-cards";
import { TestEmailForm } from "~/components/dashboard/test-email-form";
import { isFeatureEnabled, isServiceEnabled } from "../../../config";
import { Link, useSearchParams } from "react-router";

export default function Page() {
  const emailEnabled = isFeatureEnabled('email') && isServiceEnabled('resend');
  const [searchParams] = useSearchParams();
  const quizCompleted = searchParams.get('quiz_completed') === 'true';
  const score = searchParams.get('score');

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Quiz Success Message */}
          {quizCompleted && (
            <div className="px-4 lg:px-6">
              <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/20 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-400 mb-2">🎉 Quiz Completed!</h2>
                <p className="text-gray-300">Great job! You scored {score}% on your quiz.</p>
                <div className="mt-3">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Continue Learning
                  </Link>
                </div>
              </div>
            </div>
          )}
          {/* Test Quiz Links */}
          <div className="px-4 lg:px-6">
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-3">Quiz Testing</h2>
              <p className="text-gray-400 mb-4">Test the quiz functionality with sample Tajweed rules</p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  to="/quiz/idgham"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test Idgham Quiz
                </Link>
                <Link
                  to="/quiz/ikhfa"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Test Ikhfa Quiz
                </Link>
                <Link
                  to="/quiz/qalqalah"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Test Qalqalah Quiz
                </Link>
                <Link
                  to="/quiz/ghunna"
                  className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Test Ghunna Quiz
                </Link>
              </div>
            </div>
          </div>

          <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          {emailEnabled && (
            <div className="px-4 lg:px-6">
              <TestEmailForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
