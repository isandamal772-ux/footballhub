'use client';

import React, { useState, useEffect } from 'react';
import { GitCompare, Users, User, ArrowLeftRight, Check, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';

export default function ComparisonEngine() {
  const { t } = useApp();
  const [compareType, setCompareType] = useState<'TEAMS' | 'PLAYERS'>('TEAMS');
  const [teams, setTeams] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);

  // Selected state
  const [selectedTeamA, setSelectedTeamA] = useState<string>('');
  const [selectedTeamB, setSelectedTeamB] = useState<string>('');
  const [selectedPlayerA, setSelectedPlayerA] = useState<string>('');
  const [selectedPlayerB, setSelectedPlayerB] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      try {
        const [teamsRes, playersRes] = await Promise.all([
          fetch('/api/teams'),
          fetch('/api/players')
        ]);
        const teamsData = await teamsRes.json();
        const playersData = await playersRes.json();

        setTeams(teamsData);
        setPlayers(playersData);

        if (teamsData.length >= 2) {
          setSelectedTeamA(teamsData[0].id);
          setSelectedTeamB(teamsData[1].id);
        }
        if (playersData.length >= 2) {
          setSelectedPlayerA(playersData[0].id);
          setSelectedPlayerB(playersData[1].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const teamA = teams.find(t => t.id === selectedTeamA);
  const teamB = teams.find(t => t.id === selectedTeamB);

  const playerA = players.find(p => p.id === selectedPlayerA);
  const playerB = players.find(p => p.id === selectedPlayerB);

  // Helper stats values for visual slider calculations
  const calculateBarPercentages = (valA: number, valB: number) => {
    const total = valA + valB || 1;
    const pctA = Math.round((valA / total) * 100);
    const pctB = Math.round((valB / total) * 100);
    return { pctA, pctB };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Block */}
        <section className="glass-panel rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8 border-b border-brand-green/20 text-center">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="bg-brand-green/10 text-brand-green border border-brand-green/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5">
              <GitCompare className="w-3.5 h-3.5" /> Stats Engine
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white">Compare Squads & Players</h1>
            <p className="text-slate-400 text-xs">Analyze side-by-side performance metrics of teams and athletes.</p>
          </div>
        </section>

        {/* Compare type toggle */}
        <div className="flex justify-center">
          <div className="flex bg-slate-950 border border-slate-900 p-1.5 rounded-2xl gap-2">
            <button
              onClick={() => setCompareType('TEAMS')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition ${
                compareType === 'TEAMS'
                  ? 'bg-brand-green text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> Compare Teams
            </button>
            <button
              onClick={() => setCompareType('PLAYERS')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition ${
                compareType === 'PLAYERS'
                  ? 'bg-brand-green text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" /> Compare Players
            </button>
          </div>
        </div>

        {/* COMPARISON SLATES */}
        <section>
          {compareType === 'TEAMS' && (
            <div className="space-y-8">
              {/* Select selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="glass-panel p-5 rounded-2xl space-y-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Team A</label>
                  <select
                    value={selectedTeamA}
                    onChange={(e) => setSelectedTeamA(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id} disabled={t.id === selectedTeamB}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div className="glass-panel p-5 rounded-2xl space-y-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Team B</label>
                  <select
                    value={selectedTeamB}
                    onChange={(e) => setSelectedTeamB(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.id} disabled={t.id === selectedTeamA}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {teamA && teamB ? (
                <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-8">
                  {/* Banner Header comparison */}
                  <div className="grid grid-cols-3 items-center gap-4 text-center border-b border-slate-900 pb-6">
                    <div className="space-y-2 flex flex-col items-center">
                      <img src={teamA.flagUrl} alt="" className="w-16 h-10 object-cover rounded shadow border border-slate-800" />
                      <h3 className="text-base font-black text-white">{teamA.name}</h3>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs"><ArrowLeftRight className="w-4.5 h-4.5 text-brand-green" /></div>
                    </div>
                    <div className="space-y-2 flex flex-col items-center">
                      <img src={teamB.flagUrl} alt="" className="w-16 h-10 object-cover rounded shadow border border-slate-800" />
                      <h3 className="text-base font-black text-white">{teamB.name}</h3>
                    </div>
                  </div>

                  {/* Comparisons stats list */}
                  <div className="space-y-6 max-w-2xl mx-auto">
                    {/* FIFA Rank (Lower is better) */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>Rank #{teamA.ranking}</span>
                        <span className="font-normal text-[10px] text-slate-400 uppercase tracking-widest">FIFA World Ranking</span>
                        <span>Rank #{teamB.ranking}</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
                        {/* Higher ranking (lower value) gets longer bar */}
                        <div
                          className="bg-brand-green h-full transition-all duration-500"
                          style={{ width: `${(teamB.ranking / (teamA.ranking + teamB.ranking)) * 100}%` }}
                        ></div>
                        <div className="bg-slate-700 h-full grow"></div>
                      </div>
                    </div>

                    {/* Coach */}
                    <div className="flex justify-between items-center text-xs py-3 border-b border-slate-900/60 text-center">
                      <span className="font-bold text-white w-[40%] text-left">{teamA.coachName}</span>
                      <span className="font-normal text-[10px] text-slate-500 uppercase tracking-widest w-[20%] shrink-0">Head Coach</span>
                      <span className="font-bold text-white w-[40%] text-right">{teamB.coachName}</span>
                    </div>

                    {/* Squad Size */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-300 font-mono">
                        <span>{teamA.players?.length || 11} players</span>
                        <span className="font-normal text-[10px] text-slate-400 uppercase tracking-widest font-sans">Squad Size</span>
                        <span>{teamB.players?.length || 11} players</span>
                      </div>
                      {(() => {
                        const valA = teamA.players?.length || 11;
                        const valB = teamB.players?.length || 11;
                        const { pctA } = calculateBarPercentages(valA, valB);
                        return (
                          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
                            <div className="bg-brand-green h-full" style={{ width: `${pctA}%` }}></div>
                            <div className="bg-slate-700 h-full grow"></div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Groups */}
                    <div className="flex justify-between items-center text-xs py-3 border-b border-slate-900/60 text-center">
                      <span className="font-bold text-emerald-400 w-[40%] text-left">{teamA.groupName}</span>
                      <span className="font-normal text-[10px] text-slate-500 uppercase tracking-widest w-[20%] shrink-0">Tournament Group</span>
                      <span className="font-bold text-emerald-400 w-[40%] text-right">{teamB.groupName}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
                  <AlertCircle className="w-8 h-8 opacity-40 text-yellow-500" />
                  Not enough teams populated to perform comparison.
                </div>
              )}
            </div>
          )}

          {compareType === 'PLAYERS' && (
            <div className="space-y-8">
              {/* Select selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="glass-panel p-5 rounded-2xl space-y-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Player A</label>
                  <select
                    value={selectedPlayerA}
                    onChange={(e) => setSelectedPlayerA(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                  >
                    {players.map(p => (
                      <option key={p.id} value={p.id} disabled={p.id === selectedPlayerB}>{p.name} ({p.position})</option>
                    ))}
                  </select>
                </div>

                <div className="glass-panel p-5 rounded-2xl space-y-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Player B</label>
                  <select
                    value={selectedPlayerB}
                    onChange={(e) => setSelectedPlayerB(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                  >
                    {players.map(p => (
                      <option key={p.id} value={p.id} disabled={p.id === selectedPlayerA}>{p.name} ({p.position})</option>
                    ))}
                  </select>
                </div>
              </div>

              {playerA && playerB ? (
                <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-8">
                  {/* Banner Header comparison */}
                  <div className="grid grid-cols-3 items-center gap-4 text-center border-b border-slate-900 pb-6">
                    <div className="space-y-1">
                      <div className="w-12 h-12 rounded-full bg-brand-green text-slate-950 font-black text-sm flex items-center justify-center mx-auto border border-brand-green/20">
                        {playerA.name.charAt(0)}
                      </div>
                      <h3 className="text-sm font-black text-white mt-2">{playerA.name}</h3>
                      <span className="text-[10px] text-slate-400">{playerA.position}</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs"><ArrowLeftRight className="w-4.5 h-4.5 text-brand-green" /></div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-12 h-12 rounded-full bg-emerald-800 text-white font-black text-sm flex items-center justify-center mx-auto border border-brand-green/20">
                        {playerB.name.charAt(0)}
                      </div>
                      <h3 className="text-sm font-black text-white mt-2">{playerB.name}</h3>
                      <span className="text-[10px] text-slate-400">{playerB.position}</span>
                    </div>
                  </div>

                  {/* Comparisons stats list */}
                  <div className="space-y-6 max-w-2xl mx-auto">
                    {/* Goals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-300 font-mono">
                        <span>{playerA.goals} goals</span>
                        <span className="font-normal text-[10px] text-slate-400 uppercase tracking-widest font-sans">Goals</span>
                        <span>{playerB.goals} goals</span>
                      </div>
                      {(() => {
                        const { pctA } = calculateBarPercentages(playerA.goals, playerB.goals);
                        return (
                          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                            <div className="bg-brand-green h-full" style={{ width: `${pctA}%` }}></div>
                            <div className="bg-slate-700 h-full grow"></div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Assists */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-300 font-mono">
                        <span>{playerA.assists} assists</span>
                        <span className="font-normal text-[10px] text-slate-400 uppercase tracking-widest font-sans">Assists</span>
                        <span>{playerB.assists} assists</span>
                      </div>
                      {(() => {
                        const { pctA } = calculateBarPercentages(playerA.assists, playerB.assists);
                        return (
                          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                            <div className="bg-brand-green h-full" style={{ width: `${pctA}%` }}></div>
                            <div className="bg-slate-700 h-full grow"></div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Match Rating */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-300 font-mono">
                        <span className="text-brand-green font-black">★ {playerA.rating.toFixed(2)}</span>
                        <span className="font-normal text-[10px] text-slate-400 uppercase tracking-widest font-sans">Avg Match Rating</span>
                        <span className="text-brand-green font-black">★ {playerB.rating.toFixed(2)}</span>
                      </div>
                      {(() => {
                        const { pctA } = calculateBarPercentages(playerA.rating, playerB.rating);
                        return (
                          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
                            <div className="bg-brand-green h-full" style={{ width: `${pctA}%` }}></div>
                            <div className="bg-slate-700 h-full grow"></div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Appearances */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-300 font-mono">
                        <span>{playerA.appearances} Caps</span>
                        <span className="font-normal text-[10px] text-slate-400 uppercase tracking-widest font-sans">Appearances</span>
                        <span>{playerB.appearances} Caps</span>
                      </div>
                      {(() => {
                        const { pctA } = calculateBarPercentages(playerA.appearances, playerB.appearances);
                        return (
                          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                            <div className="bg-brand-green h-full" style={{ width: `${pctA}%` }}></div>
                            <div className="bg-slate-700 h-full grow"></div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
                  <AlertCircle className="w-8 h-8 opacity-40 text-yellow-500" />
                  Not enough players populated to perform comparison.
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
