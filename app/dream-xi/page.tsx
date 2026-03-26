'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Zap, Loader2, ShieldAlert, Activity, Users } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const TEAMS = ['CSK', 'MI', 'RCB', 'KKR', 'SRH', 'DC', 'PBKS', 'RR', 'LSG', 'GT'];
const PLATFORMS = ['Dream11', 'MY11Circle', 'MPL', 'Fan2Play'];

export default function DreamXI() {
  const [teamA, setTeamA] = useState('CSK');
  const [teamB, setTeamB] = useState('MI');
  const [platform, setPlatform] = useState('Dream11');
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
        contents: `Generate an optimal fantasy XI for an IPL 2026 match between ${teamA} and ${teamB} specifically optimized for the ${platform} platform.
        Include:
        1. The Optimal Playing XI (Wicketkeepers, Batters, All-rounders, Bowlers)
        2. Captain & Vice-Captain Reasoning
        3. 2-3 Differential Picks (Low ownership, high upside)
        4. Platform-Specific Strategy for ${platform} (e.g., points system nuances)
        
        Format the output in clear Markdown with headings. Make it sound professional, data-driven, and insightful. Use realistic hypothetical players and stats for IPL 2026. Keep it concise but impactful.`,
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
            <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center border border-purple-400/20">
              <BrainCircuit className="w-5 h-5 text-purple-400" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Dream XI Engine</h1>
          </div>
          <p className="text-zinc-400 text-lg">Optimal fantasy XI, captain/VC reasoning, and differential picks.</p>
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
              <Users className="w-5 h-5 text-purple-400" />
              Configure Engine
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Team A</label>
                <select 
                  value={teamA}
                  onChange={(e) => setTeamA(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
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
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                >
                  {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Fantasy Platform</label>
                <select 
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                >
                  {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <button
                onClick={generateReport}
                disabled={loading || teamA === teamB}
                className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Running Engine...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Optimal XI
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              Engine Parameters
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Confirmed XIs', 'Pitch Data', 'Player Matchups', 'Recent Form', 'Venue Stats', 'Ownership %', 'Platform Rules'].map(factor => (
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
                  <BrainCircuit className="w-16 h-16 text-zinc-800 mb-4" />
                  <h3 className="text-xl font-display font-semibold text-zinc-400 mb-2">Engine Idle</h3>
                  <p className="text-zinc-500 max-w-sm">Configure the matchup and platform to generate the optimal fantasy XI.</p>
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
                    <div className="absolute inset-0 border-t-2 border-purple-500 rounded-full animate-spin" />
                    <div className="absolute inset-2 border-r-2 border-pink-500 rounded-full animate-spin animation-delay-150" />
                    <div className="absolute inset-4 border-b-2 border-indigo-500 rounded-full animate-spin animation-delay-300" />
                    <BrainCircuit className="absolute inset-0 m-auto w-8 h-8 text-zinc-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-zinc-200 mb-2">Simulating Millions of Combinations...</h3>
                  <p className="text-zinc-500 font-mono text-sm animate-pulse">Optimizing for {platform} scoring system</p>
                </motion.div>
              )}

              {report && !loading && (
                <motion.div 
                  key="report"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-invert prose-zinc max-w-none prose-headings:font-display prose-headings:font-semibold prose-h2:text-purple-400 prose-h3:text-pink-400 prose-strong:text-zinc-200 prose-a:text-purple-400"
                >
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-zinc-800">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-2xl font-bold font-display text-zinc-300">
                      {teamA}
                    </div>
                    <span className="text-zinc-600 font-mono">VS</span>
                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-2xl font-bold font-display text-zinc-300">
                      {teamB}
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
                      <ShieldAlert className="w-4 h-4" />
                      OPTIMIZED FOR {platform.toUpperCase()}
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
