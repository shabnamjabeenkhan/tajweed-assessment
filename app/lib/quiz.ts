import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { isFeatureEnabled, isServiceEnabled, getServiceConfig } from "../../config";

/**
 * Quiz-related utility functions
 */

export interface QuizQuestion {
  _id: string;
  ruleId: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  isActive: boolean;
  version: number;
  createdAt: number;
}

export interface TajweedRule {
  _id: string;
  slug: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: number;
}

export interface QuizData {
  rule: TajweedRule | null;
  questions: QuizQuestion[];
}

/**
 * Get 10 random questions for a specific Tajweed rule
 */
export async function getQuestionsByRule(ruleSlug: string): Promise<QuizData> {
  if (!isFeatureEnabled("convex") || !isServiceEnabled("convex")) {
    throw new Error("Convex must be enabled for quiz functionality");
  }

  const convexConfig = getServiceConfig("convex");
  if (!convexConfig?.url) {
    throw new Error("Convex URL not configured");
  }

  try {
    // Create HTTP client for server-side usage
    const client = new ConvexHttpClient(convexConfig.url);

    // First, get the rule by slug
    const rule = await client.query(api.tajweedRules.getRuleBySlug, { slug: ruleSlug });

    if (!rule) {
      return { rule: null, questions: [] };
    }

    // Get all active questions for this rule
    const allQuestions = await client.query(api.questions.getQuestionsByRule, { ruleId: rule._id });

    // Shuffle and take 10 questions
    const shuffledQuestions = shuffleArray([...allQuestions]);
    const selectedQuestions = shuffledQuestions.slice(0, 10);

    return {
      rule,
      questions: selectedQuestions,
    };
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    throw new Error("Failed to fetch quiz data");
  }
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Calculate quiz score
 */
export function calculateScore(
  answers: { questionId: string; selectedOptionIndex?: number; skipped: boolean }[],
  questions: QuizQuestion[]
): {
  correctCount: number;
  totalCount: number;
  scorePercent: number;
  skippedCount: number;
} {
  const totalCount = answers.length;
  const skippedCount = answers.filter(a => a.skipped).length;

  let correctCount = 0;

  answers.forEach((answer) => {
    if (!answer.skipped && answer.selectedOptionIndex !== undefined) {
      const question = questions.find(q => q._id === answer.questionId);
      if (question && answer.selectedOptionIndex === question.correctOptionIndex) {
        correctCount++;
      }
    }
  });

  const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return {
    correctCount,
    totalCount,
    scorePercent,
    skippedCount,
  };
}

/**
 * Validate quiz answers before submission
 */
export function validateQuizAnswers(
  answers: { questionId: string; selectedOptionIndex?: number; skipped: boolean }[],
  questions: QuizQuestion[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (answers.length !== questions.length) {
    errors.push("Answer count does not match question count");
  }

  // Check if all questions have corresponding answers
  questions.forEach((question) => {
    const answer = answers.find(a => a.questionId === question._id);
    if (!answer) {
      errors.push(`Missing answer for question: ${question.prompt.substring(0, 50)}...`);
    }
  });

  // Check for invalid answer indexes
  answers.forEach((answer) => {
    if (!answer.skipped && answer.selectedOptionIndex !== undefined) {
      const question = questions.find(q => q._id === answer.questionId);
      if (question) {
        if (answer.selectedOptionIndex < 0 || answer.selectedOptionIndex >= question.options.length) {
          errors.push(`Invalid option index for question: ${question.prompt.substring(0, 50)}...`);
        }
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format time in minutes and seconds
 */
export function formatQuizTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get quiz difficulty based on rule complexity (placeholder logic)
 */
export function getQuizDifficulty(rule: TajweedRule): 'easy' | 'medium' | 'hard' {
  // This is placeholder logic - in real app, this might be stored in the rule
  const difficultyMap: Record<string, 'easy' | 'medium' | 'hard'> = {
    'madd': 'medium',
    'saakin': 'easy',
    'qalqalah': 'hard',
    'idgham': 'medium',
    'ikhfa': 'hard',
  };

  return difficultyMap[rule.slug] || 'medium';
}