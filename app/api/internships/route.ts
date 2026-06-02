import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY! });
const DATABASE_ID = "d132bedc-0da3-4535-b585-3e307a8dbc2a";

export async function GET() {
  try {
    const res = await (notion as any).databases.query({
      database_id: DATABASE_ID,
      sorts: [{ property: "Deadline", direction: "ascending" }],
    });

    const internships = res.results.map((page: any) => {
      const props = page.properties;
      return {
        id: page.id,
        company: props.Company?.title?.[0]?.plain_text ?? "",
        role: props.Role?.rich_text?.[0]?.plain_text ?? "",
        sector: props.Sector?.select?.name ?? "",
        status: props.Status?.select?.name ?? "",
        location: props.Location?.select?.name ?? "",
        deadline: props.Deadline?.date?.start ?? null,
        contact: props.Contact?.rich_text?.[0]?.plain_text ?? "",
        notes: props.Notes?.rich_text?.[0]?.plain_text ?? "",
        url: page.url,
      };
    });

    return NextResponse.json({ internships });
  } catch (err) {
    console.error("Notion internships error:", err);
    return NextResponse.json({ internships: [] });
  }
}
