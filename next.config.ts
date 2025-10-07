import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
