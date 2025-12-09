import { redirect, useLoaderData, useNavigate } from "react-router";
import type { Route } from "./+types/quiz.$ruleSlug";
import { validateQuizAnswers } from "~/lib/quiz";
import { QuizContainer, type QuizAnswer } from "~/components/quiz/QuizContainer";
import { QuizErrorBoundary } from "~/components/quiz/QuizErrorBoundary";
import { ConvexHttpClient } from "convex/browser";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect } from "react";

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
    throw new Response("Failed to load quiz", { status: 500 });
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

  // Get test user ID for MVP
  const testUserId = useQuery(api.testUser.getTestUser);
  const createTestUser = useMutation(api.testUser.getOrCreateTestUser);
  const createQuizAttempt = useMutation(api.quizAttempts.createQuizAttempt);

  // Create test user if it doesn't exist
  useEffect(() => {
    if (testUserId === null) {
      createTestUser();
    }
  }, [testUserId, createTestUser]);

  const handleQuizSubmit = async (answers: QuizAnswer[]) => {
    if (!testUserId) {
      console.error("User not authenticated");
      navigate("/dashboard?quiz_error=true&error_message=User not authenticated");
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

      // Save quiz attempt using test user
      const attemptId = await createQuizAttempt({
        userId: testUserId,
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
            userId={testUserId || null}
            onSubmit={handleQuizSubmit}
          />
        </div>
      </div>
    </QuizErrorBoundary>
  );
}