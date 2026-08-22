import type { NextConfig } from "next";

const goApiProxyUrl =
  process.env.GO_API_PROXY_URL ??
  process.env.API_PROXY_URL ??
  "http://localhost:8081";
const djangoApiProxyUrl =
  process.env.DJANGO_API_PROXY_URL ?? "http://localhost:8000";
const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api/v1";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["127.0.0.1"],
  async rewrites() {
    // Same-origin proxy: split commerce → Django, everything else → Go
    if (apiBaseUrl.startsWith("http")) {
      return [];
    }

    return [
      // Django-owned commerce prefixes (must be listed before the Go catch-all)
      {
        source: "/api/v1/carts/:path*",
        destination: `${djangoApiProxyUrl}/api/v1/carts/:path*`,
      },
      {
        source: "/api/v1/orders/:path*",
        destination: `${djangoApiProxyUrl}/api/v1/orders/:path*`,
      },
      {
        source: "/api/v1/payments/:path*",
        destination: `${djangoApiProxyUrl}/api/v1/payments/:path*`,
      },
      {
        source: "/api/v1/promotions/:path*",
        destination: `${djangoApiProxyUrl}/api/v1/promotions/:path*`,
      },
      {
        source: "/api/v1/coupons/:path*",
        destination: `${djangoApiProxyUrl}/api/v1/coupons/:path*`,
      },
      // Go catch-all: auth, admin/customers, catalog, observability
      {
        source: "/api/v1/:path*",
        destination: `${goApiProxyUrl}/api/v1/:path*`,
      },
      {
        source: "/static/:path*",
        destination: `${goApiProxyUrl}/static/:path*`,
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
