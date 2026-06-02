"use client";

import { useEffect, useState } from "react";
import { Mail, RefreshCw } from "lucide-react";

interface Email {
  id: string;
  from: string;
  subject: string;
  date: string;
  reason: string;
}

function senderName(from: string) {
  const match = from.match(/^"?([^"<]+)"?\s*</);
  return match ? match[1].trim() : from.split("@")[0];
}

export default function EmailWidget() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmails = async () => {
    setLoading(true);
    const res = await fetch("/api/emails");
    const { emails } = await res.json();
    setEmails(emails ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div
      className="rounded-2xl p-6 min-h-[160px]"
      style={{
        background: "rgba(253,250,244,0.88)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-xs tracking-widest uppercase"
          style={{ color: "var(--accent)" }}
        >
          Needs a reply
        </p>
        <button
          onClick={fetchEmails}
          className="transition-opacity hover:opacity-60"
          style={{ color: "var(--muted-foreground)" }}
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-10 rounded-lg animate-pulse"
              style={{ background: "var(--muted)" }}
            />
          ))}
        </div>
      ) : emails.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          No emails require a response right now.
        </p>
      ) : (
        <ul className="space-y-3">
          {emails.map((email) => (
            <li
              key={email.id}
              className="flex gap-3 items-start"
            >
              <div
                className="mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: "var(--secondary)" }}
              >
                <Mail size={11} style={{ color: "var(--accent)" }} />
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-medium leading-snug truncate"
                  style={{ color: "var(--foreground)" }}
                >
                  {email.subject}
                </p>
                <p className="text-xs truncate" style={{ color: "var(--muted-foreground)" }}>
                  {senderName(email.from)} · {email.reason}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
