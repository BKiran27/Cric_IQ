'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, RefreshCw, Activity, ChevronRight, ChevronLeft, Calendar, Target } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import { format, subDays, addDays, isToday } from 'date-fns';

interface PlayerScore {
  name: string;
  status?: string;
  runs: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  sr?: string;
  overs?: number;
  maidens?: number;
  wickets?: number;
  econ?: string;
}

interface Match {
  id: string;
  title: string;
  league: string;
  status: string;
  team1: { name: string; score: string; overs: string; logoColor: string };
  team2: { name: string; score: string; overs: string; logoColor: string };
  toss: string;
  currentSituation: string;
  scorecard: {
    batting: PlayerScore[];
    bowling: PlayerScore[];
  };
  aiAnalysis: string;
}

export default function LiveMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const fetchLiveMatches = async (dateToFetch: Date) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const schema = {
        type: Type.OBJECT,
        properties: {
          matches: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                league: { type: Type.STRING },
                status: { type: Type.STRING },
                team1: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    score: { type: Type.STRING },
                    overs: { type: Type.STRING },
                    logoColor: { type: Type.STRING, description: "Tailwind color class like 'bg-blue-500'" }
                  },
                  required: ['name', 'score', 'overs', 'logoColor']
                },
                team2: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    score: { type: Type.STRING },
                    overs: { type: Type.STRING },
                    logoColor: { type: Type.STRING }
                  },
                  required: ['name', 'score', 'overs', 'logoColor']
                },
                toss: { type: Type.STRING },
                currentSituation: { type: Type.STRING },
                scorecard: {
                  type: Type.OBJECT,
                  properties: {
                    batting: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          status: { type: Type.STRING },
                          runs: { type: Type.NUMBER },
                          balls: { type: Type.NUMBER },
                          fours: { type: Type.NUMBER },
                          sixes: { type: Type.NUMBER },
                          sr: { type: Type.STRING }
                        },
                        required: ['name', 'status', 'runs', 'balls', 'fours', 'sixes', 'sr']
                      }
                    },
                    bowling: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          overs: { type: Type.NUMBER },
                          maidens: { type: Type.NUMBER },
                          runs: { type: Type.NUMBER },
                          wickets: { type: Type.NUMBER },
                          econ: { type: Type.STRING }
                        },
                        required: ['name', 'overs', 'maidens', 'runs', 'wickets', 'econ']
                      }
                    }
                  },
                  required: ['batting', 'bowling']
                },
                aiAnalysis: { type: Type.STRING }
              },
              required: ['id', 'title', 'league', 'status', 'team1', 'team2', 'toss', 'currentSituation', 'scorecard', 'aiAnalysis']
            }
          }
        },
        required: ['matches']
      };

      const dateString = format(dateToFetch, 'yyyy-MM-dd');
      const isCurrentDay = isToday(dateToFetch);
      const promptContext = isCurrentDay 
        ? `Generate 3 highly realistic currently live or very recently concluded cricket matches from around the world (e.g., International Tests/ODIs/T20Is, IPL, PSL, WPL, etc.) specifically for today's date (${dateString}). Do not include matches from other dates.`
        : `Generate 3 highly realistic cricket matches from around the world (e.g., International Tests/ODIs/T20Is, IPL, PSL, WPL, etc.) that took place strictly on ${dateString}. Make the status 'Completed' or 'Stumps' depending on the format. Do not include matches from other dates.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `${promptContext} Include detailed scorecards (current batters and bowlers) and a short AI analysis of the game state or final result.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        }
      });
      
      if (response.text) {
        const data = JSON.parse(response.text);
        setMatches(data.matches);
        if (data.matches.length > 0) {
          setSelectedMatch(data.matches[0]);
        } else {
          setSelectedMatch(null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches(selectedDate);
  }, [selectedDate]);

  const handlePrevDay = () => setSelectedDate(prev => subDays(prev, 1));
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between shrink-0 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-rose-400/10 flex items-center justify-center border border-rose-400/20">
              <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Match Center</h1>
          </div>
          <p className="text-zinc-400 text-lg">Real-time match updates and historical scorecards.</p>
        </motion.div>
        
        <div className="flex items-center gap-4">
          {/* Date Navigator */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1">
            <button 
              onClick={handlePrevDay} 
              disabled={loading}
              className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-4 text-sm font-medium text-zinc-200 font-mono min-w-[140px] justify-center relative">
              <Calendar className="w-4 h-4 text-rose-400" />
              {isToday(selectedDate) ? 'Today' : format(selectedDate, 'MMM dd, yyyy')}
              <input 
                type="date" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => {
                  if (e.target.value) {
                    // Parse the date string as a local date to avoid timezone shifts
                    const [year, month, day] = e.target.value.split('-').map(Number);
                    setSelectedDate(new Date(year, month - 1, day));
                  }
                }}
              />
            </div>
            <button 
              onClick={handleNextDay} 
              disabled={loading}
              className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={() => fetchLiveMatches(selectedDate)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        {/* Match List Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 animate-pulse h-40" />
            ))
          ) : matches.length === 0 ? (
             <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500">
               No matches found for this date.
             </div>
          ) : (
            matches.map((match) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedMatch(match)}
                className={`cursor-pointer rounded-2xl p-5 transition-all duration-200 border ${
                  selectedMatch?.id === match.id 
                    ? 'bg-zinc-800 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.1)]' 
                    : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800/80'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{match.league}</span>
                  <span className={`text-xs font-mono px-2 py-1 rounded-md ${
                    match.status.toLowerCase().includes('live') ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {match.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${match.team1.logoColor}`} />
                      <span className="font-display font-semibold text-zinc-200">{match.team1.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-zinc-100">{match.team1.score}</span>
                      <span className="text-xs text-zinc-500 ml-2">({match.team1.overs})</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${match.team2.logoColor}`} />
                      <span className="font-display font-semibold text-zinc-200">{match.team2.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-zinc-100">{match.team2.score}</span>
                      <span className="text-xs text-zinc-500 ml-2">({match.team2.overs})</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-zinc-800/50 text-sm text-zinc-400 line-clamp-2">
                  {match.currentSituation}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Scorecard & Analysis Area */}
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
          {loading || !selectedMatch ? (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
              <Activity className="w-12 h-12 mb-4 animate-pulse opacity-50" />
              <p>{loading ? 'Loading match data...' : 'Select a match to view details'}</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-display font-bold text-white mb-2">{selectedMatch.title}</h2>
                <p className="text-zinc-400 text-sm">{selectedMatch.toss}</p>
              </div>

              {/* Batting Scorecard */}
              <div className="mb-8">
                <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Batting</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-500 font-mono uppercase bg-zinc-950/50">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">Batter</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">R</th>
                        <th className="px-4 py-3 text-right">B</th>
                        <th className="px-4 py-3 text-right">4s</th>
                        <th className="px-4 py-3 text-right">6s</th>
                        <th className="px-4 py-3 text-right rounded-r-lg">SR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMatch.scorecard.batting.map((batter, idx) => (
                        <tr key={idx} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-zinc-200">{batter.name}</td>
                          <td className="px-4 py-3 text-zinc-400 text-xs">{batter.status}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-white">{batter.runs}</td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-400">{batter.balls}</td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-400">{batter.fours}</td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-400">{batter.sixes}</td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-400">{batter.sr}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bowling Scorecard */}
              <div className="mb-8">
                <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-4 border-b border-zinc-800 pb-2">Bowling</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-500 font-mono uppercase bg-zinc-950/50">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">Bowler</th>
                        <th className="px-4 py-3 text-right">O</th>
                        <th className="px-4 py-3 text-right">M</th>
                        <th className="px-4 py-3 text-right">R</th>
                        <th className="px-4 py-3 text-right">W</th>
                        <th className="px-4 py-3 text-right rounded-r-lg">Econ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMatch.scorecard.bowling.map((bowler, idx) => (
                        <tr key={idx} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-zinc-200">{bowler.name}</td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-400">{bowler.overs}</td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-400">{bowler.maidens}</td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-400">{bowler.runs}</td>
                          <td className="px-4 py-3 text-right font-mono font-bold text-white">{bowler.wickets}</td>
                          <td className="px-4 py-3 text-right font-mono text-zinc-400">{bowler.econ}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                <h3 className="text-sm font-display font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  AI Game State Analysis
                </h3>
                <p className="text-zinc-300 leading-relaxed text-sm">
                  {selectedMatch.aiAnalysis}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
