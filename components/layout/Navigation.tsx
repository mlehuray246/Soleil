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
];

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav
      className="sticky top-0 z-50 border-b"
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
          style={{
            fontFamily: "var(--font-dancing)",
            color: "var(--primary)",
            letterSpacing: "0.02em",
          }}
        >
          Soleil
        </Link>

        <div className="flex items-center gap-8">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide transition-colors"
                style={{
                  fontFamily: "var(--font-dm-sans)",
                  color: active ? "var(--primary)" : "var(--muted-foreground)",
                  fontWeight: active ? "500" : "400",
                  borderBottom: active
                    ? "1.5px solid var(--accent)"
                    : "1.5px solid transparent",
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
            <button
              onClick={() => signOut()}
              className="hover:opacity-70 transition-opacity"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="hover:opacity-70 transition-opacity"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
