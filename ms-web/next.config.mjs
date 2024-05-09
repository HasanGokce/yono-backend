/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/mvp/web",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.yonoapp.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cat-avatars.vercel.app",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
