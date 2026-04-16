/**
 * FILE: attemptsService.ts
 * PURPOSE: Handles creating and updating attempts, and grading locally using fetched questions.
 * WHY: Isolates Supabase calls from the quiz UI logic. Grading is done client-side for reliability.
 */

import { supabase } from "./supabase";
import type { Answer, Attempt, GradeResult, Question } from "../types/quiz.types";

export async function createAttempt(userId: string): Promise<Attempt> {
  const { data, error } = await supabase
    .from("attempts")
    .insert([{ user_id: userId, answers: [], started_at: new Date().toISOString() }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Attempt;
}

export async function updateAttemptAnswers(
  attemptId: string,
  answers: Answer[]
): Promise<void> {
  const { error } = await supabase
    .from("attempts")
    .update({ answers, completed_at: new Date().toISOString() })
    .eq("id", attemptId);

  if (error) throw new Error(error.message);
}

export async function gradeAttempt(
  attemptId: string,
  answers: Answer[],
  questions: Question[]
): Promise<GradeResult> {
  const total = questions.length;
  let correctCount = 0;

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.question_id);
    if (question && answer.selected_index === question.correct_index) {
      correctCount++;
    }
  }

  const passed = total > 0 && correctCount === total;

  const { error } = await supabase
    .from("attempts")
    .update({ passed })
    .eq("id", attemptId);

  if (error) throw new Error(error.message);

  return { passed, correct_count: correctCount, total };
}

export async function fetchAttempt(attemptId: string): Promise<Attempt> {
  const { data, error } = await supabase
    .from("attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (error) throw new Error(error.message);
  return data as Attempt;
}
