"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  location?: string;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarView() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [current, setCurrent] = useState(new Date());

  useEffect(() => {
    fetch("/api/calendar")
      .then((r) => r.json())
      .then(({ events }) => setEvents(events ?? []));
  }, []);

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const monthName = current.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  const eventsOnDay = (day: number) => {
    const d = new Date(year, month, day);
    return events.filter((e) => isSameDay(new Date(e.start), d));
  };

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2
          className="text-2xl font-light"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}
        >
          {monthName}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prev}
            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--secondary)]"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            className="p-1.5 rounded-lg transition-colors hover:bg-[var(--secondary)]"
            style={{ color: "var(--muted-foreground)" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            className="text-center text-xs py-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const dayEvents = eventsOnDay(day);
          const isToday = isSameDay(new Date(year, month, day), today);
          return (
            <div
              key={day}
              className="relative flex flex-col items-center py-1.5 rounded-lg"
              style={{
                background: isToday ? "var(--primary)" : "transparent",
                minHeight: "44px",
              }}
            >
              <span
                className="text-xs font-medium"
                style={{
                  color: isToday ? "var(--primary-foreground)" : "var(--foreground)",
                }}
              >
                {day}
              </span>
              <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                {dayEvents.slice(0, 3).map((e) => (
                  <div
                    key={e.id}
                    className="w-1 h-1 rounded-full"
                    style={{ background: isToday ? "rgba(255,255,255,0.6)" : "var(--accent)" }}
                    title={e.title ?? ""}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming events */}
      <div className="mt-6 pt-6 border-t" style={{ borderColor: "var(--border)" }}>
        <p
          className="text-xs tracking-widest uppercase mb-3"
          style={{ color: "var(--accent)" }}
        >
          Upcoming
        </p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {events.slice(0, 8).map((e) => (
            <div key={e.id} className="flex gap-3 items-start">
              <div
                className="text-xs pt-0.5 w-16 flex-shrink-0"
                style={{ color: "var(--muted-foreground)" }}
              >
                {new Date(e.start).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <div>
                <p className="text-sm" style={{ color: "var(--foreground)" }}>
                  {e.title}
                </p>
                {!e.allDay && (
                  <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                    {new Date(e.start).toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
