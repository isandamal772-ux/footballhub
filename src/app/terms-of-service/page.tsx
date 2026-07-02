import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Use | Football Hub',
  description: 'Understand the terms of service, conditions, and guidelines for using the Football Hub sports directory.',
};

export default function TermsOfService() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-black text-white tracking-tight">Terms of Use</h1>
        <p className="text-xs text-slate-500">Last updated: July 2026</p>
        
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-normal">
          <p>
            By accessing and navigating Football Hub (accessible via <a href="https://footballhub.asia" className="text-brand-green hover:underline">footballhub.asia</a>), you agree to be bound by these Terms of Use and comply with all applicable local regulations.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">1. Permitted Use</h2>
          <p>
            You are granted a temporary license to access the team standings, player profiles, live score simulations, and news articles on our website for personal, non-commercial viewing. This is a license grant, not a transfer of title.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">2. Intellectual Property</h2>
          <p>
            All website structures, logos, UI designs, customized data visualizations, and aggregate datasets are the exclusive property of Football Hub. Third-party branding, team badges, and player images are used solely for descriptive editorial purposes.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">3. Disclaimers and Limitations</h2>
          <p>
            The live scores, player statistics, and match commentary feeds are provided "as is". While we simulate and update match information 24/7, we make no guarantees regarding real-time accuracy, latency, or server uptime.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">4. Governing Law</h2>
          <p>
            Any legal dispute arising from your use of Football Hub shall be governed by global digital publication guidelines and local internet regulation codes. For questions, contact us at <span className="text-brand-green font-mono">contact@footballhub.asia</span>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
