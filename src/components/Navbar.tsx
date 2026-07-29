"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, Bookmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SearchResult {
  id: number;
  title: { romaji: string; english: string | null };
  coverImage: { medium: string; large: string };
  format: string | null;
  episodes: number | null;
  averageScore: number | null;
}

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=anime`);
      const data = await res.json();
      setResults(data.media || []);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  const handleChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 400);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-surface/80 backdrop-blur-xl border-b border-border/20">
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
        <div className="w-10 lg:w-0 flex-shrink-0" />

        <div ref={searchRef} className="flex-1 max-w-xl mx-2 sm:mx-auto relative">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => { handleChange(e.target.value); setIsSearchOpen(true); }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search anime..."
              className="w-full pl-9 pr-8 py-2 sm:py-2.5 bg-surface-light/80 border border-border/30 rounded-xl text-sm text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-highlight/50 transition-all"
            />
            {query && (
              <button onClick={() => { setQuery(""); setResults([]); setIsSearchOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {isSearchOpen && query.length >= 2 && (
            <div className="absolute top-full mt-2 w-full bg-card border border-border/30 rounded-xl shadow-2xl overflow-hidden max-h-[60vh] overflow-y-auto hide-scrollbar z-50">
              {loading && <div className="p-4 text-center text-text-muted text-sm">Searching...</div>}
              {!loading && results.length === 0 && <div className="p-4 text-center text-text-muted text-sm">No results</div>}
              {results.map((r) => (
                <Link key={r.id} href={`/anime/${r.id}`} onClick={() => { setIsSearchOpen(false); setQuery(""); }}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface-light/60 transition-colors border-b border-border/10 last:border-b-0">
                  <div className="relative w-9 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={r.coverImage.medium} alt={r.title.english || r.title.romaji} fill className="object-cover" sizes="36px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{r.title.english || r.title.romaji}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {r.format && <span className="text-[10px] px-1.5 py-0.5 bg-accent/50 text-text-secondary rounded">{r.format}</span>}
                      {r.episodes && <span className="text-[10px] text-text-muted">{r.episodes} eps</span>}
                    </div>
                  </div>
                </Link>
              ))}
              {results.length > 0 && (
                <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => setIsSearchOpen(false)}
                  className="block text-center py-2.5 text-sm text-highlight hover:text-highlight/80 bg-surface-light/30">
                  View all results →
                </Link>
              )}
            </div>
          )}
        </div>

        <Link href="/bookmarks" className="p-2 rounded-lg hover:bg-surface-light transition-colors text-text-secondary hover:text-white flex-shrink-0">
          <Bookmark size={18} />
        </Link>
      </div>
    </header>
  );
}
