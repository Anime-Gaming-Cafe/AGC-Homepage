import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["discord.js", "@prisma/client", "@prisma/adapter-pg"],
};

export default nextConfig;
