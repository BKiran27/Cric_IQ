'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Orbit, Zap, Loader2, ShieldAlert, Swords, Activity, MapPin } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const TEAMS = ['CSK', 'MI', 'RCB', 'KKR', 'SRH', 'DC', 'PBKS', 'RR', 'LSG', 'GT'];

export default function MatchOracle() {
  const [teamA, setTeamA] = useState('CSK');
  const [teamB, setTeamB] = useState('MI');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const generateReport = async () => {
    if (teamA === teamB) return;
    setLoading(true);
    setReport(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Generate a highly detailed, analytical 12-factor intelligence report for an IPL 2026 match between ${teamA} and ${teamB}. 
        Format the output in clear Markdown with headings. 
        The 12 factors are: Pitch, Weather/Dew, Toss, H2H, Powerplay, Death Overs, Spin vs Pace, Form, Injuries, Player Matchups, Venue, Momentum.
        Make it sound professional, data-driven, and insightful. Use realistic hypothetical stats for IPL 2026. Keep it concise but impactful.`,
      });
      
      setReport(response.text || 'Failed to generate report.');
    } catch (error) {
      console.error(error);
      setReport('An error occurred while generating the report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center border border-blue-400/20">
              <Orbit className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Match Oracle</h1>
          </div>
          <p className="text-zinc-400 text-lg">12-factor intelligence report for any two IPL 2026 teams.</p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <motion.div 
          className="lg:col-span-4 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
              <Swords className="w-5 h-5 text-rose-400" />
              Select Matchup
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Team A</label>
                <select 
                  value={teamA}
                  onChange={(e) => setTeamA(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                >
                  {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                  <span className="text-xs font-mono text-zinc-400">VS</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Team B</label>
                <select 
                  value={teamB}
                  onChange={(e) => setTeamB(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                >
                  {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <button
                onClick={generateReport}
                disabled={loading || teamA === teamB}
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing 12 Factors...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Intelligence Report
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Live Factors Analyzed
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Pitch', 'Weather/Dew', 'Toss', 'H2H', 'Powerplay', 'Death Overs', 'Spin vs Pace', 'Form', 'Injuries', 'Player Matchups', 'Venue', 'Momentum'].map(factor => (
                <span key={factor} className="px-2 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 font-mono">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Report Output */}
        <motion.div 
          className="lg:col-span-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 min-h-[600px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {!report && !loading && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                >
                  <Orbit className="w-16 h-16 text-zinc-800 mb-4" />
                  <h3 className="text-xl font-display font-semibold text-zinc-400 mb-2">Awaiting Matchup</h3>
                  <p className="text-zinc-500 max-w-sm">Select two teams and generate the report to view the 12-factor intelligence analysis.</p>
                </motion.div>
              )}

              {loading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-zinc-900/80 backdrop-blur-sm z-10"
                >
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin" />
                    <div className="absolute inset-2 border-r-2 border-emerald-500 rounded-full animate-spin animation-delay-150" />
                    <div className="absolute inset-4 border-b-2 border-purple-500 rounded-full animate-spin animation-delay-300" />
                    <Orbit className="absolute inset-0 m-auto w-8 h-8 text-zinc-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-zinc-200 mb-2">Crunching Data...</h3>
                  <p className="text-zinc-500 font-mono text-sm animate-pulse">Running 12-factor analysis models</p>
                </motion.div>
              )}

              {report && !loading && (
                <motion.div 
                  key="report"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-invert prose-zinc max-w-none prose-headings:font-display prose-headings:font-semibold prose-h2:text-blue-400 prose-h3:text-emerald-400 prose-strong:text-zinc-200 prose-a:text-blue-400"
                >
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-zinc-800">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-2xl font-bold font-display text-zinc-300">
                      {teamA}
                    </div>
                    <span className="text-zinc-600 font-mono">VS</span>
                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-2xl font-bold font-display text-zinc-300">
                      {teamB}
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                      <ShieldAlert className="w-4 h-4" />
                      CONFIDENTIAL INTEL
                    </div>
                  </div>
                  
                  <div dangerouslySetInnerHTML={{ __html: report.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/## (.*?)<br\/>/g, '<h2>$1</h2>').replace(/### (.*?)<br\/>/g, '<h3>$1</h3>') }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
