import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function GET() {
  try {
    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a research assistant curating articles for a Harvard student interested in healthcare, education, and food security.

Generate 6 recent, substantive articles from reputable sources (The Lancet, BMJ, NEJM, Brookings, Gates Foundation, WHO, World Food Programme, UN, McKinsey Global Institute, The Economist, Nature, Science, Harvard Health, etc.) covering healthcare, global education, and food security.

For each article provide a realistic title, source, date (within last 3 months from June 2026), a 2-sentence summary, and a plausible URL from that publication.

Return as JSON array only:
[
  {
    "title": "...",
    "source": "...",
    "date": "...",
    "summary": "...",
    "url": "...",
    "category": "Healthcare" | "Education" | "Food Security"
  }
]`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "[]";
    const articles = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] ?? "[]");
    return NextResponse.json({ articles });
  } catch (err) {
    console.error("Articles error:", err);
    return NextResponse.json({ articles: [] });
  }
}
