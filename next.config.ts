import type { NextConfig } from "next";

const apiProxyUrl = process.env.API_PROXY_URL ?? "http://localhost:8080";
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api/v1";

const nextConfig: NextConfig = {
  async rewrites() {
    // Same-origin proxy: /api/v1/* and /static/* → Go backend (avoids CORS in local dev)
    if (apiBaseUrl.startsWith("http")) {
      return [];
    }

    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiProxyUrl}/api/v1/:path*`,
      },
      {
        source: "/static/:path*",
        destination: `${apiProxyUrl}/static/:path*`,
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.chaumet.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
