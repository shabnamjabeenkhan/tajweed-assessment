import { Link } from "react-router";
import type { TajweedRule } from "~/lib/quiz";

interface QuizHeaderProps {
  rule: TajweedRule;
  currentQuestion: number;
  totalQuestions: number;
  onExit: () => void;
}

export function QuizHeader({ rule, currentQuestion, totalQuestions, onExit }: QuizHeaderProps) {
  const progressPercentage = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="mb-6">
      {/* Rule Info and Exit */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">{rule.title}</h1>
            <p className="text-gray-400 text-sm">{rule.description}</p>
          </div>
        </div>

        <button
          onClick={onExit}
          className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white transition-colors text-sm"
        >
          Exit Quiz
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
          <span>Progress</span>
          <span>{currentQuestion}/{totalQuestions} • {Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}