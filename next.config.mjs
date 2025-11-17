/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: [],
  
 /** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  turbopack: {}, // ✅ 새 Turbopack 설정 추가
};

export default nextConfig;

  },
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
}

export default nextConfig
