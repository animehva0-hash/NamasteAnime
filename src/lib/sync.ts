import { db } from "@/db";
import { animeCache, syncLog } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ANILIST_API } from "./constants";
import type { AnilistMedia } from "./anilist";

const MEDIA_FRAGMENT = `
  id idMal
  title { romaji english native }
  coverImage { extraLarge large medium color }
  bannerImage description format status season seasonYear
  episodes duration genres averageScore meanScore popularity trending favourites source
  studios { nodes { id name } }
  nextAiringEpisode { airingAt episode timeUntilAiring }
  startDate { year month day }
  endDate { year month day }
`;

async function fetchFromAnilist(query: string, variables: Record<string, unknown> = {}) {
  const res = await fetch(ANILIST_API, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 429) {
    await new Promise((r) => setTimeout(r, 5000));
    return fetchFromAnilist(query, variables);
  }
  if (!res.ok) throw new Error(`AniList ${res.status}`);
  return res.json();
}

function mediaToRow(m: AnilistMedia, category: string, rank: number) {
  return {
    anilistId: m.id,
    malId: m.idMal,
    titleRomaji: m.title.romaji,
    titleEnglish: m.title.english,
    titleNative: m.title.native,
    coverExtraLarge: m.coverImage.extraLarge,
    coverLarge: m.coverImage.large,
    coverMedium: m.coverImage.medium,
    coverColor: m.coverImage.color,
    bannerImage: m.bannerImage,
    description: m.description,
    format: m.format,
    status: m.status,
    season: m.season,
    seasonYear: m.seasonYear,
    episodes: m.episodes,
    duration: m.duration,
    genres: m.genres,
    averageScore: m.averageScore,
    meanScore: m.meanScore,
    popularity: m.popularity,
    trending: m.trending,
    favourites: m.favourites,
    source: m.source,
    studios: m.studios.nodes,
    nextAiringEpisode: m.nextAiringEpisode,
    startDate: m.startDate,
    endDate: m.endDate,
    category,
    categoryRank: rank,
    syncedAt: new Date(),
  };
}

type CategoryConfig = {
  category: string;
  query: string;
  variables: Record<string, unknown>;
};

const CATEGORIES: CategoryConfig[] = [
  {
    category: "trending",
    query: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:TRENDING_DESC){${MEDIA_FRAGMENT}}}}`,
    variables: { page: 1, perPage: 24 },
  },
  {
    category: "popular",
    query: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:POPULARITY_DESC){${MEDIA_FRAGMENT}}}}`,
    variables: { page: 1, perPage: 24 },
  },
  {
    category: "highrated",
    query: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:SCORE_DESC){${MEDIA_FRAGMENT}}}}`,
    variables: { page: 1, perPage: 24 },
  },
  {
    category: "updated",
    query: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:UPDATED_AT_DESC,status:RELEASING){${MEDIA_FRAGMENT}}}}`,
    variables: { page: 1, perPage: 24 },
  },
  {
    category: "added",
    query: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:ID_DESC){${MEDIA_FRAGMENT}}}}`,
    variables: { page: 1, perPage: 24 },
  },
  {
    category: "upcoming",
    query: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,status:NOT_YET_RELEASED,sort:POPULARITY_DESC){${MEDIA_FRAGMENT}}}}`,
    variables: { page: 1, perPage: 24 },
  },
  {
    category: "ongoing",
    query: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,status:RELEASING,sort:POPULARITY_DESC){${MEDIA_FRAGMENT}}}}`,
    variables: { page: 1, perPage: 24 },
  },
  {
    category: "completed",
    query: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,status:FINISHED,sort:POPULARITY_DESC){${MEDIA_FRAGMENT}}}}`,
    variables: { page: 1, perPage: 24 },
  },
];

export async function syncCategory(config: CategoryConfig) {
  try {
    const data = await fetchFromAnilist(config.query, config.variables);
    const mediaList: AnilistMedia[] = data.data.Page.media;

    // Delete old entries for this category
    await db.delete(animeCache).where(eq(animeCache.category, config.category));

    // Insert new entries
    for (let i = 0; i < mediaList.length; i++) {
      const row = mediaToRow(mediaList[i], config.category, i);
      await db.insert(animeCache).values(row);
    }

    // Log sync
    await db.insert(syncLog).values({
      category: config.category,
      itemCount: mediaList.length,
      status: "success",
    });

    return mediaList.length;
  } catch (err) {
    await db.insert(syncLog).values({
      category: config.category,
      status: `error: ${err instanceof Error ? err.message : "unknown"}`,
    });
    return 0;
  }
}

