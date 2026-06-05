import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import InterviewPrepClient from "@/components/interview-prep/InterviewPrepClient";

export default async function InterviewPrepPage() {
  const session = await auth();
  if (!session) redirect("/");

  const daysUntil = Math.max(
    0,
    Math.ceil(
      (new Date("2026-09-01").getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-2">
          <div>
            <a
              href="/projects/internships"
              className="inline-flex items-center gap-1 text-xs mb-4 hover:opacity-70 transition-opacity"
              style={{ color: "var(--muted-foreground)" }}
            >
              ← Back to Internships
            </a>
            <h1
              className="text-4xl font-light"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}
            >
              Interview Prep
            </h1>
          </div>
          <div
            className="rounded-xl px-5 py-3 text-right flex-shrink-0"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--accent)" }}>
              McKinsey Interview
            </p>
            <p
              className="text-2xl font-light"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}
            >
              {daysUntil} days to go
            </p>
          </div>
        </div>
        <p className="text-sm mb-8" style={{ color: "var(--muted-foreground)" }}>
          Self-study tracker · Case · Behavioural · Mental Maths · Frameworks
        </p>
        <InterviewPrepClient />
      </div>
    </div>
  );
}
