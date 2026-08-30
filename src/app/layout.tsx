import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GLS - Gymnastics Learning System | Platform Pembelajaran Senam Digital",
  description:
    "Platform digital pembelajaran senam untuk pelatih, atlet, dan orang tua. Belajar teknik senam lebih terarah dengan kurikulum terstruktur dan video berkualitas tinggi.",
  keywords: [
    "Gymnastics Learning System",
    "GLS",
    "Senam Artistik",
    "Pelatihan Senam",
    "LMS Senam",
    "Belajar Senam",
    "Video Senam",
  ],
  authors: [{ name: "Gymnastics Learning System" }],
  openGraph: {
    title: "GLS - Gymnastics Learning System",
    description:
      "Platform digital pembelajaran senam untuk pelatih dan atlet. Belajar teknik senam lebih terarah.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B] antialiased">
        {children}
      </body>
    </html>
  );
}
