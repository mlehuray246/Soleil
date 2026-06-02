import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const USER_ID = "marthaleh@icloud.com";

// Pre-populated goals from Notion Personal Life OS
const SEED_GOALS = [
  { text: "Ace McKinsey interview", horizon: "short", completed: false, target_date: "2026-09-01" },
  { text: "Harvard Summer School Proctor", horizon: "short", completed: false, target_date: "2026-08-01" },
  { text: "Secure Summer 2027 internship (biotech / consulting / PE / fintech / non-profit)", horizon: "medium", completed: false, target_date: "2027-06-01" },
  { text: "Define company thesis", horizon: "medium", completed: false, target_date: null },
  { text: "Start a socially-driven company", horizon: "long", completed: false, target_date: null },
];

export async function POST() {
  // Only seed if goals table is empty for this user
  const { data: existing } = await supabaseAdmin
    .from("goals")
    .select("id")
    .eq("user_id", USER_ID)
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ message: "Goals already exist — skipped." });
  }

  const { data, error } = await supabaseAdmin
    .from("goals")
    .insert(SEED_GOALS.map((g) => ({ ...g, user_id: USER_ID })))
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ seeded: data?.length });
}
