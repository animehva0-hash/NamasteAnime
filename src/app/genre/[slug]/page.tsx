import { Suspense } from "react";
import { getByGenre } from "@/lib/anilist";
import { ALL_GENRES } from "@/lib/constants";
import AnimeGrid from "@/components/AnimeGrid";
import Pagination from "@/components/Pagination";
import Filters from "@/components/Filters";
import { GridSkeleton } from "@/components/LoadingSkeleton";
import ErrorFallback from "@/components/ErrorFallback";

export const dynamic = "force-dynamic";

function slugToGenre(slug: string): string {
  const map: Record<string, string> = {};
  for (const g of ALL_GENRES) map[g.toLowerCase().replace(/\s+/g, "-")] = g;
  return map[slug] || slug;
}

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string; format?: string }>;
}

async function Content({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const genre = slugToGenre(slug);
  const page = parseInt(sp.page || "1");

  try {
    const data = await getByGenre(genre, page, 24, sp.sort || "POPULARITY_DESC", sp.format);
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{genre} Anime</h1>
        <p className="text-text-secondary text-sm mb-6">Page {page}</p>
        <Filters showSort showFormat />
        <AnimeGrid anime={data.media} />
        <Pagination currentPage={data.pageInfo.currentPage} lastPage={data.pageInfo.lastPage} hasNextPage={data.pageInfo.hasNextPage} />
      </div>
    );
  } catch {
    return <ErrorFallback message="Failed to load anime. AniList may be rate limiting." />;
  }
}

export default function Page(props: Props) {
  return <Suspense fallback={<GridSkeleton />}><Content {...props} /></Suspense>;
}
