import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '700'] 
});

export const metadata: Metadata = {
  title: "Slideshow Editor",
  description: "Create beautiful slideshows with text overlays",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} antialiased h-full bg-gray-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}

