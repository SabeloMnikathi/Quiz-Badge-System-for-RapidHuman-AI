/**
 * FILE: ProgressBar.tsx
 * PURPOSE: Shows the user's progress through the quiz.
 * WHY: Gives users a sense of how far along they are, reducing quiz abandonment.
 */

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Question {Math.min(current + 1, total)} of {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-indigo-500"
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
