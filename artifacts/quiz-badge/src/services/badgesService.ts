/**
 * FILE: badgesService.ts
 * PURPOSE: Creates and fetches badge records from the "badges" table.
 * WHY: Separates badge logic from UI components and the quiz flow.
 */

import { supabase } from "./supabase";
import type { Badge } from "../types/quiz.types";

export async function createBadge(userId: string, attemptId: string): Promise<void> {
  const badgeImageUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/badges/badge.png`;

  const { error } = await supabase.from("badges").insert([{
    user_id: userId,
    attempt_id: attemptId,
    image_url: badgeImageUrl,
    awarded_at: new Date().toISOString(),
  }]);

  if (error) {
    console.warn("Badge creation failed (non-critical):", error.message);
  }
}

export async function fetchBadgeForAttempt(attemptId: string): Promise<Badge | null> {
  const { data, error } = await supabase
    .from("badges")
    .select("*")
    .eq("attempt_id", attemptId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as Badge | null;
}
