import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, DM_Sans } from "next/font/google";
import wedding from "@/data/wedding";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--next-font-display",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});
const royal = Cinzel({
  subsets: ["latin"],
  variable: "--next-font-royal",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--next-font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined) ||
  (process.env.URL ? process.env.URL : undefined);
const shareImage = { url: "/og-image.jpg", width: 1200, height: 630, alt: wedding.seo.title };

export const metadata: Metadata = {
  metadataBase: baseUrl ? new URL(baseUrl) : undefined,
  title: wedding.seo.title,
  description: wedding.seo.description,
  alternates: baseUrl ? { canonical: baseUrl } : undefined,
  openGraph: {
    title: wedding.seo.title,
    description: wedding.seo.description,
    type: "website",
    images: [shareImage],
  },
  twitter: { card: "summary_large_image", title: wedding.seo.title, description: wedding.seo.description, images: [shareImage.url] },
  robots: { index: allowIndexing, follow: allowIndexing },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#651d32",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${royal.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
