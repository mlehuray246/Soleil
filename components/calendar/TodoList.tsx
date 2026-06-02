"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Plus, Trash2, Pencil } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  due_date: string | null;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newText, setNewText] = useState("");
  const [newDate, setNewDate] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const load = () =>
    fetch("/api/todos")
      .then((r) => r.json())
      .then(({ todos }) => setTodos(todos ?? []));

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!newText.trim()) return;
    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newText, due_date: newDate || null, completed: false }),
    });
    setNewText("");
    setNewDate("");
    load();
  };

  const toggle = async (todo: Todo) => {
    await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: todo.id, completed: !todo.completed }),
    });
    load();
  };

  const remove = async (id: string) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const saveEdit = async (id: string) => {
    await fetch("/api/todos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, text: editText }),
    });
    setEditId(null);
    load();
  };

  const pending = todos.filter((t) => !t.completed);
  const done = todos.filter((t) => t.completed);

  return (
    <div
      className="rounded-2xl p-6 h-full"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <p
        className="text-xs tracking-widest uppercase mb-4"
        style={{ color: "var(--accent)" }}
      >
        To Do
      </p>

      {/* Add new */}
      <div className="flex flex-col gap-2 mb-5">
        <input
          type="text"
          placeholder="Add a task..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="w-full text-sm px-3 py-2 rounded-lg outline-none focus:ring-1"
          style={{
            background: "var(--secondary)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          }}
        />
        <div className="flex gap-2">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="flex-1 text-xs px-3 py-1.5 rounded-lg outline-none"
            style={{
              background: "var(--secondary)",
              color: "var(--muted-foreground)",
              border: "1px solid var(--border)",
            }}
          />
          <button
            onClick={add}
            className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-opacity hover:opacity-80"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            <Plus size={12} /> Add
          </button>
        </div>
      </div>

      {/* Pending */}
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {pending.map((todo) => (
          <div key={todo.id} className="flex items-start gap-2 group">
            <button onClick={() => toggle(todo)} className="mt-0.5 flex-shrink-0">
              <Circle size={15} style={{ color: "var(--border)" }} />
            </button>
            <div className="flex-1 min-w-0">
              {editId === todo.id ? (
                <input
                  autoFocus
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(todo.id)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                  className="w-full text-sm outline-none bg-transparent border-b"
                  style={{ borderColor: "var(--accent)", color: "var(--foreground)" }}
                />
              ) : (
                <p className="text-sm" style={{ color: "var(--foreground)" }}>
                  {todo.text}
                </p>
              )}
              {todo.due_date && (
                <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {new Date(todo.due_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              )}
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setEditId(todo.id); setEditText(todo.text); }}
                style={{ color: "var(--muted-foreground)" }}
                className="hover:opacity-70"
              >
                <Pencil size={12} />
              </button>
              <button
                onClick={() => remove(todo.id)}
                style={{ color: "var(--muted-foreground)" }}
                className="hover:opacity-70"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Done */}
      {done.length > 0 && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs mb-2" style={{ color: "var(--muted-foreground)" }}>
            Completed ({done.length})
          </p>
          <div className="space-y-1.5 max-h-32 overflow-y-auto">
            {done.map((todo) => (
              <div key={todo.id} className="flex items-center gap-2 group">
                <button onClick={() => toggle(todo)} className="flex-shrink-0">
                  <CheckCircle2 size={15} style={{ color: "var(--accent)" }} />
                </button>
                <p
                  className="text-sm flex-1 line-through"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {todo.text}
                </p>
                <button
                  onClick={() => remove(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
