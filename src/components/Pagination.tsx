"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
}

export default function Pagination({ currentPage, lastPage, hasNextPage }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const maxPages = Math.min(lastPage, 100);
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(maxPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  if (maxPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-4 flex-wrap">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-card border border-border/30 text-text-secondary hover:bg-card-hover hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft size={18} />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => goToPage(1)}
            className="px-3 py-2 rounded-lg bg-card border border-border/30 text-text-secondary hover:bg-card-hover hover:text-white text-sm transition-all"
          >
            1
          </button>
          {start > 2 && <span className="text-text-muted">...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={cn(
            "px-3 py-2 rounded-lg text-sm font-medium transition-all",
            p === currentPage
              ? "bg-highlight text-white shadow-lg shadow-highlight/30"
              : "bg-card border border-border/30 text-text-secondary hover:bg-card-hover hover:text-white"
          )}
        >
          {p}
        </button>
      ))}

      {end < maxPages && (
        <>
          {end < maxPages - 1 && <span className="text-text-muted">...</span>}
          <button
            onClick={() => goToPage(maxPages)}
            className="px-3 py-2 rounded-lg bg-card border border-border/30 text-text-secondary hover:bg-card-hover hover:text-white text-sm transition-all"
          >
            {maxPages}
          </button>
        </>
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={!hasNextPage}
        className="p-2 rounded-lg bg-card border border-border/30 text-text-secondary hover:bg-card-hover hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
