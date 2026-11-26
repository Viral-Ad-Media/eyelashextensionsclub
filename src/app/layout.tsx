import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: Lash Extension Guides & Tips`, template: `%s | ${site.name}` },
  description: site.description,
  icons: { icon: "/brand/icon.png" },
  openGraph: {
    siteName: site.name,
    type: "website",
    url: "/",
    title: `${site.name}: Lash Extension Guides & Tips`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: Lash Extension Guides & Tips`,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
