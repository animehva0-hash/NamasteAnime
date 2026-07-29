"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { AnilistMedia } from "@/lib/anilist";

export default function HeroBanner({ anime }: { anime: AnilistMedia[] }) {
  const [current, setCurrent] = useState(0);
  const featured = anime.slice(0, 5);

  const next = useCallback(() => setCurrent((c) => (c + 1) % featured.length), [featured.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + featured.length) % featured.length), [featured.length]);

  useEffect(() => { const t = setInterval(next, 6000); return () => clearInterval(t); }, [next]);

  if (!featured.length) return null;
  const item = featured[current];
  const bgImage = item.bannerImage || item.coverImage.extraLarge;

  return (
    <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[460px] rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8">
      <div className="absolute inset-0">
        <Image src={bgImage} alt={item.title.english || item.title.romaji} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-end p-4 sm:p-6 lg:p-10">
        <div className="max-w-lg animate-fade-in" key={current}>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {item.averageScore && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 text-xs font-semibold">
                <Star size={11} fill="#facc15" /> {(item.averageScore / 10).toFixed(1)}
              </span>
            )}
            {item.format && <span className="px-2 py-0.5 rounded-md bg-accent/60 text-[10px] text-white font-bold uppercase">{item.format}</span>}
            {item.episodes && <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] text-white">{item.episodes} eps</span>}
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight mb-1 sm:mb-2 line-clamp-2">
            {item.title.english || item.title.romaji}
          </h1>

          {item.genres && <p className="text-xs sm:text-sm text-text-secondary mb-2 sm:mb-4">{item.genres.slice(0, 3).join(" • ")}</p>}

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href={`/anime/${item.id}`}
              className="flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl bg-highlight hover:bg-highlight/90 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-highlight/30">
              <Play size={14} fill="white" /> Watch Now
            </Link>
            <Link href={`/anime/${item.id}`}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all">
              <Info size={14} /> Details
            </Link>
          </div>
        </div>
      </div>

      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
        <ChevronLeft size={18} />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {featured.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${i === current ? "bg-highlight w-5" : "bg-white/40 w-1.5 hover:bg-white/60"}`} />
        ))}
      </div>
    </div>
  );
}