export async function syncAll() {
  const results: Record<string, number> = {};
  for (const config of CATEGORIES) {
    results[config.category] = await syncCategory(config);
    // Small delay between categories to avoid rate limit
    await new Promise((r) => setTimeout(r, 1500));
  }
  return results;
}

export async function needsSync(category: string, maxAgeHours = 6): Promise<boolean> {
  const rows = await db
    .select()
    .from(animeCache)
    .where(eq(animeCache.category, category))
    .limit(1);

  if (rows.length === 0) return true;

  const age = Date.now() - rows[0].syncedAt.getTime();
  return age > maxAgeHours * 3600 * 1000;
}

export async function getFromCache(category: string): Promise<AnilistMedia[]> {
  const rows = await db
    .select()
    .from(animeCache)
    .where(eq(animeCache.category, category))
    .orderBy(animeCache.categoryRank);

  return rows.map((r) => ({
    id: r.anilistId,
    idMal: r.malId,
    title: { romaji: r.titleRomaji, english: r.titleEnglish, native: r.titleNative },
    coverImage: { extraLarge: r.coverExtraLarge || "", large: r.coverLarge || "", medium: r.coverMedium || "", color: r.coverColor },
    bannerImage: r.bannerImage,
    description: r.description,
    format: r.format,
    status: r.status,
    season: r.season,
    seasonYear: r.seasonYear,
    episodes: r.episodes,
    duration: r.duration,
    genres: (r.genres as string[]) || [],
    averageScore: r.averageScore,
    meanScore: r.meanScore,
    popularity: r.popularity,
    trending: r.trending,
    favourites: r.favourites,
    source: r.source,
    studios: { nodes: (r.studios as { id: number; name: string }[]) || [] },
    nextAiringEpisode: r.nextAiringEpisode as AnilistMedia["nextAiringEpisode"],
    startDate: (r.startDate || { year: null, month: null, day: null }) as AnilistMedia["startDate"],
    endDate: (r.endDate || { year: null, month: null, day: null }) as AnilistMedia["endDate"],
    trailer: null,
    characters: { edges: [] },
    relations: { edges: [] },
    recommendations: { nodes: [] },
  }));
}

// Get cached detail or fetch fresh
export async function getCachedDetail(anilistId: number): Promise<AnilistMedia | null> {
  // Check if we have detail data (with characters etc)
  const rows = await db.select().from(animeCache)
    .where(and(eq(animeCache.anilistId, anilistId), eq(animeCache.category, "detail")))
    .limit(1);

  if (rows.length > 0) {
    const r = rows[0];
    const age = Date.now() - r.syncedAt.getTime();
    // Detail cache valid for 24 hours
    if (age < 24 * 3600 * 1000) {
      return {
        id: r.anilistId,
        idMal: r.malId,
        title: { romaji: r.titleRomaji, english: r.titleEnglish, native: r.titleNative },
        coverImage: { extraLarge: r.coverExtraLarge || "", large: r.coverLarge || "", medium: r.coverMedium || "", color: r.coverColor },
        bannerImage: r.bannerImage,
        description: r.description,
        format: r.format,
        status: r.status,
        season: r.season,
        seasonYear: r.seasonYear,
        episodes: r.episodes,
        duration: r.duration,
        genres: (r.genres as string[]) || [],
        averageScore: r.averageScore,
        meanScore: r.meanScore,
        popularity: r.popularity,
        trending: r.trending,
        favourites: r.favourites,
        source: r.source,
        studios: { nodes: (r.studios as { id: number; name: string }[]) || [] },
        nextAiringEpisode: r.nextAiringEpisode as AnilistMedia["nextAiringEpisode"],
        startDate: (r.startDate || { year: null, month: null, day: null }) as AnilistMedia["startDate"],
        endDate: (r.endDate || { year: null, month: null, day: null }) as AnilistMedia["endDate"],
        trailer: r.trailer as AnilistMedia["trailer"],
        characters: (r.characters || { edges: [] }) as AnilistMedia["characters"],
        relations: (r.relations || { edges: [] }) as AnilistMedia["relations"],
        recommendations: (r.recommendations || { nodes: [] }) as AnilistMedia["recommendations"],
      };
    }
  }

  return null;
}

export async function saveDetailToCache(anime: AnilistMedia) {
  // Delete old detail entry
  await db.delete(animeCache).where(
    and(eq(animeCache.anilistId, anime.id), eq(animeCache.category, "detail"))
  );

  const row = mediaToRow(anime, "detail", 0);
  await db.insert(animeCache).values({
    ...row,
    trailer: anime.trailer,
    characters: anime.characters,
    relations: anime.relations,
    recommendations: anime.recommendations,
  });
}
