"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, X, Star, CheckCircle2, Circle } from "lucide-react";
import { BOOK_RECS, SHOW_RECS, sample } from "./recommendations";

interface MediaItem {
  id: string;
  type: "book" | "show";
  title: string;
  detail: string;
  completed: boolean;
  completed_at: string | null;
  rating: number | null;
  created_at: string;
}

// ── Star rating picker ────────────────────────────────────────────────────────
function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
        >
          <Star
            size={16}
            fill={(hover || value) >= n ? "var(--accent)" : "none"}
            stroke={(hover || value) >= n ? "var(--accent)" : "var(--border)"}
          />
        </button>
      ))}
    </div>
  );
}

// ── Complete modal ────────────────────────────────────────────────────────────
function CompleteModal({ item, onConfirm, onClose }: {
  item: MediaItem;
  onConfirm: (rating: number) => void;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(44,36,22,0.4)", backdropFilter: "blur(4px)" }} />
      <div
        className="relative rounded-2xl p-6 w-full max-w-xs shadow-xl"
        style={{ background: "var(--card)", border: "1px solid var(--border)", zIndex: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg mb-1" style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)", fontWeight: 500 }}>
          {item.type === "book" ? "Finished reading?" : "Just watched?"}
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--muted-foreground)" }}>{item.title}</p>
        <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>Rate it</p>
        <div className="mb-5">
          <StarPicker value={rating} onChange={setRating} />
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg text-xs"
            style={{ background: "var(--secondary)", color: "var(--muted-foreground)" }}>Cancel</button>
          <button
            onClick={() => rating > 0 && onConfirm(rating)}
            disabled={rating === 0}
            className="flex-1 py-2 rounded-lg text-xs hover:opacity-80 disabled:opacity-40"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Mark complete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── One media section (Books or Shows) ───────────────────────────────────────
function MediaSection({ type, label }: { type: "book" | "show"; label: string }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDetail, setNewDetail] = useState("");
  const [completing, setCompleting] = useState<MediaItem | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const recs = useMemo(
    () => sample(type === "book" ? BOOK_RECS : SHOW_RECS, 5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const load = () =>
    fetch(`/api/media?type=${type}`).then(r => r.json()).then(({ items }) => setItems(items ?? []));

  useEffect(() => { load(); }, []);

  const add = async (title: string, detail = "") => {
    if (!title.trim()) return;
    await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, title: title.trim(), detail, completed: false }),
    });
    setNewTitle(""); setNewDetail(""); setShowAdd(false);
    load();
  };

  const complete = async (item: MediaItem, rating: number) => {
    await fetch("/api/media", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, completed: true, completed_at: new Date().toISOString(), rating }),
    });
    setCompleting(null);
    load();
  };

  const remove = async (id: string) => {
    await fetch("/api/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const pending = items.filter(i => !i.completed);
  const done = items.filter(i => i.completed)
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
    .slice(0, 5);

  const accentColor = type === "book" ? "var(--primary)" : "var(--accent)";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light" style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}>
          {label}
        </h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full hover:opacity-80 transition-opacity"
          style={{ background: accentColor, color: "var(--primary-foreground)" }}
        >
          <Plus size={12} /> Add
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-xl p-4 flex flex-col gap-2" style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
          <input
            type="text"
            placeholder={type === "book" ? "Book title..." : "Show or film title..."}
            value={newTitle}
            autoFocus
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add(newTitle, newDetail)}
            className="w-full text-sm px-3 py-2 rounded-lg outline-none"
            style={{ background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)" }}
          />
          <input
            type="text"
            placeholder={type === "book" ? "Author (optional)" : "Network / note (optional)"}
            value={newDetail}
            onChange={e => setNewDetail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && add(newTitle, newDetail)}
            className="w-full text-sm px-3 py-2 rounded-lg outline-none"
            style={{ background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)" }}
          />
          <div className="flex gap-2">
            <button onClick={() => setShowAdd(false)} className="flex-1 py-1.5 rounded-lg text-xs"
              style={{ background: "var(--card)", color: "var(--muted-foreground)" }}>Cancel</button>
            <button onClick={() => add(newTitle, newDetail)} className="flex-1 py-1.5 rounded-lg text-xs hover:opacity-80"
              style={{ background: accentColor, color: "var(--primary-foreground)" }}>Add</button>
          </div>
        </div>
      )}

      {/* To read/watch list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs tracking-widest uppercase" style={{ color: accentColor }}>
            {type === "book" ? "To read" : "To watch"} · {pending.length}
          </p>
        </div>
        {pending.length === 0 ? (
          <p className="px-4 py-5 text-sm" style={{ color: "var(--muted-foreground)" }}>
            Nothing here yet — add something above.
          </p>
        ) : (
          <div>
            {pending.map((item, i) => (
              <div
                key={item.id}
                className="flex items-start gap-3 px-4 py-3 group"
                style={{ borderBottom: i < pending.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <button onClick={() => setCompleting(item)} className="mt-0.5 flex-shrink-0 hover:opacity-70">
                  <Circle size={16} style={{ color: "var(--border)" }} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.title}</p>
                  {item.detail && <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>{item.detail}</p>}
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed */}
      {done.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--border)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <p className="text-xs tracking-widest uppercase" style={{ color: "var(--muted-foreground)" }}>
              Recently {type === "book" ? "read" : "watched"}
            </p>
          </div>
          {done.map((item, i) => (
            <div
              key={item.id}
              className="flex items-start gap-3 px-4 py-3"
              style={{ borderBottom: i < done.length - 1 ? "1px solid var(--border)" : "none" }}
            >
              <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" style={{ color: accentColor }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{item.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {item.rating && (
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} size={11}
                          fill={n <= item.rating! ? "var(--accent)" : "none"}
                          stroke={n <= item.rating! ? "var(--accent)" : "var(--border)"}
                        />
                      ))}
                    </div>
                  )}
                  {item.completed_at && (
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      {new Date(item.completed_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      <div>
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--muted-foreground)" }}>
          Suggested for you
        </p>
        <div className="flex flex-col gap-2">
          {recs.map((rec) => {
            const alreadyAdded = items.some(i => i.title.toLowerCase() === rec.title.toLowerCase());
            return (
              <div
                key={rec.title}
                className="flex items-start gap-3 px-4 py-3 rounded-xl group"
                style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{rec.title}</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>{rec.detail}</p>
                </div>
                <button
                  onClick={() => !alreadyAdded && add(rec.title, rec.detail)}
                  disabled={alreadyAdded}
                  className="flex-shrink-0 mt-0.5 text-xs px-2.5 py-1 rounded-full transition-opacity hover:opacity-70 disabled:opacity-30"
                  style={{ background: alreadyAdded ? "var(--secondary)" : accentColor, color: "var(--primary-foreground)" }}
                >
                  {alreadyAdded ? "Added" : "+ Add"}
                </button>
              </div>
            );
          })}
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>
          Recommendations refresh on each page load.
        </p>
      </div>

      {/* Complete modal */}
      {completing && (
        <CompleteModal
          item={completing}
          onConfirm={(rating) => complete(completing, rating)}
          onClose={() => setCompleting(null)}
        />
      )}
    </div>
  );
}

// ── Main client ───────────────────────────────────────────────────────────────
export default function DowntimeClient() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <MediaSection type="book" label="Books" />
      <MediaSection type="show" label="Shows & Films" />
    </div>
  );
}
