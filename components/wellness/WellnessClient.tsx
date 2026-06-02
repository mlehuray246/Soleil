"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Plus } from "lucide-react";

interface WellnessEntry {
  id: string;
  type: "workout" | "cycle";
  date: string;
  label: string;
  notes: string;
  duration_min?: number;
  phase?: string;
}

const WORKOUT_TYPES = [
  { label: "Field Hockey Practice", color: "#4A7C59", bg: "#4A7C5928" },
  { label: "Field Hockey Game",     color: "#2D5A3D", bg: "#2D5A3D28" },
  { label: "Gym",                   color: "#C8962A", bg: "#C8962A28" },
  { label: "Run",                   color: "#B5654A", bg: "#B5654A28" },
  { label: "Yoga",                  color: "#7B9E87", bg: "#7B9E8728" },
  { label: "Rest",                  color: "#9E8E7A", bg: "#9E8E7A28" },
  { label: "Other",                 color: "#6B5E4A", bg: "#6B5E4A28" },
];

const PERIOD_COLOR = "#C45C8A";
const PERIOD_BG    = "#C45C8A22";

function getWorkoutStyle(label: string) {
  return WORKOUT_TYPES.find((w) => w.label === label) ?? WORKOUT_TYPES[WORKOUT_TYPES.length - 1];
}

function normaliseDate(raw: string): string {
  return (raw ?? "").slice(0, 10);
}

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// ── Day modal ────────────────────────────────────────────────────────────────
interface DayModalProps {
  date: { year: number; month: number; day: number };
  initialEntries: WellnessEntry[];
  onClose: () => void;
  onRefresh: () => void;
}

