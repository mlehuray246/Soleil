import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ArticlesFeed from "@/components/projects/ArticlesFeed";

export default async function NonprofitPage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
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
            Projects · Non-profit
          </p>
          <h1
            className="text-4xl font-light"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}
          >
            Healthcare, Education & Food Security
          </h1>
          <p className="text-sm mt-2" style={{ color: "var(--muted-foreground)" }}>
            AI-curated articles from leading global sources — updated daily.
          </p>
        </div>
        <ArticlesFeed />
      </div>
    </div>
  );
}
