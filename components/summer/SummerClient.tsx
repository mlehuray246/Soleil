"use client";

import { useEffect, useState } from "react";
import { ExternalLink, ChevronRight, CheckCircle2, Clock, ArrowRight, BookOpen, Film } from "lucide-react";
import CompleteModal from "@/components/shared/CompleteModal";
import { StarDisplay } from "@/components/shared/StarPicker";

interface SummerActivity {
  id: string;
  scheduled_date: string;
  pillar: "mind" | "culture" | "craft";
  type: string;
  title: string;
  description: string | null;
  source: string | null;
  url: string | null;
  duration_min: number | null;
  completed: boolean;
  completed_at: string | null;
  rating: number | null;
  feedback: string | null;
  moved_from: string | null;
}

interface FunMedia {
  id: string;
  type: "book" | "film";
  title: string;
  detail: string | null;
  status: "current" | "completed" | "suggested";
  sort_order: number;
  rating: number | null;
}

const PILLAR_COLOR: Record<string, string> = {
  mind: "var(--primary)",
  culture: "var(--accent)",
  craft: "#8A9E7A",
};

const PILLAR_BG: Record<string, string> = {
  mind: "#3D4A2E18",
  culture: "#C8962A18",
  craft: "#8A9E7A18",
};

const TYPE_ICON: Record<string, string> = {
  book: "📖",
  article: "📰",
  lecture: "🎓",
  documentary: "🎬",
  film: "🎞️",
  reflection: "✍️",
  writing: "📝",
};

const START_DATE = "2026-06-04";

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return toDateKey(d);
}

