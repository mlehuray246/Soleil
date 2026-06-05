import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import InternshipTracker from "@/components/projects/InternshipTracker";

export default async function InternshipsPage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <a
            href="/projects"
            className="inline-flex items-center gap-1 text-xs mb-4 hover:opacity-70 transition-opacity"
            style={{ color: "var(--muted-foreground)" }}
          >
            ← Back to Projects
          </a>
          <p
            className="text-xs tracking-widest uppercase mb-2"
            style={{ color: "var(--accent)" }}
          >
            Projects · Career
          </p>
          <div className="flex items-start justify-between gap-4">
            <h1
              className="text-4xl font-light"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}
            >
              Summer 2027 Internship Search
            </h1>
            <Link
              href="/interview-prep"
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-full hover:opacity-80 transition-opacity flex-shrink-0 mt-1"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              <BookOpen size={14} />
              Interview Prep
            </Link>
          </div>
          <p className="text-sm mt-2" style={{ color: "var(--muted-foreground)" }}>
            Synced from Notion · Consulting, Biotech, PE, Fintech, Non-profit
          </p>
        </div>
        <InternshipTracker />
      </div>
    </div>
  );
}
