import { Suspense } from "react";
import { getByFormat } from "@/lib/anilist";
import AnimeGrid from "@/components/AnimeGrid";
import Pagination from "@/components/Pagination";
import Filters from "@/components/Filters";
import { GridSkeleton } from "@/components/LoadingSkeleton";
import ErrorFallback from "@/components/ErrorFallback";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ format: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

async function Content({ params, searchParams }: Props) {
  const { format } = await params;
  const sp = await searchParams;
  const formatUpper = format.toUpperCase();
  const page = parseInt(sp.page || "1");
  const labels: Record<string, string> = { TV: "TV Series", MOVIE: "Movies", OVA: "OVA", ONA: "ONA", SPECIAL: "Specials", MUSIC: "Music" };

  try {
    const data = await getByFormat(formatUpper, page, 24, sp.sort || "POPULARITY_DESC");
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{labels[formatUpper] || formatUpper}</h1>
        <p className="text-text-secondary text-sm mb-6">Page {page}</p>
        <Filters showSort />
        <AnimeGrid anime={data.media} />
        <Pagination currentPage={data.pageInfo.currentPage} lastPage={data.pageInfo.lastPage} hasNextPage={data.pageInfo.hasNextPage} />
      </div>
    );
  } catch { return <ErrorFallback />; }
}

export default function Page(props: Props) {
  return <Suspense fallback={<GridSkeleton />}><Content {...props} /></Suspense>;
}
