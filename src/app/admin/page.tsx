'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, MessageSquare, Plus, Trash2, LogOut, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Dashboard Data
  const [news, setNews] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Form States (News Article)
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSummary, setArticleSummary] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleImage, setArticleImage] = useState('');
  const [articleTrending, setArticleTrending] = useState(false);
  const [articleTags, setArticleTags] = useState('');
  const [newsSubmitStatus, setNewsSubmitStatus] = useState<string | null>(null);

  // Form States (Match Events Simulator)
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [simType, setSimType] = useState<'GOAL' | 'CARD' | 'SUB'>('GOAL');
  const [simTime, setSimTime] = useState<number>(75);
  const [simPlayer, setSimPlayer] = useState('');
  const [simDetail, setSimDetail] = useState('');
  const [simTeam, setSimTeam] = useState<'ARG' | 'FRA' | 'ENG' | 'BRA' | 'ESP' | 'GER' | 'MAR' | 'JPN'>('ARG');
  const [matchSubmitStatus, setMatchSubmitStatus] = useState<string | null>(null);

  // Verify auth session on load
  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/verify');
      const data = await res.json();
      if (data.authenticated) {
        setAuthenticated(true);
        loadDashboardData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingAuth(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  async function loadDashboardData() {
    setLoadingDashboard(true);
    try {
      const [newsRes, matchesRes] = await Promise.all([
        fetch('/api/news'),
        fetch('/api/matches')
      ]);
      const newsData = await newsRes.json();
      const matchesData = await matchesRes.json();

      if (Array.isArray(newsData)) setNews(newsData);
      if (Array.isArray(matchesData)) {
        setMatches(matchesData);
        if (matchesData.length > 0) {
          setSelectedMatchId(matchesData[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDashboard(false);
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }
      setAuthenticated(true);
      loadDashboardData();
    } catch (err: any) {
      setAuthError(err.message || "Invalid credentials");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setAuthenticated(false);
      setEmail('');
      setPassword('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsSubmitStatus(null);
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: articleTitle,
          summary: articleSummary,
          content: articleContent,
          imageUrl: articleImage,
          trending: articleTrending,
          tags: articleTags
        })
      });
      if (!res.ok) throw new Error("Failed to post news");

      setNewsSubmitStatus("✓ News article published successfully!");
      // Reset form
      setArticleTitle('');
      setArticleSummary('');
      setArticleContent('');
      setArticleImage('');
      setArticleTrending(false);
      setArticleTags('');

      loadDashboardData();
    } catch (err: any) {
      setNewsSubmitStatus(`❌ Error: ${err.message}`);
    }
  };

  const handleNewsDelete = async (slug: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        const res = await fetch(`/api/news/${slug}`, { method: 'DELETE' });
        if (!res.ok) throw new Error("Delete failed");
        loadDashboardData();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const handleSimulationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMatchSubmitStatus(null);

    const matchToUpdate = matches.find(m => m.id === selectedMatchId);
    if (!matchToUpdate) return;

    try {
      const currentEvents = matchToUpdate.events ? JSON.parse(matchToUpdate.events) : [];
      const currentCommentary = matchToUpdate.commentary ? JSON.parse(matchToUpdate.commentary) : [];

      // Create new event & commentary entry
      const newEvent = {
        time: simTime,
        type: simType,
        team: simTeam,
        player: simPlayer,
        detail: simDetail
      };

      const eventText = simType === 'GOAL'
        ? `GOAL! ${simPlayer} scores for ${simTeam}! ${simDetail}`
        : simType === 'CARD'
          ? `Yellow Card issued to ${simPlayer} (${simTeam}).`
          : `Substitution: ${simPlayer} enters pitch.`;

      const newComm = {
        time: simTime,
        text: eventText
      };

      const updatedEvents = [newEvent, ...currentEvents];
      const updatedCommentary = [newComm, ...currentCommentary];

      let scoreUpdate = {};
      if (simType === 'GOAL') {
        const isTeamA = simTeam === matchToUpdate.teamA?.code;
        scoreUpdate = isTeamA
          ? { teamAScore: matchToUpdate.teamAScore + 1 }
          : { teamBScore: matchToUpdate.teamBScore + 1 };
      }

      const res = await fetch(`/api/matches/${selectedMatchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...scoreUpdate,
          status: "LIVE",
          timeElapsed: simTime,
          events: JSON.stringify(updatedEvents),
          commentary: JSON.stringify(updatedCommentary)
        })
      });

      if (!res.ok) throw new Error("Simulation failed");

      setMatchSubmitStatus("✓ Match updated and simulated event broadcasted!");
      setSimPlayer('');
      setSimDetail('');

      loadDashboardData();
    } catch (err: any) {
      setMatchSubmitStatus(`❌ Error: ${err.message}`);
    }
  };

  if (checkingAuth) {
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* LOGIN SCREEN IF NOT AUTHENTICATED */}
        {!authenticated ? (
          <section className="max-w-md mx-auto glass-panel rounded-3xl p-6 md:p-8 space-y-6">
            <div className="text-center space-y-2">
              <span className="w-10 h-10 bg-emerald-950/40 border border-brand-green/20 rounded-full flex items-center justify-center text-brand-green mx-auto text-lg">🛡️</span>
              <h1 className="text-xl font-black text-white">Admin Credentials Required</h1>
              <p className="text-xs text-slate-400">Please authenticate to manage matches and publish news feeds.</p>
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {authError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@footballhub.asia"
                  required
                  className="bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green w-full"
                />
              </div>

              <div className="text-[10px] text-slate-500 bg-slate-950 p-3 rounded-lg border border-slate-900">
                💡 Local developer credentials:<br />
                <span className="font-mono text-emerald-400">admin@footballhub.asia / adminpassword</span>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-green hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition uppercase tracking-wider"
              >
                Authenticate Dashboard
              </button>
            </form>
          </section>
        ) : (
          // FULL ADMIN CONTROLS BLOCK
          <div className="space-y-8 animate-fade-in">
            {/* Header banner */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-brand-green/20">
              <div className="space-y-1 text-center sm:text-left">
                <h1 className="text-xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
                  <Shield className="w-5 h-5 text-brand-green" /> Admin Panel
                </h1>
                <p className="text-slate-400 text-xs">Simulate scoreboards, timelines, and manage sports columns.</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-850 text-xs font-bold text-red-400 px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
              >
                <LogOut className="w-4 h-4" /> Logout Admin
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Live match Simulator (Simulate events) */}
              <div className="lg:col-span-6 space-y-6">
                <div className="glass-panel rounded-2xl p-6 space-y-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-2">
                    <MessageSquare className="w-4.5 h-4.5 text-brand-green" /> Live Match Simulator
                  </h3>

                  {matchSubmitStatus && (
                    <div className="p-3 bg-brand-green/10 border border-brand-green/20 text-brand-green rounded-xl text-xs font-bold">
                      {matchSubmitStatus}
                    </div>
                  )}

                  <form onSubmit={handleSimulationSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Match</label>
                      <select
                        value={selectedMatchId}
                        onChange={(e) => setSelectedMatchId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                      >
                        {matches.map(m => (
                          <option key={m.id} value={m.id}>{m.teamA?.name} vs {m.teamB?.name} ({m.status})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Event Type</label>
                        <select
                          value={simType}
                          onChange={(e: any) => setSimType(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                        >
                          <option value="GOAL">⚽ Goal</option>
                          <option value="CARD">🟨 Card</option>
                          <option value="SUB">🔄 Sub</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sim Minute</label>
                        <input
                          type="number"
                          value={simTime}
                          onChange={(e) => setSimTime(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green font-mono"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Team Code</label>
                        <select
                          value={simTeam}
                          onChange={(e: any) => setSimTeam(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                        >
                          <option value="ARG">ARG</option>
                          <option value="FRA">FRA</option>
                          <option value="ENG">ENG</option>
                          <option value="BRA">BRA</option>
                          <option value="ESP">ESP</option>
                          <option value="GER">GER</option>
                          <option value="MAR">MAR</option>
                          <option value="JPN">JPN</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Athlete Name</label>
                      <input
                        type="text"
                        value={simPlayer}
                        onChange={(e) => setSimPlayer(e.target.value)}
                        placeholder="Lionel Messi"
                        className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Event Description</label>
                      <input
                        type="text"
                        value={simDetail}
                        onChange={(e) => setSimDetail(e.target.value)}
                        placeholder="Tucked cleanly inside bottom corner."
                        className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-green hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      Broadcast Simulated Event
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Manage News Articles */}
              <div className="lg:col-span-6 space-y-8">
                {/* News Form */}
                <div className="glass-panel rounded-2xl p-6 space-y-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-2">
                    <Plus className="w-4.5 h-4.5 text-brand-green" /> Publish News Article
                  </h3>

                  {newsSubmitStatus && (
                    <div className="p-3 bg-brand-green/10 border border-brand-green/20 text-brand-green rounded-xl text-xs font-bold">
                      {newsSubmitStatus}
                    </div>
                  )}

                  <form onSubmit={handleNewsSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Title</label>
                      <input
                        type="text"
                        value={articleTitle}
                        onChange={(e) => setArticleTitle(e.target.value)}
                        placeholder="Gold Boot Ladder Tightens"
                        className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Summary</label>
                      <input
                        type="text"
                        value={articleSummary}
                        onChange={(e) => setArticleSummary(e.target.value)}
                        placeholder="Following recent hattricks, goal ladders adjust..."
                        className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Content Body</label>
                      <textarea
                        value={articleContent}
                        onChange={(e) => setArticleContent(e.target.value)}
                        placeholder="Full article body content..."
                        className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green h-28"
                        required
                      ></textarea>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Image URL</label>
                      <input
                        type="url"
                        value={articleImage}
                        onChange={(e) => setArticleImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    <div className="flex gap-4 items-center">
                      <div className="space-y-1.5 grow">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={articleTags}
                          onChange={(e) => setArticleTags(e.target.value)}
                          placeholder="World Cup, Golden Boot"
                          className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <input
                          type="checkbox"
                          id="trending"
                          checked={articleTrending}
                          onChange={(e) => setArticleTrending(e.target.checked)}
                          className="w-4 h-4 bg-slate-900 border-slate-800 rounded focus:ring-brand-green"
                        />
                        <label htmlFor="trending" className="text-xs font-bold text-slate-300 cursor-pointer">Trending</label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-green hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition uppercase tracking-wider"
                    >
                      Publish Article
                    </button>
                  </form>
                </div>

                {/* Published Articles List */}
                <div className="glass-panel rounded-2xl p-6 space-y-4 max-h-[25rem] overflow-y-auto pr-2">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center justify-between">
                    <span>Published Articles ({news.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {news.map(n => (
                      <div key={n.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-900/40 border border-slate-900/60 text-xs">
                        <div className="space-y-0.5 max-w-[80%]">
                          <h4 className="font-bold text-white truncate">{n.title}</h4>
                          <span className="text-[10px] text-slate-500 font-mono">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={() => handleNewsDelete(n.slug)}
                          className="text-slate-500 hover:text-red-500 transition p-1.5"
                          aria-label="Delete news article"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
