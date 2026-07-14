import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalAdScript from "@/components/ads/GlobalAdScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VideoTube",
    template: "%s | VideoTube",
  },
  description: "Watch videos on VideoTube.",
  metadataBase: new URL("xxx1s.dpdns.org"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <GlobalAdScript scriptUrl={process.env.NEXT_PUBLIC_ADSTERRA_SOCIALBAR_SCRIPT_URL} />
        <GlobalAdScript scriptUrl={process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_SCRIPT_URL} />
        <GlobalAdScript scriptUrl={process.env.NEXT_PUBLIC_ADSTERRA_INTERSTITIAL_SCRIPT_URL} />
      </body>
    </html>
  );
}