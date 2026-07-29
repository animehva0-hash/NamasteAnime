// Server label → actual API provider mapping
// All "neko/pain/cero/xoro" use anineko endpoint
// "momo" uses megaplay endpoint
// "gigl" uses animegg endpoint
// "baka/vibe/pain" for anisnatch endpoint (currently 502 — handled gracefully)

export type JustAnimeProvider = "neko" | "momo" | "gigl" | "pain" | "cero" | "xoro" | "baka" | "vibe";
export type JustAnimeAudio = "sub" | "hsub" | "dub";

export interface JustAnimeTrack {
  file?: string; url?: string; label?: string; lang?: string; kind?: string; default?: boolean;
}

export interface JustAnimeSource {
  url: string; quality?: string; isM3U8?: boolean; headers?: Record<string, string>;
}

export interface JustAnimePayload {
  sources: JustAnimeSource[];
  subtitles?: JustAnimeTrack[];
  tracks?: JustAnimeTrack[];
  headers?: Record<string, string>;
  error?: string;
}

const CORE_API = "https://core.justanime.to/api";
const ORIGIN = "https://justanime.to";

function coreHeaders() {
  return { Origin: ORIGIN, Referer: `${ORIGIN}/`, "User-Agent": "Mozilla/5.0", Accept: "application/json" };
}

async function fetchCore(path: string): Promise<unknown> {
  const res = await fetch(`${CORE_API}${path}`, { headers: coreHeaders(), next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const text = await res.text();
  if (text.includes("error code:")) throw new Error(text.trim());
  try { return JSON.parse(text); } catch { throw new Error("Invalid response"); }
}

// Map provider label to actual API endpoint
function getEndpointPath(animeId: number, ep: number, provider: JustAnimeProvider, audio: JustAnimeAudio): string {
  // momo = megaplay
  if (provider === "momo") return `/watch/${animeId}/episode/${ep}/megaplay`;
  // gigl = animegg
  if (provider === "gigl") return `/watch/${animeId}/episode/${ep}/animegg`;
  // neko, pain, cero, xoro = all use anineko/hd1
  if (provider === "neko" || provider === "pain" || provider === "cero" || provider === "xoro") {
    return `/watch/${animeId}/episode/${ep}/anineko/${audio}/hd1`;
  }
  // baka, vibe = anisnatch (may 502 but handled)
  if (provider === "baka" || provider === "vibe") {
    const variantMap: Record<string, string> = { baka: "baka", vibe: "vibe" };
    return `/watch/${animeId}/episode/${ep}/anisnatch/${audio}/${variantMap[provider]}`;
  }
  return `/watch/${animeId}/episode/${ep}/anineko/${audio}/hd1`;
}

export async function getJustAnimePayload(
  animeId: number, episode: number, provider: JustAnimeProvider, audio: JustAnimeAudio,
): Promise<JustAnimePayload | null> {
  try {
    const path = getEndpointPath(animeId, episode, provider, audio);

    // megaplay and animegg return {sub:{...}, dub:{...}} format
    if (provider === "momo" || provider === "gigl") {
      if (audio === "hsub") return null; // these don't support hsub
      const data = (await fetchCore(path)) as Record<string, JustAnimePayload>;
      return data[audio] ?? null;
    }

    // anineko/anisnatch return flat {sources:[...]} format
    const data = (await fetchCore(path)) as JustAnimePayload;
    if (data?.error || !Array.isArray(data?.sources) || data.sources.length === 0) return null;
    return data;
  } catch {
    return null; // graceful fail — server just won't play
  }
}

export function getProviderRequestHeaders(provider: JustAnimeProvider): Record<string, string> {
  if (provider === "neko" || provider === "pain" || provider === "cero" || provider === "xoro")
    return { Referer: "https://vivibebe.site/", Origin: "https://vivibebe.site", "User-Agent": "Mozilla/5.0" };
  if (provider === "gigl")
    return { Referer: "https://www.animegg.org/", "User-Agent": "Mozilla/5.0" };
  return { Referer: "https://megaplay.buzz/", Origin: "https://megaplay.buzz", "User-Agent": "Mozilla/5.0" };
}
