/**
 * FILE: useTimer.ts
 * PURPOSE: Per-question countdown timer with callback on timeout.
 * WHY: Isolates timer logic from the quiz page so it can be reset/configured per question.
 */

import { useState, useEffect, useRef } from "react";

interface UseTimerOptions {
  duration: number;
  onTimeout: () => void;
  active: boolean;
}

export function useTimer({ duration, onTimeout, active }: UseTimerOptions) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeoutRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [active, duration]);

  return { timeLeft };
}
