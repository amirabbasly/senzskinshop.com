/** @type {import('next').NextConfig} */
const API_INTERNAL_URL = process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000';

const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${API_INTERNAL_URL}/api/:path*` },
      { source: '/uploads/:path*', destination: `${API_INTERNAL_URL}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
