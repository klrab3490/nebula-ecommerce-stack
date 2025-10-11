import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jvurupik0d.ufs.sh",
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
  }
};

export default nextConfig;
