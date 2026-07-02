import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | Football Hub',
  description: 'Learn how Football Hub collects, processes, and protects your personal data under global privacy standards.',
};

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-3xl w-full mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-black text-white tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Last updated: July 2026</p>
        
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-normal">
          <p>
            Welcome to Football Hub (accessible via <a href="https://footballhub.asia" className="text-brand-green hover:underline">footballhub.asia</a>). We respect your privacy and are committed to protecting any personal data we collect.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">1. Information We Collect</h2>
          <p>
            We collect minimal information required to provide our sports coverage services. This includes device-specific information, browser types, language preferences, and page views via anonymous analytics cookies to monitor search traffic performance.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">2. Cookies and Tracking Technologies</h2>
          <p>
            Football Hub uses standard cookies to remember your favorites (teams, players, and match schedules) and save your language selection. We may use third-party analytics tools (such as Google Analytics) to analyze aggregate traffic patterns. You can disable cookies in your browser settings at any time.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">3. Data Security and Retention</h2>
          <p>
            We implement industry-standard security protocols to protect all localized data. Since we do not require user account registration for general navigation, we do not store sensitive passwords or billing details on our servers.
          </p>

          <h2 className="text-lg font-bold text-white pt-4">4. Compliance and Global Guidelines</h2>
          <p>
            We strive to comply with global privacy rules, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). If you have any inquiries regarding your data, please reach out to us at <span className="text-brand-green font-mono">contact@footballhub.asia</span>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
