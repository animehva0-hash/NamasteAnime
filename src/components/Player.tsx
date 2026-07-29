"use client";

import { useState, useEffect, useRef } from "react";
import ServerSelector from "./ServerSelector";
import type { StreamServer } from "@/lib/streaming";
import { Monitor, AlertCircle, ExternalLink, Loader2 } from "lucide-react";

interface PlayerProps {
  servers: StreamServer[];
  title: string;
  episodeNumber: number;
}

interface InlineStreamData {
  videoSrc: string;
  subtitles: { src: string; label: string; lang: string }[];
}

export default function Player({ servers, title, episodeNumber }: PlayerProps) {
  const [activeServer, setActiveServer] = useState<StreamServer | null>(
    servers.length > 0 ? servers[0] : null
  );
  const [loading, setLoading] = useState(false);
  const [streamData, setStreamData] = useState<InlineStreamData | null>(null);
  const [streamError, setStreamError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<unknown>(null);

  const isInternal = activeServer?.url.startsWith("/api/embed/justanime");

  // For internal servers: fetch stream data via API and play inline
  useEffect(() => {
    if (!activeServer) return;
    setStreamError(false);
    setStreamData(null);

    if (!isInternal) return; // external servers use iframe

    setLoading(true);
    // Parse the embed URL params to call our API directly
    const url = new URL(activeServer.url, window.location.origin);
    const animeId = url.searchParams.get("animeId");
    const ep = url.searchParams.get("ep");
    const provider = url.searchParams.get("provider");
    const audio = url.searchParams.get("audio");

    const origin = window.location.origin;
    fetch(`/api/stream/resolve?animeId=${animeId}&ep=${ep}&provider=${provider}&audio=${audio}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error || !data.videoSrc) {
          setStreamError(true);
        } else {
          // Fix URLs: replace any wrong protocol with browser's actual origin
          const fixUrl = (u: string) => {
            if (!u) return u;
            try {
              const parsed = new URL(u);
              const correctOrigin = new URL(origin);
              if (parsed.host === correctOrigin.host || parsed.hostname === "0.0.0.0" || parsed.hostname === "127.0.0.1") {
                return `${origin}${parsed.pathname}${parsed.search}`;
              }
            } catch { /* keep original */ }
            return u;
          };
          setStreamData({
            videoSrc: fixUrl(data.videoSrc),
            subtitles: (data.subtitles || []).map((s: { src: string; label: string; lang: string }) => ({ ...s, src: fixUrl(s.src) })),
          });
        }
      })
      .catch(() => setStreamError(true))
      .finally(() => setLoading(false));
  }, [activeServer, isInternal]);

  // Load HLS when stream data changes
  useEffect(() => {
    if (!streamData || !videoRef.current) return;
    const video = videoRef.current;

    // Cleanup old HLS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (hlsRef.current) { (hlsRef.current as any).destroy(); hlsRef.current = null; }

    const src = streamData.videoSrc;

    if (src.includes("m3u8") && typeof window !== "undefined") {
      // Dynamic import hls.js
      import("hls.js").then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls({ enableWorker: true, startLevel: -1 });
          hls.loadSource(src);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}); });
          hlsRef.current = hls;
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
          video.play().catch(() => {});
        }
      }).catch(() => {
        video.src = src;
        video.play().catch(() => {});
      });
    } else {
      video.src = src;
      video.play().catch(() => {});
    }

    // Enable subtitles
    const enableSubs = () => {
      if (video.textTracks && video.textTracks.length > 0) {
        video.textTracks[0].mode = "showing";
      }
    };
    video.addEventListener("loadedmetadata", enableSubs);
    video.addEventListener("canplay", enableSubs);
    setTimeout(enableSubs, 1000);
    setTimeout(enableSubs, 3000);

    return () => {
      video.removeEventListener("loadedmetadata", enableSubs);
      video.removeEventListener("canplay", enableSubs);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (hlsRef.current) { (hlsRef.current as any).destroy(); hlsRef.current = null; }
    };
  }, [streamData]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="relative w-full aspect-video bg-black rounded-lg sm:rounded-xl overflow-hidden border border-border/20">
        {!activeServer && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted gap-3">
            <Monitor size={40} className="opacity-30" />
            <p className="text-sm">Select a server to start watching</p>
          </div>
        )}

        {/* Internal servers: direct video element (no iframe, no sandbox issues) */}
        {activeServer && isInternal && (
          <>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <Loader2 size={32} className="text-highlight animate-spin" />
              </div>
            )}
            {streamError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-text-muted gap-2 z-10">
                <p className="text-sm">Stream not available</p>
                <p className="text-xs opacity-60">Try another server</p>
              </div>
            )}
            {streamData && (
              <video
                ref={videoRef}
                controls
                autoPlay
                playsInline
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full bg-black"
                style={{ objectFit: "contain" }}
              >
                {streamData.subtitles.map((s, i) => (
                  <track
                    key={`${s.src}-${i}`}
                    kind="subtitles"
                    src={s.src}
                    label={s.label}
                    srcLang={s.lang}
                    default={i === 0}
                  />
                ))}
              </video>
            )}
          </>
        )}

        {/* External servers: iframe */}
        {activeServer && !isInternal && (
          <iframe
            key={activeServer.url}
            src={activeServer.url}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture; web-share"
            referrerPolicy="origin"
            style={{ border: "none" }}
          />
        )}
      </div>

      {activeServer && (
        <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border border-border/20 text-xs sm:text-sm">
          <AlertCircle size={14} className="text-highlight flex-shrink-0" />
          <span className="text-text-secondary truncate">
            <span className="text-white font-medium">{title}</span> - EP {episodeNumber} • {activeServer.name}
          </span>
          <a href={activeServer.url} target="_blank" rel="noopener noreferrer"
            className="ml-auto flex-shrink-0 text-text-muted hover:text-highlight transition-colors" title="Open in new tab">
            <ExternalLink size={14} />
          </a>
        </div>
      )}

      <ServerSelector servers={servers} onSelect={setActiveServer} activeServer={activeServer} />
    </div>
  );
}
