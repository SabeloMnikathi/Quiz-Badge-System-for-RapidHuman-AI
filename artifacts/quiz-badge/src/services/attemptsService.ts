/**
 * FILE: attemptsService.ts
 * PURPOSE: Handles creating attempts and calling the grade-attempt Edge Function.
 * WHY: Isolates Supabase + edge function calls from the quiz UI logic.
 */

import { supabase } from "./supabase";
import type { Answer, Attempt, GradeResult } from "../types/quiz.types";

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

export async function gradeAttempt(attemptId: string): Promise<GradeResult> {
  const { data, error } = await supabase.functions.invoke("grade-attempt", {
    body: { attemptId },
  });

  if (error) {
    const msg = error.message || error.toString() || "Edge Function call failed";
    throw new Error(msg);
  }
  if (!data) throw new Error("No response from grading function");
  if (data.error) throw new Error(data.error);
  return data as GradeResult;
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
