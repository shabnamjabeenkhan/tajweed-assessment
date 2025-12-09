import { redirect, useLoaderData, useNavigate } from "react-router";
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

export async function action(args: Route.ActionArgs) {
  const { ruleSlug } = args.params;
  const formData = await args.request.formData();
  const answersJson = formData.get("answers") as string;

  if (!ruleSlug || !answersJson) {
    return redirect(`/dashboard?quiz_error=true&error_message=Missing required data`);
  }

  try {
    const answers = JSON.parse(answersJson) as QuizAnswer[];

    // Setup Convex client
    const convexUrl = process.env.VITE_CONVEX_URL || import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) {
      return redirect(`/dashboard?quiz_error=true&error_message=Configuration error`);
    }
    const convexClient = new ConvexHttpClient(convexUrl);

    // Get the rule by slug
    const rule = await convexClient.query(api.tajweedRules.getBySlug, { slug: ruleSlug });
    if (!rule) {
      return redirect(`/dashboard?quiz_error=true&error_message=Rule not found`);
    }

    // Get questions to calculate score
    const questions = await convexClient.query(api.questions.getByRule, { ruleId: rule._id });

    // Get user ID from form data (passed from client)
    const userIdFromForm = formData.get("userId") as string;
    if (!userIdFromForm) {
      return redirect(`/dashboard?quiz_error=true&error_message=User not authenticated`);
    }

    // Format answers for Convex function
    const formattedAnswers = answers.map(answer => ({
      questionId: answer.questionId as any,
      selectedOptionIndex: answer.skipped ? undefined : answer.selectedOptionIndex,
      skipped: answer.skipped
    }));

    // Save quiz attempt (this handles scoring and saving answers automatically)
    const attemptId = await convexClient.mutation(api.quizAttempts.createQuizAttempt, {
      userId: userIdFromForm as any,
      ruleId: rule._id,
      answers: formattedAnswers
    });

    // Get the actual score from the created attempt
    const attemptDetails = await convexClient.query(api.quizAttempts.getAttemptDetails, {
      attemptId: attemptId
    });

    const actualScore = attemptDetails?.scorePercent || 0;

    // Redirect to dashboard with success message and attempt ID
    return redirect(`/dashboard?quiz_completed=true&score=${actualScore}&attempt_id=${attemptId}`);
  } catch (error) {
    console.error("Quiz submission error:", error);
    // Instead of throwing, redirect to dashboard with error state
    return redirect(`/dashboard?quiz_error=true&error_message=Failed to submit quiz`);
  }
}

export default function QuizPage() {
  const { rule, questions } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const authEnabled = isFeatureEnabled('auth') && isServiceEnabled('clerk');
  const { isSignedIn, userId: clerkUserId } = useAuth();

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

    // Get user with retry for auth sync
    let user = currentUser;
    if (!user?._id && authEnabled && isSignedIn) {
      try {
        user = await upsertUser();
        // If still null, wait briefly for auth sync and try once more
        if (!user?._id) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          user = await upsertUser();
        }

        if (!user?._id) {
          navigate("/dashboard?quiz_error=true&error_message=Please refresh the page and try again.");
          return;
        }
      } catch (error) {
        navigate("/dashboard?quiz_error=true&error_message=Authentication error. Please sign out and back in.");
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
      console.error("Quiz submission error:", error);
      navigate("/dashboard?quiz_error=true&error_message=Failed to submit quiz");
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