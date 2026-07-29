import { NextRequest, NextResponse } from "next/server";
import { searchAnime, searchCharacters, searchStudios } from "@/lib/anilist";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "anime";
  const page = parseInt(searchParams.get("page") || "1");

  if (!q || q.length < 2) {
    return NextResponse.json({ media: [], pageInfo: null });
  }

  try {
    if (type === "character") {
      const data = await searchCharacters(q, page, 20);
      return NextResponse.json(data);
    }
    if (type === "studio") {
      const data = await searchStudios(q, page, 20);
      return NextResponse.json(data);
    }

    const data = await searchAnime(q, page, 20);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ media: [], pageInfo: null }, { status: 500 });
  }
}
