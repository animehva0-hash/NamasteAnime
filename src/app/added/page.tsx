import { Suspense } from "react";
import { getFromCache, needsSync, syncCategory } from "@/lib/sync";
import AnimeGrid from "@/components/AnimeGrid";
import { GridSkeleton } from "@/components/LoadingSkeleton";
import ErrorFallback from "@/components/ErrorFallback";

export const dynamic = "force-dynamic";

const MF = `id idMal title{romaji english native}coverImage{extraLarge large medium color}bannerImage description format status season seasonYear episodes duration genres averageScore meanScore popularity trending favourites source studios{nodes{id name}}nextAiringEpisode{airingAt episode timeUntilAiring}startDate{year month day}endDate{year month day}`;

async function Content() {
  try {
    if (await needsSync("added", 6)) {
      await syncCategory({ category: "added", query: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,sort:ID_DESC){${MF}}}}`, variables: { page: 1, perPage: 24 } }).catch(() => {});
    }
    const data = await getFromCache("added");
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Recently Added</h1>
        <p className="text-text-secondary text-sm mb-6">Served from database cache</p>
        <AnimeGrid anime={data} />
      </div>
    );
  } catch { return <ErrorFallback />; }
}

export default function Page() {
  return <Suspense fallback={<GridSkeleton />}><Content /></Suspense>;
}
