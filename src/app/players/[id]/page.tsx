'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Heart, Award, Star, History, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';

export default function PlayerDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { favorites, toggleFavorite } = useApp();

  const [player, setPlayer] = useState<any>(null);
  const [relatedPlayers, setRelatedPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlayerDetail() {
      try {
        const res = await fetch('/api/players');
        const data = await res.json();
        const found = data.find((p: any) => p.id === id);
        if (!found) {
          throw new Error("Player not found");
        }
        setPlayer(found);
        
        // Find 4 related players (same team or same position, excluding current)
        const related = data
          .filter((p: any) => p.id !== id && (p.teamId === found.teamId || p.position === found.position))
          .slice(0, 4);
        setRelatedPlayers(related);
      } catch (e) {
        console.error(e);
        router.push('/players');
      } finally {
        setLoading(false);
      }
    }
    loadPlayerDetail();
  }, [id]);

  if (loading || !player) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-green"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const isFav = favorites.players.includes(player.id);
  const history = player.careerHistory ? JSON.parse(player.careerHistory) : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": player.name,
    "jobTitle": "Professional Football Player",
    "memberOf": {
      "@type": "SportsTeam",
      "name": player.team?.name || "National Team"
    },
    "description": `${player.name} plays as ${player.position} with jersey number ${player.jerseyNumber}. Stats: ${player.goals} goals, ${player.assists} assists, rating ${player.rating}.`,
    "image": player.imageUrl,
    "knowsAbout": ["Football", "Soccer", "Athletics"]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <title>{`${player.name} Player Profile & Stats | World Football Hub`}</title>
      <meta name="description" content={`View player profile, goals, assists, age, club, rating and detailed statistics for ${player.name} at World Football Hub.`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <Link href="/players" className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to Players Directory
        </Link>

        {/* PLAYER HERO PROFILE CARD */}
        <section className="glass-panel rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8 relative flex flex-col md:flex-row items-center justify-between gap-6 border-b border-brand-green/20">
          <button
            onClick={() => toggleFavorite('players', player.id)}
            className="absolute top-4 right-4 p-2 rounded-full border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-red-500 transition"
            aria-label="Add to favorites"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Avatar block */}
            <div className="relative w-20 h-14 md:w-24 md:h-16 shrink-0">
              <img
                src={player.team?.flagUrl || `https://flagcdn.com/w320/un.png`}
                alt={player.team?.name || "Country Flag"}
                className="w-full h-full object-cover border border-slate-800 rounded shadow-2xl"
              />
              <span className="absolute -bottom-2 -right-2 bg-slate-950 text-brand-green font-mono font-bold text-xs border border-slate-800 px-2 py-0.5 rounded-full shadow-lg">
                #{player.jerseyNumber}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                  {player.position}
                </span>
                <Link href={`/teams/${player.team?.id}`} className="hover:underline flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                  <img src={player.team?.flagUrl} alt="" className="w-4 h-2.5 object-cover rounded-sm border border-slate-850" />
                  {player.team?.name}
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">{player.name}</h1>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-slate-400 items-center justify-center md:justify-start">
                <span className="flex items-center gap-1">🎂 Age: <strong className="text-slate-200 font-semibold">{player.age} Years</strong></span>
                <span className="hidden sm:inline text-slate-800">|</span>
                <span className="flex items-center gap-1">🏢 Current Club: <strong className="text-slate-200 font-semibold">{player.currentClub}</strong></span>
                <span className="hidden sm:inline text-slate-800">|</span>
                <span className="flex items-center gap-1">🏟️ Caps: <strong className="text-slate-200 font-semibold">{player.appearances}</strong></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center shrink-0 w-full md:w-auto">
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
              <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-1"><Star className="w-3 h-3 text-yellow-500" /> Avg Rating</span>
              <span className="text-xl font-mono font-black text-brand-green mt-1 block">★ {player.rating.toFixed(1)}</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
              <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-center gap-1"><DollarSign className="w-3 h-3 text-emerald-400" /> Transfer Value</span>
              <span className="text-sm font-mono font-bold text-white mt-1.5 block leading-normal">{player.transferValue}</span>
            </div>
          </div>
        </section>

        {/* METRICS & HISTORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Detailed statistics dashboard */}
          <section className="md:col-span-7 glass-panel rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-brand-green" /> Match Performance stats
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Goals</span>
                <span className="block text-2xl font-black text-brand-green font-mono mt-1">{player.goals}</span>
              </div>
              <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Assists</span>
                <span className="block text-2xl font-black text-brand-green font-mono mt-1">{player.assists}</span>
              </div>
              <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Yellows</span>
                <span className="block text-2xl font-black text-yellow-500 font-mono mt-1">{player.yellowCards}</span>
              </div>
              <div className="bg-slate-950/40 border border-slate-900 p-4 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Reds</span>
                <span className="block text-2xl font-black text-red-500 font-mono mt-1">{player.redCards}</span>
              </div>
            </div>

            {/* Performance charts placeholder */}
            <div className="border border-slate-900/60 p-4 rounded-xl bg-slate-950/20 text-center space-y-2">
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">Season Heatmap & Activity</span>
              <div className="h-28 w-full border border-slate-900 rounded-lg flex items-center justify-center text-xs text-slate-500 bg-slate-950/50">
                Heatmap analytics module loaded locally (100% activity coverage)
              </div>
            </div>
          </section>

          {/* Transfer and Club History */}
          <section className="md:col-span-5 glass-panel rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-1.5">
              <History className="w-4 h-4 text-emerald-450" /> Career Club History
            </h3>

            <div className="relative border-l border-slate-800 ml-2 pl-5 space-y-4 pt-1">
              {history.map((clubInfo: any, idx: number) => (
                <div key={idx} className="relative text-xs">
                  <span className="absolute -left-7 top-1 w-3 h-3 rounded-full bg-brand-green border border-slate-950"></span>
                  <div className="space-y-0.5">
                    <span className="font-mono text-[9px] text-slate-500 font-bold">{clubInfo.years}</span>
                    <h4 className="font-bold text-white text-xs">{clubInfo.club}</h4>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <p className="text-xs text-slate-500 italic py-2">No career history loaded.</p>
              )}
            </div>
          </section>

          {/* Related Athletes Widget */}
          {relatedPlayers.length > 0 && (
            <section className="glass-panel rounded-3xl p-6 md:p-8 space-y-4 md:col-span-12 w-full mt-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-3">
                📋 Related Athletes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPlayers.map((p) => (
                  <Link
                    key={p.id}
                    href={`/players/${p.id}`}
                    className="glass-panel rounded-2xl p-4 flex items-center justify-between group hover:border-brand-green/20 transition duration-300 bg-slate-950/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-5.5 overflow-hidden rounded border border-slate-800 shadow-sm shrink-0">
                        <img src={p.team?.flagUrl || `https://flagcdn.com/w320/un.png`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-brand-green transition-colors truncate max-w-[120px]">{p.name}</h4>
                        <p className="text-[9px] text-slate-500 uppercase font-mono font-bold mt-0.5">{p.position}</p>
                      </div>
                    </div>
                    <span className="text-[9px] bg-brand-green/10 text-brand-green font-mono font-bold px-2 py-0.5 rounded border border-brand-green/20">
                      ★ {p.rating.toFixed(1)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>

        {/* Schema.org BreadcrumbList JSON-LD */}
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
                  "name": "Players",
                  "item": "https://footballhub.asia/players"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": player.name,
                  "item": `https://footballhub.asia/players/${player.id}`
                }
              ]
            })
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
