import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const photosDir = path.join(process.cwd(), "public", "photos");

  try {
    const files = fs.readdirSync(photosDir).filter((f) =>
      /\.(jpe?g|png|webp)$/i.test(f)
    );

    // Shuffle once per request — only changes on page refresh
    const shuffled = [...files]
      .map((f) => ({ f, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ f }) => f);

    const photos = shuffled.map((filename) => ({
      id: filename,
      name: filename,
      url: `/photos/${encodeURIComponent(filename)}`,
    }));

    return NextResponse.json({ photos });
  } catch (err) {
    console.error("Photos read error:", err);
    return NextResponse.json({ photos: [] });
  }
}
