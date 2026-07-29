import { Suspense } from "react";
import { getByFormat } from "@/lib/anilist";
import { ANIME_FORMATS } from "@/lib/constants";
import AnimeGrid from "@/components/AnimeGrid";
import SectionHeader from "@/components/SectionHeader";
import { GridSkeleton } from "@/components/LoadingSkeleton";
import Link from "next/link";
import { Film, Tv, Monitor, Music, Star, Clapperboard } from "lucide-react";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

const formatIcons: Record<string, ReactNode> = {
  TV: <Tv size={24} />, MOVIE: <Film size={24} />, OVA: <Clapperboard size={24} />,
  ONA: <Monitor size={24} />, SPECIAL: <Star size={24} />, MUSIC: <Music size={24} />,
};

const formatColors: Record<string, string> = {
  TV: "from-blue-600 to-cyan-500", MOVIE: "from-purple-600 to-pink-500",
  OVA: "from-orange-500 to-amber-400", ONA: "from-green-600 to-emerald-500",
  SPECIAL: "from-yellow-500 to-red-400", MUSIC: "from-violet-600 to-fuchsia-500",
};

async function Content() {
  const results = await Promise.allSettled(
    ANIME_FORMATS.map((f) => getByFormat(f.value, 1, 6))
  );

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Browse by Type</h1>
      <p className="text-text-secondary text-sm mb-6 sm:mb-8">Explore anime by format</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {ANIME_FORMATS.map((f) => (
          <Link key={f.value} href={`/types/${f.value.toLowerCase()}`}>
            <div className={`relative group rounded-xl overflow-hidden bg-gradient-to-br ${formatColors[f.value] || "from-gray-600 to-gray-500"} p-4 sm:p-5 h-24 sm:h-28 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
              <span className="text-white/90">{formatIcons[f.value]}</span>
              <h3 className="text-base sm:text-lg font-bold text-white">{f.label}</h3>
            </div>
          </Link>
        ))}
      </div>

      {ANIME_FORMATS.map((f, i) => {
        const result = results[i];
        if (result.status !== "fulfilled") return null;
        return (
          <section key={f.value} className="mb-8 sm:mb-10">
            <SectionHeader title={`${f.label} Anime`} href={`/types/${f.value.toLowerCase()}`} />
            <AnimeGrid anime={result.value.media} />
          </section>
        );
      })}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<GridSkeleton />}><Content /></Suspense>;
}
