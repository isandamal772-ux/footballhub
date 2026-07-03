'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, Activity, Users, User, ChevronRight, Bookmark } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MatchCard from '@/components/MatchCard';
import { useApp } from '@/context/AppContext';

export default function FavoritesDashboard() {
  const { favorites, toggleFavorite, t } = useApp();
  const [matches, setMatches] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [matchesRes, teamsRes, playersRes] = await Promise.all([
          fetch('/api/matches'),
          fetch('/api/teams'),
          fetch('/api/players')
        ]);
        const matchesData = await matchesRes.json();
        const teamsData = await teamsRes.json();
        const playersData = await playersRes.json();

        setMatches(matchesData);
        setTeams(teamsData);
        setPlayers(playersData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const favoriteMatches = matches.filter(m => favorites.matches.includes(m.id));
  const favoriteTeams = teams.filter(t => favorites.teams.includes(t.id));
  const favoritePlayers = players.filter(p => favorites.players.includes(p.id));

  const totalFavs = favoriteMatches.length + favoriteTeams.length + favoritePlayers.length;

  return (
    <div className="flex flex-col min-h-screen">
      <title>Your Favorite Squads, Players & Matches | World Football Hub</title>
      <meta name="description" content="View and manage your bookmarked players, favorite national teams, and bookmarked match schedules in one place." />
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Header card */}
        <section className="glass-panel rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8 border-b border-brand-green/20">
          <div className="max-w-xl space-y-2">
            <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-red-500 fill-red-500" /> Bookmarks Center
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white">Your Favorites Dashboard</h1>
            <p className="text-slate-400 text-xs">Access matches, squads, and athlete details that you follow closely.</p>
          </div>
        </section>

        {loading ? (
          <div className="h-60 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse"></div>
        ) : totalFavs === 0 ? (
          <div className="py-20 text-center border border-slate-900/50 rounded-2xl bg-slate-950/20 max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center text-slate-500 mx-auto text-xl">🖤</div>
            <h2 className="text-base font-bold text-white">No bookmarked favorites yet</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Follow matches, players or teams by clicking the heart icons across the site to see them listed here.
            </p>
            <Link href="/" className="inline-block bg-brand-green text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-emerald-450 transition">
              Explore Matches
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* FAVORITE MATCHES */}
            {favoriteMatches.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-green animate-pulse" />
                  Followed Matches ({favoriteMatches.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteMatches.map(m => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </div>
            )}

            {/* FAVORITE TEAMS */}
            {favoriteTeams.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-green" />
                  Followed Teams ({favoriteTeams.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {favoriteTeams.map(t => (
                    <div key={t.id} className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative group hover:border-brand-green/30 transition">
                      <button
                        onClick={() => toggleFavorite('teams', t.id)}
                        className="absolute top-4 right-4 text-red-500 hover:text-slate-500 transition"
                        aria-label="Remove favorite"
                      >
                        <Heart className="w-4 h-4 fill-red-500" />
                      </button>

                      <div className="space-y-3">
                        <img src={t.flagUrl} alt="" className="w-10 h-7 object-cover rounded shadow border border-slate-850" />
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-brand-green transition-colors">{t.name}</h3>
                          <span className="text-[10px] text-slate-500">FIFA Rank: #{t.ranking}</span>
                        </div>
                      </div>

                      <Link
                        href={`/teams/${t.id}`}
                        className="text-[10px] text-brand-green font-bold flex items-center gap-0.5 mt-5 self-start hover:translate-x-0.5 transition-transform"
                      >
                        Squad profile <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAVORITE PLAYERS */}
            {favoritePlayers.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-green" />
                  Followed Athletes ({favoritePlayers.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {favoritePlayers.map(p => (
                    <div key={p.id} className="glass-panel rounded-2xl p-5 flex flex-col justify-between relative group hover:border-brand-green/30 transition">
                      <button
                        onClick={() => toggleFavorite('players', p.id)}
                        className="absolute top-4 right-4 text-red-500 hover:text-slate-500 transition"
                        aria-label="Remove favorite"
                      >
                        <Heart className="w-4 h-4 fill-red-500" />
                      </button>

                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-full bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-sm font-bold text-brand-green">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-brand-green transition-colors">{p.name}</h3>
                          <p className="text-[10px] text-slate-500">{p.position} • Rating ★{p.rating.toFixed(1)}</p>
                        </div>
                      </div>

                      <Link
                        href={`/players/${p.id}`}
                        className="text-[10px] text-brand-green font-bold flex items-center gap-0.5 mt-5 self-start hover:translate-x-0.5 transition-transform"
                      >
                        Detailed stats <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
