import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SummerClient from "@/components/summer/SummerClient";

export default async function SummerPage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1
          className="text-4xl font-light mb-1"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}
        >
          Summer Plan
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--muted-foreground)" }}>
          12 weeks · 2 hours a day · June 4 – August 23
        </p>
        <SummerClient />
      </div>
    </div>
  );
}
