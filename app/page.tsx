import { auth, signIn } from "@/lib/auth";
import PhotoBackground from "@/components/home/PhotoBackground";
import QuoteCard from "@/components/home/QuoteCard";
import TodoWidget from "@/components/home/TodoWidget";
import EmailWidget from "@/components/home/EmailWidget";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: "var(--background)" }}
      >
        <h1
          className="text-6xl"
          style={{ fontFamily: "var(--font-dancing)", color: "var(--primary)" }}
        >
          Soleil
        </h1>
        <p
          className="text-lg"
          style={{
            color: "var(--muted-foreground)",
            fontFamily: "var(--font-cormorant)",
          }}
        >
          Your personal dashboard
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button
            type="submit"
            className="px-8 py-3 rounded-full text-sm tracking-widest uppercase transition-opacity hover:opacity-80"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            Sign in with Google
          </button>
        </form>
      </div>
    );
  }

  const firstName = session.user?.name?.split(" ")[0] ?? "Martha";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="relative min-h-screen">
      <PhotoBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <p
            className="text-sm tracking-widest uppercase mb-1"
            style={{ color: "var(--muted-foreground)" }}
          >
            {today}
          </p>
          <h1
            className="text-5xl font-light"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--primary)" }}
          >
            {greeting},{" "}
            <span style={{ fontFamily: "var(--font-dancing)", fontWeight: 600 }}>
              {firstName}
            </span>
          </h1>
        </div>

        {/* Widget grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <QuoteCard />
          <TodoWidget />
          <EmailWidget />
        </div>
      </div>
    </div>
  );
}
