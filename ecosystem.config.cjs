module.exports = {
  apps: [
    {
      name: "rahil-gallery-client",
      script: "server.js",
      cwd: "./.next/standalone",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "0.0.0.0",
        GO_API_PROXY_URL: "http://127.0.0.1:8080",
        DJANGO_API_PROXY_URL: "http://127.0.0.1:8000",
        // Legacy alias kept for older deploys
        API_PROXY_URL: "http://127.0.0.1:8080",
        NEXT_PUBLIC_API_BASE_URL: "/api/v1",
      },
    },
  ],
};
