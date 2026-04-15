/**
 * FILE: Timer.tsx
 * PURPOSE: Displays a circular countdown timer for each question.
 * WHY: A dedicated component keeps timer rendering concerns separate from quiz logic.
 */

import { motion } from "framer-motion";

interface TimerProps {
  timeLeft: number;
  total: number;
}

export function Timer({ timeLeft, total }: TimerProps) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / total;
  const dashOffset = circumference * (1 - progress);

  const color =
    timeLeft > total * 0.5
      ? "#6366f1"
      : timeLeft > total * 0.25
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      <svg className="absolute" width="64" height="64" viewBox="0 0 64 64">
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="4"
        />
        <motion.circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 32 32)"
          animate={{ strokeDashoffset: dashOffset, stroke: color }}
          transition={{ duration: 0.5, ease: "linear" }}
        />
      </svg>
      <span className="relative text-sm font-bold tabular-nums" style={{ color }}>
        {timeLeft}
      </span>
    </div>
  );
}
