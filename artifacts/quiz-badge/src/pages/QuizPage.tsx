/**
 * FILE: QuizPage.tsx
 * PURPOSE: Orchestrates the question flow — navigation, timer, answer recording, and submission.
 * WHY: Centralizes quiz orchestration so individual components stay focused on display.
 */

import { useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { useQuiz } from "../context/QuizContext";
import { useTimer } from "../hooks/useTimer";
import { useQuizSession } from "../hooks/useQuizSession";
import { QuestionCard } from "../components/QuestionCard";
import { Timer } from "../components/Timer";
import { ProgressBar } from "../components/ProgressBar";
import { updateAttemptAnswers, gradeAttempt } from "../services/attemptsService";
import type { Answer } from "../types/quiz.types";

const QUESTION_TIME = 60;

const slideVariants = {
  enter: { x: "100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

export function QuizPage() {
  const { state, dispatch } = useQuiz();
  const { questions, currentIndex, answers, attemptId } = state;
  const [, setLocation] = useLocation();
  const { saveSession } = useQuizSession();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1);
  const timerKey = useRef(0);

  const currentQuestion = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const startTime = useRef<number>(Date.now());

  const handleAdvance = useCallback(
    async (timeoutAnswer: boolean = false) => {
      if (submitting) return;

      const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
      const answer: Answer = {
        question_id: currentQuestion.id,
        selected_index: timeoutAnswer ? null : selectedIndex,
        time_taken: timeTaken,
      };

      dispatch({ type: "RECORD_ANSWER", payload: answer });
      setSelectedIndex(null);
      timerKey.current += 1;
      startTime.current = Date.now();

      const updatedAnswers = [...answers, answer];

      if (isLast) {
        setSubmitting(true);
        try {
          await updateAttemptAnswers(attemptId!, updatedAnswers);
          const result = await gradeAttempt(attemptId!);
          dispatch({ type: "COMPLETE_QUIZ", payload: result });
          if (state.userId) saveSession(attemptId!, state.userId);
          setLocation("/result");
        } catch (err) {
          console.error("Grading failed:", err);
        } finally {
          setSubmitting(false);
        }
      } else {
        setDirection(1);
        dispatch({ type: "NEXT_QUESTION" });
      }
    },
    [currentQuestion, selectedIndex, answers, isLast, attemptId, dispatch, setLocation, submitting, state.userId, saveSession]
  );

  const handleTimeout = useCallback(() => {
    handleAdvance(true);
  }, [handleAdvance]);

  const { timeLeft } = useTimer({
    duration: QUESTION_TIME,
    onTimeout: handleTimeout,
    active: !submitting,
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
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion.id}
            custom={direction}
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
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => handleAdvance(false)}
            disabled={selectedIndex === null || submitting}
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-xl text-base hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {submitting
              ? "Grading..."
              : isLast
              ? "Submit Quiz"
              : "Next Question →"}
          </button>
        </div>
      </div>
    </div>
  );
}
