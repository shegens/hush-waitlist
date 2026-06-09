/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Stub optional Para SDK peer deps we don't use
    config.resolve.alias = {
      ...config.resolve.alias,
      "@getpara/ethers-v6-integration": false,
      "@getpara/ethers-v5-integration": false,
      "@getpara/solana-web3.js-v1-integration": false,
      "@getpara/solana-signers-v2-integration": false,
      "@getpara/cosmjs-v0-integration": false,
      "@farcaster/miniapp-sdk": false,
      "ethers": false,
    };

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};
module.exports = nextConfig;
