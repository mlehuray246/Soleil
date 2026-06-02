import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import GoalsClient from "@/components/goals/GoalsClient";

export default async function GoalsPage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1
          className="text-4xl font-light mb-2"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}
        >
          Life Goals
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--muted-foreground)" }}>
          Where you are going — short, medium, and long term.
        </p>
        <GoalsClient />
      </div>
    </div>
  );
}
