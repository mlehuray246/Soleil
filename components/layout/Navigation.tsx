"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/calendar", label: "Calendar" },
  { href: "/projects", label: "Projects" },
  { href: "/goals", label: "Goals" },
  { href: "/wellness", label: "Wellness" },
  { href: "/downtime", label: "Downtime" },
  { href: "/summer", label: "Summer" },
];

// Five tabs shown in the mobile bottom bar
const mobileTabs = [
  {
    href: "/",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M3 9.5L11 3L19 9.5V19a1 1 0 01-1 1H14v-5h-4v5H4a1 1 0 01-1-1V9.5z"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
          fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0}
        />
      </svg>
    ),
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"
          fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.1 : 0} />
        <path d="M3 9h16M8 3v4M14 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/summer",
    label: "Summer",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="4" stroke="currentColor" strokeWidth="1.5"
          fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0} />
        <path d="M11 3v2M11 17v2M3 11h2M17 11h2M5.64 5.64l1.41 1.41M14.95 14.95l1.41 1.41M5.64 16.36l1.41-1.41M14.95 7.05l1.41-1.41"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/goals",
    label: "Goals",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"
          fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.1 : 0} />
        <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.5"
          fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.3 : 0} />
      </svg>
    ),
  },
  {
    href: "/wellness",
    label: "Wellness",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M11 19s-8-5.5-8-10a5 5 0 0110 0 5 5 0 0110 0c0 4.5-8 10-8 10h-4z"
          stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
          fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.2 : 0}
        />
      </svg>
    ),
  },
];

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* ── Desktop nav (hidden on mobile) ──────────────────────────── */}
      <nav
        className="hidden md:block sticky top-0 z-50 border-b"
        style={{
          background: "rgba(245,240,232,0.92)",
          backdropFilter: "blur(12px)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
          <Link
            href="/"
            className="text-2xl"
            style={{ fontFamily: "var(--font-dancing)", color: "var(--primary)", letterSpacing: "0.02em" }}
          >
            Soleil
          </Link>

          <div className="flex items-center gap-8">
            {navLinks.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm tracking-wide transition-colors"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    color: active ? "var(--primary)" : "var(--muted-foreground)",
                    fontWeight: active ? "500" : "400",
                    borderBottom: active ? "1.5px solid var(--accent)" : "1.5px solid transparent",
                    paddingBottom: "2px",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {session ? (
              <button onClick={() => signOut()} className="hover:opacity-70 transition-opacity">
                Sign out
              </button>
            ) : (
              <button onClick={() => signIn("google")} className="hover:opacity-70 transition-opacity">
                Sign in
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile top bar (shown on mobile only) ───────────────────── */}
      <nav
        className="md:hidden sticky top-0 z-50 flex items-center justify-between px-5 border-b"
        style={{
          background: "rgba(245,240,232,0.95)",
          backdropFilter: "blur(16px)",
          borderColor: "var(--border)",
          height: 52,
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <span
          className="text-2xl"
          style={{ fontFamily: "var(--font-dancing)", color: "var(--primary)" }}
        >
          Soleil
        </span>

        <div className="text-xs" style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-dm-sans)" }}>
          {session ? (
            <button onClick={() => signOut()} className="hover:opacity-70 transition-opacity">
              Sign out
            </button>
          ) : (
            <button onClick={() => signIn("google")} className="hover:opacity-70 transition-opacity">
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* ── Mobile bottom tab bar ────────────────────────────────────── */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t"
        style={{
          background: "rgba(245,240,232,0.97)",
          backdropFilter: "blur(20px)",
          borderColor: "var(--border)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {mobileTabs.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-opacity"
              style={{
                color: active ? "var(--primary)" : "var(--muted-foreground)",
                minHeight: 56,
              }}
            >
              {tab.icon(active)}
              <span style={{
                fontSize: 10,
                fontFamily: "var(--font-dm-sans)",
                fontWeight: active ? 600 : 400,
                letterSpacing: "0.03em",
              }}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
