/**
 * FILE: BadgeScreen.tsx
 * PURPOSE: Full-screen congratulations view with badge SVG and confetti animation.
 * WHY: Separates the success state presentation from result routing logic.
 */

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface BadgeScreenProps {
  correctCount: number;
  total: number;
  onRetry: () => void;
}

function BadgeSVG() {
  return (
    <svg viewBox="0 0 200 200" className="w-40 h-40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="outerGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </radialGradient>
        <radialGradient id="innerGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#6366f1" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#outerGrad)" />
      <circle cx="100" cy="100" r="78" fill="url(#innerGrad)" />
      <polygon
        points="100,38 116,78 160,78 126,103 140,146 100,121 60,146 74,103 40,78 84,78"
        fill="#fbbf24"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="85" r="16" fill="white" opacity="0.15" />
      <path d="M89 85 L97 93 L113 77" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BadgeScreen({ correctCount, total, onRetry }: BadgeScreenProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        origin: { y: 0.6 },
        ...opts,
        particleCount: Math.floor(200 * particleRatio),
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="drop-shadow-2xl"
        >
          <BadgeSVG />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">
            You've earned your badge!
          </h1>
          <p className="mt-3 text-gray-500 text-lg">
            You scored {correctCount} out of {total} correctly.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onRetry}
          className="mt-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl text-base hover:bg-indigo-700 transition-colors"
        >
          Take Quiz Again
        </motion.button>
      </motion.div>
    </div>
  );
}
