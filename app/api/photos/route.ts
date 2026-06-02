import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { google } from "googleapis";

// Fetches photos from Google Drive "Favourites" album (starred files), last 4 years
export async function GET() {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ photos: [] });
  }

  try {
    const oauth2 = new google.auth.OAuth2();
    oauth2.setCredentials({ access_token: session.accessToken });
    const drive = google.drive({ version: "v3", auth: oauth2 });

    const fourYearsAgo = new Date();
    fourYearsAgo.setFullYear(fourYearsAgo.getFullYear() - 4);

    const res = await drive.files.list({
      q: `starred = true and mimeType contains 'image/' and createdTime > '${fourYearsAgo.toISOString()}'`,
      fields: "files(id, name, thumbnailLink, webContentLink, createdTime)",
      pageSize: 50,
      orderBy: "createdTime desc",
    });

    const photos = (res.data.files || []).map((f) => ({
      id: f.id,
      name: f.name,
      url: f.thumbnailLink?.replace("=s220", "=s1200") ?? f.webContentLink,
    }));

    return NextResponse.json({ photos });
  } catch (err) {
    console.error("Photos fetch error:", err);
    return NextResponse.json({ photos: [] });
  }
}
