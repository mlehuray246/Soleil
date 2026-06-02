"use client";

import { useEffect, useState } from "react";

export default function QuoteCard() {
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/emails/quote")
      .then((r) => r.json())
      .then(({ quote }) => {
        setQuote(quote);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div
      className="rounded-2xl p-6 h-full min-h-[160px] flex flex-col justify-between"
      style={{
        background: "rgba(253,250,244,0.88)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
      }}
    >
      <p
        className="text-xs tracking-widest uppercase mb-4"
        style={{ color: "var(--accent)", fontFamily: "var(--font-dm-sans)" }}
      >
        From Mum
      </p>
      {loading ? (
        <div
          className="h-4 rounded animate-pulse w-3/4"
          style={{ background: "var(--muted)" }}
        />
      ) : quote ? (
        <blockquote
          className="text-xl leading-relaxed italic flex-1"
          style={{
            fontFamily: "var(--font-cormorant)",
            color: "var(--foreground)",
            fontWeight: 300,
          }}
        >
          &ldquo;{quote}&rdquo;
        </blockquote>
      ) : (
        <p
          className="text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          No quote today yet — check back later.
        </p>
      )}
      <p
        className="text-xs mt-4"
        style={{ color: "var(--muted-foreground)" }}
      >
        — Ursula le Huray
      </p>
    </div>
  );
}
