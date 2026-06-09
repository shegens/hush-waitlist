import type { Metadata } from "next";
import { ParaProvider } from "@/components/ParaProvider";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "hush",
  description: "All signal. No noise.",
  openGraph: {
    title: "hush",
    description: "All signal. No noise.",
    images: ["/hush-og.png"],
    url: "https://hush.wtf",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "hush",
    description: "All signal. No noise.",
    images: ["/hush-og.png"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/hush-favicon.png" />
      </head>
      <body>
        <ParaProvider>{children}</ParaProvider>
      </body>
    </html>
  );
}
