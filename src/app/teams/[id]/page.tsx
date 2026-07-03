'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Heart, Award, Users, BookOpen, Clock, Activity } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';

export default function TeamDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { favorites, toggleFavorite } = useApp();

  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeamDetail() {
      try {
        const res = await fetch('/api/teams');
        const data = await res.json();
        const found = data.find((t: any) => t.id === id);
        if (!found) {
          throw new Error("Team not found");
        }
        setTeam(found);
      } catch (e) {
        console.error(e);
        router.push('/teams');
      } finally {
        setLoading(false);
      }
    }
    loadTeamDetail();
  }, [id]);

  if (loading || !team) {
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

  const isFav = favorites.teams.includes(team.id);

  // Group players by position
  const players = team.players || [];
  const gks = players.filter((p: any) => p.position === 'Goalkeeper');
  const defs = players.filter((p: any) => p.position === 'Defender');
  const mids = players.filter((p: any) => p.position === 'Midfielder');
  const fwds = players.filter((p: any) => p.position === 'Forward');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "name": team.name,
    "sport": "Football/Soccer",
    "coach": {
      "@type": "Person",
      "name": team.coachName
    },
    "memberOf": {
      "@type": "SportsOrganization",
      "name": "FIFA"
    },
    "logo": team.flagUrl,
    "description": `${team.name} national football team. Group: ${team.groupName}, FIFA Ranking: #${team.ranking}, Form: ${team.form}.`
  };

  return (
    <div className="flex flex-col min-h-screen">
      <title>{`${team.name} National Team Squad & Standings | World Football Hub`}</title>
      <meta name="description" content={`Explore fixtures, roster squad list, coach details, FIFA ranking, and match results for ${team.name} national team at World Football Hub.`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <Link href="/teams" className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to Teams Directory
        </Link>

        {/* TEAM PROFILE HEADER CARD */}
        <section className="glass-panel rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8 relative flex flex-col md:flex-row items-center justify-between gap-6 border-b border-brand-green/20">
          <button
            onClick={() => toggleFavorite('teams', team.id)}
            className="absolute top-4 right-4 p-2 rounded-full border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-red-500 transition"
            aria-label="Add to favorites"
          >
            <Heart className={`w-5 h-5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <img
              src={team.flagUrl}
              alt={team.name}
              className="w-24 h-16 object-cover rounded-xl shadow-2xl border border-slate-850"
            />
            <div className="space-y-2">
              <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                {team.groupName}
              </span>
              <h1 className="text-3xl font-black text-white">{team.name} ({team.code})</h1>
              <p className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1">
                🧔 Coach: <span className="text-slate-200 font-semibold">{team.coachName}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center shrink-0 w-full md:w-auto">
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
              <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest">FIFA Ranking</span>
              <span className="text-xl font-mono font-black text-brand-green mt-1 block">#{team.ranking}</span>
            </div>
            <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
              <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-widest">Form</span>
              <div className="flex gap-1 justify-center mt-2.5">
                {team.form.split(',').map((f: string, idx: number) => (
                  <span
                    key={idx}
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-slate-950 ${
                      f === 'W' ? 'bg-brand-green' : f === 'D' ? 'bg-slate-400' : 'bg-red-500'
                    }`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TEAM SQUAD ROSTER */}
        <section className="space-y-6">
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-green" />
            Squad Roster & Profiles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Goalkeepers & Defenders */}
            <div className="space-y-6">
              {/* Goalkeepers */}
              <div className="glass-panel rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-900 pb-2">
                  🧤 Goalkeepers
                </h3>
                <div className="space-y-3">
                  {gks.map((p: any) => (
                    <Link
                      key={p.id}
                      href={`/players/${p.id}`}
                      className="flex justify-between items-center text-xs hover:bg-slate-900/25 p-2 rounded-xl transition border border-transparent hover:border-slate-800"
                    >
                      <span className="font-bold text-white flex items-center gap-2.5">
                        <span className="font-mono text-slate-500 inline-block w-6">#{p.jerseyNumber}</span>
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt="" className="w-6 h-6 object-cover rounded-full border border-brand-green/20" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-brand-green/15 text-brand-green font-black flex items-center justify-center text-[9px] shrink-0">{p.name.charAt(0)}</div>
                        )}
                        <span>{p.name}</span>
                      </span>
                      <div className="flex items-center gap-4 text-slate-400 font-semibold font-mono">
                        <span>Apps: {p.appearances}</span>
                        <span className="bg-brand-green/10 text-brand-green px-1.5 py-0.5 rounded border border-brand-green/20">★ {p.rating.toFixed(1)}</span>
                      </div>
                    </Link>
                  ))}
                  {gks.length === 0 && <p className="text-xs text-slate-500 italic">No goalkeepers registered.</p>}
                </div>
              </div>

              {/* Defenders */}
              <div className="glass-panel rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-900 pb-2">
                  🛡️ Defenders
                </h3>
                <div className="space-y-3">
                  {defs.map((p: any) => (
                    <Link
                      key={p.id}
                      href={`/players/${p.id}`}
                      className="flex justify-between items-center text-xs hover:bg-slate-900/25 p-2 rounded-xl transition border border-transparent hover:border-slate-800"
                    >
                      <span className="font-bold text-white flex items-center gap-2.5">
                        <span className="font-mono text-slate-500 inline-block w-6">#{p.jerseyNumber}</span>
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt="" className="w-6 h-6 object-cover rounded-full border border-brand-green/20" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-brand-green/15 text-brand-green font-black flex items-center justify-center text-[9px] shrink-0">{p.name.charAt(0)}</div>
                        )}
                        <span>{p.name}</span>
                      </span>
                      <div className="flex items-center gap-4 text-slate-400 font-semibold font-mono">
                        <span>Goals: {p.goals}</span>
                        <span className="bg-brand-green/10 text-brand-green px-1.5 py-0.5 rounded border border-brand-green/20">★ {p.rating.toFixed(1)}</span>
                      </div>
                    </Link>
                  ))}
                  {defs.length === 0 && <p className="text-xs text-slate-500 italic">No defenders registered.</p>}
                </div>
              </div>
            </div>

            {/* Midfielders & Forwards */}
            <div className="space-y-6">
              {/* Midfielders */}
              <div className="glass-panel rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-900 pb-2">
                  ⚡ Midfielders
                </h3>
                <div className="space-y-3">
                  {mids.map((p: any) => (
                    <Link
                      key={p.id}
                      href={`/players/${p.id}`}
                      className="flex justify-between items-center text-xs hover:bg-slate-900/25 p-2 rounded-xl transition border border-transparent hover:border-slate-800"
                    >
                      <span className="font-bold text-white flex items-center gap-2.5">
                        <span className="font-mono text-slate-500 inline-block w-6">#{p.jerseyNumber}</span>
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt="" className="w-6 h-6 object-cover rounded-full border border-brand-green/20" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-brand-green/15 text-brand-green font-black flex items-center justify-center text-[9px] shrink-0">{p.name.charAt(0)}</div>
                        )}
                        <span>{p.name}</span>
                      </span>
                      <div className="flex items-center gap-4 text-slate-400 font-semibold font-mono">
                        <span>Asts: {p.assists}</span>
                        <span className="bg-brand-green/10 text-brand-green px-1.5 py-0.5 rounded border border-brand-green/20">★ {p.rating.toFixed(1)}</span>
                      </div>
                    </Link>
                  ))}
                  {mids.length === 0 && <p className="text-xs text-slate-500 italic">No midfielders registered.</p>}
                </div>
              </div>

              {/* Forwards */}
              <div className="glass-panel rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-widest border-b border-slate-900 pb-2">
                  🎯 Forwards
                </h3>
                <div className="space-y-3">
                  {fwds.map((p: any) => (
                    <Link
                      key={p.id}
                      href={`/players/${p.id}`}
                      className="flex justify-between items-center text-xs hover:bg-slate-900/25 p-2 rounded-xl transition border border-transparent hover:border-slate-800"
                    >
                      <span className="font-bold text-white flex items-center gap-2.5">
                        <span className="font-mono text-slate-500 inline-block w-6">#{p.jerseyNumber}</span>
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt="" className="w-6 h-6 object-cover rounded-full border border-brand-green/20" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-brand-green/15 text-brand-green font-black flex items-center justify-center text-[9px] shrink-0">{p.name.charAt(0)}</div>
                        )}
                        <span>{p.name}</span>
                      </span>
                      <div className="flex items-center gap-4 text-slate-400 font-semibold font-mono">
                        <span className="text-brand-green">Goals: {p.goals}</span>
                        <span className="bg-brand-green/10 text-brand-green px-1.5 py-0.5 rounded border border-brand-green/20">★ {p.rating.toFixed(1)}</span>
                      </div>
                    </Link>
                  ))}
                  {fwds.length === 0 && <p className="text-xs text-slate-500 italic">No forwards registered.</p>}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
