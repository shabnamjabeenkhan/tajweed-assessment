import { useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/quiz.$ruleSlug";
import { validateQuizAnswers } from "~/lib/quiz";
import { QuizContainer, type QuizAnswer } from "~/components/quiz/QuizContainer";
import { QuizErrorBoundary } from "~/components/quiz/QuizErrorBoundary";
import { ConvexHttpClient } from "convex/browser";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";
import { useAuth } from "@clerk/react-router";
import { isFeatureEnabled, isServiceEnabled } from "../../config";

export async function loader(args: Route.LoaderArgs) {
  const { ruleSlug } = args.params;

  if (!ruleSlug) {
    throw new Error("Rule slug is required");
  }

  try {
    const convexUrl = process.env.VITE_CONVEX_URL || import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("VITE_CONVEX_URL environment variable is required");
    }
    const convexClient = new ConvexHttpClient(convexUrl);

    // Get the rule by slug
    const rule = await convexClient.query(api.tajweedRules.getBySlug, { slug: ruleSlug });

    if (!rule) {
      throw new Response("Rule not found", { status: 404 });
    }

    // Get questions for this rule
    const questions = await convexClient.query(api.questions.getByRule, { ruleId: rule._id });

    if (questions.length === 0) {
      throw new Response("No questions found for this rule", { status: 404 });
    }

    return {
      rule,
      questions,
    };
  } catch (error) {
    console.error("Error loading quiz data:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Response(`Failed to load quiz: ${errorMessage}`, { status: 500 });
  }
}

// Server action removed - quiz submission now handled client-side with authenticated mutations

export default function QuizPage() {
  const { rule, questions } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const authEnabled = isFeatureEnabled('auth') && isServiceEnabled('clerk');
  const { isSignedIn, getToken } = useAuth();

  // Get current authenticated user from Convex
  const currentUser = useQuery(api.users.getCurrentUser);
  const upsertUser = useMutation(api.users.upsertUser);
  const createQuizAttempt = useMutation(api.quizAttempts.createQuizAttempt);

  // Ensure user exists in database (creates if needed)
  useEffect(() => {
    // Only try to create user if Clerk says we're authenticated but Convex doesn't have the user
    if (authEnabled && isSignedIn && currentUser === null) {
      // User authenticated in Clerk but not in Convex DB, try to create/upsert
      upsertUser().catch((error) => {
        console.error("Failed to create user in Convex:", error);
      });
    }
  }, [authEnabled, isSignedIn, currentUser, upsertUser]);

  const handleQuizSubmit = async (answers: QuizAnswer[]) => {
    // Check Clerk authentication first
    if (authEnabled && !isSignedIn) {
      navigate("/sign-in?redirect_url=" + encodeURIComponent(window.location.pathname));
      return;
    }

    // CRITICAL: Verify Clerk token is available before calling Convex mutations
    if (authEnabled && isSignedIn && getToken) {
      try {
        const token = await getToken({ template: "convex" });
        if (!token) {
          console.error("[handleQuizSubmit] Clerk token is null - ConvexProviderWithClerk may not be passing tokens correctly");
          navigate("/dashboard?quiz_error=true&error_message=Authentication token not available. Please sign out and sign back in.");
          return;
        }
        console.log("[handleQuizSubmit] Clerk token obtained successfully, length:", token.length);
      } catch (tokenError) {
        console.error("[handleQuizSubmit] Failed to get Clerk token:", tokenError);
        navigate("/dashboard?quiz_error=true&error_message=Failed to get authentication token. Please sign out and sign back in.");
        return;
      }
    }

    // Get user with retry for auth sync
    let user = currentUser;
    if (!user?._id && authEnabled && isSignedIn) {
      try {
        // Try to create/upsert user with retries
        let attempts = 0;
        const maxAttempts = 3;
        const delayMs = 1000;

        while (attempts < maxAttempts && !user?._id) {
          attempts++;
          try {
            console.log(`[handleQuizSubmit] Attempting upsertUser (attempt ${attempts}/${maxAttempts})`);
            user = await upsertUser();
            if (user?._id) {
              console.log("[handleQuizSubmit] User created/updated successfully:", user._id);
              break; // Success!
            }
          } catch (error) {
            console.error(`[handleQuizSubmit] upsertUser attempt ${attempts} failed:`, error);
            // If it's an auth error, don't retry
            if (error instanceof Error && error.message.includes("Authentication required")) {
              throw error;
            }
          }

          // Wait before retry (exponential backoff)
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, delayMs * attempts));
          }
        }

        if (!user?._id) {
          console.error("[handleQuizSubmit] Failed to create user after", maxAttempts, "attempts");
          navigate("/dashboard?quiz_error=true&error_message=Unable to authenticate. Please sign out and sign back in, then try again.");
          return;
        }
      } catch (error) {
        console.error("[handleQuizSubmit] User creation error:", error);
        const errorMsg = error instanceof Error ? error.message : "Authentication error";
        navigate(`/dashboard?quiz_error=true&error_message=${encodeURIComponent(errorMsg)}`);
        return;
      }
    }

    // Fallback: use test user if auth disabled
    if (!user?._id && !authEnabled) {
      navigate("/dashboard?quiz_error=true&error_message=Authentication required to save quiz results.");
      return;
    }

    // Validate answers before submission
    const validation = validateQuizAnswers(answers, questions);
    if (!validation.isValid) {
      console.error("Quiz validation failed:", validation.errors);
      navigate("/dashboard?quiz_error=true&error_message=Invalid answers");
      return;
    }

    try {
      // Format answers for Convex function
      const formattedAnswers = answers.map(answer => ({
        questionId: answer.questionId as any,
        selectedOptionIndex: answer.skipped ? undefined : answer.selectedOptionIndex,
        skipped: answer.skipped
      }));

      // Save quiz attempt using authenticated user
      const attemptId = await createQuizAttempt({
        userId: user!._id,
        ruleId: rule._id as any,
        answers: formattedAnswers
      });

      // Calculate score for redirect (we can get this from the created attempt)
      const correctAnswers = answers.filter((answer, index) =>
        !answer.skipped && answer.selectedOptionIndex === questions[index].correctOptionIndex
      );
      const score = Math.round((correctAnswers.length / answers.length) * 100);

      // Navigate to dashboard with success message
      navigate(`/dashboard?quiz_completed=true&score=${score}&attempt_id=${attemptId}`);
    } catch (error) {
      console.error("[handleQuizSubmit] Quiz submission error:", error);
      const errorMsg = error instanceof Error 
        ? error.message 
        : "Failed to submit quiz. Please try again.";
      navigate(`/dashboard?quiz_error=true&error_message=${encodeURIComponent(errorMsg)}`);
    }
  };

  return (
    <QuizErrorBoundary>
      <div className="min-h-screen text-white" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4 py-8">
          <QuizContainer
            rule={rule}
            questions={questions}
            userId={currentUser?._id || null}
            onSubmit={handleQuizSubmit}
          />
        </div>
      </div>
    </QuizErrorBoundary>
  );
}