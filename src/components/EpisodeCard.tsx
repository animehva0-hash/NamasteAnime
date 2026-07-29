"use client";

import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface EpisodeCardProps {
  number: number;
  isActive: boolean;
  onClick: () => void;
}

export default function EpisodeCard({ number, isActive, onClick }: EpisodeCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all active:scale-95",
        isActive
          ? "bg-highlight text-white shadow-lg shadow-highlight/30 ring-2 ring-highlight/50"
          : "bg-card border border-border/20 text-text-secondary hover:bg-card-hover hover:text-white hover:border-highlight/40"
      )}
    >
      <Play size={10} fill={isActive ? "white" : "currentColor"} />
      {number}
    </button>
  );
}
