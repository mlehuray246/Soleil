"use client";

import { useEffect, useState } from "react";
import TodoWidget from "@/components/home/TodoWidget";
import EmailWidget from "@/components/home/EmailWidget";
import TedTalkWidget from "@/components/home/TedTalkWidget";

interface Photo { id: string; url: string; }

function Polaroid({ url, rotate, width, height }: {
  url: string; rotate: number; width: number; height: number;
}) {
  return (
    <div style={{
      transform: `rotate(${rotate}deg)`,
      background: "#FDFAF4",
      padding: "7px 7px 26px 7px",
      border: "1px solid #D8CEBC",
      boxShadow: "3px 5px 16px rgba(44,36,22,0.14)",
      flexShrink: 0,
      width,
    }}>
      <img src={url} alt="" style={{ width: "100%", height, objectFit: "cover", display: "block" }} />
    </div>
  );
}

function RawPhoto({ url, width, height, radius = 6, rotate = 0, style = {} }: {
  url: string; width: number | string; height: number | string;
  radius?: number; rotate?: number; style?: React.CSSProperties;
}) {
  return (
    <img src={url} alt="" style={{
      width, height, objectFit: "cover", display: "block", flexShrink: 0,
      borderRadius: radius,
      boxShadow: "2px 4px 18px rgba(44,36,22,0.13)",
      transform: `rotate(${rotate}deg)`,
      ...style,
    }} />
  );
}

function HRule() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 28px" }}>
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)" }} />
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );
}

// Inline quote — no card, just beautiful typography
function InlineQuote({ quote, bigger = false }: { quote: string | null; bigger?: boolean }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      height: "100%",
      padding: "0 8px",
    }}>
      {/* decorative top line */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <div style={{ width: 28, height: 1, background: "var(--accent)" }} />
        <span style={{
          fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase",
          color: "var(--accent)", fontFamily: "var(--font-dm-sans)",
        }}>
          from mum
        </span>
        <div style={{ width: 28, height: 1, background: "var(--accent)" }} />
      </div>

      {/* large opening quote mark */}
      <div style={{
        fontFamily: "var(--font-cormorant)",
        fontSize: bigger ? "6rem" : "5rem",
        lineHeight: 0.7,
        color: "var(--accent)",
        opacity: 0.35,
        marginBottom: 4,
        userSelect: "none",
      }}>
        "
      </div>

      {quote ? (
        <p style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: bigger ? "1.5rem" : "1.25rem",
          fontStyle: "italic",
          fontWeight: 400,
          color: "var(--primary)",
          lineHeight: 1.6,
          marginBottom: 14,
        }}>
          {quote}
        </p>
      ) : (
        <p style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: "1.1rem",
          fontStyle: "italic",
          color: "var(--muted-foreground)",
          marginBottom: 14,
        }}>
          No quote yet today.
        </p>
      )}

      {/* attribution */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 20, height: 1, background: "var(--border)" }} />
        <span style={{
          fontFamily: "var(--font-dancing)",
          fontSize: "1.1rem",
          color: "var(--accent)",
        }}>
          Ursula le Huray
        </span>
      </div>
    </div>
  );
}

