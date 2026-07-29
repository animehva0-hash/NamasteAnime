import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const CORE_API = "https://core.justanime.to/api";
const ORIGIN = "https://justanime.to";

export async function GET(request: NextRequest) {
  const animeId = request.nextUrl.searchParams.get("id");
  if (!animeId) return NextResponse.json({ hasDub: false });

  try {
    const res = await fetch(`${CORE_API}/watch/${animeId}/episode/1/anineko/dub/hd1`, {
      headers: { Origin: ORIGIN, Referer: `${ORIGIN}/`, Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return NextResponse.json({ hasDub: false });

    const text = await res.text();
    const hasDub = text.includes('"sources"') && !text.includes('"error"');
    return NextResponse.json({ hasDub });
  } catch {
    return NextResponse.json({ hasDub: false });
  }
}
