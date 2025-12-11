// lib/planService.ts
import { supabase } from "@/lib/supabaseClient";

export interface SavePlanInput {
  title: string;
  plan_markdown: string;
  plan_json: any;
  intro: string;
  tips: string;
}

export async function savePlanWithToken(token: string, input: SavePlanInput) {
  const client = supabase; // safe because we pass token manually in API route

  const { data, error } = await client.rpc("save_plan", {
    p_title: input.title,
    p_plan_markdown: input.plan_markdown,
    p_plan_json: input.plan_json,
    p_intro: input.intro,
    p_tips: input.tips,
  });

  if (error) throw error;
  return data;
}
