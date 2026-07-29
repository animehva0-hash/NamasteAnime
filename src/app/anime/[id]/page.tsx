import { Suspense } from "react";
import { getAnimeDetails } from "@/lib/anilist";
import { getCachedDetail, saveDetailToCache } from "@/lib/sync";
import { DetailSkeleton } from "@/components/LoadingSkeleton";
import AnimeDetailView from "@/components/AnimeDetailView";
import ErrorFallback from "@/components/ErrorFallback";

export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }>; }

async function Content({ params }: Props) {
  const { id } = await params;
  const animeId = parseInt(id);
  if (isNaN(animeId)) return <ErrorFallback message="Invalid anime ID" />;

  try {
    // 1. Try database cache first (0 API calls)
    const cached = await getCachedDetail(animeId);
    if (cached) return <AnimeDetailView anime={cached} />;

    // 2. Cache miss — fetch from AniList (1 API call) then save to DB
    const anime = await getAnimeDetails(animeId);
    if (!anime) return <ErrorFallback message="Anime not found" />;

    // Save to cache for next time (non-blocking)
    saveDetailToCache(anime).catch(() => {});

    return <AnimeDetailView anime={anime} />;
  } catch {
    return <ErrorFallback message="Failed to load. Please reload." />;
  }
}

export default function Page(props: Props) {
  return <Suspense fallback={<DetailSkeleton />}><Content {...props} /></Suspense>;
}
