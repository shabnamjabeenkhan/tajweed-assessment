import { Link, useLoaderData } from "react-router";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { CheckCircle, XCircle, ArrowRight, ArrowLeft } from "lucide-react";

// Route types
type LoaderArgs = {
  params: { attemptId: string };
};

type ComponentProps = {
  loaderData: any;
};

export async function loader(args: LoaderArgs) {
  const { attemptId } = args.params;

  if (!attemptId) {
    throw new Error("Attempt ID is required");
  }

  try {
    // Setup Convex client
    const convexUrl = process.env.VITE_CONVEX_URL || import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("VITE_CONVEX_URL environment variable is required");
    }
    const convexClient = new ConvexHttpClient(convexUrl);

    let actualAttemptId = attemptId;

    // Handle "latest" case by fetching user's most recent attempt
    if (attemptId === "latest") {
      // Use the test user ID for MVP
      const testUserId = "jd76h3qestqer1vh269vd9wh317sme1k" as any;

      // Get user's most recent attempt
      const userHistory = await convexClient.query(api.quizAttempts.getUserQuizHistory, {
        userId: testUserId,
        limit: 1
      });

      if (!userHistory || userHistory.attempts.length === 0) {
        throw new Response("No quiz attempts found", { status: 404 });
      }

      actualAttemptId = userHistory.attempts[0]._id;
      console.log("Retrieved latest attempt ID:", actualAttemptId);
    }

    // Validate that we have a proper ID
    if (!actualAttemptId || actualAttemptId === "latest") {
      throw new Response("Invalid attempt ID", { status: 400 });
    }

    // Get attempt details with all related data
    const attemptDetails = await convexClient.query(api.quizAttempts.getAttemptDetails, {
      attemptId: actualAttemptId as any
    });

    if (!attemptDetails) {
      throw new Response("Quiz attempt not found", { status: 404 });
    }

    // TODO: Validate that attempt belongs to current user
    // if (attemptDetails.userId !== currentUserId) {
    //   throw new Response("Unauthorized", { status: 403 });
    // }

    return {
      attempt: attemptDetails,
      userId: "mock-user-id" // TODO: Replace with real user ID
    };
  } catch (error) {
    console.error("Error loading results:", error);
    throw new Response("Failed to load results", { status: 500 });
  }
}

