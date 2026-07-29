import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export default function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-highlight hover:text-highlight/80 transition-colors group"
        >
          View All
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}
