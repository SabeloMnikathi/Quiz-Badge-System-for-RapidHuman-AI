/**
 * FILE: StartPage.tsx
 * PURPOSE: Quiz intro screen with title, rules, and a Begin button.
 * WHY: Separates the entry UX from the question flow — provides context before the timed quiz starts.
 */

import { motion } from "framer-motion";

interface StartPageProps {
  questionCount: number;
  onBegin: () => void;
  loading: boolean;
}

export function StartPage({ questionCount, onBegin, loading }: StartPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100">
          <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-3">Knowledge Quiz</h1>
        <p className="text-gray-500 text-lg mb-8">
          Test your knowledge and earn a badge!
        </p>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 text-left shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Before you start</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 font-bold mt-0.5">•</span>
              <span>{questionCount} questions — one per screen</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 font-bold mt-0.5">•</span>
              <span>Each question has a 60-second timer</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 font-bold mt-0.5">•</span>
              <span>You cannot go back once you advance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-500 font-bold mt-0.5">•</span>
              <span>Answer all questions correctly to earn your badge</span>
            </li>
          </ul>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onBegin}
          disabled={loading || questionCount === 0}
          className="w-full max-w-xs mx-auto block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl text-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Loading..." : questionCount === 0 ? "No Questions Available" : "Begin Quiz"}
        </motion.button>
      </motion.div>
    </div>
  );
}