function DayModal({ date, initialEntries, onClose, onRefresh }: DayModalProps) {
  const [entries, setEntries] = useState<WellnessEntry[]>(initialEntries);
  const [workoutLabel, setWorkoutLabel] = useState(WORKOUT_TYPES[0].label);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [adding, setAdding] = useState<"workout" | "cycle" | null>(null);
  const [saving, setSaving] = useState(false);

  const dateKey = toDateKey(date.year, date.month, date.day);
  const displayDate = new Date(date.year, date.month, date.day).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long",
  });
  const hasPeriod = entries.some((e) => e.type === "cycle");

  const handleAddWorkout = async () => {
    setSaving(true);
    const payload = { type: "workout", date: dateKey, label: workoutLabel, duration_min: duration ? Number(duration) : undefined, notes };
    const res = await fetch("/api/wellness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.entry) {
      setEntries((prev) => [...prev, { ...json.entry, date: normaliseDate(json.entry.date) }]);
      onRefresh();
    } else {
      console.error("Wellness POST error:", json);
    }
    setDuration(""); setNotes(""); setAdding(null); setSaving(false);
  };

  const handleAddPeriod = async () => {
    setSaving(true);
    const payload = { type: "cycle", date: dateKey, label: "Period", phase: "Menstrual", notes };
    const res = await fetch("/api/wellness", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (json.entry) {
      setEntries((prev) => [...prev, { ...json.entry, date: normaliseDate(json.entry.date) }]);
      onRefresh();
    } else {
      console.error("Wellness POST error:", json);
    }
    setNotes(""); setAdding(null); setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    await fetch("/api/wellness", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(44,36,22,0.45)", backdropFilter: "blur(4px)" }} />
      <div
        className="relative rounded-2xl p-6 w-full max-w-sm shadow-xl"
        style={{ background: "var(--card)", border: "1px solid var(--border)", zIndex: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl" style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)", fontWeight: 500 }}>
            {displayDate}
          </h3>
          <button onClick={onClose} style={{ color: "var(--muted-foreground)" }}><X size={16} /></button>
        </div>

        {entries.length > 0 && (
          <div className="mb-4 space-y-2">
            {entries.map((e) => {
              const isP = e.type === "cycle";
              const s = isP ? { color: PERIOD_COLOR, bg: PERIOD_BG } : getWorkoutStyle(e.label);
              return (
                <div key={e.id} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: s.bg }}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium" style={{ color: s.color }}>{e.label}</span>
                    {e.duration_min && <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>{e.duration_min} min</span>}
                  </div>
                  <button onClick={() => handleDelete(e.id)} className="hover:opacity-60 ml-2" style={{ color: "var(--muted-foreground)" }}>
                    <X size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {!adding && (
          <div className="flex gap-2">
            <button onClick={() => setAdding("workout")}
              className="flex-1 py-2 rounded-lg text-xs flex items-center justify-center gap-1 hover:opacity-80 transition-opacity"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
              <Plus size={12} /> Add workout
            </button>
            {!hasPeriod && (
              <button onClick={() => setAdding("cycle")}
                className="flex-1 py-2 rounded-lg text-xs flex items-center justify-center gap-1 hover:opacity-80 transition-opacity"
                style={{ background: PERIOD_BG, color: PERIOD_COLOR, border: `1px solid ${PERIOD_COLOR}50` }}>
                <Plus size={12} /> Period day
              </button>
            )}
          </div>
        )}

        {adding === "workout" && (
          <div className="space-y-2">
            <select value={workoutLabel} onChange={(e) => setWorkoutLabel(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none"
              style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
              {WORKOUT_TYPES.map((w) => <option key={w.label}>{w.label}</option>)}
            </select>
            <input type="number" placeholder="Duration (min)" value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none"
              style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            <input type="text" placeholder="Notes (optional)" value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none"
              style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            <div className="flex gap-2">
              <button onClick={() => setAdding(null)} className="flex-1 py-2 rounded-lg text-xs"
                style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>Cancel</button>
              <button onClick={handleAddWorkout} disabled={saving}
                className="flex-1 py-2 rounded-lg text-xs hover:opacity-80 disabled:opacity-50"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        )}

        {adding === "cycle" && (
          <div className="space-y-2">
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>Mark this as a period day.</p>
            <input type="text" placeholder="Notes (optional)" value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg outline-none"
              style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            <div className="flex gap-2">
              <button onClick={() => setAdding(null)} className="flex-1 py-2 rounded-lg text-xs"
                style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>Cancel</button>
              <button onClick={handleAddPeriod} disabled={saving}
                className="flex-1 py-2 rounded-lg text-xs hover:opacity-80 disabled:opacity-50"
                style={{ background: PERIOD_COLOR, color: "#fff" }}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main calendar ────────────────────────────────────────────────────────────
export default function WellnessClient() {
  const [entries, setEntries] = useState<WellnessEntry[]>([]);
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState<{ year: number; month: number; day: number } | null>(null);

  const load = async () => {
    const [w, c] = await Promise.all([
      fetch("/api/wellness?type=workout").then((r) => r.json()),
      fetch("/api/wellness?type=cycle").then((r) => r.json()),
    ]);
    const all = [...(w.entries ?? []), ...(c.entries ?? [])].map((e: WellnessEntry) => ({
      ...e, date: normaliseDate(e.date),
    }));
    setEntries(all);
  };

  useEffect(() => { load(); }, []);

  const year  = current.getFullYear();
  const month = current.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const entriesForDay = (day: number) => {
    const key = toDateKey(year, month, day);
    return entries.filter((e) => e.date === key);
  };

  const monthName = current.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  return (
    <div>
      {/* Legend */}
      <div className="rounded-2xl p-4 mb-6 flex flex-wrap gap-x-5 gap-y-3"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        {WORKOUT_TYPES.map((w) => (
          <div key={w.label} className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm" style={{ background: w.color }} />
            <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{w.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-sm" style={{ background: PERIOD_COLOR }} />
          <span className="text-xs font-medium" style={{ color: "var(--foreground)" }}>Period</span>
        </div>
      </div>

      {/* Calendar — first design: rounded cells, dot indicators */}
      <div className="rounded-2xl p-6" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light" style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}>
            {monthName}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setCurrent(new Date(year, month - 1, 1))}
              className="p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors"
              style={{ color: "var(--muted-foreground)" }}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setCurrent(new Date(year, month + 1, 1))}
              className="p-1.5 rounded-lg hover:bg-[var(--secondary)] transition-colors"
              style={{ color: "var(--muted-foreground)" }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="text-center text-xs py-1" style={{ color: "var(--muted-foreground)" }}>{d}</div>
          ))}
        </div>

        {/* Day cells — original rounded style */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dayEntries = entriesForDay(day);
            const isToday    = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const hasPeriod  = dayEntries.some((e) => e.type === "cycle");
            const workouts   = dayEntries.filter((e) => e.type === "workout");

            return (
              <button
                key={day}
                onClick={() => setSelected({ year, month, day })}
                className="flex flex-col items-center py-1.5 px-1 rounded-xl transition-all hover:opacity-80 w-full"
                style={{
                  minHeight: "72px",
                  background: hasPeriod
                    ? PERIOD_BG
                    : isToday
                    ? "#8A9E7A"   // mellow sage green instead of deep olive
                    : "var(--card)",
                  border: hasPeriod
                    ? `1.5px solid ${PERIOD_COLOR}60`
                    : isToday
                    ? "1.5px solid #8A9E7A"
                    : "1px solid var(--border)",
                }}
              >
                {/* Day number */}
                <span
                  className="text-xs font-medium mb-1"
                  style={{
                    color: isToday
                      ? "#fff"
                      : hasPeriod
                      ? PERIOD_COLOR
                      : "var(--foreground)",
                  }}
                >
                  {day}
                </span>

                {/* Workout previews — dot + short label */}
                <div className="flex flex-col gap-0.5 w-full">
                  {workouts.slice(0, 2).map((e) => {
                    const s = getWorkoutStyle(e.label);
                    const shortLabel = e.label
                      .replace("Field Hockey Practice", "FH Practice")
                      .replace("Field Hockey Game", "FH Game");
                    return (
                      <div
                        key={e.id}
                        className="flex items-center gap-1 px-1 rounded w-full"
                        style={{ background: s.bg }}
                      >
                        <div
                          className="rounded-full flex-shrink-0"
                          style={{ width: "6px", height: "6px", background: s.color }}
                        />
                        <span
                          className="truncate"
                          style={{ fontSize: "8px", color: s.color, fontWeight: 600, lineHeight: "14px" }}
                        >
                          {shortLabel}
                        </span>
                      </div>
                    );
                  })}
                  {workouts.length > 2 && (
                    <span className="text-center" style={{ fontSize: "8px", color: "var(--muted-foreground)" }}>
                      +{workouts.length - 2} more
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selected && (
        <DayModal
          date={selected}
          initialEntries={entriesForDay(selected.day)}
          onClose={() => { setSelected(null); load(); }}
          onRefresh={load}
        />
      )}
    </div>
  );
}
