/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy optionnel pour contourner les soucis CORS en dev.
  // Le frontend peut appeler /api-backend/... qui est relayé vers le backend.
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return [
      {
        source: "/api-backend/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
