import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const USER_ID = "marthaleh@icloud.com";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "workout";

  const { data } = await supabaseAdmin
    .from("wellness")
    .select("*")
    .eq("user_id", USER_ID)
    .eq("type", type)
    .order("date", { ascending: false })
    .limit(90);

  return NextResponse.json({ entries: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin
    .from("wellness")
    .insert({ ...body, user_id: USER_ID })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ entry: data });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await supabaseAdmin.from("wellness").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
