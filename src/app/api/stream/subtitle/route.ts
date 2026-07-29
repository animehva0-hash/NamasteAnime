import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return new Response("Missing url", { status: 400 });

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });

    if (!res.ok) return new Response("Subtitle fetch failed", { status: res.status });

    const body = await res.text();

    // Force correct content-type for VTT/ASS/SRT subtitles
    let contentType = "text/vtt; charset=utf-8";
    if (url.includes(".ass")) contentType = "text/plain; charset=utf-8";
    if (url.includes(".srt")) contentType = "text/plain; charset=utf-8";

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Subtitle proxy error", { status: 500 });
  }
}
