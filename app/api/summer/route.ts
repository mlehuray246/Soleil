import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const USER_ID = "marthaleh@icloud.com";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

export async function GET() {
  const today = todayStr();
  const windowEnd = addDays(today, 6);

  // Fetch: missed (past + incomplete) + window (today → +6)
  const { data, error } = await supabaseAdmin
    .from("summer_activities")
    .select("*")
    .eq("user_id", USER_ID)
    .or(
      `and(scheduled_date.lt.${today},completed.eq.false),and(scheduled_date.gte.${today},scheduled_date.lte.${windowEnd})`
    )
    .order("scheduled_date", { ascending: true })
    .order("pillar", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ activities: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from("summer_activities")
    .insert({ ...body, user_id: USER_ID })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ activity: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  const { data, error } = await supabaseAdmin
    .from("summer_activities")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ activity: data });
}
