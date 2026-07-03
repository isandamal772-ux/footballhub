'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, MapPin, Calendar, Play, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import CountdownTimer from './CountdownTimer';

interface MatchCardProps {
  match: {
    id: string;
    teamAScore: number;
    teamBScore: number;
    status: string; // "SCHEDULED", "LIVE", "HT", "FT"
    timeElapsed: number;
    datetime: string | Date;
    venue: string;
    stage: string;
    groupName?: string;
    teamA?: { id: string; name: string; code: string; flagUrl: string };
    teamB?: { id: string; name: string; code: string; flagUrl: string };
  };
}

export default function MatchCard({ match }: MatchCardProps) {
  const { favorites, toggleFavorite, t } = useApp();
  const isFavorite = favorites.matches.includes(match.id);

  const formattedDate = new Date(match.datetime).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden relative transition-all duration-300">
      {/* Ribbon for Status */}
      {match.status === 'LIVE' && (
        <div className="absolute top-0 left-0 bg-brand-green text-background text-[10px] font-black tracking-widest px-3 py-1 flex items-center gap-1 rounded-br-lg uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-background animate-pulse"></span>
          Live
        </div>
      )}

      {/* Header with stage & Venue */}
      <div className="px-4 pt-4 pb-2 border-b border-slate-900/40 flex justify-between items-center text-[11px] text-slate-400 font-semibold">
        <span className="uppercase text-emerald-400">
          {match.stage} {match.groupName ? `• ${match.groupName}` : ''}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite('matches', match.id);
            }}
            className="text-slate-400 hover:text-red-500 transition"
            aria-label="Toggle Match Favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Score / Team Grid */}
      <Link href={`/match/${match.id}`} className="block p-4 space-y-4">
        <div className="flex items-center justify-between">
          {/* Team A */}
          <div className="flex flex-col items-center justify-center text-center w-24 shrink-0">
            <img
              src={match.teamA?.flagUrl}
              alt={match.teamA?.name}
              className="w-12 h-8 object-cover rounded shadow-md border border-slate-800"
            />
            <span className="text-xs font-bold mt-2 text-white truncate max-w-full">
              {match.teamA?.name}
            </span>
          </div>

          {/* Central Score / Time */}
          <div className="flex flex-col items-center justify-center grow">
            {match.status === 'SCHEDULED' ? (
              <div className="text-center flex flex-col items-center gap-1.5">
                <span className="block text-[11px] text-slate-400 font-mono">{formattedDate}</span>
                <CountdownTimer targetDate={match.datetime} />
              </div>
            ) : (
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 font-mono text-2xl font-black text-white">
                  <span>{match.teamAScore}</span>
                  <span className="text-slate-600 text-lg">-</span>
                  <span>{match.teamBScore}</span>
                </div>
                {match.status === 'LIVE' ? (
                  <span className="inline-block text-[11px] bg-brand-green/10 text-brand-green font-bold px-2 py-0.5 rounded mt-1.5 animate-pulse">
                    {match.timeElapsed}'
                  </span>
                ) : match.status === 'HT' ? (
                  <span className="inline-block text-[11px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded mt-1.5">
                    HT
                  </span>
                ) : (
                  <span className="inline-block text-[11px] bg-slate-900 text-slate-500 font-bold px-2 py-0.5 rounded mt-1.5 uppercase">
                    FT
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Team B */}
          <div className="flex flex-col items-center justify-center text-center w-24 shrink-0">
            <img
              src={match.teamB?.flagUrl}
              alt={match.teamB?.name}
              className="w-12 h-8 object-cover rounded shadow-md border border-slate-800"
            />
            <span className="text-xs font-bold mt-2 text-white truncate max-w-full">
              {match.teamB?.name}
            </span>
          </div>
        </div>

        {/* Footer info (Venue) */}
        <div className="pt-2 border-t border-slate-900/20 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1 truncate max-w-[80%]">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {match.venue}
          </span>
          <span className="text-brand-green font-bold flex items-center gap-0.5 hover:translate-x-1 transition-transform">
            Details <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </Link>
    </div>
  );
}
