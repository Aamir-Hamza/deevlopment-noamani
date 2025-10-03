/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // This allows production builds to successfully complete
    // even if your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'recreationbeauty.com',
        pathname: '/cdn/**',
      },
      {
        protocol: 'https',
        hostname: 'letsenhance.io',
      },

      {

        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    // Suppress the webpack cache warning
    config.infrastructureLogging = {
      level: 'error'
    };
    return config;
  },
  // Optimize for production
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  // Handle environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    RAZORPAY_KEY_ID: 'rzp_test_Y1SVuHN3IsyjgD',
    RAZORPAY_KEY_SECRET: 'JLzuhoxBn82XUjZTJxqLsZ6r',
    NEXT_PUBLIC_RAZORPAY_KEY_ID: 'rzp_test_Y1SVuHN3IsyjgD',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
};

module.exports = nextConfig;
