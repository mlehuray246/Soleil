"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { StarPicker, StarDisplay } from "@/components/shared/StarPicker";

interface PrepSession {
  id: string;
  type: "case" | "behavioral" | "mental_math" | "framework" | "research";
  date: string;
  title: string;
  notes: string | null;
  confidence: number | null;
  created_at: string;
}

const CASE_TYPES = [
  "Market Sizing",
  "Profitability",
  "Market Entry",
  "M&A / Due Diligence",
  "Operations",
  "Growth Strategy",
  "Pricing",
  "Other",
];

const PEI_PROMPTS = [
  {
    id: "leadership",
    label: "Personal Impact / Leadership",
    prompt: "Tell me about a time you led a team through a difficult situation. What was the challenge, what did you do, and what was the result?",
  },
  {
    id: "teamwork",
    label: "Working in a Team",
    prompt: "Describe a time you had to collaborate with someone very different from you. How did you make it work?",
  },
  {
    id: "failure",
    label: "Failure & Learning",
    prompt: "Tell me about your greatest failure. What happened, what did you learn, and how have you applied that learning?",
  },
  {
    id: "achievement",
    label: "Personal Achievement",
    prompt: "What accomplishment are you most proud of? Why does it matter to you?",
  },
  {
    id: "entrepreneurial",
    label: "Entrepreneurial Drive",
    prompt: "Tell me about a time you identified an opportunity and pursued it — even without being asked. What drove you?",
  },
];

const FRAMEWORK_TOPICS = [
  "Issue Tree",
  "Profitability",
  "Market Sizing",
  "M&A / Due Diligence",
  "Operations",
];

