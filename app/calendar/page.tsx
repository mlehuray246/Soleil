import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CalendarView from "@/components/calendar/CalendarView";
import TodoList from "@/components/calendar/TodoList";

export default async function CalendarPage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--background)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1
          className="text-4xl font-light mb-8"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}
        >
          Calendar & Tasks
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <CalendarView />
          </div>
          <div className="lg:col-span-2">
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  );
}