function formatDateLabel(dateStr: string, todayStr: string): string {
  if (dateStr === todayStr) return "Today";
  if (dateStr === addDays(todayStr, 1)) return "Tomorrow";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function currentWeek(): number {
  const start = new Date(START_DATE);
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return Math.max(1, Math.min(12, diff + 1));
}

// ── Activity Card ─────────────────────────────────────────────────────────────
function ActivityCard({
  activity: a,
  size,
  onComplete,
  onMove,
  isMissed,
}: {
  activity: SummerActivity;
  size: "large" | "small";
  onComplete: () => void;
  onMove?: () => void;
  isMissed?: boolean;
}) {
  const color = PILLAR_COLOR[a.pillar];
  const bg = PILLAR_BG[a.pillar];
  const icon = TYPE_ICON[a.type] ?? "📄";

  return (
    <div
      className="rounded-2xl flex flex-col gap-3 transition-all"
      style={{
        background: a.completed ? "var(--secondary)" : "var(--card)",
        border: `1px solid ${a.completed ? "var(--border)" : color}40`,
        padding: size === "large" ? "16px" : "12px",
        minHeight: size === "large" ? "180px" : "auto",
        opacity: a.completed ? 0.75 : 1,
      }}
    >
      {/* Badges row */}
      <div className="flex gap-1.5 flex-wrap items-center">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium tracking-wide uppercase"
          style={{ background: color, color: "var(--primary-foreground)", fontSize: "9px" }}
        >
          {a.pillar}
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: bg, color: color, fontSize: "9px" }}
        >
          {icon} {a.type}
        </span>
        {a.moved_from && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "#FEF3C7", color: "#92400E", fontSize: "9px" }}
          >
            moved
          </span>
        )}
        {isMissed && (
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: "#FEE2E2", color: "#991B1B", fontSize: "9px" }}
          >
            missed
          </span>
        )}
      </div>

      {/* Title + source */}
      <div className="flex-1">
        {a.url && !a.completed ? (
          <a
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium leading-snug hover:opacity-70 transition-opacity"
            style={{
              color: "var(--foreground)",
              fontSize: size === "large" ? "14px" : "13px",
              display: "block",
            }}
          >
            {a.title}
          </a>
        ) : (
          <p
            className="font-medium leading-snug"
            style={{
              color: "var(--foreground)",
              fontSize: size === "large" ? "14px" : "13px",
              textDecoration: a.completed ? "line-through" : "none",
            }}
          >
            {a.title}
          </p>
        )}

        {a.source && (
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {a.source}
          </p>
        )}
        {size === "large" && a.description && (
          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            {a.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {a.duration_min && (
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
              <Clock size={10} />
              {a.duration_min} min
            </span>
          )}
          {a.url && (
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 text-xs hover:opacity-70 transition-opacity"
              style={{ color: color }}
            >
              <ExternalLink size={10} /> Open
            </a>
          )}
        </div>

        {a.completed ? (
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={13} style={{ color }} />
            {a.rating && <StarDisplay value={a.rating} size={11} />}
          </div>
        ) : (
          <div className="flex gap-1.5">
            {onMove && isMissed && (
              <button
                onClick={onMove}
                className="text-xs px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity"
                style={{ background: "#FEF3C7", color: "#92400E" }}
              >
                Move to tomorrow
              </button>
            )}
            <button
              onClick={onComplete}
              className="text-xs px-3 py-1 rounded-full hover:opacity-80 transition-opacity"
              style={{ background: color, color: "var(--primary-foreground)" }}
            >
              Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── For Fun Sidebar ───────────────────────────────────────────────────────────
function FunSidebar({
  items,
  onComplete,
}: {
  items: FunMedia[];
  onComplete: (item: FunMedia) => void;
}) {
  const currentBook = items.find((i) => i.type === "book" && i.status === "current");
  const currentFilm = items.find((i) => i.type === "film" && i.status === "current");
  const nextBook = items.find((i) => i.type === "book" && i.status === "suggested");
  const nextFilm = items.find((i) => i.type === "film" && i.status === "suggested");

  const FunCard = ({ item, next }: { item: FunMedia | undefined; next: FunMedia | undefined }) => {
    if (!item) return null;
    const isBook = item.type === "book";
    return (
      <div
        className="rounded-xl p-3"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-1.5 mb-2">
          {isBook ? (
            <BookOpen size={12} style={{ color: "var(--accent)" }} />
          ) : (
            <Film size={12} style={{ color: "var(--accent)" }} />
          )}
          <span className="text-xs tracking-wide uppercase" style={{ color: "var(--accent)", fontSize: "9px" }}>
            {isBook ? "Reading" : "Watching"}
          </span>
        </div>
        <p className="text-sm font-medium leading-snug mb-0.5" style={{ color: "var(--foreground)" }}>
          {item.title}
        </p>
        {item.detail && (
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{item.detail}</p>
        )}
        <button
          onClick={() => onComplete(item)}
          className="mt-2 text-xs w-full py-1.5 rounded-lg hover:opacity-80 transition-opacity"
          style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}
        >
          Mark as finished ✓
        </button>
        {next && (
          <div className="mt-2 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs mb-0.5" style={{ color: "var(--muted-foreground)", fontSize: "9px" }}>Up next</p>
            <div className="flex items-center gap-1">
              <ArrowRight size={10} style={{ color: "var(--muted-foreground)" }} />
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>{next.title}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <p
        className="text-xs tracking-widest uppercase"
        style={{ color: "var(--muted-foreground)" }}
      >
        For Fun
      </p>
      <FunCard item={currentBook} next={nextBook} />
      <FunCard item={currentFilm} next={nextFilm} />
    </div>
  );
}

// ── Main Client ───────────────────────────────────────────────────────────────
export default function SummerClient() {
  const [activities, setActivities] = useState<SummerActivity[]>([]);
  const [funItems, setFunItems] = useState<FunMedia[]>([]);
  const [completing, setCompleting] = useState<SummerActivity | null>(null);
  const [completingFun, setCompletingFun] = useState<FunMedia | null>(null);

  const today = toDateKey(new Date());

  const load = async () => {
    const res = await fetch("/api/summer");
    const { activities } = await res.json();
    setActivities(activities ?? []);
  };

  const loadFun = async () => {
    const res = await fetch("/api/fun-media");
    const { items } = await res.json();
    setFunItems(items ?? []);
  };

  useEffect(() => {
    const init = async () => {
      // Only seed if the table is completely empty — never wipe existing data
      await fetch("/api/summer/seed", { method: "POST" });
      await fetch("/api/fun-media/seed", { method: "POST" });
      await load();
      await loadFun();
    };
    init();
  }, []);

  const complete = async (activity: SummerActivity, rating: number, feedback?: string) => {
    await fetch("/api/summer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: activity.id,
        completed: true,
        completed_at: new Date().toISOString(),
        rating,
        feedback: feedback ?? null,
      }),
    });
    setCompleting(null);
    load();
  };

  const moveToTomorrow = async (activity: SummerActivity) => {
    const tomorrow = addDays(today, 1);
    await fetch("/api/summer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: activity.id,
        scheduled_date: tomorrow,
        moved_from: activity.moved_from ?? activity.scheduled_date,
      }),
    });
    load();
  };

  const completeFun = async (item: FunMedia, rating: number) => {
    await fetch("/api/fun-media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: item.id,
        status: "completed",
        completed_at: new Date().toISOString(),
        rating,
      }),
    });
    setCompletingFun(null);
    loadFun();
  };

  // Separate missed and current window
  const missed = activities.filter((a) => a.scheduled_date < today && !a.completed);
  const todayActs = activities.filter((a) => a.scheduled_date === today);

  // Build 7-day window (today+1 through today+6)
  const dayWindow = Array.from({ length: 6 }, (_, i) => addDays(today, i + 1));
  const upcomingByDay = dayWindow.map((date) => ({
    date,
    items: activities.filter((a) => a.scheduled_date === date),
  }));

  // Week progress
  const week = currentWeek();
  const weekStart = addDays(START_DATE, (week - 1) * 7);
  const weekEnd = addDays(weekStart, 6);
  const weekActs = activities.filter(
    (a) => a.scheduled_date >= weekStart && a.scheduled_date <= weekEnd
  );
  const weekDone = weekActs.filter((a) => a.completed).length;

  // Pillars for today
  const pillars: Array<"mind" | "culture" | "craft"> = ["mind", "culture", "craft"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8">
      {/* Main column */}
      <div>
        {/* Week progress bar */}
        <div
          className="rounded-xl p-4 mb-6"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="text-lg"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)", fontWeight: 500 }}
            >
              Week {week} of 12
            </span>
            <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {weekDone}/{weekActs.length} this week
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--border)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${weekActs.length > 0 ? (weekDone / weekActs.length) * 100 : 0}%`,
                background: "var(--accent)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="h-1 flex-1 mx-0.5 rounded-full"
                style={{
                  background: i + 1 < week ? "var(--accent)" : i + 1 === week ? "var(--primary)" : "var(--border)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Missed activities */}
        {missed.length > 0 && (
          <div
            className="rounded-xl p-4 mb-5"
            style={{ background: "#FEF9F0", border: "1px solid #FDE68A" }}
          >
            <p
              className="text-xs font-medium mb-3 tracking-wide"
              style={{ color: "#92400E" }}
            >
              {missed.length} missed {missed.length === 1 ? "activity" : "activities"} — move them to keep your streak going
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {missed.map((a) => (
                <ActivityCard
                  key={a.id}
                  activity={a}
                  size="small"
                  onComplete={() => setCompleting(a)}
                  onMove={() => moveToTomorrow(a)}
                  isMissed
                />
              ))}
            </div>
          </div>
        )}

        {/* TODAY */}
        <div className="mb-6">
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: "var(--accent)" }}
          >
            Today
          </p>
          {todayActs.length === 0 ? (
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                No activities scheduled for today — rest well, or catch up on any missed items.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pillars.map((pillar) => {
                const act = todayActs.find((a) => a.pillar === pillar);
                return act ? (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    size="large"
                    onComplete={() => setCompleting(act)}
                  />
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Upcoming 6 days */}
        <div>
          {upcomingByDay.map(({ date, items }) => {
            if (items.length === 0) return null;
            return (
              <div key={date} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <p
                    className="text-xs tracking-wide"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {formatDateLabel(date, today)}
                  </p>
                  <div
                    className="flex-1 h-px"
                    style={{ background: "var(--border)" }}
                  />
                </div>
                <div
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                  style={{ opacity: 0.65 }}
                >
                  {pillars.map((pillar) => {
                    const act = items.find((a) => a.pillar === pillar);
                    return act ? (
                      <ActivityCard
                        key={act.id}
                        activity={act}
                        size="small"
                        onComplete={() => setCompleting(act)}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            );
          })}

          {/* Coming soon indicator */}
          <div
            className="rounded-xl p-4 text-center mt-4"
            style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-center gap-2">
              <ChevronRight size={13} style={{ color: "var(--muted-foreground)" }} />
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                Activities revealed 7 days ahead — check back soon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* For Fun sidebar */}
      <div>
        <FunSidebar
          items={funItems}
          onComplete={(item) => setCompletingFun(item)}
        />
      </div>

      {/* Complete modal — curriculum */}
      {completing && (
        <CompleteModal
          title="Mark as complete"
          subtitle={completing.title}
          showFeedback
          feedbackPlaceholder="What did you think? (optional)"
          onConfirm={(rating, feedback) => complete(completing, rating, feedback)}
          onClose={() => setCompleting(null)}
        />
      )}

      {/* Complete modal — for fun */}
      {completingFun && (
        <CompleteModal
          title={completingFun.type === "book" ? "Finished reading?" : "Just watched?"}
          subtitle={completingFun.title}
          showFeedback={false}
          confirmLabel="Mark as finished"
          onConfirm={(rating) => completeFun(completingFun, rating)}
          onClose={() => setCompletingFun(null)}
        />
      )}
    </div>
  );
}
