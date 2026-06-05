import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Dancing_Script } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import Navigation from "@/components/layout/Navigation";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Soleil",
  description: "Martha's personal dashboard",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Soleil",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: "/icons/icon-32.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#3D4A2E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} ${dancing.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
      >
        <SessionProvider session={session}>
          <Navigation />
          <main className="flex-1">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
