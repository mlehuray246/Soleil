"use client";

import { useEffect, useState } from "react";
import { ExternalLink, RefreshCw } from "lucide-react";

interface Article {
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  category: "Healthcare" | "Education" | "Food Security";
}

const categoryColor: Record<string, string> = {
  Healthcare: "#5C6E45",
  Education: "#C8962A",
  "Food Security": "#B5654A",
};

export default function ArticlesFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/articles");
    const { articles } = await res.json();
    setArticles(articles ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-44 rounded-2xl animate-pulse"
            style={{ background: "var(--card)" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={load}
          className="flex items-center gap-2 text-xs transition-opacity hover:opacity-60"
          style={{ color: "var(--muted-foreground)" }}
        >
          <RefreshCw size={12} /> Refresh
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articles.map((article, i) => (
          <a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl p-6 flex flex-col gap-3 transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs tracking-wide px-2.5 py-0.5 rounded-full"
                style={{
                  background: `${categoryColor[article.category] ?? "#888"}18`,
                  color: categoryColor[article.category] ?? "#888",
                }}
              >
                {article.category}
              </span>
              <ExternalLink
                size={13}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--muted-foreground)" }}
              />
            </div>
            <h3
              className="text-lg leading-snug"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)", fontWeight: 500 }}
            >
              {article.title}
            </h3>
            <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--muted-foreground)" }}>
              {article.summary}
            </p>
            <p className="text-xs" style={{ color: "var(--accent)" }}>
              {article.source} · {article.date}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
