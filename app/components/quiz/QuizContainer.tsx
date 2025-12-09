import { useState } from "react";
import { QuizHeader } from "./QuizHeader";
import { LoadingSpinner } from "./LoadingSpinner";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import type { QuizQuestion, TajweedRule } from "~/lib/quiz";

interface QuizContainerProps {
  rule: TajweedRule;
  questions: QuizQuestion[];
  userId: string | null;
  onSubmit: (answers: QuizAnswer[]) => void;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionIndex?: number;
  skipped: boolean;
}

export function QuizContainer({ rule, questions, onSubmit }: QuizContainerProps) {
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
  const [showFeedback, setShowFeedback] = useState(false);

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
    setShowFeedback(true);
  };

  const handleSkip = () => {
    // Mark current question as skipped
    setAnswers(prev => prev.map((answer, index) =>
      index === currentQuestionIndex
        ? { ...answer, selectedOptionIndex: undefined, skipped: true }
        : answer
    ));

    // Reset feedback state when skipping
    setShowFeedback(false);

    // Automatically advance to next question or submit if last question
    setTimeout(() => {
      if (isLastQuestion) {
        handleNext();
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 100); // Small delay to ensure state update completes
  };


  const handleNext = () => {
    if (isLastQuestion) {
      setIsSubmitting(true);
      setError(null);
      try {
        onSubmit(answers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to submit quiz');
        setIsSubmitting(false);
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowFeedback(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowFeedback(false);
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
      <Card className="border-2 shadow-2xl overflow-hidden" style={{ backgroundColor: '#1a1a1a', borderColor: '#374151' }}>
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide">
              Question
            </h3>
            <p className="text-lg font-medium text-white">{currentQuestion.prompt}</p>
          </div>

          {/* Answer Options Grid */}
          <div className="grid gap-4 md:grid-cols-1">
            {currentQuestion.options.map((option, index) => {
              const isSelected = currentAnswer.selectedOptionIndex === index;
              const isCorrect = index === currentQuestion.correctOptionIndex;
              const isUserChoice = isSelected;
              const isCorrectAnswer = isCorrect;

              let buttonClasses = 'text-left p-4 rounded-lg border-2 transition-all duration-200 ';
              let circleClasses = 'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ';

              if (showFeedback) {
                if (isCorrectAnswer) {
                  // Always highlight correct answer in green when feedback is shown
                  buttonClasses += 'border-green-500 bg-green-500/10 text-white';
                  circleClasses += 'border-green-500 bg-green-500 text-white';
                } else if (isUserChoice && !isCorrectAnswer) {
                  // Highlight incorrect user choice in red
                  buttonClasses += 'border-red-500 bg-red-500/10 text-white';
                  circleClasses += 'border-red-500 bg-red-500 text-white';
                } else {
                  // Other options remain neutral
                  buttonClasses += 'border-neutral-700 bg-neutral-800/50 text-neutral-300';
                  circleClasses += 'border-neutral-600 text-neutral-400';
                }
              } else {
                if (isSelected) {
                  buttonClasses += 'border-blue-500 bg-blue-500/10 text-white';
                  circleClasses += 'border-blue-500 bg-blue-500 text-white';
                } else {
                  buttonClasses += 'border-neutral-700 bg-neutral-800/50 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800';
                  circleClasses += 'border-neutral-600 text-neutral-400';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => !showFeedback && handleAnswer(index)}
                  disabled={showFeedback}
                  className={buttonClasses}
                >
                  <div className="flex items-center gap-3">
                    <span className={circleClasses}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="flex-1 font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-600/10 border border-red-500/20 rounded-lg">
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
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-neutral-700/50">
          <button
            onClick={handleSkip}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-neutral-600 text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Skip
          </button>

          <div className="flex gap-3 flex-1">
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePrevious}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg border border-neutral-600 text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className={`flex-1 px-6 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                canProceed && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Submitting...
                </>
              ) : (
                <>
                  {isLastQuestion ? 'Submit Quiz' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </CardFooter>
      </Card>

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