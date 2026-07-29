import type { AnilistMedia } from "@/lib/anilist";
import AnimeCard from "./AnimeCard";

interface AnimeGridProps {
  anime: AnilistMedia[];
  className?: string;
}

export default function AnimeGrid({ anime, className }: AnimeGridProps) {
  if (!anime || anime.length === 0) {
    return <div className="text-center py-12 text-text-muted">No anime found.</div>;
  }
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3 md:gap-4 ${className || ""}`}>
      {anime.map((a, i) => (
        <div key={a.id} className="animate-fade-in" style={{ animationDelay: `${i * 20}ms` }}>
          <AnimeCard
            id={a.id}
            title={a.title.english || a.title.romaji}
            image={a.coverImage.extraLarge || a.coverImage.large}
            score={a.averageScore}
            format={a.format}
            episodes={a.episodes}
            status={a.status}
            genres={a.genres}
            popularity={a.popularity}
            nextEpisode={a.nextAiringEpisode}
          />
        </div>
      ))}
    </div>
  );
}
