'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Microscope, Zap, Loader2, ShieldAlert, Activity } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const FACTORS = [
  'Dew Effect',
  'Spin on Turning Tracks',
  'Powerplay Dominance Index',
  'Death Bowling Mastery',
  'Chase vs Defend',
  'Pressure Performer Index',
  'Impact Player Rule Effect',
  'Boundary %'
];

export default function FactorLab() {
  const [selectedFactor, setSelectedFactor] = useState(FACTORS[0]);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const generateReport = async () => {
    setLoading(true);
    setReport(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Generate a deep-dive analytical report on the isolated factor: "${selectedFactor}" for the IPL 2026 season.
        Include:
        1. Definition and Importance of this factor in T20 cricket.
        2. Top 3 Teams excelling in this factor in IPL 2026 (with hypothetical stats).
        3. Top 3 Players who are masters of this factor (with hypothetical stats).
        4. How this factor influences match outcomes (Win %).
        5. Strategic recommendations for teams to improve in this area.
        
        Format the output in clear Markdown with headings. Make it sound professional, highly analytical, data-driven, and insightful. Use realistic hypothetical stats for IPL 2026. Keep it concise but impactful.`,
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
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
              <Microscope className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Factor Lab</h1>
          </div>
          <p className="text-zinc-400 text-lg">Deep-dives into isolated factors like dew effect, spin, and powerplay dominance.</p>
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
              <Microscope className="w-5 h-5 text-cyan-400" />
              Isolate Factor
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Select Factor to Analyze</label>
                <div className="space-y-2">
                  {FACTORS.map(factor => (
                    <button
                      key={factor}
                      onClick={() => setSelectedFactor(factor)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                        selectedFactor === factor 
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {factor}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={generateReport}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Running Lab Analysis...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Execute Deep-Dive
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Lab Metrics
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Win % Correlation', 'Top Teams', 'Top Players', 'Strategic Impact', 'Historical Data'].map(metric => (
                <span key={metric} className="px-2 py-1 rounded-md bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 font-mono">
                  {metric}
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
                  <Microscope className="w-16 h-16 text-zinc-800 mb-4" />
                  <h3 className="text-xl font-display font-semibold text-zinc-400 mb-2">Lab Ready</h3>
                  <p className="text-zinc-500 max-w-sm">Select a factor and execute the deep-dive to view the isolated analysis.</p>
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
                    <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin" />
                    <div className="absolute inset-2 border-r-2 border-teal-500 rounded-full animate-spin animation-delay-150" />
                    <div className="absolute inset-4 border-b-2 border-blue-500 rounded-full animate-spin animation-delay-300" />
                    <Microscope className="absolute inset-0 m-auto w-8 h-8 text-zinc-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-zinc-200 mb-2">Isolating Factor Variables...</h3>
                  <p className="text-zinc-500 font-mono text-sm animate-pulse">Running regression models on {selectedFactor}</p>
                </motion.div>
              )}

              {report && !loading && (
                <motion.div 
                  key="report"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-invert prose-zinc max-w-none prose-headings:font-display prose-headings:font-semibold prose-h2:text-cyan-400 prose-h3:text-teal-400 prose-strong:text-zinc-200 prose-a:text-cyan-400"
                >
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-zinc-800">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                      <Microscope className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="!m-0 !text-2xl text-zinc-200">{selectedFactor}</h2>
                      <p className="text-zinc-500 font-mono text-sm">Isolated Factor Analysis</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
                      <ShieldAlert className="w-4 h-4" />
                      LAB REPORT
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
