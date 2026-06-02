import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    slug: "nonprofit",
    label: "Non-profit",
    description:
      "Healthcare, education & food security — curated research and articles from global sources.",
    accent: "#5C6E45",
    tag: "Research",
  },
  {
    slug: "internships",
    label: "Internships",
    description:
      "Summer 2027 internship search across consulting, biotech, PE, fintech, and non-profit sectors.",
    accent: "#C8962A",
    tag: "Career",
  },
];

export default async function ProjectsPage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1
          className="text-4xl font-light mb-2"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}
        >
          Projects
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--muted-foreground)" }}>
          Click a card to open the project workspace.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`}>
              <div
                className="group rounded-2xl p-8 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="text-xs tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{
                      background: `${p.accent}18`,
                      color: p.accent,
                    }}
                  >
                    {p.tag}
                  </span>
                  <ArrowRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--muted-foreground)" }}
                  />
                </div>
                <h2
                  className="text-3xl font-light mb-3"
                  style={{
                    fontFamily: "var(--font-cormorant)",
                    color: "var(--primary)",
                  }}
                >
                  {p.label}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {p.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
