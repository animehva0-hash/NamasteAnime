import { Suspense } from "react";
import { GridSkeleton } from "@/components/LoadingSkeleton";
import SearchPageContent from "@/components/SearchPageContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<GridSkeleton />}>
      <SearchPageContent />
    </Suspense>
  );
}
