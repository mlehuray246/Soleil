import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { google } from "googleapis";

export async function GET() {
  const session = await auth();
  if (!session?.accessToken) return NextResponse.json({ events: [] });

  try {
    const oauth2 = new google.auth.OAuth2();
    oauth2.setCredentials({ access_token: session.accessToken });
    const calendar = google.calendar({ version: "v3", auth: oauth2 });

    const now = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 30);

    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: now.toISOString(),
      timeMax: end.toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = (res.data.items || []).map((e) => ({
      id: e.id,
      title: e.summary,
      start: e.start?.dateTime ?? e.start?.date,
      end: e.end?.dateTime ?? e.end?.date,
      allDay: !e.start?.dateTime,
      location: e.location,
      color: e.colorId,
    }));

    return NextResponse.json({ events });
  } catch (err) {
    console.error("Calendar fetch error:", err);
    return NextResponse.json({ events: [] });
  }
}
