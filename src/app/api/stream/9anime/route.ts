import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function resolveEmbed(pageUrl: string): Promise<string | null> {
  const res = await fetch(pageUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "text/html,application/xhtml+xml",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const html = await res.text();
  const match = html.match(/<iframe[^>]*src=["']([^"']+)["']/i);
  if (!match?.[1]) return null;
  return match[1].replace(/&amp;/g, "&");
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ep = searchParams.get("ep") || "1";
  const mode = searchParams.get("mode") === "dub" ? "dub" : "sub";
  const candidates = [
    searchParams.get("en") || "",
    searchParams.get("ro") || "",
    searchParams.get("na") || "",
  ]
    .map((t) => t.trim())
    .filter(Boolean);

  if (candidates.length === 0) {
    return new NextResponse("Missing title candidates", { status: 400 });
  }

  const tried = new Set<string>();

  for (const title of candidates) {
    const slug = slugify(title);
    if (!slug || tried.has(slug)) continue;
    tried.add(slug);

    const pageUrl =
      mode === "dub"
        ? `https://9anime.org.lv/${slug}-dub-episode-${ep}/`
        : `https://9anime.org.lv/${slug}-episode-${ep}/`;

    try {
      const embed = await resolveEmbed(pageUrl);
      if (embed) {
        return NextResponse.redirect(embed, 307);
      }
    } catch {
      // try next candidate
    }
  }

  return new NextResponse("9anime stream not found", { status: 404 });
}
