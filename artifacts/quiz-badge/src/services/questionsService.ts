/**
 * FILE: questionsService.ts
 * PURPOSE: All CRUD operations for the "questions" table in Supabase.
 * WHY: Keeps Supabase logic out of components and pages, following the service layer pattern.
 */

import { supabase } from "./supabase";
import type { Question } from "../types/quiz.types";

export async function fetchAllQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .order("order", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Question[];
}

export async function createQuestion(
  question: Omit<Question, "id" | "created_at">
): Promise<Question> {
  const { data, error } = await supabase
    .from("questions")
    .insert([question])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Question;
}

export async function updateQuestion(
  id: string,
  updates: Partial<Omit<Question, "id" | "created_at">>
): Promise<Question> {
  const { data, error } = await supabase
    .from("questions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Question;
}

export async function deleteQuestion(id: string): Promise<void> {
  const { error } = await supabase.from("questions").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
