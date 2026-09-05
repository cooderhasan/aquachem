import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    cpus: 1,
    webpackMemoryOptimizations: true,
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false;
    }
    return config;
  },
  async redirects() {
    return [
      // Eski WordPress Kategori URL'leri -> Yeni Ürün Kategori Sayfaları (301)
      {
        source: '/product-showcase/:category/page/:page',
        destination: '/tr/products/:category?page=:page',
        permanent: true,
      },
      {
        source: '/product-showcase/:category',
        destination: '/tr/products/:category',
        permanent: true,
      },
      {
        source: '/product-showcase',
        destination: '/tr/products',
        permanent: true,
      },
      // Eski WordPress Portfolyo URL'leri -> Referanslar Sayfası (301)
      {
        source: '/portfolio/:slug*',
        destination: '/tr/references',
        permanent: true,
      },
      {
        source: '/portfolio',
        destination: '/tr/references',
        permanent: true,
      },
      // Eski WordPress Haber URL'leri -> Haberler Sayfası (301)
      {
        source: '/latest-news/:slug*',
        destination: '/tr/news',
        permanent: true,
      },
      {
        source: '/latest-news',
        destination: '/tr/news',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
