import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { GoogleAuthProvider } from "@/components/GoogleAuthProvider";
import { SmoothScroll } from "@/components/SmoothScroll";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gymnastics Competition Level (GCL)",
  description:
    "Digital gymnastics learning platform for coaches, athletes, and students. Learn gymnastics techniques with structured curriculum and high-quality instructional videos.",
  keywords: [
    "Gymnastics Competition Level",
    "GCL",
    "Artistic Gymnastics",
    "Gymnastics Coaching",
    "Gymnastics Videos",
    "Sports Science",
  ],
  authors: [{ name: "Gymnastics Competition Level" }],
  openGraph: {
    title: "Gymnastics Competition Level (GCL)",
    description:
      "Digital gymnastics learning platform for coaches and athletes. Structured training with high quality video.",
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
    <html lang="en" data-scroll-behavior="smooth" className={`${plusJakartaSans.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-[#0a0a0a] text-white antialiased">
        <GoogleAuthProvider>
          <AuthProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </AuthProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  );
}
