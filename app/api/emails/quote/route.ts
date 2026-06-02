import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { google } from "googleapis";

// Fetches today's quote from Ursula le Huray's daily email
export async function GET() {
  const session = await auth();
  if (!session?.accessToken) return NextResponse.json({ quote: null });

  try {
    const oauth2 = new google.auth.OAuth2();
    oauth2.setCredentials({ access_token: session.accessToken });
    const gmail = google.gmail({ version: "v1", auth: oauth2 });

    const today = new Date().toISOString().split("T")[0].replace(/-/g, "/");

    const list = await gmail.users.messages.list({
      userId: "me",
      q: `from:ursula after:${today}`,
      maxResults: 1,
    });

    const messages = list.data.messages;
    if (!messages?.length) return NextResponse.json({ quote: null });

    const msg = await gmail.users.messages.get({
      userId: "me",
      id: messages[0].id!,
      format: "full",
    });

    const body = extractBody(msg.data);
    const quote = extractQuote(body);

    return NextResponse.json({ quote });
  } catch (err) {
    console.error("Quote fetch error:", err);
    return NextResponse.json({ quote: null });
  }
}

function extractBody(msg: any): string {
  const payload = msg.payload;
  if (!payload) return "";

  const findText = (part: any): string => {
    if (part.mimeType === "text/plain" && part.body?.data) {
      return Buffer.from(part.body.data, "base64").toString("utf-8");
    }
    if (part.parts) {
      for (const p of part.parts) {
        const text = findText(p);
        if (text) return text;
      }
    }
    return "";
  };

  return findText(payload);
}

function extractQuote(body: string): string | null {
  if (!body) return null;
  // Take the first non-empty meaningful line as the quote
  const lines = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 10 && !l.startsWith(">") && !l.startsWith("--"));

  return lines[0] ?? null;
}
