import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import WellnessClient from "@/components/wellness/WellnessClient";

export default async function WellnessPage() {
  const session = await auth();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1
          className="text-4xl font-light mb-2"
          style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}
        >
          Wellness
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--muted-foreground)" }}>
          Private — stored securely in your personal database.
        </p>
        <WellnessClient />
      </div>
    </div>
  );
}