export default function ResultsPage() {
  const { attempt } = useLoaderData<typeof loader>();
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  // Calculate performance level
  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: "excellent", color: "text-[#1e4d05]", message: "Outstanding! You've mastered this rule!" };
    if (score >= 70) return { level: "good", color: "text-[#0b2e7f]", message: "Great job! You're on the right track!" };
    if (score >= 50) return { level: "needs-work", color: "text-yellow-400", message: "Good effort! Let's work on a few areas." };
    return { level: "struggling", color: "text-[#7f220b]", message: "Every expert was once a beginner!" };
  };

  const toggleExplanation = (questionId: string) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const performance = getPerformanceLevel(attempt.scorePercent);

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/dashboard"
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-600 text-neutral-300 hover:bg-neutral-800/60 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
              <p className="text-neutral-400">{attempt.rule?.title}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-neutral-400 mb-2">
              <span>Progress</span>
              <span>{attempt.correctCount}/{attempt.totalCount} • {attempt.scorePercent}%</span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  attempt.scorePercent >= 90 ? 'bg-[#1e4d05]' :
                  attempt.scorePercent >= 70 ? 'bg-[#0b2e7f]' :
                  attempt.scorePercent >= 50 ? 'bg-yellow-500' : 'bg-[#7f220b]'
                }`}
                style={{ width: `${attempt.scorePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Score Display */}
        <div className="rounded-lg p-8 mb-6 text-center border border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="mb-4">
            <div className={`text-6xl font-bold ${performance.color} mb-2`}>
              {attempt.scorePercent}%
            </div>
            <div className="text-neutral-300 text-lg">
              {attempt.correctCount} out of {attempt.totalCount} correct
            </div>
          </div>

          <div className={`text-xl ${performance.color} mb-4`}>
            {performance.message}
          </div>

          {/* Simple progress bar */}
          <div className="w-full bg-neutral-700 rounded-full h-3 mb-6">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                attempt.scorePercent >= 90 ? 'bg-[#1e4d05]' :
                attempt.scorePercent >= 70 ? 'bg-[#0b2e7f]' :
                attempt.scorePercent >= 50 ? 'bg-yellow-500' : 'bg-[#7f220b]'
              }`}
              style={{ width: `${attempt.scorePercent}%` }}
            />
          </div>
        </div>

        {/* Question Review */}
        <div className="rounded-lg p-6 mb-6 border border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
          <h2 className="text-2xl font-bold mb-4">Question Review</h2>
          <div className="space-y-8">
            {attempt.answers.map((answer, index) => {
              const isCorrect = !answer.skipped && answer.isCorrect;
              const isExpanded = expandedQuestions.has(answer._id);

              return (
                <div key={answer._id} className="border border-neutral-700/50 rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: '#0f0f0f' }}>
                  {/* Header Section */}
                  <div className={`p-6 text-center relative overflow-hidden ${
                    answer.skipped
                      ? 'bg-gradient-to-br from-neutral-800 to-neutral-900'
                      : isCorrect
                        ? 'bg-gradient-to-br from-green-950/30 to-emerald-950/30'
                        : 'bg-gradient-to-br from-red-950/30 to-rose-950/30'
                  }`}>
                    <div className="inline-block mb-4">
                      {answer.skipped ? (
                        <div className="w-16 h-16 rounded-full bg-neutral-600 flex items-center justify-center">
                          <span className="text-2xl text-neutral-300">-</span>
                        </div>
                      ) : isCorrect ? (
                        <CheckCircle className="w-16 h-16 text-[#1e4d05]" />
                      ) : (
                        <XCircle className="w-16 h-16 text-[#7f220b]" />
                      )}
                    </div>

                    <h1 className={`text-2xl font-bold mb-2 ${
                      answer.skipped
                        ? 'text-neutral-400'
                        : isCorrect
                          ? 'text-[#1e4d05]'
                          : 'text-[#7f220b]'
                    }`}>
                      Question {index + 1} - {answer.skipped ? 'Skipped' : isCorrect ? 'Correct!' : 'Incorrect'}
                    </h1>

                    <p className="text-neutral-400 text-lg">
                      {answer.skipped
                        ? "This question was skipped."
                        : isCorrect
                          ? "Great job! You got it right."
                          : "Don't worry, let's learn from this."}
                    </p>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-6">
                    {/* Question */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">
                        Question
                      </h3>
                      <p className="text-lg text-white">{answer.question?.prompt}</p>
                    </div>

                    {/* Answers */}
                    {!answer.skipped && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">
                            Your Answer
                          </h3>
                          <div className={`p-4 rounded-lg border-2 ${
                            isCorrect
                              ? 'bg-[#1e4d05]/20 border-[#1e4d05]'
                              : 'bg-[#7f220b]/20 border-[#7f220b]'
                          }`}>
                            <p className="text-white font-medium">
                              {answer.question?.options[answer.selectedOptionIndex || 0]}
                            </p>
                          </div>
                        </div>

                        {!isCorrect && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">
                              Correct Answer
                            </h3>
                            <div className="p-4 rounded-lg border-2 bg-[#1e4d05]/20 border-[#1e4d05]">
                              <p className="text-white font-medium">
                                {answer.question?.options[answer.question?.correctOptionIndex || 0]}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Explanation */}
                    {answer.question?.explanation && (
                      <div className="space-y-3">
                        <button
                          onClick={() => toggleExplanation(answer._id)}
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                        >
                          <span>
                            {isExpanded ? "Hide" : "Show"} Explanation
                          </span>
                          <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                            <ArrowRight className="w-4 h-4 rotate-90" />
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="overflow-hidden">
                            <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-600">
                              <p className="text-blue-100 leading-relaxed">
                                <strong>Explanation:</strong> {answer.question.explanation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`/quiz/${attempt.rule?.slug}`}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retake Quiz
          </a>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Try Another Rule
          </a>
        </div>
      </div>
    </div>
  );
}