import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Add an explicit (empty) turbopack config to satisfy Next.js/Turbopack
  // when a custom `webpack` config is present. This silences the
  // "webpack config and no turbopack config" build error.
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jvurupik0d.ufs.sh",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    // Suppress the specific webpack cache warning
    config.infrastructureLogging = {
      ...config.infrastructureLogging,
      // Only shows errors, hiding warning like cache ones
      level: "error",
    };

    return config;
  },
};

export default nextConfig;
