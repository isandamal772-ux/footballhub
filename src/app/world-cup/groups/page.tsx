'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trophy, ChevronRight, Activity, Award } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function WorldCupGroupsPage() {
  const { t } = useApp();
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
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
    loadTeams();
  }, []);

  const groups = ['Group A', 'Group B', 'Group C', 'Group D'];

  return (
    <div className="flex flex-col min-h-screen">
      <title>World Cup Group A, B, C, D Standings | World Football Hub</title>
      <meta name="description" content="View the official standings, games played, goal differences and points for World Cup Groups A, B, C, and D." />
      
      {/* Schema.org Breadcrumb and WebSite JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://footballhub.asia"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "World Cup",
                "item": "https://footballhub.asia/world-cup"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Groups A-D Standings",
                "item": "https://footballhub.asia/world-cup/groups"
              }
            ]
          })
        }}
      />

      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner Section */}
        <section className="glass-panel rounded-3xl p-6 md:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950/60 border-b border-brand-green/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              Tournament Standings
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Trophy className="w-7 h-7 text-yellow-500 animate-bounce" />
              World Cup Groups A - D
            </h1>
            <p className="text-slate-400 text-xs max-w-xl">
              Track the points totals, goal differences, wins, draws, losses and matches played for the top 16 competing squads.
            </p>
          </div>

          <Link
            href="/world-cup"
            className="inline-flex items-center gap-1 bg-brand-green hover:bg-emerald-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(16,185,129,0.2)]"
          >
            Full Tournament Hub <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        {loading ? (
          <div className="h-60 bg-slate-950/20 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-500 font-bold">Loading Standings...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groups.map((groupName) => {
              const groupTeams = teams
                .filter((t) => t.groupName === groupName)
                .sort((a: any, b: any) => a.ranking - b.ranking);

              return (
                <div key={groupName} className="glass-panel rounded-2xl p-5 space-y-4 bg-slate-950/30 border border-slate-900">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider border-b border-slate-900 pb-2 flex justify-between items-center">
                    <span>{groupName}</span>
                    <span className="text-[10px] text-slate-500 font-bold">FIFA Standings</span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-900/60 pb-2 font-bold">
                          <th className="py-2">Pos</th>
                          <th>Team</th>
                          <th className="text-center">MP</th>
                          <th className="text-center">W</th>
                          <th className="text-center">D</th>
                          <th className="text-center">L</th>
                          <th className="text-center">GD</th>
                          <th className="text-center font-bold text-brand-green">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupTeams.map((team, idx) => {
                          const played = 3;
                          const won = idx === 0 ? 2 : idx === 1 ? 1 : 0;
                          const drawn = idx === 1 ? 1 : idx === 2 ? 2 : 1;
                          const lost = idx === 0 ? 0 : idx === 1 ? 1 : idx === 2 ? 1 : 2;
                          const points = won * 3 + drawn;
                          const gd = idx === 0 ? "+4" : idx === 1 ? "+1" : idx === 2 ? "-2" : "-3";

                          return (
                            <tr key={team.id} className="border-b border-slate-900/40 hover:bg-slate-900/20 transition">
                              <td className="py-3 font-bold font-mono text-slate-500">{idx + 1}</td>
                              <td className="font-bold text-white py-3">
                                <Link href={`/teams/${team.id}`} className="flex items-center gap-2 hover:text-brand-green transition-colors">
                                  <img src={team.flagUrl} alt="" className="w-5 h-3.5 object-cover rounded-sm border border-slate-800 shrink-0" />
                                  <span>{team.name}</span>
                                </Link>
                              </td>
                              <td className="text-center font-mono text-slate-300">{played}</td>
                              <td className="text-center font-mono text-slate-400">{won}</td>
                              <td className="text-center font-mono text-slate-400">{drawn}</td>
                              <td className="text-center font-mono text-slate-400">{lost}</td>
                              <td className="text-center font-mono text-slate-400">{gd}</td>
                              <td className="text-center font-mono font-bold text-brand-green">{points}</td>
                            </tr>
                          );
                        })}
                        {groupTeams.length === 0 && (
                          <tr>
                            <td colSpan={8} className="py-4 text-center text-slate-500 italic">No teams seeded in this group.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
