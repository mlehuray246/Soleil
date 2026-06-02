import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { google } from "googleapis";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

async function fetchGmailMessages(accessToken: string) {
  const oauth2 = new google.auth.OAuth2();
  oauth2.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth: oauth2 });

  const list = await gmail.users.messages.list({
    userId: "me",
    q: "is:unread newer_than:3d",
    maxResults: 30,
  });

  const messages = list.data.messages || [];
  const full = await Promise.all(
    messages.slice(0, 20).map((m) =>
      gmail.users.messages.get({
        userId: "me",
        id: m.id!,
        format: "metadata",
        metadataHeaders: ["From", "Subject", "Date"],
      })
    )
  );

  return full.map((m) => {
    const headers = m.data.payload?.headers || [];
    const get = (name: string) =>
      headers.find((h) => h.name === name)?.value ?? "";
    return {
      id: m.data.id,
      from: get("From"),
      subject: get("Subject"),
      date: get("Date"),
      snippet: m.data.snippet ?? "",
    };
  });
}

async function triageWithAI(
  emails: { from: string; subject: string; snippet: string; date: string }[]
) {
  if (!emails.length) return [];

  const prompt = `You are reviewing emails for Martha, a Harvard junior (Applied Math + CS, field hockey athlete).
Identify which emails genuinely require a response from her. Exclude newsletters, automated notifications, receipts, marketing, and FYI-only emails.

Emails:
${emails.map((e, i) => `${i + 1}. From: ${e.from}\nSubject: ${e.subject}\nSnippet: ${e.snippet}`).join("\n\n")}

Return ONLY a JSON array of the indices (1-based) of emails requiring a response, with a brief reason each. Format:
[{"index": 1, "reason": "Brief reason"}, ...]`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const text =
      response.content[0].type === "text" ? response.content[0].text : "[]";
    const parsed = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] ?? "[]");
    return parsed.map((item: { index: number; reason: string }) => ({
      ...emails[item.index - 1],
      reason: item.reason,
    }));
  } catch {
    return [];
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) return NextResponse.json({ emails: [] });

  try {
    const gmailEmails = await fetchGmailMessages(session.accessToken);
    const actionable = await triageWithAI(gmailEmails);
    return NextResponse.json({ emails: actionable });
  } catch (err) {
    console.error("Email fetch error:", err);
    return NextResponse.json({ emails: [] });
  }
}
