"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { StreamServer } from "@/lib/streaming";
import { Subtitles, Mic, Tv } from "lucide-react";

interface ServerSelectorProps {
  servers: StreamServer[];
  onSelect: (server: StreamServer) => void;
  activeServer?: StreamServer | null;
}

export default function ServerSelector({ servers, onSelect, activeServer }: ServerSelectorProps) {
  const subServers = servers.filter((s) => s.type === "sub");
  const hardSubServers = servers.filter((s) => s.type === "hardsub");
  const dubServers = servers.filter((s) => s.type === "dub");

  const tabs = [
    { key: "sub" as const, label: "Sub", icon: <Subtitles size={16} />, count: subServers.length },
    ...(hardSubServers.length > 0 ? [{ key: "hardsub" as const, label: "Hard Sub", icon: <Tv size={16} />, count: hardSubServers.length }] : []),
    ...(dubServers.length > 0 ? [{ key: "dub" as const, label: "Dub", icon: <Mic size={16} />, count: dubServers.length }] : []),
  ];

  const [tab, setTab] = useState<"sub" | "hardsub" | "dub">("sub");
  const tabServers = tab === "sub" ? subServers : tab === "hardsub" ? hardSubServers : dubServers;

  return (
    <div className="bg-card rounded-xl border border-border/20 overflow-hidden">
      <div className="flex border-b border-border/20">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all",
              tab === item.key ? "bg-highlight text-white" : "text-text-secondary hover:text-white hover:bg-surface-light"
            )}
          >
            {item.icon} {item.label} ({item.count})
          </button>
        ))}
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex flex-wrap gap-2">
          {tabServers.map((server, i) => (
            <button
              key={`${server.name}-${server.type}-${i}`}
              onClick={() => onSelect(server)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeServer?.url === server.url
                  ? "bg-highlight text-white shadow-lg shadow-highlight/30"
                  : "bg-surface-light border border-border/30 text-text-secondary hover:text-white hover:border-highlight/50"
              )}
            >
              {server.name}
            </button>
          ))}
        </div>
        {tabServers.length === 0 && (
          <p className="text-sm text-text-muted text-center py-4">No servers available</p>
        )}
      </div>
    </div>
  );
}
