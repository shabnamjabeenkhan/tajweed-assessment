"use client";
import { TestEmailForm } from "~/components/dashboard/test-email-form";
import { isFeatureEnabled, isServiceEnabled } from "../../../config";
import { Link, useSearchParams, useLoaderData } from "react-router";
import { BookOpen, Trophy, Target, Clock, Star, TrendingUp, Award, PlayCircle } from "lucide-react";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

export async function loader() {
  try {
    // Setup Convex client
    const convexUrl = process.env.VITE_CONVEX_URL || import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("VITE_CONVEX_URL environment variable is required");
    }
    const convexClient = new ConvexHttpClient(convexUrl);

    // Use the test user ID for MVP
    const testUserId = "jd76h3qestqer1vh269vd9wh317sme1k" as any;

    // Get dashboard stats
    const stats = await convexClient.query(api.quizAttempts.getDashboardStats, {
      userId: testUserId
    });

    return { stats };
  } catch (error) {
    console.error("Error loading dashboard stats:", error);
    // Return default stats if there's an error
    return {
      stats: {
        quizzesCompleted: 0,
        averageScore: 0,
        currentStreak: 0,
        badgesEarned: 0,
        weeklyProgress: 0,
        scoreImprovement: 0,
      }
    };
  }
}

export default function Page() {
  const emailEnabled = isFeatureEnabled('email') && isServiceEnabled('resend');
  const [searchParams] = useSearchParams();
  const { stats } = useLoaderData<typeof loader>();
  const quizCompleted = searchParams.get('quiz_completed') === 'true';
  const score = searchParams.get('score');
  const attemptId = searchParams.get('attempt_id');

  return (
    <div className="flex flex-1 flex-col min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 py-6">
          {/* Welcome Header */}
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              {/* <p className="text-neutral-400">Continue your journey to perfect Quranic recitation</p> */}
            </div>
          </div>

          {/* Quiz Success Message */}
          {quizCompleted && (
            <div className="px-4 lg:px-6">
              <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Trophy className="size-8 text-green-500" />
                  <h2 className="text-xl font-semibold text-green-400">Quiz Completed!</h2>
                </div>
                <p className="text-neutral-300 mb-4">Excellent work! You scored {score}% on your quiz.</p>
                <div className="flex gap-3">
                  <Link
                    to={`/results/${attemptId || 'latest'}`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-950/30 transition-colors"
                  >
                    <TrendingUp className="size-4" />
                    View Results
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Progress Overview Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl p-6 border border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="size-8 text-blue-400" />
                  <span className="text-2xl font-bold text-white">{stats.quizzesCompleted}</span>
                </div>
                <h3 className="font-semibold text-white">Quizzes Completed</h3>
                <p className="text-sm text-neutral-400">
                  {stats.weeklyProgress > 0 ? `+${stats.weeklyProgress} this week` : 'No attempts this week'}
                </p>
              </div>

              <div className="rounded-xl p-6 border border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="flex items-center justify-between mb-2">
                  <Target className="size-8 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">{stats.averageScore}%</span>
                </div>
                <h3 className="font-semibold text-white">Average Score</h3>
                <p className="text-sm text-neutral-400">
                  {stats.scoreImprovement > 0 ? `+${stats.scoreImprovement}% improvement` :
                   stats.scoreImprovement < 0 ? `${stats.scoreImprovement}% change` :
                   'No change yet'}
                </p>
              </div>

              <div className="rounded-xl p-6 border border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="flex items-center justify-between mb-2">
                  <Clock className="size-8 text-orange-400" />
                  <span className="text-2xl font-bold text-orange-400">{stats.currentStreak}</span>
                </div>
                <h3 className="font-semibold text-white">Day Streak</h3>
                <p className="text-sm text-neutral-400">
                  {stats.currentStreak > 0 ? 'Keep it up!' : 'Start your streak!'}
                </p>
              </div>

              <div className="rounded-xl p-6 border border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="flex items-center justify-between mb-2">
                  <Award className="size-8 text-purple-400" />
                  <span className="text-2xl font-bold text-purple-400">{stats.badgesEarned}</span>
                </div>
                <h3 className="font-semibold text-white">Badges Earned</h3>
                <p className="text-sm text-neutral-400">
                  {stats.badgesEarned < 10 ? `${10 - stats.badgesEarned} more to unlock` : 'All unlocked!'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Start Quizzes */}
          <div className="px-4 lg:px-6">
            <div className="rounded-xl p-6 border border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
              <div className="flex items-center gap-3 mb-4">
                <PlayCircle className="size-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Quick Start</h2>
              </div>
              <p className="text-neutral-400 mb-6">Practice Tajweed rules with interactive quizzes</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Link
                  to="/quiz/ith-har"
                  className="group flex items-center gap-3 p-4 bg-neutral-800/30 border border-neutral-700/30 rounded-lg hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="size-3 rounded-full bg-blue-500"></div>
                  <div>
                    <h3 className="font-semibold text-blue-400">Al-Ith'har</h3>
                    <p className="text-xs text-neutral-400">Clear pronunciation</p>
                  </div>
                  <Star className="size-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </Link>

                <Link
                  to="/quiz/idgham"
                  className="group flex items-center gap-3 p-4 bg-neutral-800/30 border border-neutral-700/30 rounded-lg hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="size-3 rounded-full bg-purple-500"></div>
                  <div>
                    <h3 className="font-semibold text-purple-400">Al-Idgham</h3>
                    <p className="text-xs text-neutral-400">Merging sounds</p>
                  </div>
                  <Star className="size-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </Link>

                <Link
                  to="/quiz/iqlaab"
                  className="group flex items-center gap-3 p-4 bg-neutral-800/30 border border-neutral-700/30 rounded-lg hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="size-3 rounded-full bg-green-500"></div>
                  <div>
                    <h3 className="font-semibold text-green-400">Al-Iqlaab</h3>
                    <p className="text-xs text-neutral-400">Sound substitution</p>
                  </div>
                  <Star className="size-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </Link>

                <Link
                  to="/quiz/ikhfa"
                  className="group flex items-center gap-3 p-4 bg-neutral-800/30 border border-neutral-700/30 rounded-lg hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="size-3 rounded-full bg-orange-500"></div>
                  <div>
                    <h3 className="font-semibold text-orange-400">Al-Ikhfaa</h3>
                    <p className="text-xs text-neutral-400">Sound concealment</p>
                  </div>
                  <Star className="size-4 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </Link>
              </div>
            </div>
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