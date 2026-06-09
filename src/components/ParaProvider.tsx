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
        configOverrides={{
          themeConfig: {
            borderRadius: "md",
            foregroundMixRatio: 0.08,
            backgroundColor: "#fdf6ee",
            foregroundColor: "#d96c11",
            font: "Source Serif Pro",
          },
          authConfig: {
            oAuthMethods: [],
            disableEmailLogin: false,
            disablePhoneLogin: true,
            isGuestModeEnabled: false,
            twoFactorAuthEnabled: false,
          },
          modalConfig: {
            disableAddFundsPrompt: true,
            authLayout: ["EXTERNAL:CONDENSED", "AUTH:FULL"],
            hideWallets: true,
            logo: "https://raw.githubusercontent.com/shegens/hush/refs/heads/main/docs/hush-og.png",
          },
          externalWalletConfig: {
            wallets: ["WALLETCONNECT", "RABBY", "RAINBOW", "ZERION"],
          },
        }}
        externalWalletConfig={{}}
        paraModalConfig={{
          recoverySecretStepEnabled: true,
          onRampTestMode: true,
        }}
      >
        {children}
      </ParaSDKProvider>
    </QueryClientProvider>
  );
}
