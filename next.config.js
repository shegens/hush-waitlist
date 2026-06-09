/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Stub all optional Para SDK peer deps we don't use
    const stubs = [
      // Para integrations
      "@getpara/ethers-v5-integration",
      "@getpara/ethers-v6-integration",
      "@getpara/viem-v2-integration",
      "@getpara/solana-web3.js-v1-integration",
      "@getpara/solana-signers-v2-integration",
      "@getpara/cosmjs-v0-integration",
      "@getpara/stellar-sdk-v14-integration",
      // Para AA
      "@getpara/aa-alchemy",
      "@getpara/aa-biconomy",
      "@getpara/aa-cdp",
      "@getpara/aa-gelato",
      "@getpara/aa-pimlico",
      "@getpara/aa-porto",
      "@getpara/aa-rhinestone",
      "@getpara/aa-safe",
      "@getpara/aa-thirdweb",
      "@getpara/aa-zerodev",
      // Farcaster
      "@farcaster/miniapp-sdk",
      "@farcaster/miniapp-wagmi-connector",
      "@farcaster/mini-app-solana",
      // Wallets / signing
      "ethers",
      "wagmi",
    ];

    config.resolve.alias = {
      ...config.resolve.alias,
      ...Object.fromEntries(stubs.map((s) => [s, false])),
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
