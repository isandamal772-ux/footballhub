'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ChevronRight, Users, User, Activity, Trophy } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';

  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [matchesRes, teamsRes, playersRes, newsRes] = await Promise.all([
          fetch('/api/matches'),
          fetch('/api/teams'),
          fetch('/api/players'),
          fetch('/api/news')
        ]);
        const matchesData = await matchesRes.json();
        const teamsData = await teamsRes.json();
        const playersData = await playersRes.json();
        const newsData = await newsRes.json();

        setMatches(matchesData);
        setTeams(teamsData);
        setPlayers(playersData);
        setNews(newsData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const queryLower = query.toLowerCase();

  const matchedMatches = matches.filter(m =>
    m.teamA?.name.toLowerCase().includes(queryLower) ||
    m.teamB?.name.toLowerCase().includes(queryLower) ||
    m.stage.toLowerCase().includes(queryLower)
  );

  const matchedTeams = teams.filter(t =>
    t.name.toLowerCase().includes(queryLower) ||
    t.code.toLowerCase().includes(queryLower)
  );

  const matchedPlayers = players.filter(p =>
    p.name.toLowerCase().includes(queryLower) ||
    p.position.toLowerCase().includes(queryLower)
  );

  const matchedNews = news.filter(n =>
    n.title.toLowerCase().includes(queryLower) ||
    n.summary.toLowerCase().includes(queryLower)
  );

  const totalResults = matchedMatches.length + matchedTeams.length + matchedPlayers.length + matchedNews.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-slate-400 text-xs">
        <Search className="w-4 h-4 text-emerald-450" />
        <span>About {totalResults} results found for "<span className="text-white font-semibold">{query}</span>"</span>
      </div>

      {loading ? (
        <div className="h-40 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse"></div>
      ) : totalResults === 0 ? (
        <div className="py-16 text-center border border-slate-900/50 rounded-2xl bg-slate-950/20 max-w-md mx-auto">
          <p className="text-sm text-slate-500 italic">No matches, teams, athletes or columns match your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Matches Result Card */}
          {matchedMatches.length > 0 && (
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-brand-green" /> Matched Matches ({matchedMatches.length})
              </h3>
              <div className="space-y-3">
                {matchedMatches.map(m => (
                  <Link
                    key={m.id}
                    href={`/match/${m.id}`}
                    className="flex justify-between items-center p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl hover:border-brand-green/30 transition text-xs font-semibold"
                  >
                    <span>{m.teamA?.name} vs {m.teamB?.name} ({m.status})</span>
                    <span className="text-brand-green font-bold flex items-center gap-0.5">Details <ChevronRight className="w-3.5 h-3.5" /></span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Teams Result Card */}
          {matchedTeams.length > 0 && (
            <div className="glass-panel rounded-2xl p-5 space-y-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-green" /> Matched Teams ({matchedTeams.length})
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {matchedTeams.map(t => (
                  <Link
                    key={t.id}
                    href={`/teams/${t.id}`}
                    className="p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl hover:border-brand-green/30 transition text-xs flex items-center gap-2 font-bold"
                  >
                    <img src={t.flagUrl} alt="" className="w-6 h-4 object-cover rounded-sm border border-slate-800" />
                    <span>{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Athletes Result Card */}
          {matchedPlayers.length > 0 && (
            <div className="glass-panel rounded-2xl p-5 space-y-4 col-span-full">
              <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-1.5">
                <User className="w-4 h-4 text-brand-green" /> Matched Athletes ({matchedPlayers.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {matchedPlayers.map(p => (
                  <Link
                    key={p.id}
                    href={`/players/${p.id}`}
                    className="flex justify-between items-center p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl hover:border-brand-green/30 transition text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-white">{p.name}</h4>
                      <span className="text-[10px] text-slate-500">{p.position} • {p.team?.name}</span>
                    </div>
                    <span className="bg-brand-green/10 text-brand-green font-mono font-bold text-[9px] px-1.5 py-0.5 rounded border border-brand-green/20">★ {p.rating.toFixed(1)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Articles Result Card */}
          {matchedNews.length > 0 && (
            <div className="glass-panel rounded-2xl p-5 space-y-4 col-span-full">
              <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-900 pb-2 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-brand-green" /> Matched Articles ({matchedNews.length})
              </h3>
              <div className="space-y-3">
                {matchedNews.map(n => (
                  <Link
                    key={n.id}
                    href={`/news/${n.slug}`}
                    className="flex justify-between items-center p-3 bg-slate-900/40 border border-slate-900/60 rounded-xl hover:border-brand-green/30 transition text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-white">{n.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{n.summary}</p>
                    </div>
                    <span className="text-brand-green font-bold flex items-center shrink-0 ml-4">Read →</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default function SearchResults() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Search Directory Results</h1>
          <p className="text-slate-400 text-xs mt-1">Found matching profiles, tournaments, or articles from search registers.</p>
        </div>

        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand-green"></div>
          </div>
        }>
          <SearchResultsContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
