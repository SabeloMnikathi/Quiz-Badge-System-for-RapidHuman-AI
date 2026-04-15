/**
 * FILE: useQuestions.ts
 * PURPOSE: Fetches all quiz questions from Supabase on mount.
 * WHY: Decouples data fetching from rendering logic for reusability and testability.
 */

import { useState, useEffect } from "react";
import { fetchAllQuestions } from "../services/questionsService";
import type { Question } from "../types/quiz.types";

export function useQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllQuestions();
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { questions, loading, error, reload: load };
}
