/**
 * FILE: grade-attempt/index.ts
 * PURPOSE: Supabase Edge Function that grades a quiz attempt and awards a badge if all correct.
 * WHY: Grading must happen server-side to prevent answer spoofing from the client.
 *
 * Deploy with: supabase functions deploy grade-attempt
 * Set secrets in Supabase dashboard → Settings → Edge Functions:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { attemptId } = await req.json() as { attemptId: string };

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: attempt, error: attemptError } = await supabase
      .from("attempts")
      .select("*")
      .eq("id", attemptId)
      .single();

    if (attemptError || !attempt) {
      throw new Error("Attempt not found");
    }

    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id, correct_index");

    if (questionsError || !questions) {
      throw new Error("Could not fetch questions");
    }

    const questionMap = new Map(questions.map((q: { id: string; correct_index: number }) => [q.id, q.correct_index]));

    const answers: Array<{ question_id: string; selected_index: number | null }> = attempt.answers;
    let correctCount = 0;

    for (const answer of answers) {
      const correctIndex = questionMap.get(answer.question_id);
      if (correctIndex !== undefined && answer.selected_index === correctIndex) {
        correctCount++;
      }
    }

    const total = questions.length;
    const passed = correctCount === total && total > 0;

    await supabase
      .from("attempts")
      .update({ passed, completed_at: new Date().toISOString() })
      .eq("id", attemptId);

    if (passed) {
      const badgeImageUrl = `${supabaseUrl}/storage/v1/object/public/badges/badge.png`;

      await supabase.from("badges").insert([
        {
          user_id: attempt.user_id,
          attempt_id: attemptId,
          image_url: badgeImageUrl,
          awarded_at: new Date().toISOString(),
        },
      ]);

      await supabase
        .from("attempts")
        .update({ badge_url: badgeImageUrl })
        .eq("id", attemptId);
    }

    return new Response(
      JSON.stringify({ passed, correct_count: correctCount, total }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
