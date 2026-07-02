'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, Search, Heart, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';

export default function TeamsDirectory() {
  const { favorites, toggleFavorite } = useApp();
  const [teams, setTeams] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const res = await fetch('/api/teams');
        const data = await res.json();
        setTeams(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">National Teams Directory</h1>
            <p className="text-slate-400 text-xs mt-1">Explore team squads, coach biographies, FIFA rankings and statistics.</p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search teams by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-white text-xs px-9 py-2.5 rounded-xl focus:outline-none focus:border-brand-green w-full"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 4, 5].map(n => (
              <div key={n} className="h-40 bg-slate-900/40 border border-slate-800 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTeams.map((team) => {
              const isFav = favorites.teams.includes(team.id);

              return (
                <div
                  key={team.id}
                  className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between relative group"
                >
                  {/* Favorite Toggle Button */}
                  <button
                    onClick={() => toggleFavorite('teams', team.id)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-red-500 transition"
                    aria-label="Add team to favorites"
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  <div className="space-y-4">
                    <img
                      src={team.flagUrl}
                      alt={team.name}
                      className="w-12 h-8 object-cover rounded shadow-md border border-slate-800"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-brand-green transition-colors">
                        {team.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">FIFA Rank: #{team.ranking} • Group {team.groupName.split(' ')[1]}</p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-slate-900/40 pt-4 flex justify-between items-center text-xs text-slate-400">
                    <div>
                      <span className="block text-[9px] text-slate-500 font-bold uppercase">Form</span>
                      <div className="flex gap-1 mt-1">
                        {team.form.split(',').map((f: string, idx: number) => (
                          <span
                            key={idx}
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black font-mono text-slate-950 ${
                              f === 'W' ? 'bg-brand-green' : f === 'D' ? 'bg-slate-400' : 'bg-red-500'
                            }`}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/teams/${team.id}`}
                      className="text-brand-green font-bold flex items-center gap-0.5 hover:translate-x-0.5 transition-transform"
                    >
                      Squads <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
            {filteredTeams.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 text-sm">
                No national teams match your search criteria.
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
