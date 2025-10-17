import { redirect, useLoaderData, useSubmit } from "react-router";
import type { Route } from "./+types/quiz.$ruleSlug";
import { validateQuizAnswers } from "~/lib/quiz";
import { QuizContainer, type QuizAnswer } from "~/components/quiz/QuizContainer";
import { QuizErrorBoundary } from "~/components/quiz/QuizErrorBoundary";

export async function loader(args: Route.LoaderArgs) {
  const { ruleSlug } = args.params;

  if (!ruleSlug) {
    throw new Error("Rule slug is required");
  }

  // Mock data for testing - replace with Convex calls later
  const mockRules: Record<string, any> = {
    madd: {
      _id: "mock-madd-id",
      slug: "madd",
      title: "Madd Rules",
      description: "Rules for prolonging vowel sounds in Quranic recitation",
      isActive: true,
      createdAt: Date.now(),
    },
    saakin: {
      _id: "mock-saakin-id",
      slug: "saakin",
      title: "Saakin Rules",
      description: "Rules for letters with sukoon (no vowel mark)",
      isActive: true,
      createdAt: Date.now(),
    }
  };

  const mockQuestions = [
    {
      _id: "q1",
      ruleId: `mock-${ruleSlug}-id`,
      prompt: `What is the basic rule for ${ruleSlug} in Tajweed?`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctOptionIndex: 1,
      explanation: `This is the explanation for ${ruleSlug} rules.`,
      isActive: true,
      version: 1,
      createdAt: Date.now(),
    },
    {
      _id: "q2",
      ruleId: `mock-${ruleSlug}-id`,
      prompt: `How should ${ruleSlug} be applied when reciting?`,
      options: ["Method 1", "Method 2", "Method 3", "Method 4"],
      correctOptionIndex: 0,
      explanation: `This explains the application of ${ruleSlug}.`,
      isActive: true,
      version: 1,
      createdAt: Date.now(),
    },
  ];

  const rule = mockRules[ruleSlug];

  if (!rule) {
    throw new Response("Rule not found", { status: 404 });
  }

  return {
    rule,
    questions: mockQuestions,
    userId: "mock-user-id",
    authEnabled: true,
  };
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

    console.log("Quiz submission received:", {
      ruleSlug,
      answersCount: answers.length,
      answers: answers.map(a => ({
        questionId: a.questionId,
        selected: a.selectedOptionIndex,
        skipped: a.skipped
      }))
    });

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Redirect back to dashboard with success message
    return redirect("/dashboard?quiz=completed&rule=" + ruleSlug);
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
      <div className="min-h-screen bg-gray-950 text-white">
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