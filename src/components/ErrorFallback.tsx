"use client";

import { RefreshCw } from "lucide-react";

export default function ErrorFallback({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-16 h-16 rounded-full bg-highlight/10 flex items-center justify-center">
        <RefreshCw size={28} className="text-highlight" />
      </div>
      <p className="text-text-secondary text-sm text-center max-w-md">
        {message || "Something went wrong. Please try again."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-5 py-2 rounded-xl bg-highlight text-white text-sm font-medium hover:bg-highlight/90 transition-all"
      >
        Reload Page
      </button>
    </div>
  );
}
