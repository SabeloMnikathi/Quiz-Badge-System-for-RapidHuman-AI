/**
 * FILE: QuizRoot.tsx
 * PURPOSE: Controls the quiz flow — handles anonymous sign-in, session guard, start, quiz, and result screens.
 * WHY: Centralizes all quiz orchestration logic so each page component stays focused.
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuiz } from "../context/QuizContext";
import { useQuestions } from "../hooks/useQuestions";
import { useQuizSession } from "../hooks/useQuizSession";
import { supabase } from "../services/supabase";
import { createAttempt } from "../services/attemptsService";
import { StartPage } from "./StartPage";
import { QuizPage } from "./QuizPage";
import { ResultPage } from "./ResultPage";

type Screen = "start" | "quiz" | "result";

export function QuizRoot() {
  const { state, dispatch } = useQuiz();
  const { questions, loading, error } = useQuestions();
  const { getSession, saveSession } = useQuizSession();
  const [, setLocation] = useLocation();
  const [screen, setScreen] = useState<Screen>("start");
  const [startError, setStartError] = useState<string | null>(null);

  useEffect(() => {
    dispatch({ type: "SET_QUESTIONS", payload: questions });
  }, [questions, dispatch]);

  useEffect(() => {
    const session = getSession();
    if (session && !state.completed) {
      setScreen("result");
    }
  }, []);

  useEffect(() => {
    if (state.completed) {
      setScreen("result");
    }
  }, [state.completed]);

  const handleBegin = async () => {
    setStartError(null);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
      if (authError || !authData.user) throw new Error("Failed to sign in anonymously.");

      const userId = authData.user.id;
      const attempt = await createAttempt(userId);
      saveSession(attempt.id, userId);

      dispatch({ type: "START_QUIZ", payload: { attemptId: attempt.id, userId } });
      setScreen("quiz");
    } catch (err) {
      setStartError(err instanceof Error ? err.message : "Could not start quiz.");
    }
  };

  if (screen === "quiz" && state.started) return <QuizPage />;
  if (screen === "result") return <ResultPage />;

  return (
    <div>
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      {startError && (
        <div className="fixed top-4 right-4 bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg border border-red-200">
          {startError}
        </div>
      )}
      <StartPage
        questionCount={questions.length}
        onBegin={handleBegin}
        loading={loading}
      />
    </div>
  );
}
