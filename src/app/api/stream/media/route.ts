import { NextRequest } from "next/server";
import { getProviderRequestHeaders, type JustAnimeProvider } from "@/lib/justanime";
import { getBaseUrlFromRequest } from "@/lib/base-url";

export const dynamic = "force-dynamic";

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const PNG_HEADER_SIZE = 252;

function isPNG(buf: Uint8Array): boolean {
  if (buf.length < 8) return false;
  for (let i = 0; i < 8; i++) { if (buf[i] !== PNG_SIGNATURE[i]) return false; }
  return true;
}

function proxiedUrl(baseUrl: string, url: string, provider: string) {
  return `${baseUrl}/api/stream/media?url=${encodeURIComponent(url)}&provider=${encodeURIComponent(provider)}`;
}

function rewritePlaylist(text: string, sourceUrl: string, provider: string, baseUrl: string) {
  return text.split("\n").map((line) => {
    const t = line.trim();
    if (!t) return line;
    if (t.startsWith("#EXT-X-KEY") || t.startsWith("#EXT-X-MAP")) {
      return line.replace(/URI="([^"]+)"/g, (_, uri: string) => `URI="${proxiedUrl(baseUrl, new URL(uri, sourceUrl).toString(), provider)}"`);
    }
    if (t.startsWith("#")) return line;
    return proxiedUrl(baseUrl, new URL(t, sourceUrl).toString(), provider);
  }).join("\n");
}

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrlFromRequest(request);
  const url = request.nextUrl.searchParams.get("url");
  const provider = (request.nextUrl.searchParams.get("provider") || "momo") as JustAnimeProvider;

  if (!url) return new Response("Missing url", { status: 400 });

  const range = request.headers.get("range");
  try {
    const upstream = await fetch(url, {
      headers: { ...getProviderRequestHeaders(provider), ...(range ? { Range: range } : {}) },
      cache: "no-store",
    });
    if (!upstream.ok && upstream.status !== 206) return new Response(`Upstream ${upstream.status}`, { status: upstream.status });

    const ct = upstream.headers.get("content-type") || "";
    if (url.includes(".m3u8") || ct.includes("mpegurl")) {
      const text = await upstream.text();
      return new Response(rewritePlaylist(text, url, provider, baseUrl), {
        headers: { "Content-Type": "application/vnd.apple.mpegurl", "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" },
      });
    }

    const buf = await upstream.arrayBuffer();
    let data = new Uint8Array(buf);
    if (isPNG(data) && data.length > PNG_HEADER_SIZE) data = data.slice(PNG_HEADER_SIZE);

    return new Response(data, {
      headers: { "Content-Type": "video/mp2t", "Content-Length": String(data.length), "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" },
    });
  } catch { return new Response("Proxy error", { status: 502 }); }
}
