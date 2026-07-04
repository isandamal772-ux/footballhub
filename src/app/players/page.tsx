'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShieldAlert, Award, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';

export default function PlayersDirectory() {
  const { favorites, toggleFavorite } = useApp();
  const [players, setPlayers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [posFilter, setPosFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlayers() {
      try {
        const res = await fetch('/api/players');
        const data = await res.json();
        setPlayers(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadPlayers();
  }, []);

  const filteredPlayers = players.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPos = posFilter === 'ALL' || p.position === posFilter;
    return matchesSearch && matchesPos;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <title>World Football Player Directory | World Football Hub</title>
      <meta name="description" content="Browse profiles, market valuations, stats, and rankings for the world's top professional football players at World Football Hub." />
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Players Directory</h1>
            <p className="text-slate-400 text-xs mt-1">Track tournament ratings, individual goals, assist logs, and transfer values.</p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-white text-xs px-9 py-2.5 rounded-xl focus:outline-none focus:border-brand-green w-full"
              />
            </div>

            {/* Position filter */}
            <select
              value={posFilter}
              onChange={(e) => setPosFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-brand-green"
            >
              <option value="ALL">All Positions</option>
              <option value="Goalkeeper">Goalkeepers</option>
              <option value="Defender">Defenders</option>
              <option value="Midfielder">Midfielders</option>
              <option value="Forward">Forwards</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="glass-panel rounded-2xl p-6 h-60 animate-pulse"></div>
        ) : (
          <div className="glass-panel rounded-2xl overflow-hidden border border-card-border/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-900 bg-slate-950/30 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">Player</th>
                    <th>Team</th>
                    <th className="hidden md:table-cell text-left">Current Club</th>
                    <th className="hidden sm:table-cell text-left">Age</th>
                    <th>Position</th>
                    <th className="text-center">Apps</th>
                    <th className="text-center font-bold text-brand-green">Goals</th>
                    <th className="text-center">Assists</th>
                    <th className="text-center">Rating</th>
                    <th className="py-4 px-6 text-center">Favorite</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((p) => {
                    const isFav = favorites.players.includes(p.id);

                    return (
                      <tr key={p.id} className="border-b border-slate-900/40 hover:bg-slate-900/15 transition">
                        <td className="py-4 px-6 font-bold text-white flex items-center gap-3">
                          <img src={p.team?.flagUrl || `https://flagcdn.com/w320/un.png`} alt="" className="w-6.5 h-4.5 object-cover rounded-sm border border-slate-800 shrink-0 shadow-sm" />
                          <Link href={`/players/${p.id}`} className="hover:text-brand-green transition-colors">
                            {p.name}
                          </Link>
                        </td>
                        <td className="text-slate-300 font-semibold">
                          <Link href={`/teams/${p.team?.id}`} className="flex items-center gap-1.5 hover:text-brand-green transition-colors">
                            <img src={p.team?.flagUrl} alt="" className="w-5 h-3.5 object-cover rounded-sm border border-slate-800" />
                            {p.team?.name}
                          </Link>
                        </td>
                        <td className="text-slate-400 font-medium hidden md:table-cell">{p.currentClub}</td>
                        <td className="text-slate-400 font-medium hidden sm:table-cell">{p.age} Yrs</td>
                        <td className="text-slate-400 font-medium">{p.position}</td>
                        <td className="text-center font-mono text-slate-300">{p.appearances}</td>
                        <td className="text-center font-mono font-bold text-brand-green">{p.goals}</td>
                        <td className="text-center font-mono text-slate-300">{p.assists}</td>
                        <td className="text-center py-4">
                          <span className="bg-brand-green/10 text-brand-green font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-brand-green/20">
                            ★ {p.rating.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => toggleFavorite('players', p.id)}
                            className="text-slate-500 hover:text-red-500 transition"
                            aria-label="Add player to favorites"
                          >
                            <Heart className={`w-4.5 h-4.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredPlayers.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-500 italic">No athletes match the search filter.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
