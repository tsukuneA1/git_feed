import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "zenn.dev" },
      { protocol: "https", hostname: "cdn.qiita.com" },
      { protocol: "https", hostname: "assets.st-note.com" },
    ],
  },
};

export default nextConfig;
