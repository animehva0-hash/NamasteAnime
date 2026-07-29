"use client";

import { Mic } from "lucide-react";

interface DubBadgeProps {
  hasDub: boolean;
}

export default function DubBadge({ hasDub }: DubBadgeProps) {
  if (!hasDub) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-xs font-semibold">
      <Mic size={10} /> DUB
    </span>
  );
}
