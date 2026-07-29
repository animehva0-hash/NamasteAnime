"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home, Layers, Film, RefreshCw, PlusCircle,
  TrendingUp, Calendar, Play, CheckCircle,
  Menu, X, Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Home, Layers, Film, RefreshCw, PlusCircle,
  TrendingUp, Calendar, Play, CheckCircle,
};

const SIDEBAR_ITEMS = [
  { name: "Home", href: "/", icon: "Home" },
  { name: "Genre", href: "/genre", icon: "Layers" },
  { name: "Types", href: "/types", icon: "Film" },
  { name: "Updated", href: "/updated", icon: "RefreshCw" },
  { name: "Added", href: "/added", icon: "PlusCircle" },
  { name: "Popular", href: "/popular", icon: "TrendingUp" },
  { name: "Upcoming", href: "/upcoming", icon: "Calendar" },
  { name: "Ongoing", href: "/ongoing", icon: "Play" },
  { name: "Completed", href: "/completed", icon: "CheckCircle" },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 left-3 z-[60] p-2.5 rounded-xl bg-sidebar text-white shadow-lg hover:bg-sidebar-hover transition-all"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-dvh z-50 flex flex-col transition-transform duration-300 ease-in-out",
          "w-[240px] sm:w-[260px] bg-sidebar/95 backdrop-blur-xl border-r border-border/30",
          "lg:translate-x-0 rounded-r-2xl lg:rounded-r-none shadow-2xl lg:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border/20">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-highlight to-red-400 flex items-center justify-center shadow-lg flex-shrink-0">
            <Flame size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white tracking-tight leading-tight">Namaste</h1>
            <p className="text-[10px] text-text-secondary -mt-0.5 tracking-wider uppercase">Anime</p>
          </div>
        </div>

        <div className="px-5 pt-5 pb-2">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-widest">Menu</span>
        </div>

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto hide-scrollbar">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-highlight text-white shadow-lg shadow-highlight/30"
                    : "text-text-secondary hover:bg-sidebar-hover hover:text-white"
                )}
              >
                <Icon size={18} className={cn("transition-colors flex-shrink-0", isActive ? "text-white" : "text-text-muted group-hover:text-highlight")} />
                <span className="truncate">{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse flex-shrink-0" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-3 border-t border-border/20">
          <p className="text-[10px] text-text-muted text-center">© 2026 Namaste Anime</p>
        </div>
      </aside>
    </>
  );
}
