/**
 * FILE: ResultPage.tsx
 * PURPOSE: Routes to the BadgeScreen (pass) or a retry screen (fail) based on grade result.
 * WHY: Decouples pass/fail routing logic from the presentation of each outcome.
 */

import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuiz } from "../context/QuizContext";
import { BadgeScreen } from "../components/BadgeScreen";

export function ResultPage() {
  const { state, dispatch } = useQuiz();
  const [, setLocation] = useLocation();

  const { gradeResult, completed } = state;

  useEffect(() => {
    if (!completed) {
      setLocation("/");
    }
  }, [completed, setLocation]);

  if (!gradeResult) return null;

  const handleRetry = () => {
    sessionStorage.clear();
    dispatch({ type: "RESET" });
    setLocation("/");
  };

  if (gradeResult.passed) {
    return (
      <BadgeScreen
        correctCount={gradeResult.correct_count}
        total={gradeResult.total}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-white px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-md"
      >
        <div className="mb-6 text-5xl">😔</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Not quite — try again!</h1>
        <p className="text-gray-500 text-lg mb-2">
          You got {gradeResult.correct_count} out of {gradeResult.total} correct.
        </p>
        <p className="text-gray-400 text-sm mb-8">You need a perfect score to earn the badge.</p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleRetry}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl text-base hover:bg-indigo-700 transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}
