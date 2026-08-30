'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { ApparatusSection } from '@/components/landing/ApparatusSection';
import { PreviewSection } from '@/components/landing/PreviewSection';
import { FAQSection } from '@/components/landing/FAQSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { LoginModal } from '@/components/landing/LoginModal';

export default function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B]">
      {/* 1. Header Navigation Bar */}
      <Navbar onOpenLogin={handleOpenLogin} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection onOpenLogin={handleOpenLogin} />

        {/* 3. About & Problem Statement Section */}
        <AboutSection />

        {/* 4. Core Features Section (Mengapa GLS?) */}
        <FeaturesSection />

        {/* 5. Movement Library & Apparatus Categories */}
        <ApparatusSection onOpenLogin={handleOpenLogin} />

        {/* 6. Dashboard Preview Section (Grid & Non-Netflix style) */}
        <PreviewSection onOpenLogin={handleOpenLogin} />

        {/* 7. Frequently Asked Questions (FAQ) */}
        <FAQSection />

        {/* 8. Call To Action (CTA) */}
        <CTASection onOpenLogin={handleOpenLogin} />
      </main>

      {/* 9. Footer */}
      <Footer onOpenLogin={handleOpenLogin} />

      {/* 10. Interactive Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
}
