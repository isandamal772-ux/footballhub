'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Trophy, TrendingUp, Sparkles, Filter, ChevronRight, MessageSquare, Heart, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatchCard from '@/components/MatchCard';
import StructuredData from '@/components/StructuredData';
import { useApp } from '@/context/AppContext';

export default function Home() {
  const { t } = useApp();
  const [matches, setMatches] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'LIVE' | 'SCHEDULED' | 'FT'>('ALL');
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      const [matchesRes, newsRes, playersRes] = await Promise.all([
        fetch('/api/matches'),
        fetch('/api/news'),
        fetch('/api/players')
      ]);

      const [matchesData, newsData, playersData] = await Promise.all([
        matchesRes.json(),
        newsRes.json(),
        playersRes.json()
      ]);

      if (Array.isArray(matchesData)) setMatches(matchesData);
      if (Array.isArray(newsData)) setNews(newsData);
      if (Array.isArray(playersData)) {
        // Sort players by rating for top players section
        const sorted = [...playersData].sort((a, b) => b.rating - a.rating);
        setPlayers(sorted.slice(0, 5));
      }
    } catch (e) {
      console.error("Error loading home data", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // Poll matches every 5 seconds for live updates
    const interval = setInterval(async () => {
      try {
        const matchesRes = await fetch('/api/matches');
        const matchesData = await matchesRes.json();
        if (Array.isArray(matchesData)) setMatches(matchesData);
      } catch (e) {
        console.error(e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Filter matches
  const filteredMatches = matches.filter(m => {
    if (filter === 'ALL') return true;
    return m.status === filter;
  });

  // Featured live match or highest priority match for Hero
  const heroMatch = matches.find(m => m.status === 'LIVE') || matches[0];

  // News Trending filter
  const trendingNews = news.filter(n => n.trending);
  const regularNews = news.filter(n => !n.trending);

  // Schema data for SEO
  const sportsSchema = heroMatch ? {
    name: `${heroMatch.teamA?.name} vs ${heroMatch.teamB?.name} Live Score`,
    startDate: heroMatch.datetime,
    location: {
      '@type': 'Place',
      name: heroMatch.venue
    },
    sport: 'Soccer',
    competitor: [
      { '@type': 'SportsTeam', name: heroMatch.teamA?.name },
      { '@type': 'SportsTeam', name: heroMatch.teamB?.name }
    ]
  } : {};

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Ronaldo Background Watermark */}
      <div 
        className="absolute top-0 left-0 w-full h-[700px] bg-[url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-[0.16] pointer-events-none -z-50"
      ></div>
      {/* Vignette Gradient Overlay */}
      <div 
        className="absolute top-0 left-0 w-full h-[700px] bg-gradient-to-b from-transparent via-[#080c14]/70 to-[#080c14] pointer-events-none -z-45"
      ></div>
      <Header />
      {heroMatch && <StructuredData type="SportsEvent" data={sportsSchema} />}

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        
        {/* HERO SECTION: FEATURED MATCH */}
        {heroMatch && (
          <section className="relative overflow-hidden rounded-3xl border border-card-border/40 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/30 p-8 md:p-12 shadow-2xl">
            {/* Visual pitch indicator */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left match dashboard */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    {heroMatch.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>}
                    {heroMatch.status === 'LIVE' ? `LIVE • ${heroMatch.timeElapsed}'` : 'Featured Match'}
                  </span>
                  <span className="text-slate-400 text-xs font-semibold">{heroMatch.stage}</span>
                </div>

                <div className="flex items-center justify-between gap-4 max-w-xl">
                  {/* Team A info */}
                  <div className="flex flex-col items-center gap-2 text-center w-28">
                    <img src={heroMatch.teamA?.flagUrl} alt="" className="w-16 h-10 object-cover rounded-lg border border-slate-800 shadow-lg" />
                    <span className="text-sm font-black text-white">{heroMatch.teamA?.name}</span>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-4xl md:text-5xl font-black tracking-tight text-white">
                      {heroMatch.status === 'SCHEDULED' ? 'VS' : `${heroMatch.teamAScore} - ${heroMatch.teamBScore}`}
                    </span>
                    {heroMatch.status === 'LIVE' && (
                      <span className="text-xs text-brand-green animate-pulse font-bold mt-2">Commentary Live</span>
                    )}
                  </div>

                  {/* Team B info */}
                  <div className="flex flex-col items-center gap-2 text-center w-28">
                    <img src={heroMatch.teamB?.flagUrl} alt="" className="w-16 h-10 object-cover rounded-lg border border-slate-800 shadow-lg" />
                    <span className="text-sm font-black text-white">{heroMatch.teamB?.name}</span>
                  </div>
                </div>

                <p className="text-slate-400 text-sm flex items-center gap-1">
                  🏟️ Venue: <span className="text-slate-200 font-semibold">{heroMatch.venue}</span>
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link
                    href={`/match/${heroMatch.id}`}
                    className="bg-brand-green hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
                  >
                    Enter Match Center
                  </Link>
                  <Link
                    href="/compare"
                    className="bg-slate-900 border border-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-slate-800 hover:border-slate-700 transition"
                  >
                    Compare Squads
                  </Link>
                </div>
              </div>

              {/* Right commentary feed / timeline preview */}
              <div className="lg:col-span-4 bg-slate-950/60 border border-card-border/25 rounded-2xl p-6 h-64 overflow-hidden relative flex flex-col">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                  <span>Live Events Timeline</span>
                  {heroMatch.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></span>}
                </h4>

                <div className="space-y-4 overflow-y-auto flex-grow pr-2 scrollbar-thin">
                  {heroMatch.events && JSON.parse(heroMatch.events).length > 0 ? (
                    JSON.parse(heroMatch.events).map((e: any, idx: number) => (
                      <div key={idx} className="flex gap-3 text-xs">
                        <span className="font-mono font-bold text-brand-green shrink-0">{e.time}'</span>
                        <div>
                          <p className="font-bold text-white flex items-center gap-1.5">
                            {e.type === 'GOAL' ? '⚽' : e.type === 'CARD' ? '🟨' : '🔄'} {e.player}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{e.detail}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                      <MessageSquare className="w-8 h-8 mb-2 opacity-40" />
                      <p className="text-xs">Timeline will populate once the match begins.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MATCHES HUB: TODAY'S MATCHES WITH DYNAMIC FILTERS */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Activity className="w-6 h-6 text-brand-green animate-pulse" />
                Live Scores & Fixtures
              </h2>
              <p className="text-slate-400 text-xs mt-1">Real-time updates straight from stadium servers.</p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {(['ALL', 'LIVE', 'SCHEDULED', 'FT'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    filter === type
                      ? 'bg-brand-green text-slate-950 border-brand-green shadow-lg shadow-brand-green/10'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {type === 'ALL' && 'All Matches'}
                  {type === 'LIVE' && 'Live Now'}
                  {type === 'SCHEDULED' && 'Upcoming'}
                  {type === 'FT' && 'Finished'}
                </button>
              ))}
              <button
                onClick={loadData}
                className="p-2 rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-white hover:border-slate-700 transition"
                aria-label="Refresh matches"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(n => (
                <div key={n} className="h-44 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMatches.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
              {filteredMatches.length === 0 && (
                <div className="col-span-full py-12 text-center border border-slate-900/50 rounded-2xl bg-slate-950/20 text-slate-500 text-sm">
                  No matches match the selected criteria.
                </div>
              )}
            </div>
          )}
        </section>

        {/* FOOTBALL NEWS & TRENDING TOPICS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main news grid */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Trophy className="w-6 h-6 text-brand-green" />
              {t('latest_news')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {news.map((item) => (
                <article
                  key={item.id}
                  className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {item.trending && (
                      <span className="absolute top-3 right-3 bg-brand-green text-slate-950 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Trending
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                        {item.tags.split(',')[0] || 'World Cup'}
                      </span>
                      <h3 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-brand-green transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                    <Link
                      href={`/news/${item.slug}`}
                      className="text-xs text-brand-green font-bold flex items-center gap-1 self-start hover:underline"
                    >
                      Read Full Article <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
              {news.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  No news articles published yet.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar widget: Trending topics & Top Players */}
          <div className="lg:col-span-4 space-y-8">
            {/* Trending topics */}
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-green" />
                {t('trending')}
              </h3>
              <ul className="space-y-3 text-xs">
                {trendingNews.slice(0, 3).map((item) => (
                  <li key={item.id} className="group">
                    <Link href={`/news/${item.slug}`} className="flex flex-col gap-1">
                      <span className="text-slate-300 font-semibold group-hover:text-brand-green transition-colors line-clamp-2">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <a href="#" className="block text-[11px] font-bold text-slate-400 hover:text-emerald-400 mt-4 transition text-center border-t border-slate-900/60 pt-3">
                    View Trending Feeds
                  </a>
                </li>
              </ul>
            </div>

            {/* Top performing players */}
            <div className="glass-panel rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Featured Athletes
              </h3>
              <div className="space-y-4">
                {players.map((p, idx) => (
                  <Link
                    key={p.id}
                    href={`/players/${p.id}`}
                    className="flex items-center justify-between group hover:bg-slate-900/35 p-2 rounded-xl border border-transparent hover:border-card-border/10 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="font-mono text-sm font-black text-slate-500 w-4">
                        {idx + 1}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-emerald-950/40 border border-brand-green/20 flex items-center justify-center text-sm font-black text-brand-green">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-brand-green transition-colors">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{p.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="bg-brand-green/10 text-brand-green font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-brand-green/20">
                        ★ {p.rating.toFixed(1)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
