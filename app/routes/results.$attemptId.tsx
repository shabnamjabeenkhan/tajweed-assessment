import { useLoaderData } from "react-router";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

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

  // Calculate performance level
  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: "excellent", color: "text-green-400", message: "Outstanding! You've mastered this rule!" };
    if (score >= 70) return { level: "good", color: "text-blue-400", message: "Great job! You're on the right track!" };
    if (score >= 50) return { level: "needs-work", color: "text-yellow-400", message: "Good effort! Let's work on a few areas." };
    return { level: "struggling", color: "text-red-400", message: "Every expert was once a beginner!" };
  };

  const performance = getPerformanceLevel(attempt.scorePercent);

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
          <p className="text-neutral-400">{attempt.rule?.title}</p>
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
                attempt.scorePercent >= 90 ? 'bg-green-500' :
                attempt.scorePercent >= 70 ? 'bg-blue-500' :
                attempt.scorePercent >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${attempt.scorePercent}%` }}
            />
          </div>
        </div>

        {/* Question Review */}
        <div className="rounded-lg p-6 mb-6 border border-neutral-700/50" style={{ backgroundColor: '#1a1a1a' }}>
          <h2 className="text-2xl font-bold mb-4">Question Review</h2>
          <div className="space-y-4">
            {attempt.answers.map((answer, index) => (
              <div key={answer._id} className="border border-neutral-700/50 rounded-lg p-4" style={{ backgroundColor: '#0f0f0f' }}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">Question {index + 1}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    answer.skipped ? 'bg-neutral-600 text-neutral-300' :
                    answer.isCorrect ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                  }`}>
                    {answer.skipped ? 'Skipped' : answer.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <p className="text-neutral-300 mb-3">{answer.question?.prompt}</p>

                <div className="space-y-2">
                  {answer.question?.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded ${
                        optionIndex === answer.question?.correctOptionIndex ? 'bg-green-900 border border-green-600' :
                        optionIndex === answer.selectedOptionIndex && !answer.isCorrect ? 'bg-red-900 border border-red-600' :
                        'bg-neutral-800'
                      }`}
                    >
                      <span className="flex items-center">
                        {optionIndex === answer.selectedOptionIndex && (
                          <span className="mr-2">👆</span>
                        )}
                        {optionIndex === answer.question?.correctOptionIndex && (
                          <span className="mr-2">✅</span>
                        )}
                        {option}
                      </span>
                    </div>
                  ))}
                </div>

                {answer.question?.explanation && (
                  <div className="mt-3 p-3 bg-blue-900 border border-blue-600 rounded">
                    <p className="text-blue-100">
                      <strong>Explanation:</strong> {answer.question.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
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