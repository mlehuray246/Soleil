import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const USER_ID = "marthaleh@icloud.com";

export async function GET() {
  const { data } = await supabaseAdmin
    .from("goals")
    .select("*")
    .eq("user_id", USER_ID)
    .order("created_at", { ascending: true });

  return NextResponse.json({ goals: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from("goals")
    .insert({ ...body, user_id: USER_ID })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ goal: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  const { data, error } = await supabaseAdmin
    .from("goals")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ goal: data });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await supabaseAdmin.from("goals").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
