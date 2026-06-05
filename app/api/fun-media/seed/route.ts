import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const USER_ID = "marthaleh@icloud.com";

const SEED = [
  { type: "book", title: "The Kite Runner", detail: "Khaled Hosseini", status: "current", sort_order: 0 },
  { type: "film", title: "Into the Wild", detail: "Sean Penn, 2007", status: "current", sort_order: 0 },
  { type: "book", title: "Normal People", detail: "Sally Rooney", status: "suggested", sort_order: 1 },
  { type: "book", title: "A Gentleman in Moscow", detail: "Amor Towles", status: "suggested", sort_order: 2 },
  { type: "book", title: "Station Eleven", detail: "Emily St. John Mandel", status: "suggested", sort_order: 3 },
  { type: "book", title: "Pachinko", detail: "Min Jin Lee", status: "suggested", sort_order: 4 },
  { type: "book", title: "Homegoing", detail: "Yaa Gyasi", status: "suggested", sort_order: 5 },
  { type: "film", title: "180 South", detail: "Jeff Johnson, 2010", status: "suggested", sort_order: 1 },
  { type: "film", title: "Knives Out", detail: "Rian Johnson, 2019", status: "suggested", sort_order: 2 },
  { type: "film", title: "Everything Everywhere All at Once", detail: "Daniels, 2022", status: "suggested", sort_order: 3 },
  { type: "film", title: "Marriage Story", detail: "Noah Baumbach, 2019", status: "suggested", sort_order: 4 },
  { type: "film", title: "Nomadland", detail: "Chloé Zhao, 2020", status: "suggested", sort_order: 5 },
];

export async function POST() {
  const { data: existing } = await supabaseAdmin
    .from("fun_media")
    .select("id")
    .eq("user_id", USER_ID)
    .limit(1);

  if (existing && existing.length > 0) {
    return NextResponse.json({ message: "Already seeded — skipped." });
  }

  const { data, error } = await supabaseAdmin
    .from("fun_media")
    .insert(SEED.map((s) => ({ ...s, user_id: USER_ID })))
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ seeded: data?.length });
}
