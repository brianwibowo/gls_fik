'use client';

import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { ApparatusSection } from '@/components/landing/ApparatusSection';
import { PreviewSection } from '@/components/landing/PreviewSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B]">
      {/* 1. Header Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. About & Problem Statement Section */}
        <AboutSection />

        {/* 4. Core Features Section (Mengapa GLS?) */}
        <FeaturesSection />

        {/* 5. Movement Library & Apparatus Categories */}
        <ApparatusSection />

        {/* 6. Dashboard Preview Section */}
        <PreviewSection />

        {/* 7. Frequently Asked Questions (FAQ) */}
        <FAQSection />

        {/* 8. Call To Action (CTA) */}
        <CTASection />
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
}
