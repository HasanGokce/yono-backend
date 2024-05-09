/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/mvp/web",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
