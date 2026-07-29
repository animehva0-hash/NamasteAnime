import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s4.anilist.co" },
      { protocol: "https", hostname: "img1.ak.crunchyroll.com" },
      { protocol: "https", hostname: "media.kitsu.app" },
      { protocol: "https", hostname: "cdn.myanimelist.net" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Permissions-Policy",
            value: "autoplay=*, fullscreen=*, encrypted-media=*, picture-in-picture=*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
