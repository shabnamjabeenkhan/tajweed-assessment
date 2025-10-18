import { useState } from "react";
import { QuizHeader } from "./QuizHeader";
import { LoadingSpinner } from "./LoadingSpinner";
import type { QuizQuestion, TajweedRule } from "~/lib/quiz";

interface QuizContainerProps {
  rule: TajweedRule;
  questions: QuizQuestion[];
  userId: string | null;
  onSubmit: (answers: QuizAnswer[]) => Promise<void> | void;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionIndex?: number;
  skipped: boolean;
}

export function QuizContainer({ rule, questions, userId, onSubmit }: QuizContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>(() =>
    questions.map(q => ({
      questionId: q._id,
      selectedOptionIndex: undefined,
      skipped: false,
    }))
  );
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const canProceed = currentAnswer.selectedOptionIndex !== undefined || currentAnswer.skipped;

  const handleAnswer = (optionIndex: number) => {
    setAnswers(prev => prev.map((answer, index) =>
      index === currentQuestionIndex
        ? { ...answer, selectedOptionIndex: optionIndex, skipped: false }
        : answer
    ));
  };

  const handleSkip = () => {
    // Mark current question as skipped
    setAnswers(prev => prev.map((answer, index) =>
      index === currentQuestionIndex
        ? { ...answer, selectedOptionIndex: undefined, skipped: true }
        : answer
    ));

    // Automatically advance to next question or submit if last question
    setTimeout(() => {
      if (isLastQuestion) {
        handleNext();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 100); // Small delay to ensure state update completes
  };


  const handleNext = async () => {
    if (isLastQuestion) {
      setIsSubmitting(true);
      setError(null);
      try {
        await onSubmit(answers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit quiz');
        setIsSubmitting(false);
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleExit = () => {
    setShowExitDialog(true);
  };

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-300 mb-2">No Questions Available</h2>
          <p className="text-gray-500">There are no questions available for this rule.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Quiz Header */}
      <QuizHeader
        rule={rule}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onExit={handleExit}
      />

      {/* Main Quiz Content */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 md:p-8">
        {/* Question Display */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium">
              {currentQuestionIndex + 1}
            </span>
            <span className="text-gray-400 text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 leading-relaxed">
            {currentQuestion.prompt}
          </h2>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                  currentAnswer.selectedOptionIndex === index
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm ${
                    currentAnswer.selectedOptionIndex === index
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-600/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className="text-red-400 font-medium">Submission Error</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Skip
            </button>
          </div>

          <div className="flex gap-3">
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePrevious}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                canProceed && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Submitting...
                </>
              ) : (
                isLastQuestion ? 'Submit Quiz' : 'Next'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      {showExitDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-white mb-3">Exit Quiz?</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to exit? Your progress will be lost.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowExitDialog(false)}
                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Exit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}