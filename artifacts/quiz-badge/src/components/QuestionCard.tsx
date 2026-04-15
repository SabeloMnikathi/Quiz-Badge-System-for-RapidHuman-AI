/**
 * FILE: QuestionCard.tsx
 * PURPOSE: Renders a single quiz question with animated radio options.
 * WHY: Encapsulates question presentation so QuizPage only orchestrates flow.
 */

import { motion } from "framer-motion";

interface QuestionCardProps {
  text: string;
  options: string[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

const optionLabels = ["A", "B", "C", "D"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const optionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function QuestionCard({
  text,
  options,
  selectedIndex,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="text-2xl font-semibold text-gray-900 mb-8 leading-snug"
      >
        {text}
      </motion.h2>

      <motion.div
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <motion.button
              key={idx}
              variants={optionVariants}
              onClick={() => onSelect(idx)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer
                ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50 text-indigo-900"
                    : "border-gray-200 bg-white text-gray-800 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${
                    isSelected
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
              >
                {optionLabels[idx]}
              </span>
              <span className="text-base">{option}</span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
