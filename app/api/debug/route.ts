import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const USER_ID = "marthaleh@icloud.com";

export async function GET() {
  const results: Record<string, unknown> = {};

  // 1. Test todos insert with real user_id
  const { data: todo, error: todoErr } = await supabaseAdmin
    .from("todos")
    .insert({ user_id: USER_ID, text: "debug test", completed: false, due_date: null })
    .select().single();
  results.todoInsert = todoErr ? { error: todoErr.message, code: todoErr.code } : { ok: true, id: todo?.id };
  if (todo?.id) await supabaseAdmin.from("todos").delete().eq("id", todo.id);

  // 2. Test todos select with real user_id
  const { data: todos, error: todosErr } = await supabaseAdmin
    .from("todos").select("*").eq("user_id", USER_ID);
  results.todoSelect = todosErr ? { error: todosErr.message } : { count: todos?.length };

  // 3. Test wellness insert
  const { data: well, error: wellErr } = await supabaseAdmin
    .from("wellness")
    .insert({ user_id: USER_ID, type: "workout", date: "2026-06-01", label: "Gym", notes: "" })
    .select().single();
  results.wellnessInsert = wellErr ? { error: wellErr.message, code: wellErr.code, details: wellErr.details } : { ok: true, id: well?.id };
  if (well?.id) await supabaseAdmin.from("wellness").delete().eq("id", well.id);

  // 4. Test goals insert
  const { data: goal, error: goalErr } = await supabaseAdmin
    .from("goals")
    .insert({ user_id: USER_ID, text: "debug", horizon: "short", completed: false })
    .select().single();
  results.goalsInsert = goalErr ? { error: goalErr.message, code: goalErr.code } : { ok: true, id: goal?.id };
  if (goal?.id) await supabaseAdmin.from("goals").delete().eq("id", goal.id);

  return NextResponse.json(results);
}
