"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";

interface Goal {
  id: string;
  text: string;
  horizon: "short" | "medium" | "long";
  completed: boolean;
  target_date: string | null;
}

const horizons: { key: Goal["horizon"]; label: string; subtitle: string }[] = [
  { key: "short", label: "Near-term", subtitle: "This year" },
  { key: "medium", label: "Medium-term", subtitle: "1–3 years" },
  { key: "long", label: "Long-term", subtitle: "3+ years" },
];

function GoalColumn({
  horizon,
  label,
  subtitle,
  goals,
  onAdd,
  onToggle,
  onDelete,
}: {
  horizon: Goal["horizon"];
  label: string;
  subtitle: string;
  goals: Goal[];
  onAdd: (text: string, date: string) => void;
  onToggle: (goal: Goal) => void;
  onDelete: (id: string) => void;
}) {
  const [text, setText] = useState("");
  const [date, setDate] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onAdd(text, date);
    setText("");
    setDate("");
  };

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="mb-2">
        <h2
          className="text-2xl font-light"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}
        >
          {label}
        </h2>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {subtitle}
        </p>
      </div>

      <div className="space-y-3 flex-1">
        {goals.map((g) => (
          <div key={g.id} className="flex items-start gap-2 group">
            <button onClick={() => onToggle(g)} className="mt-0.5 flex-shrink-0">
              {g.completed ? (
                <CheckCircle2 size={15} style={{ color: "var(--accent)" }} />
              ) : (
                <Circle size={15} style={{ color: "var(--border)" }} />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm leading-snug"
                style={{
                  color: g.completed ? "var(--muted-foreground)" : "var(--foreground)",
                  textDecoration: g.completed ? "line-through" : "none",
                }}
              >
                {g.text}
              </p>
              {g.target_date && (
                <p className="text-xs mt-0.5" style={{ color: "var(--accent)" }}>
                  {new Date(g.target_date).toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
            <button
              onClick={() => onDelete(g.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
              style={{ color: "var(--muted-foreground)" }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        {goals.length === 0 && (
          <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            No goals yet — add one below.
          </p>
        )}
      </div>

      <div
        className="pt-4 border-t flex flex-col gap-2"
        style={{ borderColor: "var(--border)" }}
      >
        <input
          type="text"
          placeholder="Add a goal..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full text-sm px-3 py-2 rounded-lg outline-none"
          style={{
            background: "var(--secondary)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          }}
        />
        <div className="flex gap-2">
          <input
            type="month"
            value={date}
            onChange={(e) => setDate(e.target.value ? e.target.value + "-01" : "")}
            className="flex-1 text-xs px-3 py-1.5 rounded-lg outline-none"
            style={{
              background: "var(--secondary)",
              color: "var(--muted-foreground)",
              border: "1px solid var(--border)",
            }}
          />
          <button
            onClick={submit}
            className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            <Plus size={12} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function GoalsClient() {
  const [goals, setGoals] = useState<Goal[]>([]);

  const load = () =>
    fetch("/api/goals")
      .then((r) => r.json())
      .then(({ goals }) => setGoals(goals ?? []));

  useEffect(() => {
    // Seed from Notion on first visit, then load
    fetch("/api/goals/seed", { method: "POST" }).finally(() => load());
  }, []);

  const add = async (horizon: Goal["horizon"], text: string, date: string) => {
    await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, horizon, completed: false, target_date: date || null }),
    });
    load();
  };

  const toggle = async (goal: Goal) => {
    await fetch("/api/goals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: goal.id, completed: !goal.completed }),
    });
    load();
  };

  const del = async (id: string) => {
    await fetch("/api/goals", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {horizons.map((h) => (
        <GoalColumn
          key={h.key}
          horizon={h.key}
          label={h.label}
          subtitle={h.subtitle}
          goals={goals.filter((g) => g.horizon === h.key)}
          onAdd={(text, date) => add(h.key, text, date)}
          onToggle={toggle}
          onDelete={del}
        />
      ))}
    </div>
  );
}
