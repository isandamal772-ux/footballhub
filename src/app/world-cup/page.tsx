'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Calendar, MapPin, Award, ArrowRight, Eye } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';

export default function WorldCupSection() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState<'GROUPS' | 'SCHEDULE' | 'BRACKET' | 'GOLDEN_BOOT' | 'STADIUMS'>('GROUPS');
  const [teams, setTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [teamsRes, matchesRes] = await Promise.all([
          fetch('/api/teams'),
          fetch('/api/matches')
        ]);
        const teamsData = await teamsRes.json();
        const matchesData = await matchesRes.json();
        setTeams(teamsData);
        setMatches(matchesData);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  // Sort groups A-D
  const groups = ['Group A', 'Group B', 'Group C', 'Group D'];

  // Host Country & Stadium Data
  const stadiums = [
    {
      name: "Lusail Iconic Stadium",
      city: "Lusail City",
      capacity: "88,966",
      imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop",
      matches: "Hosts the Final and 9 matches in total."
    },
    {
      name: "Al Bayt Stadium",
      city: "Al Khor",
      capacity: "68,895",
      imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=600&auto=format&fit=crop",
      matches: "Hosts the Opening Match and 9 matches in total."
    },
    {
      name: "Education City Stadium",
      city: "Al Rayyan",
      capacity: "44,667",
      imageUrl: "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=600&auto=format&fit=crop",
      matches: "Hosts Group Stage and Quarter-Final matches."
    },
    {
      name: "Ahmad Bin Ali Stadium",
      city: "Al Rayyan",
      capacity: "45,032",
      imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop",
      matches: "Hosts 7 matches up to Round of 16."
    }
  ];

  // Golden Boot Candidates
  const goldenBoot = [
    { name: "Kylian Mbappé", team: "France", code: "FRA", flag: "https://flagcdn.com/w40/fr.png", goals: 8, assists: 2, matches: 7 },
    { name: "Lionel Messi", team: "Argentina", code: "ARG", flag: "https://flagcdn.com/w40/ar.png", goals: 7, assists: 3, matches: 7 },
    { name: "Julián Álvarez", team: "Argentina", code: "ARG", flag: "https://flagcdn.com/w40/ar.png", goals: 4, assists: 0, matches: 7 },
    { name: "Olivier Giroud", team: "France", code: "FRA", flag: "https://flagcdn.com/w40/fr.png", goals: 4, assists: 0, matches: 6 },
    { name: "Alvaro Morata", team: "Spain", code: "ESP", flag: "https://flagcdn.com/w40/es.png", goals: 3, assists: 1, matches: 4 }
  ];

  // Bracket Nodes
  const bracketR16 = [
    { id: "r16-1", teamA: "Argentina", scoreA: 2, teamB: "Australia", scoreB: 1, date: "Dec 3", winner: "Argentina" },
    { id: "r16-2", teamA: "Netherlands", scoreA: 3, teamB: "USA", scoreB: 1, date: "Dec 3", winner: "Netherlands" },
    { id: "r16-3", teamA: "France", scoreA: 3, teamB: "Poland", scoreB: 1, date: "Dec 4", winner: "France" },
    { id: "r16-4", teamA: "England", scoreA: 3, teamB: "Senegal", scoreB: 0, date: "Dec 4", winner: "England" }
  ];

  const bracketQF = [
    { id: "qf-1", teamA: "Netherlands", scoreA: "2 (3)", teamB: "Argentina", scoreB: "2 (4)", date: "Dec 9", winner: "Argentina" },
    { id: "qf-2", teamA: "England", scoreA: 1, teamB: "France", scoreB: 2, date: "Dec 10", winner: "France" }
  ];

  const bracketSF = [
    { id: "sf-1", teamA: "Argentina", scoreA: 3, teamB: "Croatia", scoreB: 0, date: "Dec 13", winner: "Argentina" },
    { id: "sf-2", teamA: "France", scoreA: 2, teamB: "Morocco", scoreB: 0, date: "Dec 14", winner: "France" }
  ];

  const bracketF = [
    { id: "f-1", teamA: "Argentina", scoreA: "3 (4)", teamB: "France", scoreB: "3 (2)", date: "Dec 18", winner: "Argentina" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* World Cup Header Card */}
        <section className="glass-panel rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-b-2 border-b-brand-green/30">
          <div className="space-y-3 max-w-2xl text-center md:text-left">
            <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5">
              🏆 FIFA World Cup Coverage
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              World Cup Hub
            </h1>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Explore interactive group standings, track the knockout stages through our real-time bracket, see the Golden Boot leaderboard, and review stadiums.
            </p>
          </div>
          <div className="shrink-0 flex items-center justify-center bg-brand-green/10 border border-brand-green/20 p-6 rounded-2xl w-24 h-24 shadow-2xl">
            <Trophy className="w-12 h-12 text-brand-green animate-pulse" />
          </div>
        </section>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-900 text-sm overflow-x-auto no-scrollbar">
          {(['GROUPS', 'SCHEDULE', 'BRACKET', 'GOLDEN_BOOT', 'STADIUMS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-6 font-bold tracking-tight text-xs border-b-2 shrink-0 transition ${
                activeTab === tab
                  ? 'border-brand-green text-brand-green'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'GROUPS' && t('groups')}
              {tab === 'SCHEDULE' && '📅 Match Timetable'}
              {tab === 'BRACKET' && t('bracket')}
              {tab === 'GOLDEN_BOOT' && t('golden_boot')}
              {tab === 'STADIUMS' && t('stadiums')}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <section className="min-h-96">
          {/* GROUPS TAB */}
          {activeTab === 'GROUPS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {groups.map((groupName) => {
                const groupTeams = teams.filter(t => t.groupName === groupName)
                  .sort((a, b) => a.ranking - b.ranking); // Rank ascending for mock standings

                return (
                  <div key={groupName} className="glass-panel rounded-2xl p-5 space-y-4">
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
                            // Mock standings rows
                            const played = 3;
                            const won = idx === 0 ? 2 : idx === 1 ? 1 : 0;
                            const drawn = idx === 1 ? 1 : idx === 2 ? 2 : 1;
                            const lost = idx === 0 ? 0 : idx === 1 ? 1 : idx === 2 ? 1 : 2;
                            const points = won * 3 + drawn;
                            const gd = idx === 0 ? "+4" : idx === 1 ? "+1" : idx === 2 ? "-2" : "-3";

                            return (
                              <tr key={team.id} className="border-b border-slate-900/40 hover:bg-slate-900/20 transition">
                                <td className="py-3 font-bold font-mono text-slate-500">{idx + 1}</td>
                                <td className="font-bold text-white flex items-center gap-2 py-3">
                                  <img src={team.flagUrl} alt="" className="w-5 h-3.5 object-cover rounded-sm border border-slate-800" />
                                  {team.name}
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
                              <td colSpan={8} className="py-4 text-center text-slate-500 italic">No teams seeded.</td>
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

          {/* SCHEDULE TAB: COMPLETE MATCH TIMETABLE */}
          {activeTab === 'SCHEDULE' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="glass-panel rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-4 mb-6 gap-3">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                      📅 Tournament Match Schedule
                    </h3>
                    <p className="text-slate-400 text-xs mt-1">Complete timetable of all fixtures, active scores, and upcoming matches.</p>
                  </div>
                  <div className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    {matches.length} Total Matches
                  </div>
                </div>

                <div className="space-y-4">
                  {matches.map((m) => {
                    const matchDate = new Date(m.datetime);
                    const formattedDate = matchDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });

                    return (
                      <div 
                        key={m.id}
                        className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-slate-900 hover:border-slate-800 bg-slate-950/20 hover:bg-slate-950/40 transition gap-4"
                      >
                        {/* Time & Venue Column */}
                        <div className="text-center sm:text-left space-y-1.5 shrink-0">
                          <span className="bg-slate-900 border border-slate-850 px-2.5 py-0.5 rounded text-[10px] text-slate-300 font-mono">
                            {m.stage} - {m.groupName || 'Knockout'}
                          </span>
                          <p className="text-xs text-white font-bold font-mono">{formattedDate}</p>
                          <p className="text-[10px] text-slate-500">{m.venue}</p>
                        </div>

                        {/* Teams and Score Dashboard */}
                        <div className="flex items-center justify-center gap-6 flex-grow">
                          {/* Team A */}
                          <div className="flex items-center gap-2.5 w-32 sm:w-40 justify-end">
                            <span className="text-xs font-bold text-white text-right truncate">{m.teamA?.name}</span>
                            <img src={m.teamA?.flagUrl} alt="" className="w-6 h-4 object-cover rounded shadow-sm border border-slate-800 shrink-0" />
                          </div>

                          {/* Score Box */}
                          <div className="bg-slate-950/80 border border-slate-900 px-4 py-1.5 rounded-lg text-center min-w-16 flex items-center justify-center gap-1.5">
                            {m.status === 'UPCOMING' ? (
                              <span className="text-[10px] font-bold text-brand-green uppercase tracking-wide">VS</span>
                            ) : (
                              <span className="font-mono text-sm font-black text-white">
                                {m.teamAScore} - {m.teamBScore}
                              </span>
                            )}
                          </div>

                          {/* Team B */}
                          <div className="flex items-center gap-2.5 w-32 sm:w-40 justify-start">
                            <img src={m.teamB?.flagUrl} alt="" className="w-6 h-4 object-cover rounded shadow-sm border border-slate-800 shrink-0" />
                            <span className="text-xs font-bold text-white text-left truncate">{m.teamB?.name}</span>
                          </div>
                        </div>

                        {/* Status & Match Center Link */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-900 pt-3 sm:pt-0 gap-3 shrink-0">
                          {/* Status Badge */}
                          <div>
                            {m.status === 'LIVE' && (
                              <span className="bg-red-600/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                LIVE {m.timeElapsed}'
                              </span>
                            )}
                            {m.status === 'FT' && (
                              <span className="bg-slate-900 text-slate-500 border border-slate-850 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                                Full Time
                              </span>
                            )}
                            {m.status === 'UPCOMING' && (
                              <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                                Scheduled
                              </span>
                            )}
                          </div>

                          {/* Link Button */}
                          <Link 
                            href={`/match/${m.id}`}
                            className="bg-brand-green hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Match Center
                          </Link>
                        </div>
                      </div>
                    );
                  })}

                  {matches.length === 0 && (
                    <p className="text-xs text-slate-500 italic text-center py-8">No scheduled matches loaded.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* BRACKET TAB (Interactive knockout visualization) */}
          {activeTab === 'BRACKET' && (
            <div className="overflow-x-auto pb-6">
              <div className="min-w-[800px] grid grid-cols-4 gap-6 items-center p-4 relative">
                {/* Round of 16 Column */}
                <div className="space-y-8">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-2">Round of 16</h4>
                  {bracketR16.map((node) => (
                    <div key={node.id} className="bg-slate-900/85 border border-slate-800 rounded-xl p-3 space-y-2 text-xs relative">
                      <div className="flex justify-between items-center font-bold">
                        <span className={node.winner === node.teamA ? 'text-brand-green' : 'text-slate-400'}>{node.teamA}</span>
                        <span className="font-mono">{node.scoreA}</span>
                      </div>
                      <div className="flex justify-between items-center font-bold">
                        <span className={node.winner === node.teamB ? 'text-brand-green' : 'text-slate-400'}>{node.teamB}</span>
                        <span className="font-mono">{node.scoreB}</span>
                      </div>
                      <div className="text-[9px] text-slate-500 border-t border-slate-800/40 pt-1.5 flex justify-between">
                        <span>{node.date}</span>
                        <span className="text-brand-green font-bold flex items-center gap-0.5">Details →</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quarter-Finals Column */}
                <div className="space-y-20">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-2">Quarter-Finals</h4>
                  {bracketQF.map((node) => (
                    <div key={node.id} className="bg-slate-900/85 border border-slate-800 rounded-xl p-3 space-y-2 text-xs relative">
                      <div className="flex justify-between items-center font-bold">
                        <span className={node.winner === node.teamA ? 'text-brand-green' : 'text-slate-400'}>{node.teamA}</span>
                        <span className="font-mono">{node.scoreA}</span>
                      </div>
                      <div className="flex justify-between items-center font-bold">
                        <span className={node.winner === node.teamB ? 'text-brand-green' : 'text-slate-400'}>{node.teamB}</span>
                        <span className="font-mono">{node.scoreB}</span>
                      </div>
                      <div className="text-[9px] text-slate-500 border-t border-slate-800/40 pt-1.5 flex justify-between">
                        <span>{node.date}</span>
                        <span className="text-brand-green font-bold">Details →</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Semi-Finals Column */}
                <div className="space-y-40">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-2">Semi-Finals</h4>
                  {bracketSF.map((node) => (
                    <div key={node.id} className="bg-slate-900/85 border border-slate-800 rounded-xl p-3 space-y-2 text-xs relative">
                      <div className="flex justify-between items-center font-bold">
                        <span className={node.winner === node.teamA ? 'text-brand-green' : 'text-slate-400'}>{node.teamA}</span>
                        <span className="font-mono">{node.scoreA}</span>
                      </div>
                      <div className="flex justify-between items-center font-bold">
                        <span className={node.winner === node.teamB ? 'text-brand-green' : 'text-slate-400'}>{node.teamB}</span>
                        <span className="font-mono">{node.scoreB}</span>
                      </div>
                      <div className="text-[9px] text-slate-500 border-t border-slate-800/40 pt-1.5 flex justify-between">
                        <span>{node.date}</span>
                        <span className="text-brand-green font-bold">Details →</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Finals Column */}
                <div className="space-y-60">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center mb-2">Final</h4>
                  {bracketF.map((node) => (
                    <div key={node.id} className="bg-emerald-950/20 border-2 border-brand-green/40 rounded-xl p-4 space-y-3 text-xs relative shadow-2xl">
                      <div className="flex justify-between items-center font-black">
                        <span className={node.winner === node.teamA ? 'text-brand-green' : 'text-slate-400'}>{node.teamA}</span>
                        <span className="font-mono">{node.scoreA}</span>
                      </div>
                      <div className="flex justify-between items-center font-black">
                        <span className={node.winner === node.teamB ? 'text-brand-green' : 'text-slate-400'}>{node.teamB}</span>
                        <span className="font-mono">{node.scoreB}</span>
                      </div>
                      <div className="text-[9px] text-slate-500 border-t border-slate-800/40 pt-1.5 flex justify-between">
                        <span>🏆 Champions: <span className="text-brand-green font-bold">{node.winner}</span></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* GOLDEN BOOT TAB */}
          {activeTab === 'GOLDEN_BOOT' && (
            <div className="glass-panel rounded-2xl p-6 max-w-2xl mx-auto space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-3 text-center">
                Tournament Top Goalscorers
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-900 font-bold pb-2">
                      <th className="py-2">Rank</th>
                      <th>Player</th>
                      <th>Team</th>
                      <th className="text-center">Matches</th>
                      <th className="text-center font-bold text-brand-green">Goals</th>
                      <th className="text-center">Assists</th>
                    </tr>
                  </thead>
                  <tbody>
                    {goldenBoot.map((p, idx) => (
                      <tr key={idx} className="border-b border-slate-900/50 hover:bg-slate-900/20 transition">
                        <td className="py-3 font-bold font-mono text-slate-500">{idx + 1}</td>
                        <td className="font-bold text-white py-3">{p.name}</td>
                        <td className="text-slate-300 font-medium flex items-center gap-1.5 py-3">
                          <img src={p.flag} alt="" className="w-4.5 h-3 rounded-sm object-cover border border-slate-800" />
                          {p.team}
                        </td>
                        <td className="text-center font-mono text-slate-400">{p.matches}</td>
                        <td className="text-center font-mono font-bold text-brand-green text-sm">{p.goals}</td>
                        <td className="text-center font-mono text-slate-400">{p.assists}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STADIUMS TAB */}
          {activeTab === 'STADIUMS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stadiums.map((stadium, idx) => (
                <div key={idx} className="glass-panel rounded-2xl overflow-hidden flex flex-col group border border-card-border/20">
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={stadium.imageUrl}
                      alt={stadium.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-slate-300 font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" /> {stadium.city}
                    </div>
                  </div>
                  <div className="p-5 space-y-2 grow flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">{stadium.name}</h4>
                      <p className="text-xs text-slate-400">Capacity: <span className="text-emerald-400 font-semibold">{stadium.capacity}</span></p>
                      <p className="text-[11px] text-slate-500 leading-normal">{stadium.matches}</p>
                    </div>
                    <a href="#" className="text-[10px] text-brand-green font-bold flex items-center gap-0.5 mt-3 self-start hover:underline">
                      See matches schedule →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
