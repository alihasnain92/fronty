/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(ico|png|jpg|jpeg|gif|svg)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/[path][name].[hash][ext]'
      },
    });
    return config;
  },
  // Add this to properly handle static file serving
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig