"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Trash2, Star, Film } from "lucide-react";

interface BookmarkItem {
  id: number;
  animeId: number;
  title: string;
  coverImage: string | null;
  format: string | null;
  status: string | null;
  genres: string[] | null;
  score: number | null;
  episodes: number | null;
}

export default function BookmarksPage() {
  const [bookmarksList, setBookmarksList] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookmarks")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBookmarksList(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const removeBookmark = async (animeId: number, title: string) => {
    await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ animeId, title, coverImage: "", format: "", status: "", genres: [], score: 0, episodes: 0 }),
    });
    setBookmarksList((prev) => prev.filter((b) => b.animeId !== animeId));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Bookmarks</h1>
      <p className="text-text-secondary mb-8">Your saved anime</p>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] skeleton rounded-xl" />
          ))}
        </div>
      ) : bookmarksList.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark size={48} className="mx-auto text-text-muted opacity-30 mb-4" />
          <p className="text-text-muted">No bookmarks yet</p>
          <Link href="/" className="text-highlight text-sm hover:underline mt-2 inline-block">
            Browse anime →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarksList.map((bm) => (
            <div key={bm.id} className="flex gap-4 p-4 rounded-xl bg-card border border-border/20 group">
              <Link href={`/anime/${bm.animeId}`} className="flex-shrink-0">
                <div className="relative w-20 h-28 rounded-lg overflow-hidden">
                  {bm.coverImage && (
                    <Image src={bm.coverImage} alt={bm.title} fill className="object-cover" sizes="80px" />
                  )}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/anime/${bm.animeId}`}>
                  <h3 className="text-sm font-semibold text-white truncate hover:text-highlight transition-colors">{bm.title}</h3>
                </Link>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {bm.format && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-accent/50 text-text-secondary rounded">{bm.format}</span>
                  )}
                  {bm.score && (
                    <span className="flex items-center gap-1 text-xs text-yellow-400">
                      <Star size={10} fill="#facc15" /> {(bm.score / 10).toFixed(1)}
                    </span>
                  )}
                  {bm.episodes && (
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Film size={10} /> {bm.episodes} eps
                    </span>
                  )}
                </div>
                {bm.genres && bm.genres.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {(bm.genres as string[]).slice(0, 3).map((g) => (
                      <span key={g} className="text-[9px] px-1.5 py-0.5 bg-surface-light text-text-muted rounded">{g}</span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeBookmark(bm.animeId, bm.title)}
                className="self-start p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
