/**
 * FILE: BadgeScreen.tsx
 * PURPOSE: Full-screen congratulations view with badge image and confetti animation.
 * WHY: Separates the success state presentation from result routing logic.
 */

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface BadgeScreenProps {
  badgeUrl: string | null;
  correctCount: number;
  total: number;
}

export function BadgeScreen({ badgeUrl, correctCount, total }: BadgeScreenProps) {
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

  const BadgeFallback = () => (
    <svg viewBox="0 0 200 200" className="w-36 h-36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="90" fill="#6366f1" />
      <circle cx="100" cy="100" r="75" fill="#818cf8" />
      <polygon
        points="100,40 115,80 160,80 125,105 138,148 100,123 62,148 75,105 40,80 85,80"
        fill="#fbbf24"
        stroke="#f59e0b"
        strokeWidth="2"
      />
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-36 h-36 drop-shadow-xl">
          {badgeUrl ? (
            <img src={badgeUrl} alt="Badge" className="w-full h-full object-contain" />
          ) : (
            <BadgeFallback />
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Congratulations, you have unlocked a badge!
          </h1>
          <p className="mt-3 text-gray-500 text-lg">
            You scored {correctCount} out of {total} correctly.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
