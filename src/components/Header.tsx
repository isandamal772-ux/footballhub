'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Search, Globe, Heart, Trophy, Activity, Users, User, GitCompare } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Header() {
  const { favorites, language, setLanguage, t } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerMatches, setTickerMatches] = useState<any[]>([]);

  // Total favorites badge
  const favCount = favorites.teams.length + favorites.players.length + favorites.matches.length;

  // Poll for ticker scores
  useEffect(() => {
    async function fetchTicker() {
      try {
        const res = await fetch('/api/matches');
        const data = await res.json();
        setTickerMatches(data.slice(0, 5)); // show top 5 in ticker
      } catch (e) {
        console.error("Error fetching ticker scores", e);
      }
    }
    fetchTicker();
    const interval = setInterval(fetchTicker, 15000); // 15s updates for ticker
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: t('live_scores'), icon: Activity },
    { href: '/world-cup', label: t('world_cup'), icon: Trophy },
    { href: '/teams', label: 'Teams', icon: Users },
    { href: '/players', label: 'Players', icon: User },
    { href: '/compare', label: t('compare'), icon: GitCompare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-card-border bg-background/85 backdrop-blur-md">
      {/* Live Ticker Area */}
      <div className="w-full h-9 bg-slate-950 border-b border-card-border/60 overflow-hidden flex items-center text-xs">
        <div className="bg-brand-green text-background font-bold px-3 py-1 flex items-center gap-1 shrink-0 h-full tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-background animate-pulse"></span>
          Live Ticker
        </div>
        <div className="relative w-full overflow-hidden h-full flex items-center">
          <div className="flex animate-ticker whitespace-nowrap gap-8 hover:[animation-play-state:paused] cursor-pointer">
            {/* Double the list to create a seamless looping effect */}
            {[...tickerMatches, ...tickerMatches].map((m, idx) => (
              <Link
                key={`${m.id}-${idx}`}
                href={`/match/${m.id}`}
                className="inline-flex items-center gap-3 px-4 py-1 hover:bg-slate-900 border-r border-card-border/20 transition h-full text-slate-300 hover:text-slate-100"
              >
                <span className="font-semibold text-slate-400 text-[10px] uppercase">
                  {m.stage}
                </span>
                <span className="font-medium flex items-center gap-1.5">
                  <img src={m.teamA?.flagUrl} alt="" className="w-3.5 h-2.5 object-cover rounded-sm border border-slate-800" />
                  {m.teamA?.code}
                </span>
                <span className={`px-1.5 py-0.5 rounded font-mono text-center min-w-8 font-bold ${m.status === 'LIVE' ? 'bg-brand-green/10 text-brand-green' : 'bg-slate-800 text-slate-300'}`}>
                  {m.status === 'SCHEDULED' ? 'vs' : `${m.teamAScore} - ${m.teamBScore}`}
                </span>
                <span className="font-medium flex items-center gap-1.5">
                  {m.teamB?.code}
                  <img src={m.teamB?.flagUrl} alt="" className="w-3.5 h-2.5 object-cover rounded-sm border border-slate-800" />
                </span>
                {m.status === 'LIVE' && (
                  <span className="text-[10px] text-brand-green animate-pulse font-bold">
                    {m.timeElapsed}'
                  </span>
                )}
              </Link>
            ))}
            {tickerMatches.length === 0 && (
              <span className="text-slate-400 px-4">No active matches at the moment. Check upcoming fixtures below!</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-slate-950 font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
                ⚽
              </div>
              <span className="text-lg font-black tracking-tighter bg-gradient-to-r from-slate-50 via-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                WORLD FOOTBALL <span className="text-brand-green">HUB</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition ${
                    isActive
                      ? 'text-brand-green border-b-2 border-brand-green pb-1 mt-0.5'
                      : 'text-slate-300 hover:text-white hover:scale-105'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Controls (Search, Language, Favorites, Profile) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1 p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition text-sm">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="uppercase font-semibold">{language}</span>
              </button>
              <div className="absolute right-0 mt-2 w-28 bg-slate-950 border border-card-border rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {(['en', 'es', 'fr', 'de'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`block w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-900 transition ${
                      language === lang ? 'text-brand-green' : 'text-slate-300'
                    }`}
                  >
                    {lang === 'en' && 'English'}
                    {lang === 'es' && 'Español'}
                    {lang === 'fr' && 'Français'}
                    {lang === 'de' && 'Deutsch'}
                  </button>
                ))}
              </div>
            </div>

            {/* Favorites Button */}
            <Link
              href="/favorites"
              className="relative p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-green text-slate-950 font-bold text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </Link>

            {/* Admin Link */}
            <Link
              href="/admin"
              className="text-xs bg-emerald-950/40 border border-brand-green/30 text-brand-green px-3 py-1.5 rounded-full font-bold hover:bg-brand-green hover:text-slate-950 transition-all duration-300"
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white transition"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              href="/favorites"
              className="relative p-1.5 rounded-full text-slate-400 hover:text-white transition"
            >
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-green text-slate-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-slate-400 hover:text-white transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Search Bar */}
      {searchOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950 border-b border-card-border p-4 shadow-2xl animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-card-border text-white text-sm px-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-green"
              autoFocus
            />
            <button
              type="submit"
              className="bg-brand-green text-slate-950 font-bold px-4 py-2.5 rounded-lg text-sm hover:bg-emerald-400 transition"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-slate-950 border-b border-card-border/80 px-4 py-6 space-y-4 animate-fade-in z-50 relative">
          <div className="grid grid-cols-2 gap-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-semibold transition ${
                    pathname === link.href
                      ? 'bg-brand-green/10 border-brand-green text-brand-green'
                      : 'bg-slate-900/50 border-slate-800 text-slate-300'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-900 pt-4 flex justify-between items-center">
            <div className="flex gap-2">
              {(['en', 'es', 'fr', 'de'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 rounded text-xs font-bold transition uppercase ${
                    language === lang ? 'bg-brand-green text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs bg-emerald-950 border border-brand-green/30 text-brand-green px-3 py-1.5 rounded-full font-bold hover:bg-brand-green hover:text-slate-950 transition"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-slate-900 py-2 px-3 z-50 flex items-center justify-around shadow-[0_-5px_25px_rgba(0,0,0,0.6)]">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1 transition-all ${
                isActive ? 'text-brand-green' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 transition-transform ${isActive ? 'scale-110 text-brand-green' : 'text-slate-400'}`} />
              <span className="text-[9px] font-bold tracking-tight">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
