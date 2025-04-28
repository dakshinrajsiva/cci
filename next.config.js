/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove deprecated experimental.appDir as it's now default in Next.js 13+
  experimental: {},
  // Output as static files for GitHub Pages
  output: 'export',
  // Enable static image optimization
  images: {
    unoptimized: true,
  },
  // Ensure ESLint runs on specific file extensions during builds
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Set the base path to match your GitHub repo name if needed
  // For example: basePath: '/cci',
  // Comment out for local development
  // basePath: '/cci',
  // Set asset prefix to match your GitHub repo if needed
  // Comment out for local development
  // assetPrefix: '/cci',
}

module.exports = nextConfig