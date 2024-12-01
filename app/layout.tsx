import type { Metadata } from "next";
import { Fira_Sans, JetBrains_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GoogleAdSense } from "nextjs-google-adsense";
import "./globals.css";

const inter = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",

  // weight: "400"
});

export const metadata: Metadata = {
  title: "pintech",
  description: "Find the coolest tech tools available for you to choose for your next project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>

        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        {/* <script async type='text/javascript' src='//pl25076615.profitablecpmrate.com/6f/33/78/6f3378a0075a52704d922406534c28da.js'></script> */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8223913407934219"
          crossOrigin="anonymous"></script>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({ });
        </script>
      </head>
      <body className={inter.className}>{children}</body>
      <Analytics />
      <SpeedInsights />
      {/* <GoogleAdSense publisherId="pub-8223913407934219" /> */}
    </html>
  );
}
