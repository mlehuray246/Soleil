import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DowntimeClient from "@/components/downtime/DowntimeClient";

export default async function DowntimePage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1
          className="text-4xl font-light mb-1"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}
        >
          Downtime
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--muted-foreground)" }}>
          Books to read · Shows & films to watch · What's next on your list.
        </p>
        <DowntimeClient />
      </div>
    </div>
  );
}
