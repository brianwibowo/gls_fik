import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { SmoothScroll } from "@/components/SmoothScroll";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gymnasticcomplevel.com"),
  title: "Gymnastics Competition Level (GCL) | Artistic Gymnastics Technical Platform",
  description:
    "Official Gymnastics Competition Level (GCL) technical curriculum. Authentic competition video analysis, 6 apparatus progressions, athlete checklists, and certified coach evaluations.",
  keywords: [
    "Gymnastics Competition Level",
    "GCL",
    "gymnasticcomplevel.com",
    "Artistic Gymnastics",
    "Men's Artistic Gymnastics",
    "Apparatus Curriculum",
    "Floor Exercise",
    "Pommel Horse",
    "Still Rings",
    "Vault",
    "Parallel Bars",
    "Horizontal Bar",
  ],
  authors: [{ name: "Gymnastics Competition Level (GCL)" }],
  openGraph: {
    title: "Gymnastics Competition Level (GCL)",
    description:
      "Technical curriculum, authentic competition videos, apparatus tracking, and coach evaluations for artistic gymnasts.",
    url: "https://gymnasticcomplevel.com",
    siteName: "GCL - Gymnastics Competition Level",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#0a0a0a] text-white antialiased">
        <AuthProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
