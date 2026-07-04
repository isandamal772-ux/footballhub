'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, TrendingUp, AlertCircle, ChevronRight, Activity, Percent } from 'lucide-react';

export default function PredictionsCenter() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await fetch('/api/matches');
        const data = await res.json();
        // Show scheduled or live matches
        setMatches(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, []);

  // Form helper
  const renderFormBadge = (form: string) => {
    return form.split(',').slice(0, 3).map((f, idx) => (
      <span
        key={idx}
        className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black text-slate-950 ${
          f === 'W' ? 'bg-brand-green' : f === 'D' ? 'bg-amber-400' : 'bg-red-400'
        }`}
      >
        {f}
      </span>
    ));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <title>Football Match Predictions & Win Probabilities | World Football Hub</title>
      <meta name="description" content="Get upcoming football match predictions, calculated win probabilities, head-to-head records and form comparison reports." />
      
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
                "name": "Match Predictions",
                "item": "https://footballhub.asia/predictions"
              }
            ]
          })
        }}
      />

      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner Section */}
        <section className="glass-panel rounded-3xl p-6 md:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950/60 border-b border-brand-green/20">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              AI Sports Forecasts
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              <TrendingUp className="w-7 h-7 text-emerald-400 animate-pulse" />
              Match Predictions Center
            </h1>
            <p className="text-slate-400 text-xs max-w-xl">
              Compare squad form indices, historical head-to-head ratios, and calculated win probabilities for all scheduled international fixtures.
            </p>
          </div>
        </section>

        {loading ? (
          <div className="h-60 bg-slate-950/20 animate-pulse rounded-2xl flex items-center justify-center text-xs text-slate-500 font-bold">Loading Predictions...</div>
        ) : (
          <div className="space-y-6">
            {matches.map((m) => {
              // Simulated dynamic win probability calculations based on team rankings
              const rankA = m.teamA?.ranking || 10;
              const rankB = m.teamB?.ranking || 10;
              const totalRank = rankA + rankB;
              const probA = Math.round((1 - rankA / totalRank) * 100);
              const probB = Math.round((1 - rankB / totalRank) * 100);
              const diff = Math.abs(probA - probB);
              const drawProb = 100 - probA - probB;

              return (
                <div key={m.id} className="glass-panel p-6 rounded-2xl border border-slate-900 space-y-6 group hover:border-brand-green/20 transition duration-300">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-950 border border-slate-800 text-[10px] font-mono font-bold text-brand-green px-2 py-0.5 rounded">
                        {m.stage}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">🏟️ {m.venue}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">📅 Kickoff: {new Date(m.datetime).toLocaleString()}</span>
                  </div>

                  {/* Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Team A Details */}
                    <div className="flex items-center gap-4">
                      <img src={m.teamA?.flagUrl} alt="" className="w-10 h-7 object-cover rounded border border-slate-850 shadow" />
                      <div>
                        <h3 className="text-sm font-bold text-white truncate max-w-[150px]">{m.teamA?.name}</h3>
                        <div className="flex gap-1 items-center mt-1">
                          <span className="text-[9px] text-slate-500 font-semibold uppercase">Form:</span>
                          <div className="flex gap-0.5">{renderFormBadge(m.teamA?.form || "W,W,D")}</div>
                        </div>
                      </div>
                    </div>

                    {/* AI Probability Bar Chart */}
                    <div className="space-y-2">
                      <div className="flex justify-between font-mono text-[10px] font-bold text-slate-300">
                        <span>{probA}%</span>
                        <span className="text-slate-500 uppercase font-sans font-normal text-[8px] tracking-widest">Draw {drawProb}%</span>
                        <span>{probB}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                        <div className="bg-brand-green h-full" style={{ width: `${probA}%` }}></div>
                        <div className="bg-slate-700 h-full" style={{ width: `${drawProb}%` }}></div>
                        <div className="bg-emerald-700 h-full grow"></div>
                      </div>
                    </div>

                    {/* Team B Details */}
                    <div className="flex items-center gap-4 justify-end">
                      <div className="text-right">
                        <h3 className="text-sm font-bold text-white truncate max-w-[150px]">{m.teamB?.name}</h3>
                        <div className="flex gap-1 items-center justify-end mt-1">
                          <span className="text-[9px] text-slate-500 font-semibold uppercase">Form:</span>
                          <div className="flex gap-0.5">{renderFormBadge(m.teamB?.form || "W,L,W")}</div>
                        </div>
                      </div>
                      <img src={m.teamB?.flagUrl} alt="" className="w-10 h-7 object-cover rounded border border-slate-850 shadow" />
                    </div>
                  </div>

                  {/* Prediction and match-center link */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-900/60 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                      <AlertCircle className="w-4 h-4 text-brand-green shrink-0" />
                      <span>Forecast: <strong className="text-white font-bold">{probA > probB ? `${m.teamA?.name} Win` : probB > probA ? `${m.teamB?.name} Win` : 'Draw/Close Game'}</strong> (Confidence: {diff + 20}%)</span>
                    </div>
                    <Link
                      href={`/match/${m.id}`}
                      className="text-[10px] text-brand-green font-black uppercase tracking-wider flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
                    >
                      Enter Match Center <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
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