export default function HomeClient({ firstName, greeting, today }: {
  firstName: string; greeting: string; today: string;
}) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [quote, setQuote] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/photos").then(r => r.json()).then(({ photos }) => setPhotos(photos ?? []));
    fetch("/api/emails/quote").then(r => r.json()).then(({ quote }) => setQuote(quote));
  }, []);

  const p = (i: number) => photos[i]?.url ?? "";

  return (
    <>
      {/* ── MOBILE layout (hidden on md+) ──────────────────────────── */}
      <div
        className="md:hidden flex flex-col gap-4 px-5 pt-5"
        style={{
          background: "var(--background)",
          minHeight: "calc(100dvh - 52px)",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 72px)",
          overflowY: "auto",
        }}
      >
        {/* Greeting */}
        <div>
          <p style={{
            fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase",
            color: "var(--muted-foreground)", fontFamily: "var(--font-dm-sans)", marginBottom: 6,
          }}>
            {today}
          </p>
          <h1 style={{
            fontFamily: "var(--font-cormorant)", fontSize: "2rem",
            fontWeight: 300, color: "var(--primary)", lineHeight: 1.1,
          }}>
            {greeting},
          </h1>
          <h2 style={{
            fontFamily: "var(--font-dancing)", fontSize: "3rem",
            color: "var(--accent)", lineHeight: 1,
          }}>
            {firstName}
          </h2>
        </div>

        {/* Ursula quote card */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 20, height: 1, background: "var(--accent)" }} />
            <span style={{
              fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase",
              color: "var(--accent)", fontFamily: "var(--font-dm-sans)",
            }}>
              from mum
            </span>
            <div style={{ width: 20, height: 1, background: "var(--accent)" }} />
          </div>
          <p style={{
            fontFamily: "var(--font-cormorant)", fontSize: "1.2rem",
            fontStyle: "italic", color: "var(--primary)", lineHeight: 1.55,
            marginBottom: 10,
          }}>
            {quote ?? "No quote yet today."}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 14, height: 1, background: "var(--border)" }} />
            <span style={{
              fontFamily: "var(--font-dancing)", fontSize: "1rem", color: "var(--accent)",
            }}>
              Ursula le Huray
            </span>
          </div>
        </div>

        {/* TED Talk card */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <TedTalkWidget />
        </div>

        {/* Quick-link grid — Projects, Downtime, Interview Prep */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: "/projects", label: "Projects", emoji: "📁" },
            { href: "/downtime", label: "Downtime", emoji: "🎬" },
            { href: "/interview-prep", label: "Interview", emoji: "💼" },
          ].map(({ href, label, emoji }) => (
            <a
              key={href}
              href={href}
              className="rounded-2xl flex flex-col items-center justify-center gap-1.5 py-4"
              style={{ background: "var(--card)", border: "1px solid var(--border)", textDecoration: "none" }}
            >
              <span style={{ fontSize: "1.4rem" }}>{emoji}</span>
              <span style={{
                fontSize: "10px", letterSpacing: "0.05em", color: "var(--muted-foreground)",
                fontFamily: "var(--font-dm-sans)",
              }}>
                {label}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* ── DESKTOP layout (hidden on mobile) ──────────────────────── */}
    <div className="hidden md:flex" style={{
      height: "calc(100vh - 56px)",
      overflow: "hidden",
      background: "var(--background)",
      flexDirection: "column",
    }}>

      {/* ── TOP: greeting + photo cluster ─────────────────────────── */}
      <div style={{
        flex: "0 0 42%",
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
        minHeight: 0,
      }}>

        {/* Greeting — fixed width, never overlaps photos */}
        <div style={{
          flex: "0 0 290px",
          padding: "28px 20px 20px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 2,
        }}>
          <p style={{
            fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase",
            color: "var(--muted-foreground)", marginBottom: 14,
            fontFamily: "var(--font-dm-sans)",
          }}>
            {today}
          </p>
          <h1 style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(2rem, 2.8vw, 3rem)",
            fontWeight: 300,
            color: "var(--primary)",
            lineHeight: 1.1,
            marginBottom: 2,
          }}>
            {greeting},
          </h1>
          <h2 style={{
            fontFamily: "var(--font-dancing)",
            fontSize: "clamp(2.6rem, 4vw, 3.8rem)",
            color: "var(--accent)",
            lineHeight: 1,
            marginBottom: 18,
          }}>
            {firstName}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 36, height: 1, background: "var(--accent)" }} />
            <span style={{
              fontFamily: "var(--font-dancing)",
              fontSize: "1.05rem",
              color: "var(--accent)",
            }}>Soleil</span>
          </div>
        </div>

        {/* Photo cluster — middle */}
        {photos.length > 2 && (
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>

            {/* Large landscape raw */}
            <div style={{ position: "absolute", top: 16, left: 10 }}>
              <RawPhoto url={p(0)} width={240} height={175} radius={7} rotate={-0.8} />
            </div>

            {/* Polaroid — overlapping bottom-right of large */}
            <div style={{ position: "absolute", bottom: 14, left: 160 }}>
              <Polaroid url={p(1)} rotate={3.5} width={145} height={105} />
            </div>

          </div>
        )}

        {/* Vertical divider before TED widget */}
        <div style={{ width: 1, background: "var(--border)", flexShrink: 0, margin: "20px 0" }} />

        {/* TED Talk of the Day */}
        <div style={{ flex: "0 0 260px", padding: "10px 20px 10px 20px", overflow: "hidden" }}>
          <TedTalkWidget />
        </div>

        {/* Vertical divider before quote */}
        <div style={{ width: 1, background: "var(--border)", flexShrink: 0, margin: "20px 0" }} />

        {/* Quote — top right, bigger */}
        <div style={{ flex: "0 0 240px", padding: "10px 28px 10px 20px" }}>
          <InlineQuote quote={quote} bigger />
        </div>

      </div>

      <HRule />

      {/* ── BOTTOM: quote + large photo + widgets ─────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
        padding: "14px 28px 18px 28px",
        gap: 20,
        minHeight: 0,
      }}>

        {/* Large raw photo — the visual anchor of the bottom section */}
        {p(3) && (
          <div style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
          }}>
            <RawPhoto url={p(3)} width={200} height="100%" radius={7} style={{ maxHeight: "100%" }} />
          </div>
        )}

        {/* Polaroid — nestled next to large photo */}
        {p(4) && (
          <div style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "flex-end",
            paddingBottom: 8,
          }}>
            <Polaroid url={p(4)} rotate={-3} width={120} height={90} />
          </div>
        )}

        {/* Vertical divider */}
        <div style={{ width: 1, background: "var(--border)", flexShrink: 0, margin: "8px 0" }} />

        {/* Todo + Email stacked */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minWidth: 0,
        }}>
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <TodoWidget />
          </div>
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            <EmailWidget />
          </div>
        </div>

      </div>
    </div>{/* end desktop wrapper */}
    </>
  );
}
