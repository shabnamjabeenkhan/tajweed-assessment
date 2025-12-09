"use client";
import { TestEmailForm } from "~/components/dashboard/test-email-form";
import { isFeatureEnabled, isServiceEnabled } from "../../../config";
import { Link, useSearchParams } from "react-router";
import { BookOpen, Trophy, Target, Star, TrendingUp, Award, PlayCircle } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";

export default function Page() {
  const emailEnabled = isFeatureEnabled('email') && isServiceEnabled('resend');
  const [searchParams] = useSearchParams();

  // Get current authenticated user
  const currentUser = useQuery(api.users.getCurrentUser);
  const upsertUser = useMutation(api.users.upsertUser);

  // Ensure user exists in database (creates if needed)
  useEffect(() => {
    if (currentUser === null) {
      // User not found, try to create/upsert
      upsertUser().catch(() => {
        // Silently fail if user creation fails (user might not be authenticated)
      });
    }
  }, [currentUser, upsertUser]);

  // Get dashboard stats in real-time (only when we have a user)
  const statsQuery = useQuery(api.quizAttempts.getDashboardStats,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  );

  // Provide fallback stats while loading or on error
  const stats = statsQuery ?? {
    quizzesCompleted: 0,
    averageScore: 0,
    currentStreak: 0,
    badgesEarned: 0,
    weeklyProgress: 0,
    scoreImprovement: 0,
  };
  const quizCompleted = searchParams.get('quiz_completed') === 'true';
  const quizError = searchParams.get('quiz_error') === 'true';
  const errorMessage = searchParams.get('error_message');
  const score = searchParams.get('score');
  const attemptId = searchParams.get('attempt_id');

  // Show loading state while user or stats are loading
  if (currentUser === undefined || (currentUser && statsQuery === undefined)) {
    return (
      <div className="flex flex-1 flex-col min-h-screen items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

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

          {/* Quiz Error Message */}
          {quizError && (
            <div className="px-4 lg:px-6">
              <div className="bg-gradient-to-r from-red-600/10 to-red-600/10 border border-red-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-red-400">Quiz Error</h2>
                </div>
                <p className="text-neutral-300 mb-4">
                  {errorMessage || "There was an error submitting your quiz. Please try again."}
                </p>
                <div className="flex gap-3">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Progress Overview Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                  <Award className="size-8 text-purple-400" />
                  <span className="text-2xl font-bold text-purple-400">{stats.badgesEarned}</span>
                </div>
                <h3 className="font-semibold text-white">Badges Earned</h3>
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
                  to="/quiz/idghaam"
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
                  to="/quiz/ikhfaa"
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