/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ allows API routes & dynamic features
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