// ── Case Log Tab ──────────────────────────────────────────────────────────────
function CaseLog({ sessions, onAdd, onDelete }: {
  sessions: PrepSession[];
  onAdd: (s: Partial<PrepSession>) => void;
  onDelete: (id: string) => void;
}) {
  const [caseType, setCaseType] = useState(CASE_TYPES[0]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [difficulty, setDifficulty] = useState(0);
  const [performance, setPerformance] = useState(0);
  const [notes, setNotes] = useState("");

  const cases = sessions.filter((s) => s.type === "case").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const submit = () => {
    if (!caseType) return;
    onAdd({
      type: "case",
      date,
      title: caseType,
      notes: `difficulty:${difficulty}|performance:${performance}|${notes}`,
      confidence: performance,
    });
    setNotes("");
    setDifficulty(0);
    setPerformance(0);
  };

  const parseDiff = (s: PrepSession) => {
    const m = s.notes?.match(/difficulty:(\d)/);
    return m ? parseInt(m[1]) : null;
  };
  const parsePerf = (s: PrepSession) => s.confidence;
  const parseNotes = (s: PrepSession) => s.notes?.replace(/difficulty:\d\|performance:\d\|/, "") ?? "";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Add form */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--accent)" }}>
          Log a case
        </p>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--muted-foreground)" }}>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--muted-foreground)" }}>Case type</label>
              <select value={caseType} onChange={(e) => setCaseType(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg outline-none"
                style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}>
                {CASE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "var(--muted-foreground)" }}>Difficulty</label>
              <StarPicker value={difficulty} onChange={setDifficulty} />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "var(--muted-foreground)" }}>My performance</label>
              <StarPicker value={performance} onChange={setPerformance} />
            </div>
          </div>
          <textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)}
            rows={2} className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none"
            style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
          <button onClick={submit}
            className="py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 hover:opacity-80 transition-opacity"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
            <Plus size={14} /> Log case
          </button>
        </div>
      </div>

      {/* Case history */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs tracking-widest uppercase" style={{ color: "var(--muted-foreground)" }}>
            History · {cases.length} sessions
          </p>
        </div>
        {cases.length === 0 ? (
          <p className="px-4 py-8 text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
            No cases logged yet.
          </p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {cases.map((s, i) => (
              <div key={s.id} className="flex items-start gap-3 px-4 py-3 group"
                style={{ borderBottom: i < cases.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--secondary)", color: "var(--primary)", fontSize: "10px" }}>
                      {s.title}
                    </span>
                    <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {new Date(s.date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-1">
                    {parseDiff(s) !== null && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs" style={{ color: "var(--muted-foreground)", fontSize: "9px" }}>diff</span>
                        <StarDisplay value={parseDiff(s)!} size={10} />
                      </div>
                    )}
                    {parsePerf(s) !== null && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs" style={{ color: "var(--muted-foreground)", fontSize: "9px" }}>perf</span>
                        <StarDisplay value={parsePerf(s)!} size={10} />
                      </div>
                    )}
                  </div>
                  {parseNotes(s) && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--muted-foreground)" }}>
                      {parseNotes(s)}
                    </p>
                  )}
                </div>
                <button onClick={() => onDelete(s.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5"
                  style={{ color: "var(--muted-foreground)" }}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── PEI Tab ───────────────────────────────────────────────────────────────────
function PEITab({ sessions, onSave }: {
  sessions: PrepSession[];
  onSave: (id: string | null, promptId: string, text: string, confidence: number) => void;
}) {
  const getAnswer = (promptId: string) =>
    sessions.find((s) => s.type === "behavioral" && s.title === promptId);

  return (
    <div className="flex flex-col gap-6">
      {PEI_PROMPTS.map((p) => {
        const existing = getAnswer(p.id);
        return (
          <PEICard
            key={p.id}
            prompt={p}
            existing={existing}
            onSave={(text, confidence) => onSave(existing?.id ?? null, p.id, text, confidence)}
          />
        );
      })}
    </div>
  );
}

function PEICard({ prompt, existing, onSave }: {
  prompt: typeof PEI_PROMPTS[0];
  existing: PrepSession | undefined;
  onSave: (text: string, confidence: number) => void;
}) {
  const [text, setText] = useState(existing?.notes ?? "");
  const [confidence, setConfidence] = useState(existing?.confidence ?? 0);
  const [saved, setSaved] = useState(false);

  const handleBlur = () => {
    if (text !== (existing?.notes ?? "")) {
      onSave(text, confidence);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    }
  };

  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <p className="text-xs tracking-wide uppercase mb-1"
            style={{ color: "var(--accent)", fontSize: "9px" }}>{prompt.label}</p>
          <p className="text-sm" style={{ color: "var(--foreground)" }}>{prompt.prompt}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <p className="text-xs" style={{ color: "var(--muted-foreground)", fontSize: "9px" }}>Confidence</p>
          <StarPicker value={confidence} onChange={(n) => { setConfidence(n); onSave(text, n); }} size={14} />
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        placeholder="Write your answer here... saves automatically when you click away."
        rows={4}
        className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none"
        style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}
      />
      {saved && (
        <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>Saved ✓</p>
      )}
    </div>
  );
}

// ── Mental Maths Tab ──────────────────────────────────────────────────────────
function MathsTab({ sessions, onAdd, onDelete }: {
  sessions: PrepSession[];
  onAdd: (s: Partial<PrepSession>) => void;
  onDelete: (id: string) => void;
}) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [score, setScore] = useState(0);
  const [notes, setNotes] = useState("");

  const maths = sessions
    .filter((s) => s.type === "mental_math")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recent = maths.slice(-14);

  const submit = () => {
    if (!score) return;
    onAdd({ type: "mental_math", date, title: "Mental Maths Session", notes, confidence: score });
    setScore(0); setNotes("");
  };

  // Sparkline SVG
  const SparkLine = () => {
    if (recent.length < 2) return null;
    const w = 200, h = 40, pad = 4;
    const points = recent.map((s, i) => {
      const x = pad + (i / (recent.length - 1)) * (w - pad * 2);
      const y = h - pad - ((s.confidence ?? 0) / 5) * (h - pad * 2);
      return `${x},${y}`;
    }).join(" ");
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {recent.map((s, i) => {
          const x = pad + (i / (recent.length - 1)) * (w - pad * 2);
          const y = h - pad - ((s.confidence ?? 0) / 5) * (h - pad * 2);
          return <circle key={i} cx={x} cy={y} r="2.5" fill="var(--accent)" />;
        })}
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--accent)" }}>Log session</p>
        <div className="flex flex-col gap-3">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg outline-none"
            style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
          <div>
            <p className="text-xs mb-1.5" style={{ color: "var(--muted-foreground)" }}>How did it go?</p>
            <StarPicker value={score} onChange={setScore} />
          </div>
          <input type="text" placeholder="Notes (optional)" value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg outline-none"
            style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }} />
          <button onClick={submit} disabled={!score}
            className="py-2 rounded-lg text-sm flex items-center justify-center gap-1.5 hover:opacity-80 disabled:opacity-40 transition-opacity"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
            <Plus size={14} /> Log
          </button>
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--muted-foreground)" }}>Progress</p>
        {recent.length > 1 && (
          <div className="mb-4">
            <SparkLine />
            <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>Last {recent.length} sessions</p>
          </div>
        )}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {[...maths].reverse().slice(0, 10).map((s, i) => (
            <div key={s.id} className="flex items-center justify-between group py-1"
              style={{ borderBottom: i < 9 ? "1px solid var(--border)" : "none" }}>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {new Date(s.date + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
                {s.confidence && <StarDisplay value={s.confidence} size={10} />}
              </div>
              <button onClick={() => onDelete(s.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--muted-foreground)" }}>
                <Trash2 size={11} />
              </button>
            </div>
          ))}
          {maths.length === 0 && (
            <p className="text-sm text-center py-4" style={{ color: "var(--muted-foreground)" }}>No sessions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Frameworks Tab ────────────────────────────────────────────────────────────
function FrameworksTab({ sessions, onSave }: {
  sessions: PrepSession[];
  onSave: (id: string | null, topic: string, notes: string) => void;
}) {
  const [topic, setTopic] = useState(FRAMEWORK_TOPICS[0]);
  const existing = sessions.find((s) => s.type === "framework" && s.title === topic);
  const [text, setText] = useState(existing?.notes ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setText(existing?.notes ?? "");
  }, [topic, existing?.notes]);

  const handleBlur = () => {
    onSave(existing?.id ?? null, topic, text);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap">
        {FRAMEWORK_TOPICS.map((t) => {
          const has = sessions.some((s) => s.type === "framework" && s.title === t && s.notes);
          return (
            <button key={t} onClick={() => setTopic(t)}
              className="text-sm px-4 py-2 rounded-full transition-all"
              style={{
                background: topic === t ? "var(--primary)" : "var(--secondary)",
                color: topic === t ? "var(--primary-foreground)" : "var(--muted-foreground)",
                border: has && topic !== t ? "1px solid var(--accent)" : "1px solid transparent",
              }}>
              {t}
              {has && topic !== t && <span className="ml-1.5 text-xs">●</span>}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl p-5" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>{topic}</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          placeholder={`Your ${topic} framework notes, diagrams, and examples...`}
          rows={12}
          className="w-full text-sm px-3 py-2 rounded-lg outline-none resize-none"
          style={{ background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--border)" }}
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Auto-saves on click away</p>
          {saved && <p className="text-xs" style={{ color: "var(--accent)" }}>Saved ✓</p>}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function InterviewPrepClient() {
  const [sessions, setSessions] = useState<PrepSession[]>([]);

  const load = () =>
    fetch("/api/interview-prep").then((r) => r.json()).then(({ items }) => setSessions(items ?? []));

  useEffect(() => { load(); }, []);

  const add = async (data: Partial<PrepSession>) => {
    await fetch("/api/interview-prep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: new Date().toISOString().split("T")[0], ...data }),
    });
    load();
  };

  const save = useCallback(async (id: string | null, title: string, notes: string, type: string, confidence?: number) => {
    if (id) {
      await fetch("/api/interview-prep", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes, confidence: confidence ?? null }),
      });
    } else {
      await fetch("/api/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, title, date: new Date().toISOString().split("T")[0], notes, confidence: confidence ?? null }),
      });
    }
    load();
  }, []);

  const del = async (id: string) => {
    await fetch("/api/interview-prep", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const totalSessions = sessions.filter((s) => s.type === "case" || s.type === "mental_math").length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          {totalSessions} sessions logged
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
      </div>

      <Tabs defaultValue="case">
        <TabsList className="mb-6" style={{ background: "var(--secondary)" }}>
          <TabsTrigger value="case">Case Log</TabsTrigger>
          <TabsTrigger value="behavioral">Behavioural (PEI)</TabsTrigger>
          <TabsTrigger value="maths">Mental Maths</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
        </TabsList>

        <TabsContent value="case">
          <CaseLog sessions={sessions} onAdd={add} onDelete={del} />
        </TabsContent>

        <TabsContent value="behavioral">
          <PEITab
            sessions={sessions}
            onSave={(id, promptId, text, confidence) =>
              save(id, promptId, text, "behavioral", confidence)
            }
          />
        </TabsContent>

        <TabsContent value="maths">
          <MathsTab sessions={sessions} onAdd={add} onDelete={del} />
        </TabsContent>

        <TabsContent value="frameworks">
          <FrameworksTab
            sessions={sessions}
            onSave={(id, topic, notes) => save(id, topic, notes, "framework")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
