"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  due_date: string | null;
}

export default function TodoWidget() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    fetch("/api/todos")
      .then((r) => r.json())
      .then(({ todos }) => setTodos(todos ?? []));
  }, []);

  const toggle = async (todo: Todo) => {
    const updated = { ...todo, completed: !todo.completed };
    setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: todo.id, completed: updated.completed }),
    });
  };

  const pending = todos.filter((t) => !t.completed).slice(0, 5);

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
          Today
        </p>
        <Link
          href="/calendar"
          className="flex items-center gap-1 text-xs hover:opacity-70 transition-opacity"
          style={{ color: "var(--muted-foreground)" }}
        >
          See all <ChevronRight size={12} />
        </Link>
      </div>

      {pending.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          All clear — nothing pending.
        </p>
      ) : (
        <ul className="space-y-3">
          {pending.map((todo) => (
            <li
              key={todo.id}
              className="flex items-start gap-3 cursor-pointer group"
              onClick={() => toggle(todo)}
            >
              <button className="mt-0.5 flex-shrink-0 transition-colors">
                {todo.completed ? (
                  <CheckCircle2
                    size={16}
                    style={{ color: "var(--accent)" }}
                  />
                ) : (
                  <Circle
                    size={16}
                    style={{ color: "var(--border)" }}
                    className="group-hover:stroke-[--accent]"
                  />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm leading-snug"
                  style={{
                    color: todo.completed
                      ? "var(--muted-foreground)"
                      : "var(--foreground)",
                    textDecoration: todo.completed ? "line-through" : "none",
                  }}
                >
                  {todo.text}
                </p>
                {todo.due_date && (
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                    {new Date(todo.due_date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
