"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Environment, ParaProvider as ParaSDKProvider } from "@getpara/react-sdk";
import "@getpara/react-sdk/styles.css";
import type { ReactNode } from "react";

const API_KEY = process.env.NEXT_PUBLIC_PARA_API_KEY ?? "";
const ENV = (process.env.NEXT_PUBLIC_PARA_ENVIRONMENT as Environment) || Environment.BETA;

const queryClient = new QueryClient();

export function ParaProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ParaSDKProvider
        paraClientConfig={{ apiKey: API_KEY, env: ENV }}
        config={{ appName: "Hush" }}
        paraModalConfig={{
          disableEmailLogin: false,
          disablePhoneLogin: true,
          authLayout: ["EXTERNAL:CONDENSED", "AUTH:FULL"],
          oAuthMethods: [],
          hideWallets: true,
          recoverySecretStepEnabled: true,
          onRampTestMode: true,
          logo: "https://raw.githubusercontent.com/shegens/hush/refs/heads/main/docs/hush-og.png",
          theme: {
            foregroundColor: "#d96c11",
            backgroundColor: "#fdf6ee",
            borderRadius: "md",
            mode: "light",
            font: "Source Serif Pro",
          },
        }}
        externalWalletConfig={{
          wallets: ["WALLETCONNECT", "RABBY", "RAINBOW", "ZERION"],
          walletConnectProjectId: "a9c851c2e8e6756d171c8d2440d7a6d6",
        }}
      >
        {children}
      </ParaSDKProvider>
    </QueryClientProvider>
  );
}
