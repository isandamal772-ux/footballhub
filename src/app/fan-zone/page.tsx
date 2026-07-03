'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles, Users, Award, HelpCircle, Check, X, RotateCcw, Share2, Plus, Trash2 } from 'lucide-react';

export default function FanZone() {
  const [activeTab, setActiveTab] = useState<'SQUAD' | 'QUIZ'>('SQUAD');

  // --- SQUAD BUILDER STATES ---
  const [formation, setFormation] = useState<'433' | '442' | '352'>('433');
  const [teamName, setTeamName] = useState("My Dream XI");
  const [squad, setSquad] = useState<Record<string, string>>({
    GK: "E. Martínez",
    LD: "N. Tagliafico",
    CDA: "C. Romero",
    CDB: "N. Otamendi",
    RD: "N. Molina",
    MA: "R. De Paul",
    MB: "Enzo F.",
    MC: "A. Mac Allister",
    LFW: "A. Di María",
    CF: "J. Álvarez",
    RFW: "L. Messi"
  });
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [customPlayerName, setCustomPlayerName] = useState("");

  const formationsLayout = {
    '433': {
      GK: { top: '85%', left: '50%' },
      LD: { top: '65%', left: '15%' },
      CDA: { top: '68%', left: '38%' },
      CDB: { top: '68%', left: '62%' },
      RD: { top: '65%', left: '85%' },
      MA: { top: '45%', left: '25%' },
      MB: { top: '50%', left: '50%' },
      MC: { top: '45%', left: '75%' },
      LFW: { top: '20%', left: '20%' },
      CF: { top: '15%', left: '50%' },
      RFW: { top: '20%', left: '80%' }
    },
    '442': {
      GK: { top: '85%', left: '50%' },
      LD: { top: '65%', left: '15%' },
      CDA: { top: '68%', left: '38%' },
      CDB: { top: '68%', left: '62%' },
      RD: { top: '65%', left: '85%' },
      MA: { top: '45%', left: '15%' },
      MB: { top: '48%', left: '38%' },
      MC: { top: '48%', left: '62%' },
      MD: { top: '45%', left: '85%' },
      CFA: { top: '20%', left: '35%' },
      CFB: { top: '20%', left: '65%' }
    },
    '352': {
      GK: { top: '85%', left: '50%' },
      CDA: { top: '68%', left: '25%' },
      CDB: { top: '72%', left: '50%' },
      CDC: { top: '68%', left: '75%' },
      LM: { top: '45%', left: '12%' },
      MA: { top: '48%', left: '32%' },
      MB: { top: '52%', left: '50%' },
      MC: { top: '48%', left: '68%' },
      RM: { top: '45%', left: '88%' },
      CFA: { top: '20%', left: '35%' },
      CFB: { top: '20%', left: '65%' }
    }
  };

  // Adjust squad structure when formation changes
  useEffect(() => {
    if (formation === '442') {
      setSquad({
        GK: squad.GK || "GK",
        LD: squad.LD || "LD",
        CDA: squad.CDA || "CDA",
        CDB: squad.CDB || "CDB",
        RD: squad.RD || "RD",
        MA: squad.MA || "MA",
        MB: squad.MB || "MB",
        MC: squad.MC || "MC",
        MD: "R. De Paul",
        CFA: squad.CF || "CF",
        CFB: "L. Messi"
      });
    } else if (formation === '352') {
      setSquad({
        GK: squad.GK || "GK",
        CDA: squad.CDA || "CDA",
        CDB: squad.CDB || "CDB",
        CDC: "C. Romero",
        LM: squad.LD || "LM",
        MA: squad.MA || "MA",
        MB: squad.MB || "MB",
        MC: squad.MC || "MC",
        RM: squad.RD || "RM",
        CFA: squad.CF || "CFA",
        CFB: "L. Messi"
      });
    } else {
      setSquad({
        GK: squad.GK || "GK",
        LD: squad.LD || "LD",
        CDA: squad.CDA || "CDA",
        CDB: squad.CDB || "CDB",
        RD: squad.RD || "RD",
        MA: squad.MA || "MA",
        MB: squad.MB || "MB",
        MC: squad.MC || "MC",
        LFW: squad.LFW || "A. Di María",
        CF: squad.CF || "J. Álvarez",
        RFW: squad.RFW || "L. Messi"
      });
    }
  }, [formation]);

  const handlePositionClick = (pos: string) => {
    setSelectedPosition(pos);
    setCustomPlayerName(squad[pos] || "");
  };

  const savePlayerSelection = () => {
    if (selectedPosition && customPlayerName.trim()) {
      setSquad(prev => ({
        ...prev,
        [selectedPosition]: customPlayerName.trim()
      }));
      setSelectedPosition(null);
    }
  };

  // --- TRIVIA QUIZ STATES ---
  const quizQuestions = [
    {
      q: "Which nation won the FIFA World Cup in 2022?",
      options: ["France", "Brazil", "Argentina", "Croatia"],
      answer: "Argentina"
    },
    {
      q: "Who is the all-time top scorer in FIFA World Cup history?",
      options: ["Miroslav Klose", "Pelé", "Cristiano Ronaldo", "Ronaldo Nazário"],
      answer: "Miroslav Klose"
    },
    {
      q: "Which country has won the most FIFA World Cup tournaments?",
      options: ["Germany", "Italy", "Argentina", "Brazil"],
      answer: "Brazil"
    },
    {
      q: "In which World Cup did Diego Maradona score his famous 'Hand of God' goal?",
      options: ["1982 Spain", "1986 Mexico", "1990 Italy", "1994 USA"],
      answer: "1986 Mexico"
    },
    {
      q: "Who won the Best Young Player award at the 2022 World Cup?",
      options: ["Kylian Mbappé", "Enzo Fernández", "Jude Bellingham", "Gavi"],
      answer: "Enzo Fernández"
    }
  ];

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const handleAnswerSubmit = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === quizQuestions[currentQuestionIdx].answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizComplete(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <title>Interactive Fan Zone | World Football Hub</title>
      <meta name="description" content="Build your dream XI football squad and challenge yourself with daily football trivia quizzes at the World Football Hub Fan Zone!" />
      
      <Header />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Fan Zone Header Banner */}
        <section className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-brand-green/20">
          <div className="space-y-2 text-center md:text-left">
            <span className="bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
              🎮 Interactive Fan Zone
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-6 h-6 text-brand-green animate-pulse" />
              Soccer Fan Playground
            </h1>
            <p className="text-slate-400 text-xs max-w-xl">
              Create your custom match formations, select your dream tactical lineups, and test your football wisdom to climb the global fan charts!
            </p>
          </div>

          {/* Toggle Tab Buttons */}
          <div className="flex gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-900 shrink-0">
            <button
              onClick={() => setActiveTab('SQUAD')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition duration-300 ${
                activeTab === 'SQUAD'
                  ? 'bg-brand-green text-slate-950 shadow-lg shadow-brand-green/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              Squad Builder
            </button>
            <button
              onClick={() => setActiveTab('QUIZ')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition duration-300 ${
                activeTab === 'QUIZ'
                  ? 'bg-brand-green text-slate-950 shadow-lg shadow-brand-green/10'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4.5 h-4.5" />
              Trivia Arena
            </button>
          </div>
        </section>

        {/* --- TAB 1: SQUAD BUILDER --- */}
        {activeTab === 'SQUAD' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Pitch */}
            <div className="lg:col-span-8 space-y-6">
              <div className="glass-panel p-4 rounded-3xl space-y-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-900/60 pb-3">
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="bg-transparent border-b border-transparent hover:border-slate-800 focus:border-brand-green text-white font-black text-sm px-2 py-1 w-full max-w-xs focus:outline-none"
                    placeholder="Enter Team Name..."
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Formation:</span>
                    <select
                      value={formation}
                      onChange={(e: any) => setFormation(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-white text-xs px-3 py-1.5 rounded-lg font-bold focus:outline-none focus:border-brand-green"
                    >
                      <option value="433">4-3-3 Attack</option>
                      <option value="442">4-4-2 Classic</option>
                      <option value="352">3-5-2 Midfield Heavy</option>
                    </select>
                  </div>
                </div>

                {/* Tactical Soccer Pitch Layout */}
                <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full rounded-2xl border border-emerald-800 bg-emerald-950/20 overflow-hidden shadow-2xl">
                  {/* Pitch Line Markings */}
                  <div className="absolute inset-4 border-2 border-emerald-500/10 pointer-events-none rounded-xl"></div>
                  <div className="absolute top-1/2 left-4 right-4 h-0 border-t-2 border-emerald-500/10 pointer-events-none"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-emerald-500/10 pointer-events-none"></div>
                  <div className="absolute top-4 left-1/4 right-1/4 h-24 border-2 border-t-0 border-emerald-500/10 pointer-events-none"></div>
                  <div className="absolute bottom-4 left-1/4 right-1/4 h-24 border-2 border-b-0 border-emerald-500/10 pointer-events-none"></div>

                  {/* Render Players based on formation layout */}
                  {Object.entries(formationsLayout[formation]).map(([pos, coords]) => (
                    <button
                      key={pos}
                      onClick={() => handlePositionClick(pos)}
                      style={{ top: coords.top, left: coords.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition duration-300 hover:scale-110"
                    >
                      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-slate-950 border-2 border-brand-green flex items-center justify-center text-sm shadow-xl group-hover:border-amber-400 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition">
                        👕
                      </div>
                      <div className="mt-1.5 bg-slate-950/90 border border-slate-900/60 rounded px-2 py-0.5 max-w-[85px] sm:max-w-[100px] truncate shadow-lg">
                        <p className="text-[8px] sm:text-[9px] font-black text-white truncate text-center">
                          {squad[pos] || "Select"}
                        </p>
                        <p className="text-[6px] font-bold text-slate-500 uppercase tracking-widest text-center mt-0.5">
                          {pos}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Player Selector Card */}
            <div className="lg:col-span-4 space-y-6">
              {selectedPosition ? (
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h4 className="font-black text-white text-xs uppercase tracking-widest border-b border-slate-900 pb-3 flex items-center gap-2">
                    ✍️ Edit Position: {selectedPosition}
                  </h4>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Player Name</label>
                    <input
                      type="text"
                      value={customPlayerName}
                      onChange={(e) => setCustomPlayerName(e.target.value)}
                      placeholder="Type player name..."
                      className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-brand-green"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={savePlayerSelection}
                      className="bg-brand-green hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition grow"
                    >
                      Save Player
                    </button>
                    <button
                      onClick={() => setSelectedPosition(null)}
                      className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white px-4 py-2.5 rounded-xl text-xs uppercase font-bold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass-panel p-6 rounded-2xl space-y-4 text-center">
                  <div className="w-12 h-12 bg-emerald-950/40 border border-brand-green/20 text-brand-green rounded-full flex items-center justify-center text-xl mx-auto">📋</div>
                  <h4 className="font-black text-white text-sm">Select a Position</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Click on any player position on the pitch map to customize the name and build your final squad!
                  </p>
                </div>
              )}

              {/* Roster list overview */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h4 className="font-black text-white text-xs uppercase tracking-widest border-b border-slate-900 pb-3">
                  📋 Lineup Roster Summary
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(squad).map(([pos, name]) => (
                    <div key={pos} className="flex justify-between items-center p-2 rounded bg-slate-900/20 border border-slate-900/40">
                      <span className="font-mono text-brand-green font-bold uppercase text-[9px]">{pos}</span>
                      <span className="text-slate-300 font-bold truncate max-w-[80px]">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 2: TRIVIA ARENA --- */}
        {activeTab === 'QUIZ' && (
          <div className="max-w-xl mx-auto glass-panel p-6 md:p-8 rounded-3xl space-y-6">
            {!quizComplete ? (
              <div className="space-y-6">
                {/* Question progress */}
                <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">
                    Question {currentQuestionIdx + 1} of {quizQuestions.length}
                  </span>
                  <span className="bg-brand-green/10 text-brand-green text-xs font-black px-2.5 py-1 rounded-full">
                    Score: {score}
                  </span>
                </div>

                {/* Question Text */}
                <div className="space-y-4">
                  <div className="flex gap-2.5 items-start">
                    <HelpCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <h3 className="text-base font-bold text-white leading-snug">
                      {quizQuestions[currentQuestionIdx].q}
                    </h3>
                  </div>

                  {/* Multiple Choice Options */}
                  <div className="space-y-2.5 pt-2">
                    {quizQuestions[currentQuestionIdx].options.map((option, idx) => {
                      let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white";
                      if (isAnswered) {
                        if (option === quizQuestions[currentQuestionIdx].answer) {
                          btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
                        } else if (option === selectedOption) {
                          btnStyle = "bg-red-500/10 border-red-500 text-red-400";
                        } else {
                          btnStyle = "bg-slate-950/40 border-slate-900/60 text-slate-600 opacity-60";
                        }
                      }

                      return (
                        <button
                          key={idx}
                          disabled={isAnswered}
                          onClick={() => handleAnswerSubmit(option)}
                          className={`w-full border p-3.5 rounded-xl text-xs font-semibold text-left transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {isAnswered && option === quizQuestions[currentQuestionIdx].answer && (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isAnswered && option === selectedOption && option !== quizQuestions[currentQuestionIdx].answer && (
                            <X className="w-4 h-4 text-red-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action button */}
                {isAnswered && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full bg-brand-green hover:bg-emerald-400 text-slate-950 font-black py-3 px-4 rounded-xl text-xs transition uppercase tracking-wider flex items-center justify-center gap-1"
                  >
                    {currentQuestionIdx < quizQuestions.length - 1 ? "Next Question" : "View Results"}
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center space-y-6 py-6">
                <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/20 text-amber-400 rounded-full flex items-center justify-center text-3xl mx-auto animate-bounce">
                  🏆
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white">Quiz Completed!</h3>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
                    You scored <span className="text-brand-green font-bold">{score} out of {quizQuestions.length}</span> questions correctly today.
                  </p>
                </div>

                {/* Performance feedback */}
                <div className="p-4 bg-slate-950 border border-slate-900 rounded-2xl max-w-xs mx-auto">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Performance Rank</span>
                  <span className="text-sm font-black text-amber-400 uppercase tracking-widest mt-1 block">
                    {score === 5 ? "👑 World Cup Champion" : score >= 3 ? "⚽ Professional Midfielder" : "👟 Amateur Rookie"}
                  </span>
                </div>

                <div className="flex gap-3 justify-center pt-2">
                  <button
                    onClick={resetQuiz}
                    className="flex items-center gap-1.5 bg-brand-green hover:bg-emerald-400 text-slate-950 font-black py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition"
                  >
                    <RotateCcw className="w-4 h-4" /> Restart Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
