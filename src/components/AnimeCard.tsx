"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Play, Mic, Subtitles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimeCardProps {
  id: number;
  title: string;
  image: string;
  score?: number | null;
  format?: string | null;
  episodes?: number | null;
  status?: string | null;
  genres?: string[];
  popularity?: number | null;
  nextEpisode?: { episode: number; timeUntilAiring: number } | null;
  className?: string;
}

export default function AnimeCard({
  id, title, image, score, format, episodes, status, genres, nextEpisode, className,
}: AnimeCardProps) {
  // New episode badge: if airing and next episode coming within 24 hours or just aired
  const hasNewEp = status === "RELEASING" && nextEpisode && nextEpisode.timeUntilAiring < 86400;

  return (
    <Link href={`/anime/${id}`} className={cn("group block", className)}>
      <div className="anime-card-hover relative rounded-lg sm:rounded-xl overflow-hidden bg-card border border-border/20 hover:border-highlight/30 transition-all duration-300">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image src={image} alt={title} fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 480px) 45vw, (max-width: 640px) 30vw, (max-width: 1024px) 25vw, 16vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-highlight/90 flex items-center justify-center shadow-lg">
              <Play size={16} className="text-white ml-0.5 sm:hidden" fill="white" />
              <Play size={20} className="text-white ml-0.5 hidden sm:block" fill="white" />
            </div>
          </div>

          {score && (
            <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] sm:text-xs">
              <Star size={10} className="text-yellow-400" fill="#facc15" />
              <span className="text-yellow-400 font-semibold">{(score / 10).toFixed(1)}</span>
            </div>
          )}

          {format && (
            <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 px-1.5 py-0.5 rounded-md bg-accent/80 backdrop-blur-sm text-[8px] sm:text-[10px] font-bold text-white uppercase">
              {format}
            </div>
          )}

          {/* New Episode badge */}
          {hasNewEp && (
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 sm:top-2 px-2 py-0.5 rounded-md bg-highlight/90 text-[8px] sm:text-[9px] font-bold text-white animate-pulse">
              NEW EP
            </div>
          )}

          {/* SUB badge always */}
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 flex items-center gap-1">
            <span className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-blue-600/90 text-[8px] sm:text-[9px] font-bold text-white">
              <Subtitles size={8} /> SUB
            </span>
          </div>

          {status === "RELEASING" && !hasNewEp && (
            <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 px-1 py-0.5 rounded bg-green-500/90 text-[8px] sm:text-[9px] font-bold text-white">
              Airing
            </div>
          )}
        </div>

        <div className="p-2 sm:p-3">
          <h3 className="text-xs sm:text-sm font-semibold text-white line-clamp-2 leading-tight group-hover:text-highlight transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 sm:mt-2 flex-wrap">
            {episodes && <span className="text-[9px] sm:text-[10px] text-text-muted">{episodes} eps</span>}
            {genres && genres.length > 0 && (
              <span className="text-[9px] sm:text-[10px] text-text-muted truncate max-w-[80px] sm:max-w-[120px]">
                {genres.slice(0, 2).join(" • ")}
              </span>
            )}
          </div>
          {nextEpisode && !hasNewEp && (
            <div className="mt-1 text-[9px] sm:text-[10px] text-highlight font-medium">EP {nextEpisode.episode} soon</div>
          )}
        </div>
      </div>
    </Link>
  );
}
