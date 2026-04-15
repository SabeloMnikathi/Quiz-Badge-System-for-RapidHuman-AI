/**
 * FILE: badgesService.ts
 * PURPOSE: Fetches badge data for a given user from the "badges" table.
 * WHY: Separates badge retrieval from UI components, following the service layer pattern.
 */

import { supabase } from "./supabase";
import type { Badge } from "../types/quiz.types";

export async function fetchBadgeForAttempt(attemptId: string): Promise<Badge | null> {
  const { data, error } = await supabase
    .from("badges")
    .select("*")
    .eq("attempt_id", attemptId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Badge | null;
}
