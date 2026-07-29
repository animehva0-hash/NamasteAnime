"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface CWItem {
  id: number;
  animeId: number;
  title: string;
  coverImage: string | null;
  episodeNumber: number;
  totalEpisodes: number | null;
  progress: number | null;
}

export default function ContinueWatchingSection() {
  const [items, setItems] = useState<CWItem[]>([]);

  useEffect(() => {
    fetch("/api/continue-watching")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <SectionHeader title="▶️ Continue Watching" />
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/anime/${item.animeId}/watch?ep=${item.episodeNumber}`}
            className="flex-shrink-0 w-56 group"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-card border border-border/20 group-hover:border-highlight/30 transition-all">
              {item.coverImage && (
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="224px"
                />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play size={32} className="text-white" fill="white" />
              </div>
              {/* Progress bar */}
              {item.progress != null && item.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/60">
                  <div
                    className="h-full bg-highlight"
                    style={{ width: `${Math.min(item.progress, 100)}%` }}
                  />
                </div>
              )}
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-white truncate group-hover:text-highlight transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-text-muted">
                Episode {item.episodeNumber}
                {item.totalEpisodes ? ` / ${item.totalEpisodes}` : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
