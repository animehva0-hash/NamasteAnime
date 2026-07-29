import { Suspense } from "react";
import { getFromCache, needsSync, syncCategory } from "@/lib/sync";
import type { AnilistMedia } from "@/lib/anilist";
import AnimeGrid from "@/components/AnimeGrid";
import HeroBanner from "@/components/HeroBanner";
import SectionHeader from "@/components/SectionHeader";
import { GridSkeleton, BannerSkeleton } from "@/components/LoadingSkeleton";
import ContinueWatchingSection from "@/components/ContinueWatchingSection";

export const dynamic = "force-dynamic";

const MEDIA_FRAGMENT = `
  id idMal title { romaji english native }
  coverImage { extraLarge large medium color }
  bannerImage description format status season seasonYear
  episodes duration genres averageScore meanScore popularity trending favourites source
  studios { nodes { id name } }
  nextAiringEpisode { airingAt episode timeUntilAiring }
  startDate { year month day } endDate { year month day }
`;

async function ensureCategory(category: string): Promise<AnilistMedia[]> {
  // Check if cache is stale
  if (await needsSync(category, 6)) {
    const queries: Record<string, string> = {
      trending: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:TRENDING_DESC){${MEDIA_FRAGMENT}}}}`,
      popular: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:POPULARITY_DESC){${MEDIA_FRAGMENT}}}}`,
      highrated: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:SCORE_DESC){${MEDIA_FRAGMENT}}}}`,
      updated: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:UPDATED_AT_DESC,status:RELEASING){${MEDIA_FRAGMENT}}}}`,
      added: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:ID_DESC){${MEDIA_FRAGMENT}}}}`,
    };
    try {
      await syncCategory({ category, query: queries[category] || queries.trending, variables: { page: 1, perPage: 24 } });
    } catch { /* use stale cache */ }
  }
  return getFromCache(category);
}

async function HomeContent() {
  const [trending, popular, highrated, updated, added] = await Promise.all([
    ensureCategory("trending"),
    ensureCategory("popular"),
    ensureCategory("highrated"),
    ensureCategory("updated"),
    ensureCategory("added"),
  ]);

  return (
    <>
      {trending.length > 0 && <HeroBanner anime={trending} />}

      {trending.length > 0 && (
        <section className="mb-8 sm:mb-10">
          <SectionHeader title="🔥 Trending Anime" href="/popular" />
          <AnimeGrid anime={trending.slice(0, 12)} />
        </section>
      )}

      <ContinueWatchingSection />

      {popular.length > 0 && (
        <section className="mb-8 sm:mb-10">
          <SectionHeader title="⭐ Popular Anime" href="/popular" />
          <AnimeGrid anime={popular.slice(0, 12)} />
        </section>
      )}

      {highrated.length > 0 && (
        <section className="mb-8 sm:mb-10">
          <SectionHeader title="🏆 Highest Rated" />
          <AnimeGrid anime={highrated.slice(0, 12)} />
        </section>
      )}

      {updated.length > 0 && (
        <section className="mb-8 sm:mb-10">
          <SectionHeader title="🆕 Recently Updated" href="/updated" />
          <AnimeGrid anime={updated.slice(0, 12)} />
        </section>
      )}

      {added.length > 0 && (
        <section className="mb-8 sm:mb-10">
          <SectionHeader title="✨ Recently Added" href="/added" />
          <AnimeGrid anime={added.slice(0, 12)} />
        </section>
      )}
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<><BannerSkeleton /><GridSkeleton count={12} /></>}>
      <HomeContent />
    </Suspense>
  );
}
