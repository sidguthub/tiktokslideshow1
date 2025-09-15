import type { Metadata } from "next";
import "./globals.css";

// TikTok Sans via Google Fonts
import { TikTok_Sans } from "next/font/google";

const tikTokSans = TikTok_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-tiktok",
  weight: ["400", "700"]
});

export const metadata: Metadata = {
  title: "Slideshow Editor",
  description: "Create beautiful slideshows with text overlays",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${tikTokSans.variable} antialiased h-full bg-gray-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
