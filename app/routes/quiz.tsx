import { Link } from "react-router";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { BookOpen, Clock, Target, ArrowLeft } from "lucide-react";
import { useQuery } from "convex/react";

export default function QuizLibrary() {
  // Get only the four main rules
  const rules = useQuery(api.tajweedRules.getMainRules) || [];

  // Get quiz completion stats for the current user
  const completionStats = useQuery(api.quizAttempts.getCurrentUserQuizLibraryStats);

  // Get completed rules for the current user
  const completedRuleIds = useQuery(api.quizAttempts.getCurrentUserCompletedRules);

  // Helper function to check if a rule is completed
  const isRuleCompleted = (ruleId: any) => {
    return completedRuleIds?.includes(ruleId) ?? false;
  };

  const ruleColors = {
    'ith-har': 'blue',
    'idghaam': 'purple',
    'iqlaab': 'green',
    'ikhfaa': 'orange',
  };

  const getColorClasses = (slug: string) => {
    const color = ruleColors[slug as keyof typeof ruleColors] || 'blue';
    return {
      blue: 'text-blue-400 border-blue-500/20 bg-blue-500/10',
      purple: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
      green: 'text-green-400 border-green-500/20 bg-green-500/10',
      orange: 'text-orange-400 border-orange-500/20 bg-orange-500/10',
      yellow: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10',
      red: 'text-red-400 border-red-500/20 bg-red-500/10'
    }[color];
  };

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
                  <h1 className="text-3xl font-bold text-white mb-2">Quiz Library</h1>
                  <p className="text-neutral-400">Master Tajweed rules through interactive quizzes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-blue-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">{completionStats?.totalRules ?? rules.length}</p>
                      <p className="text-sm text-neutral-400">Total Rules</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">{completionStats?.completedRules ?? 0}</p>
                      <p className="text-sm text-neutral-400">Completed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-orange-400" />
                    <div>
                      <p className="text-2xl font-bold text-white">{completionStats?.availableRules ?? rules.length}</p>
                      <p className="text-sm text-neutral-400">Available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quiz Rules Grid */}
          <div className="px-4 lg:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rules.map((rule) => (
                <Card key={rule._id} className="border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-200" style={{ backgroundColor: '#1a1a1a' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-white">{rule.title}</span>
                      <Badge variant="outline" className={
                        isRuleCompleted(rule._id)
                          ? "text-green-400 border-green-500/20 bg-green-500/10"
                          : getColorClasses(rule.slug)
                      }>
                        {isRuleCompleted(rule._id) ? "Completed" : "New"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-neutral-400">
                      {rule.description || 'Learn the fundamentals of this Tajweed rule'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-400">Questions</span>
                      <span className="text-white">10-15</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-400">Duration</span>
                      <span className="text-white">5-10 min</span>
                    </div>

                    <Link
                      to={`/quiz/${rule.slug}`}
                      className="flex items-center justify-center w-full px-4 py-2 bg-white text-black rounded-lg transition-all duration-200 hover:bg-gray-100"
                    >
                      {isRuleCompleted(rule._id) ? "Retake Quiz" : "Start Quiz"}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {rules.length === 0 && (
            <div className="px-4 lg:px-6">
              <Card className="border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
                <CardContent className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">No Quizzes Available</h3>
                  <p className="text-neutral-400">Quiz content is currently being prepared. Check back soon!</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}