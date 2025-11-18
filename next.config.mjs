/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: [],
  turbopack: {}, // ✅ Turbopack 설정 추가 (webpack 충돌 해결)
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
};

export default nextConfig;
