import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  optimizePackageImports: ["@chakra-ui/react"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
}

export default nextConfig
