export interface StreamServer {
  name: string;
  type: "sub" | "hardsub" | "dub";
  url: string;
}

export interface StreamContext {
  anilistId: number;
  malId: number | null;
  episode: number;
  titles: { english?: string | null; romaji: string; native?: string | null };
}

function getDirectServers({ anilistId, malId, episode }: StreamContext): StreamServer[] {
  const mid = malId ?? anilistId;
  const b = `https://megaplay.buzz/stream`;
  return [
    { name: "Server 1", type: "sub", url: `${b}/mal/${mid}/${episode}/sub` },
    { name: "Server 2", type: "sub", url: `${b}/ani/${anilistId}/${episode}/sub` },
    { name: "English Dub 1", type: "dub", url: `${b}/mal/${mid}/${episode}/dub` },
    { name: "English Dub 2", type: "dub", url: `${b}/ani/${anilistId}/${episode}/dub` },
  ];
}

function getResolverServers({ episode, titles }: StreamContext): StreamServer[] {
  const build = (mode: string) => {
    const p = new URLSearchParams({ ep: String(episode), mode, en: titles.english || "", ro: titles.romaji || "" });
    return `/api/stream/9anime?${p.toString()}`;
  };
  return [
    { name: "Server 3", type: "sub", url: build("sub") },
    { name: "English Dub 3", type: "dub", url: build("dub") },
  ];
}

function getEmbedServers({ anilistId, episode, titles }: StreamContext): StreamServer[] {
  const build = (provider: string, audio: string) => {
    const p = new URLSearchParams({
      animeId: String(anilistId), ep: String(episode), provider, audio,
      title: titles.english || titles.romaji || "",
    });
    return `/api/embed/justanime?${p.toString()}`;
  };

  return [
    // Sub: Neko, Momo, Gigl (as requested)
    { name: "Neko", type: "sub", url: build("neko", "sub") },
    { name: "Momo", type: "sub", url: build("momo", "sub") },
    { name: "Gigl", type: "sub", url: build("gigl", "sub") },
    // Hard Sub: Neko, Pain, Cero, Xoro (as requested)
    { name: "Neko", type: "hardsub", url: build("neko", "hsub") },
    { name: "Pain", type: "hardsub", url: build("pain", "hsub") },
    { name: "Cero", type: "hardsub", url: build("cero", "hsub") },
    { name: "Xoro", type: "hardsub", url: build("xoro", "hsub") },
    // Dub: Neko, Momo, Gigl, Baka, Vibe, Pain (as requested)
    { name: "Neko", type: "dub", url: build("neko", "dub") },
    { name: "Momo", type: "dub", url: build("momo", "dub") },
    { name: "Gigl", type: "dub", url: build("gigl", "dub") },
    { name: "Baka", type: "dub", url: build("baka", "dub") },
    { name: "Vibe", type: "dub", url: build("vibe", "dub") },
    { name: "Pain", type: "dub", url: build("pain", "dub") },
  ];
}

export function getAllServers(context: StreamContext): StreamServer[] {
  return [
    ...getDirectServers(context),
    ...getResolverServers(context),
    ...getEmbedServers(context),
  ];
}

export function getServersByType(servers: StreamServer[], type: "sub" | "hardsub" | "dub"): StreamServer[] {
  return servers.filter((s) => s.type === type);
}
