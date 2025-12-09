import { Link } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { BarChart3, Trophy, TrendingUp, Calendar, Eye, Target, Clock, ArrowLeft } from "lucide-react";

export default function Results() {
  // Get current authenticated user
  const currentUser = useQuery(api.users.getCurrentUser);
  const upsertUser = useMutation(api.users.upsertUser);

  // Ensure user exists in database (creates if needed)
  useEffect(() => {
    if (currentUser === null) {
      upsertUser().catch(() => {
        // Silently fail if user creation fails (user might not be authenticated)
      });
    }
  }, [currentUser, upsertUser]);

  // Get user's quiz attempts in real-time (only when we have a user)
  const attemptsData = useQuery(api.quizAttempts.getUserQuizHistory,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  );
  const attempts = attemptsData?.attempts || [];

  // Get dashboard stats in real-time (only when we have a user)
  const statsQuery = useQuery(api.quizAttempts.getDashboardStats,
    currentUser?._id ? { userId: currentUser._id } : "skip"
  );
  const stats = statsQuery ?? {
    quizzesCompleted: 0,
    averageScore: 0,
    currentStreak: 0,
    badgesEarned: 0,
    weeklyProgress: 0,
    scoreImprovement: 0,
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    return 'Needs Improvement';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'text-green-600 border-green-600 bg-green-50';
    if (score >= 80) return 'text-blue-600 border-blue-600 bg-blue-50';
    if (score >= 70) return 'text-yellow-600 border-yellow-600 bg-yellow-50';
    return 'text-red-600 border-red-600 bg-red-50';
  };

  // Show loading state while user data is loading
  if (currentUser === undefined || (currentUser && statsQuery === undefined)) {
    return (
      <div className="flex flex-1 flex-col min-h-screen items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="text-white">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-screen" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-600 text-neutral-300 hover:bg-neutral-800/60 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">My Results</h1>
                  <p className="text-neutral-400">Track your progress and review quiz performance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-blue-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.quizzesCompleted}</p>
                      <p className="text-sm text-neutral-400">Total Quizzes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-2xl font-bold text-green-400">{stats.averageScore}%</p>
                      <p className="text-sm text-neutral-400">Average Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-purple-400" />
                    <div>
                      <p className="text-2xl font-bold text-purple-400">
                        {stats.scoreImprovement > 0 ? `+${stats.scoreImprovement}%` :
                         stats.scoreImprovement < 0 ? `${stats.scoreImprovement}%` : '0%'}
                      </p>
                      <p className="text-sm text-neutral-400">Improvement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-8 w-8 text-orange-400" />
                    <div>
                      <p className="text-2xl font-bold text-orange-400">{stats.currentStreak}</p>
                      <p className="text-sm text-neutral-400">Day Streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Results */}
          <div className="px-4 lg:px-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Recent Quiz Attempts</h2>

              {attempts.length > 0 ? (
                <div className="space-y-4">
                  {attempts.map((attempt) => (
                    <Card key={attempt._id} className="border-neutral-700/50 hover:border-neutral-600/50 transition-colors" style={{ backgroundColor: '#1a1a1a' }}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                              <h3 className="font-semibold text-white">{attempt.rule?.title || 'Unknown Rule'}</h3>
                              <Badge variant="outline" className={getScoreBadgeColor(attempt.scorePercent || 0)}>
                                {getScoreBadge(attempt.scorePercent || 0)}
                              </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-neutral-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(attempt._creationTime).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                5 min
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                            <div className="text-left sm:text-right">
                              <p className={`text-xl sm:text-2xl font-bold ${getScoreColor(attempt.scorePercent || 0)}`}>
                                {attempt.scorePercent || 0}%
                              </p>
                              <p className="text-sm text-neutral-400">
                                {attempt.correctCount || 0}/{attempt.totalCount || 0} correct
                              </p>
                            </div>

                            <Link
                              to={`/results/${attempt._id}`}
                              className="flex items-center justify-center gap-2 px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg hover:bg-neutral-800/60 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sm:inline">View Details</span>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
                  <CardContent className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Quiz Results Yet</h3>
                    <p className="text-neutral-400 mb-4">
                      Start taking quizzes to see your progress and results here.
                    </p>
                    <Link
                      to="/quiz"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg transition-all duration-200"
                    >
                      <Trophy className="h-4 w-4" />
                      Take Your First Quiz
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}