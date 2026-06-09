import type { Metadata } from "next";
import { ParaProvider } from "@/components/ParaProvider";
import type { ReactNode } from "react";
import "./globals.css";

const BASE_PATH = process.env.GITHUB_ACTIONS === "true" ? "/hush-waitlist" : "";

export const metadata: Metadata = {
  title: "hush",
  description: "All signal. No noise.",
  openGraph: {
    title: "hush",
    description: "All signal. No noise.",
    images: [`${BASE_PATH}/hush-og.png`],
    url: "https://hush.wtf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "hush",
    description: "All signal. No noise.",
    images: [`${BASE_PATH}/hush-og.png`],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href={`${BASE_PATH}/hush-favicon.png`} />
      </head>
      <body>
        <ParaProvider>{children}</ParaProvider>
      </body>
    </html>
  );
}
