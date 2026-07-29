"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SORT_OPTIONS } from "@/lib/constants";

interface FiltersProps {
  showSort?: boolean;
  showFormat?: boolean;
  showSeason?: boolean;
  showYear?: boolean;
}

export default function Filters({ showSort = true, showFormat = false, showSeason = false, showYear = false }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear + 2 - i);

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {showSort && (
        <select
          value={searchParams.get("sort") || ""}
          onChange={(e) => update("sort", e.target.value)}
          className="px-3 py-2 rounded-lg bg-card border border-border/30 text-sm text-white focus:outline-none focus:ring-2 focus:ring-highlight/50 appearance-none cursor-pointer"
        >
          <option value="">Sort By</option>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}

      {showFormat && (
        <select
          value={searchParams.get("format") || ""}
          onChange={(e) => update("format", e.target.value)}
          className="px-3 py-2 rounded-lg bg-card border border-border/30 text-sm text-white focus:outline-none focus:ring-2 focus:ring-highlight/50 appearance-none cursor-pointer"
        >
          <option value="">All Formats</option>
          <option value="TV">TV</option>
          <option value="MOVIE">Movie</option>
          <option value="OVA">OVA</option>
          <option value="ONA">ONA</option>
          <option value="SPECIAL">Special</option>
          <option value="MUSIC">Music</option>
        </select>
      )}

      {showSeason && (
        <select
          value={searchParams.get("season") || ""}
          onChange={(e) => update("season", e.target.value)}
          className="px-3 py-2 rounded-lg bg-card border border-border/30 text-sm text-white focus:outline-none focus:ring-2 focus:ring-highlight/50 appearance-none cursor-pointer"
        >
          <option value="">All Seasons</option>
          <option value="WINTER">Winter</option>
          <option value="SPRING">Spring</option>
          <option value="SUMMER">Summer</option>
          <option value="FALL">Fall</option>
        </select>
      )}

      {showYear && (
        <select
          value={searchParams.get("year") || ""}
          onChange={(e) => update("year", e.target.value)}
          className="px-3 py-2 rounded-lg bg-card border border-border/30 text-sm text-white focus:outline-none focus:ring-2 focus:ring-highlight/50 appearance-none cursor-pointer"
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      )}
    </div>
  );
}
