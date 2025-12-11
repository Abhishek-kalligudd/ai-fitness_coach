// app/api/save-plan/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(req: Request) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ error: "Not authenticated: missing token" }, { status: 401 });
    }

    const body = await req.json();

    // basic validation
    if (!body.plan_json) {
      return NextResponse.json({ error: "Missing plan_json in body" }, { status: 400 });
    }

    // create Supabase client that will send the user's JWT with requests
    const supabaseForUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    // call RPC
    const { data, error } = await supabaseForUser.rpc("save_plan", {
      p_title: body.title,
      p_plan_markdown: body.plan_markdown,
      p_plan_json: body.plan_json,
      p_intro: body.intro,
      p_tips: body.tips,
    });

    if (error) {
      // return rich error to help debugging
      console.error("Supabase RPC error:", error);
      return NextResponse.json(
        { error: error.message, details: error.details ?? null, hint: error.hint ?? null },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, plan: data }, { status: 200 });
  } catch (err: any) {
    console.error("Unhandled save-plan error:", err);
    return NextResponse.json(
      { error: "Server error", message: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
