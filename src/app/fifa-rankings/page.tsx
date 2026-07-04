'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trophy, TrendingUp, Calendar, ChevronRight, Award, Compass } from 'lucide-react';

export default function FifaRankings() {
  const [activeTab, setActiveTab] = useState<'MENS' | 'WOMENS' | 'HISTORY'>('MENS');
  const [mensTeams, setMensTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      try {
        const res = await fetch('/api/teams');
        const data = await res.json();
        // Sort by FIFA ranking ascending
        const sorted = data.sort((a: any, b: any) => a.ranking - b.ranking);
        setMensTeams(sorted);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadRankings();
  }, []);

  const womensTeams = [
    { rank: 1, name: "Spain", code: "ESP", points: 2021.4, flag: "es", change: "0" },
    { rank: 2, name: "USA", code: "USA", points: 2015.6, flag: "us", change: "+1" },
    { rank: 3, name: "England", code: "ENG", points: 2008.1, flag: "gb-eng", change: "-1" },
    { rank: 4, name: "France", code: "FRA", points: 1990.5, flag: "fr", change: "0" },
    { rank: 5, name: "Germany", code: "GER", points: 1968.2, flag: "de", change: "0" },
    { rank: 6, name: "Sweden", code: "SWE", points: 1954.0, flag: "se", change: "+2" },
    { rank: 7, name: "Japan", code: "JPN", points: 1948.3, flag: "jp", change: "-1" },
    { rank: 8, name: "Canada", code: "CAN", points: 1932.1, flag: "ca", change: "-1" },
    { rank: 9, name: "Brazil", code: "BRA", points: 1920.0, flag: "br", change: "0" },
    { rank: 10, name: "Australia", code: "AUS", points: 1895.7, flag: "au", change: "0" }
  ];

  const rankingHistory = [
    { period: "July 2026", details: "Spain gains 45 points after continental cup glory, climbing to World #3.", team: "Spain", rankChange: "Rank #8 ➔ #3" },
    { period: "June 2026", details: "Argentina consolidates World #1 spot with key victories. France holds strong at #2.", team: "Argentina", rankChange: "Rank #1 (Held)" },
    { period: "March 2026", details: "Morocco climbs two places following undefeated international window in Africa.", team: "Morocco", rankChange: "Rank #15 ➔ #13" },
    { period: "January 2026", details: "Colombia enters Top 15 after impressive friendly displays in Europe.", team: "Colombia", rankChange: "Rank #18 ➔ #15" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <title>Official FIFA World Rankings | World Football Hub</title>
      <meta name="description" content="View the official Men's and Women's FIFA World Rankings, points totals, position history and recent changes." />
      
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
                "name": "FIFA Rankings",
                "item": "https://footballhub.asia/fifa-rankings"
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
              Official FIFA Standings
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Trophy className="w-7 h-7 text-yellow-500" />
              FIFA World Rankings
            </h1>
            <p className="text-slate-400 text-xs max-w-xl">
              Track the official world positions of Men's and Women's national football squads, latest points adjustments, and ranking historical updates.
            </p>
          </div>

          {/* Tab selectors */}
          <div className="flex gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-900 shrink-0">
            <button
              onClick={() => setActiveTab('MENS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition duration-300 ${
                activeTab === 'MENS' ? 'bg-brand-green text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Men's
            </button>
            <button
              onClick={() => setActiveTab('WOMENS')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition duration-300 ${
                activeTab === 'WOMENS' ? 'bg-brand-green text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Women's
            </button>
            <button
              onClick={() => setActiveTab('HISTORY')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition duration-300 ${
                activeTab === 'HISTORY' ? 'bg-brand-green text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              History Log
            </button>
          </div>
        </section>

        {/* --- TAB CONTENT: MEN'S RANKINGS --- */}
        {activeTab === 'MENS' && (
          <div className="glass-panel rounded-2xl overflow-hidden border border-card-border/10">
            {loading ? (
              <div className="h-60 bg-slate-950/20 animate-pulse flex items-center justify-center text-xs text-slate-500 font-bold">Loading Rankings...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-900 bg-slate-950/30 font-bold uppercase tracking-wider">
                      <th className="py-4 px-6 text-center w-16">Rank</th>
                      <th>Team</th>
                      <th>Group</th>
                      <th className="text-center w-28">Valuation</th>
                      <th className="py-4 px-6 text-center w-24">Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mensTeams.slice(0, 15).map((t, idx) => (
                      <tr key={t.id} className="border-b border-slate-900/40 hover:bg-slate-900/15 transition">
                        <td className="py-4 px-6 text-center font-mono font-black text-brand-green text-sm">
                          #{idx + 1}
                        </td>
                        <td className="font-bold text-white">
                          <Link href={`/teams/${t.id}`} className="flex items-center gap-3 hover:text-brand-green transition-colors">
                            <img src={t.flagUrl} alt="" className="w-7 h-5 object-cover rounded border border-slate-800 shrink-0 shadow-sm" />
                            <span>{t.name}</span>
                          </Link>
                        </td>
                        <td className="text-slate-400 font-semibold">{t.groupName}</td>
                        <td className="text-center font-mono text-slate-300 font-bold">€{t.ranking * 12 + 150}M</td>
                        <td className="py-4 px-6 text-center">
                          <span className="bg-emerald-950/40 text-brand-green border border-brand-green/20 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                            {t.form.split(',')[0]} Stable
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT: WOMEN'S RANKINGS --- */}
        {activeTab === 'WOMENS' && (
          <div className="glass-panel rounded-2xl overflow-hidden border border-card-border/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-900 bg-slate-950/30 font-bold uppercase tracking-wider">
                    <th className="py-4 px-6 text-center w-16">Rank</th>
                    <th>Team</th>
                    <th className="text-center w-32">Points</th>
                    <th className="py-4 px-6 text-center w-24">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {womensTeams.map((t) => (
                    <tr key={t.rank} className="border-b border-slate-900/40 hover:bg-slate-900/15 transition">
                      <td className="py-4 px-6 text-center font-mono font-black text-brand-green text-sm">
                        #{t.rank}
                      </td>
                      <td className="font-bold text-white flex items-center gap-3 py-4">
                        <img src={`https://flagcdn.com/w320/${t.flag}.png`} alt="" className="w-7 h-5 object-cover rounded border border-slate-800 shrink-0 shadow-sm" />
                        <span>{t.name} ({t.code})</span>
                      </td>
                      <td className="text-center font-mono text-slate-300 font-bold">{t.points.toFixed(1)}</td>
                      <td className="py-4 px-6 text-center font-mono">
                        <span className={`font-black text-[10px] ${t.change.startsWith('+') ? 'text-brand-green' : t.change.startsWith('-') ? 'text-red-400' : 'text-slate-500'}`}>
                          {t.change}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: RANKING HISTORY --- */}
        {activeTab === 'HISTORY' && (
          <div className="space-y-4">
            {rankingHistory.map((h, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{h.period}</span>
                  <h4 className="font-bold text-white text-sm">{h.details}</h4>
                </div>
                <div className="text-right shrink-0 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-900 font-mono text-xs font-black text-brand-green">
                  {h.rankChange}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
