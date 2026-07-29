"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Filter } from "lucide-react";
import AnimeGrid from "@/components/AnimeGrid";
import Pagination from "@/components/Pagination";
import { GridSkeleton } from "@/components/LoadingSkeleton";
import Image from "next/image";
import Link from "next/link";
import type { AnilistMedia, PageInfo } from "@/lib/anilist";

interface CharacterResult {
  id: number;
  name: { full: string };
  image: { large: string; medium: string };
  media: { nodes: { id: number; title: { romaji: string; english: string | null }; coverImage: { large: string } }[] };
}

interface StudioResult {
  id: number;
  name: string;
  media: { nodes: { id: number; title: { romaji: string; english: string | null }; coverImage: { large: string } }[] };
}

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "anime";
  const page = parseInt(searchParams.get("page") || "1");

  const [query, setQuery] = useState(q);
  const [searchType, setSearchType] = useState(type);
  const [animeResults, setAnimeResults] = useState<AnilistMedia[]>([]);
  const [characterResults, setCharacterResults] = useState<CharacterResult[]>([]);
  const [studioResults, setStudioResults] = useState<StudioResult[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(false);

  const doSearch = useCallback(async () => {
    if (!q || q.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${searchType}&page=${page}`);
      const data = await res.json();
      if (searchType === "anime") {
        setAnimeResults(data.media || []);
        setPageInfo(data.pageInfo || null);
      } else if (searchType === "character") {
        setCharacterResults(data.characters || []);
        setPageInfo(data.pageInfo || null);
      } else if (searchType === "studio") {
        setStudioResults(data.studios || []);
        setPageInfo(data.pageInfo || null);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [q, searchType, page]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}&type=${searchType}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Search</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-11 pr-4 py-3 bg-card border border-border/30 rounded-xl text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-highlight/50"
            />
          </div>
          <div className="flex gap-2">
            {["anime", "character", "studio"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setSearchType(t);
                  if (query) router.push(`/search?q=${encodeURIComponent(query)}&type=${t}`);
                }}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all capitalize ${
                  searchType === t
                    ? "bg-highlight text-white"
                    : "bg-card border border-border/30 text-text-secondary hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </form>

      {loading ? (
        <GridSkeleton />
      ) : (
        <>
          {searchType === "anime" && animeResults.length > 0 && (
            <>
              <p className="text-text-muted mb-4 text-sm">{pageInfo?.total || 0} results found</p>
              <AnimeGrid anime={animeResults} />
              {pageInfo && (
                <Pagination
                  currentPage={pageInfo.currentPage}
                  lastPage={pageInfo.lastPage}
                  hasNextPage={pageInfo.hasNextPage}
                />
              )}
            </>
          )}

          {searchType === "character" && characterResults.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {characterResults.map((char) => (
                <div key={char.id} className="p-4 rounded-xl bg-card border border-border/20 text-center">
                  <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden mb-3">
                    <Image src={char.image.large} alt={char.name.full} fill className="object-cover" sizes="80px" />
                  </div>
                  <p className="text-sm font-medium text-white">{char.name.full}</p>
                  {char.media.nodes.length > 0 && (
                    <Link
                      href={`/anime/${char.media.nodes[0].id}`}
                      className="text-xs text-highlight hover:underline mt-1 block truncate"
                    >
                      {char.media.nodes[0].title.english || char.media.nodes[0].title.romaji}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {searchType === "studio" && studioResults.length > 0 && (
            <div className="space-y-6">
              {studioResults.map((studio) => (
                <div key={studio.id} className="p-4 rounded-xl bg-card border border-border/20">
                  <h3 className="text-lg font-bold text-white mb-3">{studio.name}</h3>
                  <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                    {studio.media.nodes.map((m) => (
                      <Link key={m.id} href={`/anime/${m.id}`} className="flex-shrink-0 w-28 group">
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden">
                          <Image src={m.coverImage.large} alt={m.title.romaji} fill className="object-cover" sizes="112px" />
                        </div>
                        <p className="text-xs text-white mt-1 truncate group-hover:text-highlight transition-colors">
                          {m.title.english || m.title.romaji}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && q && q.length >= 2 &&
            ((searchType === "anime" && animeResults.length === 0) ||
             (searchType === "character" && characterResults.length === 0) ||
             (searchType === "studio" && studioResults.length === 0)) && (
            <div className="text-center py-16">
              <Filter size={48} className="mx-auto text-text-muted opacity-30 mb-4" />
              <p className="text-text-muted">No results found for &quot;{q}&quot;</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
