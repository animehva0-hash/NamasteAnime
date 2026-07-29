"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star, Calendar, Clock, Film, Users, Heart, Play,
  Bookmark, BookmarkCheck
} from "lucide-react";
import type { AnilistMedia } from "@/lib/anilist";
import { getAllServers } from "@/lib/streaming";
import type { StreamServer } from "@/lib/streaming";
import Player from "./Player";
import EpisodeCard from "./EpisodeCard";
import CountdownTimer from "./CountdownTimer";
import AnimeCard from "./AnimeCard";

interface Props {
  anime: AnilistMedia;
}

export default function AnimeDetailView({ anime }: Props) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [servers, setServers] = useState<StreamServer[]>([]);
  const [playerKey, setPlayerKey] = useState(0);
  const [hasDub, setHasDub] = useState(false);

  const getAiredEpisodes = () => {
    if (anime.status === "FINISHED") return anime.episodes || 1;
    if (anime.nextAiringEpisode) return Math.max(anime.nextAiringEpisode.episode - 1, 1);
    if (anime.status === "NOT_YET_RELEASED") return 0;
    return anime.episodes || 1;
  };
  const airedEpisodes = getAiredEpisodes();

  // Runtime dub check from JustAnime API
  useEffect(() => {
    fetch(`/api/dub-check?id=${anime.id}`)
      .then((r) => r.json())
      .then((data) => { if (data?.hasDub) setHasDub(true); })
      .catch(() => {});
  }, [anime.id]);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setIsBookmarked(data.some((b: { animeId: number }) => b.animeId === anime.id));
      })
      .catch(() => {});
  }, [anime.id]);

  const toggleBookmark = async () => {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          animeId: anime.id, title: anime.title.english || anime.title.romaji,
          coverImage: anime.coverImage.large, format: anime.format, status: anime.status,
          genres: anime.genres, score: anime.averageScore, episodes: anime.episodes,
        }),
      });
      const data = await res.json();
      setIsBookmarked(data.bookmarked);
    } catch { /* ignore */ }
  };

  const startWatching = useCallback((ep: number) => {
    setCurrentEpisode(ep);
    setShowPlayer(true);
    setPlayerKey((k) => k + 1);
    let allServers = getAllServers({
      anilistId: anime.id, malId: anime.idMal, episode: ep,
      titles: { english: anime.title.english, romaji: anime.title.romaji, native: anime.title.native },
    });
    // Only show dub servers if anime has confirmed English dub
    if (!hasDub) {
      allServers = allServers.filter((s) => s.type !== "dub");
    }
    setServers(allServers);
    fetch("/api/watch-history", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        animeId: anime.id, title: anime.title.english || anime.title.romaji,
        coverImage: anime.coverImage.large, episodeNumber: ep, totalEpisodes: anime.episodes,
      }),
    }).catch(() => {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [anime, hasDub]);

  const bgImage = anime.bannerImage || anime.coverImage.extraLarge;

  return (
    <div className="-mx-3 sm:-mx-4 lg:-mx-6 -mt-4 sm:-mt-6">
      {showPlayer && (
        <div className="px-3 sm:px-4 lg:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
          <Player key={playerKey} servers={servers} title={anime.title.english || anime.title.romaji} episodeNumber={currentEpisode} />
        </div>
      )}

      <div className="relative w-full h-[200px] sm:h-[280px] lg:h-[350px]">
        <Image src={bgImage} alt={anime.title.romaji} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface/80 to-transparent" />
      </div>

      <div className="px-3 sm:px-4 lg:px-6 -mt-24 sm:-mt-32 relative z-10">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="relative w-32 h-48 sm:w-44 sm:h-64 rounded-xl overflow-hidden shadow-2xl border-2 border-border/30">
              <Image src={anime.coverImage.extraLarge || anime.coverImage.large} alt={anime.title.romaji} fill className="object-cover" sizes="176px" priority />
            </div>
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex items-start gap-2 flex-wrap justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                {anime.title.english || anime.title.romaji}
              </h1>
              {hasDub && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-400 text-xs font-semibold mt-1">DUB</span>
              )}
            </div>

            {anime.title.native && <p className="text-sm text-text-muted mt-1">{anime.title.native}</p>}

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 justify-center sm:justify-start">
              {anime.averageScore && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs sm:text-sm font-semibold">
                  <Star size={12} fill="#facc15" /> {(anime.averageScore / 10).toFixed(1)}
                </span>
              )}
              {anime.format && <span className="px-2 py-1 rounded-lg bg-accent/60 text-[10px] sm:text-xs text-white font-bold uppercase">{anime.format}</span>}
              {anime.status && (
                <span className={`px-2 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase ${
                  anime.status === "RELEASING" ? "bg-green-500/20 text-green-400" :
                  anime.status === "FINISHED" ? "bg-blue-500/20 text-blue-400" : "bg-gray-500/20 text-gray-400"
                }`}>{anime.status.replace(/_/g, " ")}</span>
              )}
              {anime.season && anime.seasonYear && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-[10px] sm:text-xs text-text-secondary"><Calendar size={10} /> {anime.season} {anime.seasonYear}</span>
              )}
              {anime.episodes && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-[10px] sm:text-xs text-text-secondary"><Film size={10} /> {anime.episodes} eps</span>
              )}
              {anime.duration && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-[10px] sm:text-xs text-text-secondary"><Clock size={10} /> {anime.duration} min</span>
              )}
              {anime.popularity && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 text-[10px] sm:text-xs text-text-secondary"><Heart size={10} /> {anime.popularity.toLocaleString()}</span>
              )}
            </div>

            {anime.studios.nodes.length > 0 && (
              <div className="flex items-center gap-2 mt-3 text-sm justify-center sm:justify-start">
                <Users size={14} className="text-text-muted" />
                <span className="text-text-secondary">{anime.studios.nodes.map((s) => s.name).join(", ")}</span>
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 justify-center sm:justify-start">
              {anime.genres.map((g) => (
                <Link key={g} href={`/genre/${g.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-2.5 py-1 rounded-lg bg-highlight/15 text-highlight text-[10px] sm:text-xs font-medium hover:bg-highlight/25 transition-colors">{g}</Link>
              ))}
            </div>

            {anime.nextAiringEpisode && (
              <div className="mt-4 p-3 rounded-xl bg-highlight/10 border border-highlight/20 inline-flex items-center gap-3">
                <Clock size={16} className="text-highlight" />
                <span className="text-xs sm:text-sm text-text-secondary">
                  Episode {anime.nextAiringEpisode.episode} airing in <CountdownTimer airingAt={anime.nextAiringEpisode.airingAt} className="text-highlight font-semibold" />
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 mt-5 justify-center sm:justify-start">
              {airedEpisodes > 0 && (
                <button onClick={() => startWatching(1)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-highlight hover:bg-highlight/90 text-white text-sm font-semibold transition-all shadow-lg shadow-highlight/30">
                  <Play size={16} fill="white" /> Watch Now
                </button>
              )}
              <button onClick={toggleBookmark}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all text-sm ${
                  isBookmarked ? "bg-yellow-500/20 text-yellow-400" : "bg-white/10 text-white hover:bg-white/20"
                }`}>
                {isBookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                {isBookmarked ? "Saved" : "Bookmark"}
              </button>
            </div>
          </div>
        </div>

        {anime.description && (
          <div className="mt-6 sm:mt-8">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Synopsis</h2>
            <div className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-4xl" dangerouslySetInnerHTML={{ __html: anime.description }} />
          </div>
        )}

        {anime.trailer && anime.trailer.site === "youtube" && (
          <div className="mt-6 sm:mt-8">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Trailer</h2>
            <div className="aspect-video max-w-2xl rounded-xl overflow-hidden border border-border/20">
              <iframe src={`https://www.youtube.com/embed/${anime.trailer.id}`} className="w-full h-full" allowFullScreen allow="autoplay; encrypted-media" />
            </div>
          </div>
        )}

        {airedEpisodes > 0 && (
          <div className="mt-6 sm:mt-8">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">
              Episodes ({airedEpisodes}{anime.episodes && anime.episodes > airedEpisodes ? ` / ${anime.episodes}` : ""})
            </h2>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-60 overflow-y-auto hide-scrollbar">
              {Array.from({ length: airedEpisodes }, (_, i) => i + 1).map((ep) => (
                <EpisodeCard key={ep} number={ep} isActive={showPlayer && currentEpisode === ep} onClick={() => startWatching(ep)} />
              ))}
            </div>
          </div>
        )}

        {airedEpisodes === 0 && anime.status === "NOT_YET_RELEASED" && (
          <div className="mt-6 sm:mt-8 p-4 rounded-xl bg-card border border-border/20 text-center">
            <p className="text-text-secondary text-sm">This anime has not aired yet.</p>
            {anime.nextAiringEpisode && (
              <p className="text-highlight text-sm mt-2 font-medium">
                First episode airs in <CountdownTimer airingAt={anime.nextAiringEpisode.airingAt} className="font-bold" />
              </p>
            )}
          </div>
        )}

        {anime.characters && anime.characters.edges.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Characters</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {anime.characters.edges.slice(0, 10).map((edge) => (
                <div key={edge.node.id} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-card border border-border/20">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={edge.node.image.medium} alt={edge.node.name.full} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-white truncate">{edge.node.name.full}</p>
                    <p className="text-[9px] sm:text-[10px] text-text-muted uppercase">{edge.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {anime.relations && anime.relations.edges.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Relations</h2>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar pb-2">
              {anime.relations.edges.filter((e) => e.node.type === "ANIME").map((edge) => (
                <Link key={edge.node.id} href={`/anime/${edge.node.id}`} className="flex-shrink-0 w-28 sm:w-36 group">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                    <Image src={edge.node.coverImage.large} alt={edge.node.title.english || edge.node.title.romaji} fill className="object-cover group-hover:scale-110 transition-transform" sizes="144px" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-medium text-white mt-1.5 truncate group-hover:text-highlight transition-colors">{edge.node.title.english || edge.node.title.romaji}</p>
                  <p className="text-[9px] sm:text-[10px] text-text-muted uppercase">{edge.relationType.replace(/_/g, " ")}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {anime.recommendations && anime.recommendations.nodes.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h2 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Recommendations</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
              {anime.recommendations.nodes.filter((n) => n.mediaRecommendation).slice(0, 6).map((node) => {
                const rec = node.mediaRecommendation!;
                return <AnimeCard key={rec.id} id={rec.id} title={rec.title.english || rec.title.romaji} image={rec.coverImage.extraLarge || rec.coverImage.large} score={rec.averageScore} format={rec.format} episodes={rec.episodes} genres={rec.genres} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
