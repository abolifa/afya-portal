import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "romuz.com.ly" }],
  },
};

export default nextConfig;
