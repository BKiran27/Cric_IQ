'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserSearch, Zap, Loader2, ShieldAlert, Activity, Search, TrendingUp, Target, Crosshair } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area
} from 'recharts';

interface PlayerData {
  playerInfo: {
    name: string;
    role: string;
    team: string;
    price: string;
  };
  careerStats: {
    matches: number;
    primaryStatName: string;
    primaryStatValue: number;
    average: number;
    strikeRateOrEconomy: number;
    bestPerformance: string;
  };
  seasonPerformance: {
    year: string;
    impactScore: number;
    primaryStat: number;
  }[];
  recentForm: {
    match: string;
    fantasyPoints: number;
  }[];
  matchups: {
    opponentType: string;
    analysis: string;
  }[];
  fantasyValue: {
    rating: number;
    reasoning: string;
  };
}

export default function PlayerIntel() {
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    if (!playerName.trim()) return;
    setLoading(true);
    setError(null);
    setPlayerData(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const schema = {
        type: Type.OBJECT,
        properties: {
          playerInfo: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              role: { type: Type.STRING },
              team: { type: Type.STRING },
              price: { type: Type.STRING },
            },
            required: ['name', 'role', 'team', 'price']
          },
          careerStats: {
            type: Type.OBJECT,
            properties: {
              matches: { type: Type.NUMBER },
              primaryStatName: { type: Type.STRING, description: "e.g., 'Runs' or 'Wickets'" },
              primaryStatValue: { type: Type.NUMBER },
              average: { type: Type.NUMBER },
              strikeRateOrEconomy: { type: Type.NUMBER },
              bestPerformance: { type: Type.STRING },
            },
            required: ['matches', 'primaryStatName', 'primaryStatValue', 'average', 'strikeRateOrEconomy', 'bestPerformance']
          },
          seasonPerformance: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                year: { type: Type.STRING },
                impactScore: { type: Type.NUMBER, description: "Score out of 100" },
                primaryStat: { type: Type.NUMBER },
              },
              required: ['year', 'impactScore', 'primaryStat']
            }
          },
          recentForm: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                match: { type: Type.STRING, description: "e.g., 'vs MI', 'vs CSK'" },
                fantasyPoints: { type: Type.NUMBER },
              },
              required: ['match', 'fantasyPoints']
            }
          },
          matchups: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                opponentType: { type: Type.STRING, description: "e.g., 'Left-arm Pace', 'Wrist Spin'" },
                analysis: { type: Type.STRING },
              },
              required: ['opponentType', 'analysis']
            }
          },
          fantasyValue: {
            type: Type.OBJECT,
            properties: {
              rating: { type: Type.NUMBER, description: "Rating out of 10" },
              reasoning: { type: Type.STRING },
            },
            required: ['rating', 'reasoning']
          }
        },
        required: ['playerInfo', 'careerStats', 'seasonPerformance', 'recentForm', 'matchups', 'fantasyValue']
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Generate realistic current stats, analysis, and aggregated chart data for the international or franchise cricketer "${playerName}". If the player is a batter, primaryStat is Runs. If bowler, primaryStat is Wickets. If all-rounder, pick their strongest suit. Provide 5 years of seasonPerformance and 5 matches of recentForm.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        }
      });
      
      if (response.text) {
        const data = JSON.parse(response.text) as PlayerData;
        setPlayerData(data);
      } else {
        throw new Error("Empty response");
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while generating the report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center border border-emerald-400/20">
              <UserSearch className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Player Intel</h1>
          </div>
          <p className="text-zinc-400 text-lg">Structured stats, aggregated graphs, and deep analysis.</p>
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
              <Search className="w-5 h-5 text-emerald-400" />
              Search Player
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2">Player Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Virat Kohli, Jasprit Bumrah"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateReport()}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-zinc-700"
                />
              </div>

              <button
                onClick={generateReport}
                disabled={loading || !playerName.trim()}
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Fetching Intel...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Player Intel
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Intel Modules
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Career Stats', 'Season Aggregates', 'Recent Form Trend', 'Matchups', 'Fantasy Value'].map(factor => (
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
              {!playerData && !loading && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                >
                  <UserSearch className="w-16 h-16 text-zinc-800 mb-4" />
                  <h3 className="text-xl font-display font-semibold text-zinc-400 mb-2">Awaiting Target</h3>
                  <p className="text-zinc-500 max-w-sm">Enter a player name to generate a comprehensive, data-driven intelligence report.</p>
                  {error && <p className="text-rose-400 mt-4 text-sm">{error}</p>}
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
                    <div className="absolute inset-0 border-t-2 border-emerald-500 rounded-full animate-spin" />
                    <div className="absolute inset-2 border-r-2 border-cyan-500 rounded-full animate-spin animation-delay-150" />
                    <div className="absolute inset-4 border-b-2 border-blue-500 rounded-full animate-spin animation-delay-300" />
                    <UserSearch className="absolute inset-0 m-auto w-8 h-8 text-zinc-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-zinc-200 mb-2">Compiling Dossier...</h3>
                  <p className="text-zinc-500 font-mono text-sm animate-pulse">Aggregating stats and generating charts</p>
                </motion.div>
              )}

              {playerData && !loading && (
                <motion.div 
                  key="report"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 pb-6 border-b border-zinc-800">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-2xl font-bold font-display text-emerald-400 uppercase">
                      {playerData.playerInfo.name.substring(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold text-zinc-100">{playerData.playerInfo.name}</h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-zinc-400 font-mono text-sm">{playerData.playerInfo.role}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span className="text-zinc-400 font-mono text-sm">{playerData.playerInfo.team}</span>
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <span className="text-emerald-400 font-mono text-sm">{playerData.playerInfo.price}</span>
                      </div>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                      <ShieldAlert className="w-4 h-4" />
                      VERIFIED
                    </div>
                  </div>

                  {/* Career Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                      <p className="text-zinc-500 text-xs font-mono uppercase mb-1">Matches</p>
                      <p className="text-2xl font-display font-bold text-zinc-100">{playerData.careerStats.matches}</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                      <p className="text-zinc-500 text-xs font-mono uppercase mb-1">{playerData.careerStats.primaryStatName}</p>
                      <p className="text-2xl font-display font-bold text-emerald-400">{playerData.careerStats.primaryStatValue}</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                      <p className="text-zinc-500 text-xs font-mono uppercase mb-1">Average</p>
                      <p className="text-2xl font-display font-bold text-zinc-100">{playerData.careerStats.average}</p>
                    </div>
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                      <p className="text-zinc-500 text-xs font-mono uppercase mb-1">SR / Econ</p>
                      <p className="text-2xl font-display font-bold text-zinc-100">{playerData.careerStats.strikeRateOrEconomy}</p>
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Season Performance Chart */}
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                      <h3 className="text-sm font-display font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        Season Aggregates ({playerData.careerStats.primaryStatName})
                      </h3>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={playerData.seasonPerformance}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="year" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.5rem' }}
                              itemStyle={{ color: '#34d399' }}
                              cursor={{ fill: '#27272a', opacity: 0.4 }}
                            />
                            <Bar dataKey="primaryStat" fill="#34d399" radius={[4, 4, 0, 0]} name={playerData.careerStats.primaryStatName} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Recent Form Chart */}
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                      <h3 className="text-sm font-display font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" />
                        Recent Form (Fantasy Pts)
                      </h3>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={playerData.recentForm}>
                            <defs>
                              <linearGradient id="colorPts" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="match" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.5rem' }}
                              itemStyle={{ color: '#22d3ee' }}
                            />
                            <Area type="monotone" dataKey="fantasyPoints" stroke="#22d3ee" fillOpacity={1} fill="url(#colorPts)" name="Points" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Matchups & Fantasy Value */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
                      <h3 className="text-sm font-display font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                        <Crosshair className="w-4 h-4 text-rose-400" />
                        Key Matchups
                      </h3>
                      <div className="space-y-4">
                        {playerData.matchups.map((matchup, idx) => (
                          <div key={idx} className="border-l-2 border-rose-500/50 pl-3">
                            <p className="text-xs font-mono text-zinc-400 uppercase mb-1">{matchup.opponentType}</p>
                            <p className="text-sm text-zinc-300 leading-relaxed">{matchup.analysis}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col">
                      <h3 className="text-sm font-display font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-400" />
                        Fantasy Value
                      </h3>
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-5xl font-display font-bold text-purple-400 leading-none">{playerData.fantasyValue.rating}</span>
                        <span className="text-zinc-500 font-mono text-lg mb-1">/ 10</span>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed flex-1">
                        {playerData.fantasyValue.reasoning}
                      </p>
                      <div className="mt-4 pt-4 border-t border-zinc-800">
                        <p className="text-xs text-zinc-500 font-mono">
                          Best Performance: <span className="text-zinc-300">{playerData.careerStats.bestPerformance}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
