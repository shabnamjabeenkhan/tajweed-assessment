import { redirect, useLoaderData, useSubmit } from "react-router";
import type { Route } from "./+types/quiz.$ruleSlug";
import { validateQuizAnswers } from "~/lib/quiz";
import { QuizContainer, type QuizAnswer } from "~/components/quiz/QuizContainer";
import { QuizErrorBoundary } from "~/components/quiz/QuizErrorBoundary";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

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
      userId: "mock-user-id", // TODO: Replace with real user ID from auth
      authEnabled: true,
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
    throw new Error("Missing required data");
  }

  try {
    const answers = JSON.parse(answersJson) as QuizAnswer[];

    // Setup Convex client
    const convexUrl = process.env.VITE_CONVEX_URL || import.meta.env.VITE_CONVEX_URL;
    if (!convexUrl) {
      throw new Error("VITE_CONVEX_URL environment variable is required");
    }
    const convexClient = new ConvexHttpClient(convexUrl);

    // Get the rule by slug
    const rule = await convexClient.query(api.tajweedRules.getBySlug, { slug: ruleSlug });
    if (!rule) {
      throw new Error("Rule not found");
    }

    // Get questions to calculate score
    const questions = await convexClient.query(api.questions.getByRule, { ruleId: rule._id });

    // Use the test user we created for MVP
    const testUserId = "jd76h3qestqer1vh269vd9wh317sme1k" as any; // Real user ID from database

    // Format answers for Convex function
    const formattedAnswers = answers.map(answer => ({
      questionId: answer.questionId as any,
      selectedOptionIndex: answer.skipped ? undefined : answer.selectedOptionIndex,
      skipped: answer.skipped
    }));

    // Save quiz attempt (this handles scoring and saving answers automatically)
    const attemptId = await convexClient.mutation(api.quizAttempts.createQuizAttempt, {
      userId: testUserId,
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
    throw new Error("Failed to submit quiz");
  }
}

export default function QuizPage() {
  const { rule, questions, userId } = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleQuizSubmit = (answers: QuizAnswer[]) => {
    // Validate answers before submission
    const validation = validateQuizAnswers(answers, questions);
    if (!validation.isValid) {
      console.error("Quiz validation failed:", validation.errors);
      // TODO: Show error message to user
      return;
    }

    // Submit using React Router action
    submit(
      { answers: JSON.stringify(answers) },
      { method: "post" }
    );
  };

  return (
    <QuizErrorBoundary>
      <div className="min-h-screen text-white" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="container mx-auto px-4 py-8">
          <QuizContainer
            rule={rule}
            questions={questions}
            userId={userId}
            onSubmit={handleQuizSubmit}
          />
        </div>
      </div>
    </QuizErrorBoundary>
  );
}