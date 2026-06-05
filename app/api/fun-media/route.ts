import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const USER_ID = "marthaleh@icloud.com";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("fun_media")
    .select("*")
    .eq("user_id", USER_ID)
    .order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  const { data, error } = await supabaseAdmin
    .from("fun_media")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // If completing a current item, promote the next suggested of same type to current
  if (updates.status === "completed") {
    const completed = data as { type: string };
    const { data: next } = await supabaseAdmin
      .from("fun_media")
      .select("id")
      .eq("user_id", USER_ID)
      .eq("type", completed.type)
      .eq("status", "suggested")
      .order("sort_order", { ascending: true })
      .limit(1)
      .single();
    if (next) {
      await supabaseAdmin
        .from("fun_media")
        .update({ status: "current" })
        .eq("id", next.id);
    }
  }

  return NextResponse.json({ item: data });
}
