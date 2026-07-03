'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Clock, MapPin, Award, Users, ChevronLeft, Heart, MessageSquare, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import CountdownTimer from '@/components/CountdownTimer';

export default function MatchCenter() {
  const params = useParams();
  const router = useRouter();
  const { favorites, toggleFavorite, t } = useApp();
  const id = params?.id as string;

  const [match, setMatch] = useState<any>(null);
  const [nextMatchA, setNextMatchA] = useState<any>(null);
  const [nextMatchB, setNextMatchB] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STREAM' | 'STATS' | 'LINEUPS' | 'PREDICTIONS'>('OVERVIEW');
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);
  const [predictionChoice, setPredictionChoice] = useState<string | null>(null);
  const [predictionsCounts, setPredictionsCounts] = useState({ WinA: 55, Draw: 20, WinB: 25 });
  const [loading, setLoading] = useState(true);

  const isFavorite = favorites.matches.includes(id);

  const [streamUrl, setStreamUrl] = useState<string>("");
  const [activeServer, setActiveServer] = useState<'PRESET' | 'CUSTOM'>('PRESET');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`match-stream-${id}`);
      if (saved) {
        setStreamUrl(saved);
        setActiveServer('CUSTOM');
      }
    }
  }, [id]);

  const saveStreamUrl = (url: string) => {
    setStreamUrl(url);
    if (typeof window !== 'undefined') {
      if (url) {
        localStorage.setItem(`match-stream-${id}`, url);
        setActiveServer('CUSTOM');
      } else {
        localStorage.removeItem(`match-stream-${id}`);
        setActiveServer('PRESET');
      }
    }
  };

  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let videoId = '';
        if (url.includes('youtube.com/watch')) {
          const params = new URLSearchParams(new URL(url).search);
          videoId = params.get('v') || '';
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
        } else if (url.includes('youtube.com/embed/')) {
          videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
        }
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      if (url.includes('twitch.tv')) {
        const channel = url.split('twitch.tv/')[1]?.split('?')[0] || '';
        return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}&autoplay=true`;
      }
    } catch (e) {}
    return null;
  };

  const [autoVoiceEnabled, setAutoVoiceEnabled] = useState(false);
  const lastSpokenTextRef = useRef<string>("");

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  async function loadMatchDetail() {
    try {
      const [detailRes, listRes] = await Promise.all([
        fetch(`/api/matches/${id}`),
        fetch('/api/matches')
      ]);
      if (!detailRes.ok) {
        throw new Error("Match not found");
      }
      const data = await detailRes.json();
      setMatch(data);

      const allMatches = await listRes.json();
      if (Array.isArray(allMatches)) {
        const nextA = allMatches
          .filter(m => m.id !== id && m.status === 'SCHEDULED' && (m.teamAId === data.teamAId || m.teamBId === data.teamAId))
          .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())[0];
        setNextMatchA(nextA);

        const nextB = allMatches
          .filter(m => m.id !== id && m.status === 'SCHEDULED' && (m.teamAId === data.teamBId || m.teamBId === data.teamBId))
          .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())[0];
        setNextMatchB(nextB);
      }
    } catch (e) {
      console.error(e);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMatchDetail();
    // Poll matches every 5 seconds for live events and commentary updates
    const interval = setInterval(loadMatchDetail, 5000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (autoVoiceEnabled && match?.commentary) {
      try {
        const comms = JSON.parse(match.commentary);
        if (comms.length > 0) {
          const latestText = comms[0].text;
          if (latestText && latestText !== lastSpokenTextRef.current) {
            speakText(latestText);
            lastSpokenTextRef.current = latestText;
          }
        }
      } catch (e) {}
    }
  }, [match?.commentary, autoVoiceEnabled]);

  const handlePredictSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (predictionChoice) {
      setPredictionSubmitted(true);
      // Simulate database increment
      setPredictionsCounts(prev => {
        const key = predictionChoice as keyof typeof prev;
        return {
          ...prev,
          [key]: prev[key] + 1
        };
      });
    }
  };

  if (loading || !match) {
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

  // Parse JSON data safe defaults
  const stats = match.stats ? JSON.parse(match.stats) : {};
  const events = match.events ? JSON.parse(match.events) : [];
  const commentary = match.commentary ? JSON.parse(match.commentary) : [];



  // Team players list mock fallback
  const teamAPlayers = [
    { name: "E. Martínez", number: 23, role: "GK" },
    { name: "N. Molina", number: 26, role: "DEF" },
    { name: "C. Romero", number: 13, role: "DEF" },
    { name: "N. Otamendi", number: 19, role: "DEF" },
    { name: "N. Tagliafico", number: 3, role: "DEF" },
    { name: "R. De Paul", number: 7, role: "MID" },
    { name: "Enzo F.", number: 24, role: "MID" },
    { name: "A. Mac Allister", number: 20, role: "MID" },
    { name: "L. Messi", number: 10, role: "FWD" },
    { name: "J. Álvarez", number: 9, role: "FWD" },
    { name: "A. Di María", number: 11, role: "FWD" }
  ];

  const teamBPlayers = [
    { name: "H. Lloris", number: 1, role: "GK" },
    { name: "J. Koundé", number: 5, role: "DEF" },
    { name: "R. Varane", number: 4, role: "DEF" },
    { name: "D. Upamecano", number: 18, role: "DEF" },
    { name: "T. Hernandez", number: 22, role: "DEF" },
    { name: "A. Tchouaméni", number: 8, role: "MID" },
    { name: "A. Rabiot", number: 14, role: "MID" },
    { name: "O. Dembélé", number: 11, role: "FWD" },
    { name: "A. Griezmann", number: 7, role: "MID" },
    { name: "K. Mbappé", number: 10, role: "FWD" },
    { name: "O. Giroud", number: 9, role: "FWD" }
  ];

  const totalVotes = predictionsCounts.WinA + predictionsCounts.Draw + predictionsCounts.WinB;
  const pctA = Math.round((predictionsCounts.WinA / totalVotes) * 100);
  const pctDraw = Math.round((predictionsCounts.Draw / totalVotes) * 100);
  const pctB = Math.round((predictionsCounts.WinB / totalVotes) * 100);

  return (
    <div className="flex flex-col min-h-screen">
      <title>{`${match.teamA?.name} vs ${match.teamB?.name} Live Score | World Football Hub`}</title>
      <meta name="description" content={`Follow the live match score, statistics, commentary timeline and lineups for ${match.teamA?.name} vs ${match.teamB?.name} at World Football Hub.`} />
      <Header />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition text-sm">
          <ChevronLeft className="w-4 h-4" /> Back to matches
        </Link>

        {/* Live SCOREBOARD CARD */}
        <section className="glass-panel rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8 relative">
          {match.status === 'LIVE' && (
            <span className="absolute top-4 left-4 bg-brand-green text-background text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <span className="w-1.5 h-1.5 rounded-full bg-background animate-pulse"></span>
              Live Commentary
            </span>
          )}

          <button
            onClick={() => toggleFavorite('matches', match.id)}
            className="absolute top-4 right-4 p-2 rounded-full border border-slate-800 bg-slate-900/40 text-slate-400 hover:text-red-500 transition"
            aria-label="Add to favorites"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          <div className="flex flex-col items-center justify-center space-y-6 pt-4">
            <div className="flex items-center justify-between w-full max-w-xl gap-4">
              {/* Team A logo */}
              <div className="flex flex-col items-center text-center w-28 md:w-36 shrink-0">
                <img
                  src={match.teamA?.flagUrl}
                  alt={match.teamA?.name}
                  className="w-16 h-11 md:w-20 md:h-14 object-cover rounded-lg border border-slate-800 shadow-xl"
                />
                <h2 className="text-sm md:text-base font-black text-white mt-3 truncate w-full">
                  {match.teamA?.name}
                </h2>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">Rank #{match.teamA?.ranking}</span>

                {/* Team A Goalscorers */}
                {(() => {
                  try {
                    const goals = JSON.parse(match.events || "[]").filter((e: any) => e.type === "GOAL" && e.team === match.teamA?.code);
                    if (goals.length > 0) {
                      return (
                        <div className="text-[9px] text-slate-400 mt-2 space-y-0.5 max-w-full text-center font-medium bg-slate-900/20 px-2 py-1 rounded border border-slate-900/30">
                          {goals.map((g: any, idx: number) => (
                            <div key={idx} className="truncate">⚽ {g.player} ({g.time}')</div>
                          ))}
                        </div>
                      );
                    }
                  } catch (e) {}
                  return null;
                })()}
              </div>

              {/* Central Dashboard Score */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest mb-1.5">
                  {match.stage}
                </span>
                <div className="flex items-center gap-4 font-mono text-4xl md:text-5xl font-black text-white">
                  <span>{match.status === 'SCHEDULED' ? '0' : match.teamAScore}</span>
                  <span className="text-slate-700 text-3xl">:</span>
                  <span>{match.status === 'SCHEDULED' ? '0' : match.teamBScore}</span>
                </div>
                {match.status === 'LIVE' ? (
                  <div className="flex items-center gap-1.5 mt-3 text-xs bg-brand-green/10 text-brand-green border border-brand-green/20 font-bold px-3 py-1 rounded-full animate-pulse">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{match.timeElapsed}'</span>
                  </div>
                ) : match.status === 'HT' ? (
                  <span className="text-xs bg-slate-800 text-slate-300 font-bold px-3 py-1 rounded-full mt-3">Half Time</span>
                ) : match.status === 'FT' ? (
                  <span className="text-xs bg-slate-900 text-slate-500 font-bold px-3 py-1 rounded-full mt-3">Full Time</span>
                ) : (
                  <div className="mt-3 flex flex-col items-center gap-1.5">
                    <span className="text-xs bg-slate-900 text-slate-400 font-bold px-3 py-1 rounded-full">Scheduled</span>
                    <CountdownTimer targetDate={match.datetime} />
                  </div>
                )}
              </div>

              {/* Team B logo */}
              <div className="flex flex-col items-center text-center w-28 md:w-36 shrink-0">
                <img
                  src={match.teamB?.flagUrl}
                  alt={match.teamB?.name}
                  className="w-16 h-11 md:w-20 md:h-14 object-cover rounded-lg border border-slate-800 shadow-xl"
                />
                <h2 className="text-sm md:text-base font-black text-white mt-3 truncate w-full">
                  {match.teamB?.name}
                </h2>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">Rank #{match.teamB?.ranking}</span>

                {/* Team B Goalscorers */}
                {(() => {
                  try {
                    const goals = JSON.parse(match.events || "[]").filter((e: any) => e.type === "GOAL" && e.team === match.teamB?.code);
                    if (goals.length > 0) {
                      return (
                        <div className="text-[9px] text-slate-400 mt-2 space-y-0.5 max-w-full text-center font-medium bg-slate-900/20 px-2 py-1 rounded border border-slate-900/30">
                          {goals.map((g: any, idx: number) => (
                            <div key={idx} className="truncate">⚽ {g.player} ({g.time}')</div>
                          ))}
                        </div>
                      );
                    }
                  } catch (e) {}
                  return null;
                })()}
              </div>
            </div>

            {/* Event Stadium details */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 border-t border-slate-900/60 pt-4 w-full text-center">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                {match.venue}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-800 hidden sm:inline"></span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-slate-600" />
                Referee: Facundo Tello
              </span>
            </div>
          </div>
        </section>

        {/* TAB BAR HEADER */}
        <div className="flex border-b border-slate-900 text-sm overflow-x-auto no-scrollbar">
          {(['OVERVIEW', 'STREAM', 'STATS', 'LINEUPS', 'PREDICTIONS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-6 font-bold tracking-tight text-xs border-b-2 shrink-0 transition ${
                activeTab === tab
                  ? 'border-brand-green text-brand-green'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'OVERVIEW' && 'Overview & Live Feed'}
              {tab === 'STREAM' && '🔴 Live Stream'}
              {tab === 'STATS' && 'Match Statistics'}
              {tab === 'LINEUPS' && 'Lineups / Formations'}
              {tab === 'PREDICTIONS' && 'Fan Predictions'}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <section className="min-h-96">
          {/* TAB 1: OVERVIEW & COMMENTARY */}
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Match Events timeline */}
              <div className="md:col-span-5 glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-1.5">
                  🛡️ Timeline Events
                </h3>
                <div className="relative border-l border-slate-800 ml-3 pl-6 space-y-6 pt-2">
                  {events.map((e: any, idx: number) => (
                    <div key={idx} className="relative text-xs">
                      {/* Timeline dot */}
                      <span className="absolute -left-9 top-0.5 bg-slate-950 border-2 border-brand-green w-5.5 h-5.5 rounded-full flex items-center justify-center text-xs">
                        {e.type === 'GOAL' ? '⚽' : e.type === 'CARD' ? '🟨' : '🔄'}
                      </span>
                      <div className="space-y-1">
                        <span className="font-mono font-bold text-brand-green">{e.time}'</span>
                        <h4 className="font-bold text-white leading-tight">{e.player}</h4>
                        <p className="text-[10px] text-slate-400">{e.detail}</p>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <p className="text-xs text-slate-500 italic py-4">{t('no_events')}</p>
                  )}
                </div>
              </div>

              {/* Live commentary text stream */}
              <div className="md:col-span-7 glass-panel rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center justify-between gap-1.5">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    Live Commentary Stream
                  </span>
                  <button
                    onClick={() => {
                      const nextState = !autoVoiceEnabled;
                      setAutoVoiceEnabled(nextState);
                      if (nextState && commentary.length > 0) {
                        speakText("Audio commentary enabled. " + commentary[0].text);
                        lastSpokenTextRef.current = commentary[0].text;
                      } else {
                        if (typeof window !== 'undefined') window.speechSynthesis.cancel();
                      }
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase transition-all duration-300 ${
                      autoVoiceEnabled
                        ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.3)] animate-pulse'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {autoVoiceEnabled ? '🔊 Audio ON' : '🔇 Audio OFF'}
                  </button>
                </h3>

                <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-2">
                  {commentary.map((c: any, idx: number) => (
                    <div key={idx} className="flex gap-4 border-b border-slate-900/60 pb-3 text-xs leading-relaxed group/item justify-between items-start">
                      <div className="flex gap-4 grow">
                        <span className="font-mono font-bold text-brand-green text-sm shrink-0 w-8">
                          {c.time ? `${c.time}'` : 'INFO'}
                        </span>
                        <p className="text-slate-300">
                          {c.text}
                        </p>
                      </div>
                      <button
                        onClick={() => speakText(c.text)}
                        className="text-slate-500 hover:text-amber-400 p-1 opacity-0 group-hover/item:opacity-100 focus:opacity-100 transition duration-200 shrink-0"
                        title="Read commentary aloud"
                      >
                        🔊
                      </button>
                    </div>
                  ))}
                  {commentary.length === 0 && (
                    <p className="text-xs text-slate-500 italic py-4">{t('no_commentary')}</p>
                  )}
                </div>
              </div>

              {/* Upcoming Fixtures Preview */}
              {(nextMatchA || nextMatchB) && (
                <div className="md:col-span-12 glass-panel rounded-2xl p-6 space-y-4 mt-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-1.5">
                    📅 Next Scheduled Match Preview
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team A Next Match */}
                    {nextMatchA ? (
                      <div className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-xl space-y-3">
                        <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">
                          Next for {match.teamA?.name}
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={nextMatchA.teamA?.id === match.teamAId ? nextMatchA.teamB?.flagUrl : nextMatchA.teamA?.flagUrl}
                              alt=""
                              className="w-8 h-5.5 object-cover rounded border border-slate-800"
                            />
                            <span className="text-xs font-bold text-white">
                              vs {nextMatchA.teamA?.id === match.teamAId ? nextMatchA.teamB?.name : nextMatchA.teamA?.name}
                            </span>
                          </div>
                          <CountdownTimer targetDate={nextMatchA.datetime} />
                        </div>
                        <div className="text-[10px] text-slate-500 flex flex-col gap-1 pt-1.5 border-t border-slate-900/40 font-medium">
                          <span>🏟️ Venue: {nextMatchA.venue}</span>
                          <span>📅 Kickoff: {new Date(nextMatchA.datetime).toLocaleString()}</span>
                        </div>
                        <Link
                          href={`/match/${nextMatchA.id}`}
                          className="block text-center text-[10px] bg-slate-900 hover:bg-slate-800 text-brand-green border border-slate-800 rounded-lg py-2 font-bold transition mt-2"
                        >
                          Preview Match Center
                        </Link>
                      </div>
                    ) : (
                      <div className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-xl text-center text-xs text-slate-500 italic flex items-center justify-center font-medium">
                        No upcoming fixtures scheduled for {match.teamA?.name}.
                      </div>
                    )}

                    {/* Team B Next Match */}
                    {nextMatchB ? (
                      <div className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-xl space-y-3">
                        <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider block">
                          Next for {match.teamB?.name}
                        </span>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={nextMatchB.teamA?.id === match.teamBId ? nextMatchB.teamB?.flagUrl : nextMatchB.teamA?.flagUrl}
                              alt=""
                              className="w-8 h-5.5 object-cover rounded border border-slate-800"
                            />
                            <span className="text-xs font-bold text-white">
                              vs {nextMatchB.teamA?.id === match.teamBId ? nextMatchB.teamB?.name : nextMatchB.teamA?.name}
                            </span>
                          </div>
                          <CountdownTimer targetDate={nextMatchB.datetime} />
                        </div>
                        <div className="text-[10px] text-slate-500 flex flex-col gap-1 pt-1.5 border-t border-slate-900/40 font-medium">
                          <span>🏟️ Venue: {nextMatchB.venue}</span>
                          <span>📅 Kickoff: {new Date(nextMatchB.datetime).toLocaleString()}</span>
                        </div>
                        <Link
                          href={`/match/${nextMatchB.id}`}
                          className="block text-center text-[10px] bg-slate-900 hover:bg-slate-800 text-brand-green border border-slate-800 rounded-lg py-2 font-bold transition mt-2"
                        >
                          Preview Match Center
                        </Link>
                      </div>
                    ) : (
                      <div className="bg-slate-950/40 border border-slate-900/60 p-4 rounded-xl text-center text-xs text-slate-500 italic flex items-center justify-center font-medium">
                        No upcoming fixtures scheduled for {match.teamB?.name}.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: LIVE STREAM */}
          {activeTab === 'STREAM' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Live Streaming Player */}
              <div className="lg:col-span-2 space-y-6">
                <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-black aspect-video group">
                  {activeServer === 'CUSTOM' && streamUrl ? (
                    (() => {
                      const embedUrl = getEmbedUrl(streamUrl);
                      if (embedUrl) {
                        return (
                          <iframe
                            src={embedUrl}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        );
                      }
                      return (
                        <video
                          src={streamUrl}
                          autoPlay
                          controls
                          className="w-full h-full object-cover"
                        />
                      );
                    })()
                  ) : (
                    <>
                      {/* The actual looping video stream */}
                      <video 
                        src="https://assets.mixkit.co/videos/preview/mixkit-soccer-ball-passing-in-a-grass-field-34444-large.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />

                      {/* Top Bar Controls Overlay */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                        <div className="flex items-center gap-2">
                          <span className="bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1.5 shadow-md">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                            LIVE
                          </span>
                          <span className="bg-slate-950/70 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-sm border border-slate-800/40">
                            1080p60 Source
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-slate-950/70 text-brand-green font-bold text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm border border-brand-green/20 shadow-md">
                          <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse"></span>
                          WFC TV Live Feed
                        </div>
                      </div>

                      {/* Bottom Controls Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-between z-10 text-white text-xs">
                        <div className="flex items-center gap-4">
                          <button className="hover:text-brand-green transition">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </button>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 fill-current text-slate-300" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                            <span className="w-16 h-1 bg-slate-700 rounded-full relative overflow-hidden"><span className="absolute top-0 left-0 h-full w-3/4 bg-brand-green"></span></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-slate-300 font-mono text-[10px]">
                          <span>Latency: 1.4s</span>
                          <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                          <span>Rate: 5.4 Mbps</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Streaming Source Selector & Custom Connector */}
                <div className="glass-panel p-6 rounded-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                    <h4 className="font-black text-white text-xs uppercase tracking-widest flex items-center gap-2">
                      🔌 Stream Feed Source Settings
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveServer('PRESET')}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition ${
                          activeServer === 'PRESET'
                            ? 'bg-brand-green text-slate-950'
                            : 'bg-slate-900 text-slate-400 border border-slate-850 hover:text-white'
                        }`}
                      >
                        Default Server
                      </button>
                      <button
                        onClick={() => setActiveServer('CUSTOM')}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition ${
                          activeServer === 'CUSTOM'
                            ? 'bg-brand-green text-slate-950'
                            : 'bg-slate-900 text-slate-400 border border-slate-850 hover:text-white'
                        }`}
                      >
                        Connected Feed
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      To stream live matches, paste any YouTube stream link, Twitch channel URL, or direct video feed (.mp4 / .m3u8 HLS feed) below:
                    </p>
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={streamUrl}
                        onChange={(e) => setStreamUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... or custom stream link"
                        className="bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green grow"
                      />
                      <button
                        onClick={() => saveStreamUrl(streamUrl)}
                        className="bg-brand-green hover:bg-emerald-400 text-slate-950 font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wider transition shrink-0"
                      >
                        Connect Feed
                      </button>
                    </div>
                    {streamUrl && (
                      <div className="text-[10px] text-slate-500 flex items-center justify-between bg-slate-950/40 px-3 py-2 rounded-lg border border-slate-900">
                        <span className="truncate max-w-[80%]">Connected Source: <span className="font-mono text-emerald-400 break-all">{streamUrl}</span></span>
                        <button
                          onClick={() => saveStreamUrl('')}
                          className="text-red-400 hover:underline font-bold ml-2 shrink-0"
                        >
                          Clear Feed
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 glass-panel rounded-2xl">
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      {match.teamA?.name} vs {match.teamB?.name}
                      <span className="text-brand-green font-mono text-xs font-black">({match.status === 'LIVE' ? `${match.timeElapsed}'` : 'Live Stream'})</span>
                    </h4>
                    <p className="text-slate-400 text-xs mt-1">FIFA World Cup Live Broadcast - English Commentary</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Spectators</span>
                    <p className="text-brand-green font-mono font-black text-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
                      1,842,402
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: 2D Live Attack Tracker Pitch & stream chat */}
              <div className="space-y-6">
                {/* 2D Live Pitch Tracker */}
                <div className="glass-panel rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-3">
                    ⚽ 2D Match Live Tracker
                  </h4>

                  {/* Miniature Pitch container */}
                  <div className="relative aspect-[3/2] rounded-lg border border-emerald-900 bg-emerald-950/20 overflow-hidden flex items-center justify-center">
                    {/* Pitch line markings */}
                    <div className="absolute inset-2 border border-emerald-500/20 pointer-events-none rounded"></div>
                    <div className="absolute top-2 bottom-2 left-1/2 w-0 border-l border-emerald-500/20 pointer-events-none"></div>
                    <div className="absolute w-12 h-12 rounded-full border border-emerald-500/20 pointer-events-none"></div>
                    {/* Penalty Boxes */}
                    <div className="absolute left-2 top-1/4 bottom-1/4 w-10 border border-emerald-500/20 pointer-events-none"></div>
                    <div className="absolute right-2 top-1/4 bottom-1/4 w-10 border border-emerald-500/20 pointer-events-none"></div>

                    {/* Animated Attack Indicators */}
                    <div className="absolute text-center space-y-1.5 z-10 animate-pulse">
                      {match.timeElapsed % 2 === 0 ? (
                        <>
                          <div className="text-brand-green text-sm font-black uppercase tracking-wider">Attack</div>
                          <div className="text-white text-xs font-bold">{match.teamA?.name} pushing forward</div>
                          <div className="w-2 h-2 bg-brand-green rounded-full mx-auto animate-ping"></div>
                        </>
                      ) : (
                        <>
                          <div className="text-yellow-500 text-sm font-black uppercase tracking-wider">Midfield Duel</div>
                          <div className="text-white text-xs font-bold">Tight possession battle</div>
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mx-auto animate-ping"></div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Match Stream Chat */}
                <div className="glass-panel rounded-2xl p-6 flex flex-col h-64 justify-between">
                  <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-3">
                    💬 Live Stream Chat
                  </h4>
                  
                  {/* Chat messages */}
                  <div className="flex-grow overflow-y-auto space-y-3 py-3 text-[10px] no-scrollbar">
                    <div className="flex gap-1.5">
                      <span className="text-brand-green font-bold shrink-0">Gihan_98:</span>
                      <span className="text-slate-300">Let's go! Messi will score another one!</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-emerald-500 font-bold shrink-0">Julien_FRA:</span>
                      <span className="text-slate-300">Mbappé is unstoppable today! Allez les Bleus! 🇫🇷</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-slate-400 font-bold shrink-0">FootballFanatic:</span>
                      <span className="text-slate-300">What a tactical duel. The midfield battle is intense.</span>
                    </div>
                    <div className="flex gap-1.5">
                      <span className="text-brand-green font-bold shrink-0">Priya_C:</span>
                      <span className="text-slate-300">Amazing live streaming quality! No lag.</span>
                    </div>
                  </div>

                  {/* Chat input placeholder */}
                  <div className="flex gap-2 border-t border-slate-900 pt-3">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="bg-slate-950 border border-slate-900 rounded-lg px-3 py-1.5 text-[10px] text-white w-full focus:outline-none focus:border-brand-green" 
                      disabled
                    />
                    <button className="bg-brand-green text-slate-950 font-bold px-3 py-1.5 rounded-lg text-[10px] hover:bg-emerald-400 transition">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STATISTICS */}
          {activeTab === 'STATS' && (
            <div className="glass-panel rounded-2xl p-6 max-w-xl mx-auto space-y-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-3 text-center">
                Match Performance metrics
              </h3>

              {Object.keys(stats).length > 0 ? (
                <div className="space-y-6">
                  {/* Possession */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span>{match.teamA?.name} ({stats.possession.teamA}%)</span>
                      <span className="uppercase text-[10px] tracking-wider font-bold text-white">Ball Possession</span>
                      <span>({stats.possession.teamB}%) {match.teamB?.name}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
                      <div className="bg-brand-green h-full" style={{ width: `${stats.possession.teamA}%` }}></div>
                      <div className="bg-emerald-700 h-full grow"></div>
                    </div>
                  </div>

                  {/* Stat Slider Bar function */}
                  {[
                    { key: 'shots', label: t('shots') },
                    { key: 'shotsOnTarget', label: t('shots_target') },
                    { key: 'fouls', label: t('fouls') },
                    { key: 'yellowCards', label: t('yellow_cards') },
                    { key: 'redCards', label: t('red_cards') },
                    { key: 'corners', label: t('corners') }
                  ].map((item) => {
                    const valA = stats[item.key]?.teamA ?? 0;
                    const valB = stats[item.key]?.teamB ?? 0;
                    const total = valA + valB || 1;
                    const pctValA = Math.round((valA / total) * 100);

                    return (
                      <div key={item.key} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-300">
                          <span className="font-mono text-sm">{valA}</span>
                          <span className="font-normal text-[10px] text-slate-400 uppercase tracking-widest">{item.label}</span>
                          <span className="font-mono text-sm">{valB}</span>
                        </div>
                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden flex">
                          <div className="bg-brand-green h-full" style={{ width: `${pctValA}%` }}></div>
                          <div className="bg-slate-700 h-full grow"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs flex flex-col items-center gap-2">
                  <AlertCircle className="w-8 h-8 opacity-40 text-yellow-500" />
                  No performance statistics generated for this match stage.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LINEUPS */}
          {activeTab === 'LINEUPS' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Pitch Formation */}
              <div className="md:col-span-8 flex justify-center">
                <div className="pitch-bg w-full max-w-[420px] aspect-[3/4] rounded-2xl relative overflow-hidden p-6 flex flex-col justify-between">
                  <div className="pitch-line top-0 left-0 w-full h-[50%] border-b border-white/10"></div>
                  <div className="pitch-center-circle"></div>

                  {/* Team A Formation Nodes (Top Area - Argentina e.g. 4-3-3) */}
                  <div className="absolute inset-x-0 top-6 bottom-[50%] flex flex-col justify-around text-center select-none pointer-events-none">
                    {/* Attacking line */}
                    <div className="flex justify-around px-8">
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-brand-green text-slate-950 font-bold text-xs flex items-center justify-center border border-white/20">11</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Di María</span></div>
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-brand-green text-slate-950 font-bold text-xs flex items-center justify-center border border-white/20">9</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Álvarez</span></div>
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-brand-green text-slate-950 font-bold text-xs flex items-center justify-center border border-white/20">10</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Messi</span></div>
                    </div>
                    {/* Midfielders */}
                    <div className="flex justify-around px-6">
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-brand-green text-slate-950 font-bold text-xs flex items-center justify-center border border-white/20">20</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Mac Allister</span></div>
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-brand-green text-slate-950 font-bold text-xs flex items-center justify-center border border-white/20">24</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Fernández</span></div>
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-brand-green text-slate-950 font-bold text-xs flex items-center justify-center border border-white/20">7</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">De Paul</span></div>
                    </div>
                    {/* Defenders */}
                    <div className="flex justify-around px-2">
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-brand-green text-slate-950 font-bold text-xs flex items-center justify-center border border-white/20">3</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Tagliafico</span></div>
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-brand-green text-slate-950 font-bold text-xs flex items-center justify-center border border-white/20">19</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Otamendi</span></div>
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-brand-green text-slate-950 font-bold text-xs flex items-center justify-center border border-white/20">13</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Romero</span></div>
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-brand-green text-slate-950 font-bold text-xs flex items-center justify-center border border-white/20">26</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Molina</span></div>
                    </div>
                    {/* Goalkeeper */}
                    <div className="flex justify-center">
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-brand-green text-slate-950 font-bold text-xs flex items-center justify-center border border-white/20">23</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Martínez</span></div>
                    </div>
                  </div>

                  {/* Team B Formation Nodes (Bottom Area - France e.g. 4-2-3-1) */}
                  <div className="absolute inset-x-0 top-[50%] bottom-6 flex flex-col-reverse justify-around text-center select-none pointer-events-none">
                    {/* Attacker */}
                    <div className="flex justify-center">
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center border border-white/20">9</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Giroud</span></div>
                    </div>
                    {/* Attacking Midfielders */}
                    <div className="flex justify-around px-6">
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center border border-white/20">10</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Mbappé</span></div>
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center border border-white/20">7</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Griezmann</span></div>
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center border border-white/20">11</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Dembélé</span></div>
                    </div>
                    {/* Defensive Midfielders */}
                    <div className="flex justify-around px-16">
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center border border-white/20">14</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Rabiot</span></div>
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center border border-white/20">8</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Tchouaméni</span></div>
                    </div>
                    {/* Defenders */}
                    <div className="flex justify-around px-2">
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center border border-white/20">22</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Hernandez</span></div>
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center border border-white/20">18</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Upamecano</span></div>
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center border border-white/20">4</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Varane</span></div>
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center border border-white/20">5</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Koundé</span></div>
                    </div>
                    {/* Goalkeeper */}
                    <div className="flex justify-center">
                      <div className="flex flex-col items-center"><span className="w-7 h-7 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center border border-white/20">1</span><span className="text-[9px] text-slate-300 font-bold mt-1 bg-slate-950/70 px-1 rounded">Lloris</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Roster Squad Lists */}
              <div className="md:col-span-4 space-y-6">
                <div className="glass-panel rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black text-white uppercase border-b border-slate-900 pb-2 flex items-center gap-1.5">
                    👕 {match.teamA?.name} Squad
                  </h4>
                  <ul className="space-y-1.5">
                    {teamAPlayers.map((p, idx) => (
                      <li key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium">
                          <span className="font-mono text-slate-500 inline-block w-4">{p.number}</span> {p.name}
                        </span>
                        <span className="text-[10px] bg-brand-green/10 text-brand-green px-1.5 py-0.5 rounded font-bold">{p.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-black text-white uppercase border-b border-slate-900 pb-2 flex items-center gap-1.5">
                    👕 {match.teamB?.name} Squad
                  </h4>
                  <ul className="space-y-1.5">
                    {teamBPlayers.map((p, idx) => (
                      <li key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium">
                          <span className="font-mono text-slate-500 inline-block w-4">{p.number}</span> {p.name}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-bold">{p.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PREDICTIONS */}
          {activeTab === 'PREDICTIONS' && (
            <div className="glass-panel rounded-2xl p-6 max-w-lg mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-base font-black text-white">{t('predict_win')}</h3>
                <p className="text-xs text-slate-400">Join other fans voting on match outcomes.</p>
              </div>

              {predictionSubmitted ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>{match.teamA?.name} ({pctA}%)</span>
                      <span>Draw ({pctDraw}%)</span>
                      <span>{match.teamB?.name} ({pctB}%)</span>
                    </div>
                    {/* Combined distribution bar */}
                    <div className="w-full h-4 rounded-full overflow-hidden flex text-[10px] font-bold text-slate-950 font-mono text-center">
                      <div className="bg-brand-green h-full flex items-center justify-center" style={{ width: `${pctA}%` }}>
                        {pctA > 15 && `${pctA}%`}
                      </div>
                      <div className="bg-slate-500 h-full flex items-center justify-center text-white" style={{ width: `${pctDraw}%` }}>
                        {pctDraw > 15 && `${pctDraw}%`}
                      </div>
                      <div className="bg-emerald-700 h-full flex items-center justify-center text-white" style={{ width: `${pctB}%` }}>
                        {pctB > 15 && `${pctB}%`}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-brand-green/10 border border-brand-green/20 rounded-xl text-center text-xs text-brand-green font-bold">
                    ✓ Prediction registered successfully. Your choice: <span className="underline uppercase">{predictionChoice}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePredictSubmit} className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPredictionChoice('WinA')}
                      className={`p-4 rounded-xl border text-center font-bold text-xs transition-all duration-300 ${
                        predictionChoice === 'WinA'
                          ? 'bg-brand-green border-brand-green text-slate-950 scale-105 shadow-lg shadow-brand-green/10'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="block text-lg mb-1">🏠</span>
                      {match.teamA?.name}
                    </button>

                    <button
                      type="button"
                      onClick={() => setPredictionChoice('Draw')}
                      className={`p-4 rounded-xl border text-center font-bold text-xs transition-all duration-300 ${
                        predictionChoice === 'Draw'
                          ? 'bg-slate-500 border-slate-500 text-white scale-105 shadow-lg'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="block text-lg mb-1">🤝</span>
                      Draw
                    </button>

                    <button
                      type="button"
                      onClick={() => setPredictionChoice('WinB')}
                      className={`p-4 rounded-xl border text-center font-bold text-xs transition-all duration-300 ${
                        predictionChoice === 'WinB'
                          ? 'bg-emerald-700 border-emerald-700 text-white scale-105 shadow-lg'
                          : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="block text-lg mb-1">✈️</span>
                      {match.teamB?.name}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!predictionChoice}
                    className="w-full bg-brand-green hover:bg-emerald-400 text-slate-950 disabled:bg-slate-800 disabled:text-slate-500 font-bold py-3 px-4 rounded-xl text-xs transition uppercase tracking-wider"
                  >
                    {t('submit_prediction')}
                  </button>
                </form>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
