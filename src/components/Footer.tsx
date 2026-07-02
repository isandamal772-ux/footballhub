'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const { t } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-card-border/60 text-slate-400 mt-auto">
      {/* Monetization / Newsletter Banner */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 border-b border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/20 p-6 rounded-2xl border border-card-border/30">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-green" />
              {t('newsletter_signup')}
            </h3>
            <p className="text-sm mt-2 text-slate-400">
              {t('newsletter_desc')}
            </p>
          </div>
          <div>
            {subscribed ? (
              <div className="p-3 bg-brand-green/10 border border-brand-green/20 rounded-xl text-brand-green font-semibold text-center text-sm">
                Thank you for subscribing! Check your inbox soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-slate-900 border border-slate-800 focus:border-brand-green focus:outline-none px-4 py-2.5 rounded-xl text-sm w-full text-white"
                />
                <button
                  type="submit"
                  className="bg-brand-green hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition shrink-0"
                >
                  {t('subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Info Column */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-green flex items-center justify-center text-slate-950 text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              ⚽
            </div>
            <span className="text-sm font-black tracking-tight text-white">
              WORLD FOOTBALL <span className="text-brand-green">HUB</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 leading-relaxed">
            World Football Hub is your premier companion for soccer schedules, player statistics, historical profiles, live match commentary feeds, and comprehensive FIFA World Cup coverage.
          </p>
          <div className="flex space-x-3 text-slate-500">
            <a href="#" className="hover:text-brand-green transition" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
            </a>
            <a href="#" className="hover:text-brand-green transition" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            <a href="#" className="hover:text-brand-green transition" aria-label="Instagram">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="hover:text-brand-green transition" aria-label="Youtube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>

        {/* Sitemap Columns */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Features</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-brand-green transition">Live Match Center</Link></li>
            <li><Link href="/world-cup" className="hover:text-brand-green transition">World Cup Bracket</Link></li>
            <li><Link href="/teams" className="hover:text-brand-green transition">Team Standings</Link></li>
            <li><Link href="/players" className="hover:text-brand-green transition">Player Profiles</Link></li>
            <li><Link href="/compare" className="hover:text-brand-green transition">Comparison Center</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Partners & Products</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-brand-green transition flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-yellow-500" /> WFH Sports Store</a></li>
            <li><a href="#" className="hover:text-brand-green transition">Affiliate Tickets</a></li>
            <li><a href="#" className="hover:text-brand-green transition">Sponsored Jerseys</a></li>
            <li><a href="#" className="hover:text-brand-green transition flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5 text-emerald-400" /> Match Predictions Hub</a></li>
          </ul>
        </div>

        {/* AdSense Placement / Monetization Block */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Advertisement</h4>
          <div className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center p-3 text-center">
            <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">Sponsored Link</span>
            <span className="text-xs font-semibold text-slate-400 mt-1">Get 10% Off Official Match Jerseys!</span>
            <a
              href="#"
              className="text-[10px] bg-slate-800 border border-slate-700 text-emerald-400 px-3 py-1 rounded mt-2 hover:bg-slate-700 transition font-bold"
            >
              Shop Partner Store
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-slate-950 border-t border-slate-900/50 py-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>&copy; {new Date().getFullYear()} World Football Hub. All rights reserved. Built for mobile-first sports coverage.</span>
          <div className="flex space-x-4">
            <Link href="/about" className="hover:text-slate-400">About Us</Link>
            <Link href="/contact" className="hover:text-slate-400">Contact Us</Link>
            <Link href="/privacy-policy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-slate-400">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
