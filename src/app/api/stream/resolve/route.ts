import { NextRequest, NextResponse } from "next/server";
import { getJustAnimePayload, type JustAnimeAudio, type JustAnimeProvider } from "@/lib/justanime";
import { getBaseUrlFromRequest } from "@/lib/base-url";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrlFromRequest(request);

  const animeId = Number(request.nextUrl.searchParams.get("animeId"));
  const episode = Number(request.nextUrl.searchParams.get("ep"));
  const provider = (request.nextUrl.searchParams.get("provider") || "neko") as JustAnimeProvider;
  const audio = (request.nextUrl.searchParams.get("audio") || "sub") as JustAnimeAudio;

  if (!animeId || !episode) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const payload = await getJustAnimePayload(animeId, episode, provider, audio);
  if (!payload || !payload.sources?.length) {
    return NextResponse.json({ error: "Stream not available" });
  }

  const sorted = [...payload.sources].sort((a, b) =>
    (parseInt((b.quality || "0").replace(/\D/g, "")) || 0) - (parseInt((a.quality || "0").replace(/\D/g, "")) || 0)
  );

  const videoSrc = `${baseUrl}/api/stream/media?url=${encodeURIComponent(sorted[0].url)}&provider=${encodeURIComponent(provider)}`;

  const allSubs = [...(payload.subtitles || []), ...(payload.tracks || [])];
  const subtitles = allSubs
    .map((t) => {
      const file = t.file || t.url;
      if (!file) return null;
      const label = t.label || t.lang || "English";
      const lang = label.toLowerCase().includes("eng") ? "en" : label.toLowerCase().includes("spa") ? "es" : "en";
      return { src: `${baseUrl}/api/stream/subtitle?url=${encodeURIComponent(file)}`, label, lang };
    })
    .filter(Boolean);

  return NextResponse.json({ videoSrc, subtitles });
}
