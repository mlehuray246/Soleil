"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

interface Internship {
  id: string;
  company: string;
  role: string;
  sector: string;
  status: string;
  location: string;
  deadline: string | null;
  notes: string;
  url: string;
}

const INTERNSHIPS: Internship[] = [
  { id: "1", company: "McKinsey & Company", role: "Summer Associate / Business Analyst", sector: "Consulting", status: "Interview", location: "London", deadline: "2026-03-29", notes: "Interview already booked Sep 2026 London.", url: "https://www.notion.so/371ef8c6e06081eaa01be7e2cfe1d8f4" },
  { id: "2", company: "BCG", role: "Summer Associate", sector: "Consulting", status: "Applied", location: "London", deadline: null, notes: "Round 1 deadline ~April 2026 has passed. Check BCG careers portal for next cycle.", url: "https://www.notion.so/371ef8c6e060816eb0a2fce526719c87" },
  { id: "3", company: "Bain & Company", role: "Associate Consultant Intern", sector: "Consulting", status: "To research", location: "London", deadline: "2026-08-31", notes: "Round 2 deadline Aug 31 2026 — still open!", url: "https://www.notion.so/371ef8c6e06081689735e78bac4e0c82" },
  { id: "4", company: "Oliver Wyman", role: "Consultant Intern", sector: "Consulting", status: "To research", location: "London", deadline: "2026-03-29", notes: "Mar 29 deadline passed. Check for late rounds or UK-specific dates.", url: "https://www.notion.so/371ef8c6e06081b2a115e3e5049ad56d" },
  { id: "5", company: "L.E.K. Consulting", role: "Associate Intern", sector: "Consulting", status: "To research", location: "London", deadline: null, notes: "Not yet published. Strong life sciences fit.", url: "https://www.notion.so/371ef8c6e06081859c33efc95a7e391d" },
  { id: "6", company: "EY-Parthenon", role: "Strategy Intern", sector: "Consulting", status: "To research", location: "London", deadline: "2026-10-01", notes: "Rolling — apply Sep–Oct 2026.", url: "https://www.notion.so/371ef8c6e06081a78a39d54b46e1c5bf" },
  { id: "7", company: "Deloitte Consulting", role: "Consulting Summer Scholar", sector: "Consulting", status: "To research", location: "London", deadline: "2026-10-01", notes: "Rolling — apply Sep–Oct 2026. Earlier = better.", url: "https://www.notion.so/371ef8c6e06081c4b910ee57eedabc65" },
  { id: "8", company: "Roland Berger", role: "Consultant Intern", sector: "Consulting", status: "To research", location: "London", deadline: null, notes: "Not yet published. Check Roland Berger careers portal.", url: "https://www.notion.so/371ef8c6e06081209e2cc47a164f7c62" },
  { id: "9", company: "Accenture Strategy", role: "Strategy Intern", sector: "Consulting", status: "To research", location: "London", deadline: "2026-10-01", notes: "Rolling — apply Sep–Oct 2026 for best chances.", url: "https://www.notion.so/371ef8c6e06081baae77e7f85afc2025" },
  { id: "10", company: "Jane Street", role: "Quantitative Trading / Software Intern", sector: "Fintech", status: "To research", location: "London", deadline: "2026-10-01", notes: "Opens Jul–Aug 2026. Apply immediately when open.", url: "https://www.notion.so/371ef8c6e060815e8c12ed0296f7b970" },
  { id: "11", company: "Citadel", role: "Quant / Software Intern", sector: "Fintech", status: "To research", location: "London", deadline: "2026-11-01", notes: "Rolling — apply Sep–Oct 2026.", url: "https://www.notion.so/371ef8c6e06081ab8d46f785571f9db3" },
  { id: "12", company: "Two Sigma", role: "Quantitative Research Intern", sector: "Fintech", status: "To research", location: "London", deadline: "2026-11-01", notes: "Quant funds recruit early — strong fit for AME + CS.", url: "https://www.notion.so/371ef8c6e06081ddaca2da70967bdf82" },
  { id: "13", company: "Goldman Sachs", role: "Summer Analyst (Markets / Quant)", sector: "Fintech", status: "To research", location: "London", deadline: "2026-12-01", notes: "Expect Oct 2026 open — apply within first 2–3 weeks.", url: "https://www.notion.so/371ef8c6e0608197b0cbec0df85560a0" },
  { id: "14", company: "Apax Partners", role: "Summer Analyst", sector: "Private Equity", status: "To research", location: "London", deadline: null, notes: "Check Apax careers portal ~Oct 2026.", url: "https://www.notion.so/371ef8c6e060814cb686d5111284aebc" },
  { id: "15", company: "KKR", role: "Summer Analyst", sector: "Private Equity", status: "To research", location: "London", deadline: null, notes: "KKR recruits early — check portal Sep–Oct 2026.", url: "https://www.notion.so/371ef8c6e06081fdae78cf1a2eac15a4" },
  { id: "16", company: "Blackstone", role: "Summer Analyst", sector: "Private Equity", status: "To research", location: "London", deadline: "2026-11-30", notes: "European summer internships — applications open ~Oct 2026.", url: "https://www.notion.so/371ef8c6e060816f88ffd7e36f76768a" },
  { id: "17", company: "GSK", role: "Industrial Placement / Summer Intern", sector: "Biotech", status: "To research", location: "London", deadline: null, notes: "Check gsk.com/careers ~Sep 2026.", url: "https://www.notion.so/371ef8c6e06081b29144e356edfd8baf" },
  { id: "18", company: "AstraZeneca", role: "R&D / Strategy Intern", sector: "Biotech", status: "To research", location: "London", deadline: "2026-11-30", notes: "Portal opens ~Sep 1 2026. Apply in Sep for priority.", url: "https://www.notion.so/371ef8c6e060812ea61be06b94da43b8" },
  { id: "19", company: "Flagship Pioneering", role: "Innovation Intern", sector: "Biotech", status: "To research", location: "Boston", deadline: null, notes: "Founded Moderna. Check portal ~Oct 2026.", url: "https://www.notion.so/371ef8c6e060819fbc14f61064f0767a" },
  { id: "20", company: "Wellcome Trust", role: "Science & Strategy Intern", sector: "Non-profit", status: "To research", location: "London", deadline: null, notes: "Check wellcome.org/careers ~Oct 2026.", url: "https://www.notion.so/371ef8c6e0608136ab21e43f6415a070" },
  { id: "21", company: "Cancer Research UK", role: "Research / Strategy Intern", sector: "Non-profit", status: "To research", location: "London", deadline: null, notes: "Check cancerresearchuk.org/careers ~Oct 2026.", url: "https://www.notion.so/371ef8c6e0608153a049d050b50607f1" },
];

