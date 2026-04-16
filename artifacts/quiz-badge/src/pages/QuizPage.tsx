/**
 * FILE: QuizPage.tsx
 * PURPOSE: Orchestrates the question flow — navigation, timer, answer recording, and grading.
 * WHY: Centralizes quiz orchestration so individual components stay focused on display.
 */

import { useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuiz } from "../context/QuizContext";
import { useTimer } from "../hooks/useTimer";
import { useQuizSession } from "../hooks/useQuizSession";
import { QuestionCard } from "../components/QuestionCard";
import { Timer } from "../components/Timer";
import { ProgressBar } from "../components/ProgressBar";
import { updateAttemptAnswers, gradeAttempt } from "../services/attemptsService";
import { createBadge } from "../services/badgesService";
import type { Answer } from "../types/quiz.types";

const QUESTION_TIME = 60;

const slideVariants = {
  enter: { x: "100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

export function QuizPage() {
  const { state, dispatch } = useQuiz();
  const { questions, currentIndex, answers, attemptId, userId } = state;
  const { saveSession } = useQuizSession();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [timerFrozen, setTimerFrozen] = useState(false);
  const timerKey = useRef(0);
  const startTime = useRef<number>(Date.now());

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const handleAdvance = useCallback(
    async (timeoutAnswer: boolean = false) => {
      if (submitting || timerFrozen) return;

      const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
      const answer: Answer = {
        question_id: currentQuestion.id,
        selected_index: timeoutAnswer ? null : selectedIndex,
        time_taken: timeTaken,
      };

      const updatedAnswers = [...answers, answer];

      if (isLast) {
        setTimerFrozen(true);
        setSubmitting(true);
        setSubmitError(null);

        try {
          await updateAttemptAnswers(attemptId!, updatedAnswers);
          const result = await gradeAttempt(attemptId!, updatedAnswers, questions);
          if (result.passed && userId) {
            await createBadge(userId, attemptId!);
          }
          dispatch({ type: "RECORD_ANSWER", payload: answer });
          dispatch({ type: "COMPLETE_QUIZ", payload: result });
          if (userId) saveSession(attemptId!, userId);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Submission failed. Please try again.";
          setSubmitError(msg);
          setSubmitting(false);
          setTimerFrozen(false);
        }
      } else {
        dispatch({ type: "RECORD_ANSWER", payload: answer });
        setSelectedIndex(null);
        timerKey.current += 1;
        startTime.current = Date.now();
        dispatch({ type: "NEXT_QUESTION" });
      }
    },
    [currentQuestion, selectedIndex, answers, isLast, attemptId, questions, userId, dispatch, submitting, timerFrozen, saveSession]
  );

  const handleTimeout = useCallback(() => {
    handleAdvance(true);
  }, [handleAdvance]);

  const { timeLeft } = useTimer({
    duration: QUESTION_TIME,
    onTimeout: handleTimeout,
    active: !submitting && !timerFrozen,
  });

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <ProgressBar current={currentIndex} total={questions.length} />
          </div>
          <Timer key={timerKey.current} timeLeft={timeLeft} total={QUESTION_TIME} />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full max-w-2xl"
          >
            <QuestionCard
              text={currentQuestion.text}
              options={currentQuestion.options}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-8">
        <div className="max-w-2xl mx-auto space-y-3">
          {submitError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {submitError}
            </div>
          )}
          <button
            onClick={() => handleAdvance(false)}
            disabled={selectedIndex === null || submitting}
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl text-base hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Grading..." : isLast ? "Submit Quiz" : "Next Question →"}
          </button>
        </div>
      </div>
    </div>
  );
}
