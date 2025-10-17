"use client";
import { TestEmailForm } from "~/components/dashboard/test-email-form";
import { isFeatureEnabled, isServiceEnabled } from "../../../config";
import { Link, useSearchParams } from "react-router";
import { BookOpen, Trophy, Target, Clock, Star, TrendingUp, Award, PlayCircle } from "lucide-react";

export default function Page() {
  const emailEnabled = isFeatureEnabled('email') && isServiceEnabled('resend');
  const [searchParams] = useSearchParams();
  const quizCompleted = searchParams.get('quiz_completed') === 'true';
  const score = searchParams.get('score');

  return (
    <div className="flex flex-1 flex-col bg-gray-950 min-h-screen">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 py-6">
          {/* Welcome Header */}
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to Tajweed Master</h1>
              <p className="text-gray-400">Continue your journey to perfect Quranic recitation</p>
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
                <p className="text-gray-300 mb-4">Excellent work! You scored {score}% on your quiz.</p>
                <div className="flex gap-3">
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <BookOpen className="size-4" />
                    Continue Learning
                  </Link>
                  <Link
                    to="/results"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-950 transition-colors"
                  >
                    <TrendingUp className="size-4" />
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Progress Overview Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <BookOpen className="size-8 text-blue-400" />
                  <span className="text-2xl font-bold text-white">12</span>
                </div>
                <h3 className="font-semibold text-white">Quizzes Completed</h3>
                <p className="text-sm text-gray-400">+3 this week</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="size-8 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">85%</span>
                </div>
                <h3 className="font-semibold text-white">Average Score</h3>
                <p className="text-sm text-gray-400">+5% improvement</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="size-8 text-orange-400" />
                  <span className="text-2xl font-bold text-orange-400">5</span>
                </div>
                <h3 className="font-semibold text-white">Day Streak</h3>
                <p className="text-sm text-gray-400">Keep it up!</p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="size-8 text-purple-400" />
                  <span className="text-2xl font-bold text-purple-400">7</span>
                </div>
                <h3 className="font-semibold text-white">Badges Earned</h3>
                <p className="text-sm text-gray-400">2 more to unlock</p>
              </div>
            </div>
          </div>

          {/* Quick Start Quizzes */}
          <div className="px-4 lg:px-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <PlayCircle className="size-6 text-blue-400" />
                <h2 className="text-xl font-semibold text-white">Quick Start</h2>
              </div>
              <p className="text-gray-400 mb-6">Practice Tajweed rules with interactive quizzes</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <Link
                  to="/quiz/idgham"
                  className="group flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="size-3 rounded-full bg-blue-500"></div>
                  <div>
                    <h3 className="font-semibold text-blue-400">Idgham</h3>
                    <p className="text-xs text-gray-400">Merging rules</p>
                  </div>
                  <Star className="size-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </Link>

                <Link
                  to="/quiz/ikhfa"
                  className="group flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="size-3 rounded-full bg-purple-500"></div>
                  <div>
                    <h3 className="font-semibold text-purple-400">Ikhfa</h3>
                    <p className="text-xs text-gray-400">Hiding rules</p>
                  </div>
                  <Star className="size-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </Link>

                <Link
                  to="/quiz/qalqalah"
                  className="group flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="size-3 rounded-full bg-green-500"></div>
                  <div>
                    <h3 className="font-semibold text-green-400">Qalqalah</h3>
                    <p className="text-xs text-gray-400">Echoing rules</p>
                  </div>
                  <Star className="size-4 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </Link>

                <Link
                  to="/quiz/ghunna"
                  className="group flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="size-3 rounded-full bg-orange-500"></div>
                  <div>
                    <h3 className="font-semibold text-orange-400">Ghunna</h3>
                    <p className="text-xs text-gray-400">Nasalization</p>
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