const statusColor: Record<string, string> = {
  "To research": "#9E8E7A",
  Networking: "#C8962A",
  Applied: "#3D4A2E",
  Interview: "#5C6E45",
  Offer: "#2D6A4F",
  Rejected: "#B5654A",
};

const sectorColor: Record<string, string> = {
  Consulting: "#3D4A2E",
  Biotech: "#5C6E45",
  "Private Equity": "#8A9E7A",
  Fintech: "#C8962A",
  "Non-profit": "#B5654A",
  Other: "#9E8E7A",
};

const STATUSES = ["To research", "Networking", "Applied", "Interview", "Offer", "Rejected"];

export default function InternshipTracker() {
  const [filter, setFilter] = useState<string>("All");

  const filters = ["All", ...STATUSES];
  const visible = filter === "All" ? INTERNSHIPS : INTERNSHIPS.filter((i) => i.status === filter);

  return (
    <div>
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="text-xs px-3 py-1.5 rounded-full transition-all"
            style={{
              background: filter === f ? "var(--primary)" : "var(--secondary)",
              color: filter === f ? "var(--primary-foreground)" : "var(--muted-foreground)",
            }}
          >
            {f} {f !== "All" && `(${INTERNSHIPS.filter(i => i.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
        <div
          className="grid text-xs tracking-widest uppercase px-6 py-3"
          style={{
            gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr auto",
            background: "var(--secondary)",
            color: "var(--muted-foreground)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span>Company</span>
          <span>Role</span>
          <span>Sector</span>
          <span>Location</span>
          <span>Deadline</span>
          <span>Status</span>
        </div>

        <div style={{ background: "var(--card)" }}>
          {visible.map((item, i) => (
            <div
              key={item.id}
              className="grid items-center px-6 py-4 transition-colors hover:bg-[var(--secondary)] group"
              style={{
                gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr auto",
                borderBottom: i < visible.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm" style={{ color: "var(--foreground)" }}>
                  {item.company}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <ExternalLink size={11} />
                </a>
              </div>
              <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {item.role}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full w-fit"
                style={{
                  background: `${sectorColor[item.sector] ?? "#888"}15`,
                  color: sectorColor[item.sector] ?? "#888",
                }}
              >
                {item.sector}
              </span>
              <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {item.location}
              </span>
              <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {item.deadline
                  ? new Date(item.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                  : "—"}
              </span>
              <span
                className="text-xs px-2.5 py-1 rounded-full whitespace-nowrap"
                style={{
                  background: `${statusColor[item.status] ?? "#888"}18`,
                  color: statusColor[item.status] ?? "#888",
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs mt-3 text-right" style={{ color: "var(--muted-foreground)" }}>
        {visible.length} of {INTERNSHIPS.length} companies
      </p>
    </div>
  );
}
