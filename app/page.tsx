import { auth, signIn } from "@/lib/auth";
import HomeClient from "@/components/home/HomeClient";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6"
        style={{ background: "var(--background)" }}
      >
        <h1
          className="text-7xl"
          style={{ fontFamily: "var(--font-dancing)", color: "var(--primary)" }}
        >
          Soleil
        </h1>
        <p
          className="text-xl"
          style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-cormorant)", fontStyle: "italic" }}
        >
          your personal dashboard
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button
            type="submit"
            className="mt-2 px-8 py-3 rounded-full text-sm tracking-widest uppercase transition-opacity hover:opacity-80"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
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
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <HomeClient firstName={firstName} greeting={greeting} today={today} />
  );
}
