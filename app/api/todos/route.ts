import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const USER_ID = "marthaleh@icloud.com";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("todos")
    .select("*")
    .eq("user_id", USER_ID)
    .order("due_date", { ascending: true, nullsFirst: false });

  if (error) return NextResponse.json({ todos: [] });
  return NextResponse.json({ todos: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from("todos")
    .insert({ ...body, user_id: USER_ID })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ todo: data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  const { data, error } = await supabaseAdmin
    .from("todos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ todo: data });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await supabaseAdmin.from("todos").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
