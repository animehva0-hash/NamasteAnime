import { Suspense } from "react";
import { getFromCache, needsSync, syncCategory } from "@/lib/sync";
import AnimeGrid from "@/components/AnimeGrid";
import CountdownTimer from "@/components/CountdownTimer";
import { GridSkeleton } from "@/components/LoadingSkeleton";
import ErrorFallback from "@/components/ErrorFallback";
import { Calendar, Clock } from "lucide-react";

export const dynamic = "force-dynamic";
const MF = `id idMal title{romaji english native}coverImage{extraLarge large medium color}bannerImage description format status season seasonYear episodes duration genres averageScore meanScore popularity trending favourites source studios{nodes{id name}}nextAiringEpisode{airingAt episode timeUntilAiring}startDate{year month day}endDate{year month day}`;

async function Content() {
  try {
    if (await needsSync("upcoming", 6)) {
      await syncCategory({ category: "upcoming", query: `query($page:Int,$perPage:Int){Page(page:$page,perPage:$perPage){media(type:ANIME,status:NOT_YET_RELEASED,sort:POPULARITY_DESC){${MF}}}}`, variables: { page: 1, perPage: 24 } }).catch(() => {});
    }
    const data = await getFromCache("upcoming");

    // Separate: with countdown vs without
    const withCountdown = data.filter((a) => a.nextAiringEpisode);
    const withoutCountdown = data.filter((a) => !a.nextAiringEpisode);

    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Upcoming Anime</h1>
        <p className="text-text-secondary text-sm mb-6">Not yet released</p>

        {/* Countdown section */}
        {withCountdown.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {withCountdown.slice(0, 6).map((anime) => (
              <div key={anime.id} className="p-3 sm:p-4 rounded-xl bg-card border border-border/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-highlight/20 flex items-center justify-center flex-shrink-0">
                  <Clock size={18} className="text-highlight" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-white truncate">{anime.title.english || anime.title.romaji}</p>
                  <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                    <Calendar size={10} />
                    <span>EP {anime.nextAiringEpisode!.episode} in </span>
                    <CountdownTimer airingAt={anime.nextAiringEpisode!.airingAt} className="text-highlight font-semibold" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AnimeGrid anime={[...withCountdown, ...withoutCountdown]} />
      </div>
    );
  } catch { return <ErrorFallback />; }
}

export default function Page() {
  return <Suspense fallback={<GridSkeleton />}><Content /></Suspense>;
}
