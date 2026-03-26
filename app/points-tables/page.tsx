'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Activity, ChevronRight } from 'lucide-react';
import { GoogleGenAI, Type } from '@google/genai';

const LEAGUES = [
  "Indian Premier League (IPL)",
  "World Test Championship (WTC)",
  "Pakistan Super League (PSL)",
  "Women's Premier League (WPL)",
  "Big Bash League (BBL)"
];

interface TeamStanding {
  position: number;
  team: string;
  logoUrl?: string;
  played: number;
  won: number;
  lost: number;
  tied: number;
  nrr: string;
  points: number;
  form: string[];
}

interface PointsTableData {
  leagueName: string;
  lastUpdated: string;
  standings: TeamStanding[];
}

export default function PointsTables() {
  const [selectedLeague, setSelectedLeague] = useState(LEAGUES[0]);
  const [tableData, setTableData] = useState<PointsTableData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPointsTable = async (league: string) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      const schema = {
        type: Type.OBJECT,
        properties: {
          leagueName: { type: Type.STRING },
          lastUpdated: { type: Type.STRING },
          standings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                position: { type: Type.NUMBER },
                team: { type: Type.STRING },
                logoUrl: { type: Type.STRING, description: "A valid URL to the team's logo image. Leave empty if not available." },
                played: { type: Type.NUMBER },
                won: { type: Type.NUMBER },
                lost: { type: Type.NUMBER },
                tied: { type: Type.NUMBER },
                nrr: { type: Type.STRING },
                points: { type: Type.NUMBER },
                form: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['position', 'team', 'played', 'won', 'lost', 'tied', 'nrr', 'points', 'form']
            }
          }
        },
        required: ['leagueName', 'lastUpdated', 'standings']
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `Generate the current realistic points table for the cricket league "${league}" as of today. Include realistic standings, NRR, and recent form (last 5 matches e.g., ["W", "L", "W", "W", "L"]).`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        }
      });
      
      if (response.text) {
        setTableData(JSON.parse(response.text));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPointsTable(selectedLeague);
  }, [selectedLeague]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Global Points Tables</h1>
          </div>
          <p className="text-zinc-400 text-lg">Current standings and form guide for major cricket leagues worldwide.</p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* League Selector */}
        <div className="lg:col-span-3 space-y-2">
          {LEAGUES.map((league) => (
            <button
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                selectedLeague === league
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {league}
              {selectedLeague === league && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {/* Table View */}
        <div className="lg:col-span-9">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden min-h-[500px] relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 bg-zinc-900/50 backdrop-blur-sm z-10">
                <Activity className="w-8 h-8 mb-4 animate-pulse" />
                <p className="font-mono text-sm">Fetching latest standings...</p>
              </div>
            ) : null}

            {tableData && (
              <div className="p-6">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white mb-1">{tableData.leagueName}</h2>
                    <p className="text-xs font-mono text-zinc-500">Last Updated: {tableData.lastUpdated}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-zinc-500 font-mono uppercase bg-zinc-950/50">
                      <tr>
                        <th className="px-4 py-4 rounded-l-lg w-12 text-center">#</th>
                        <th className="px-4 py-4">Team</th>
                        <th className="px-4 py-4 text-center">P</th>
                        <th className="px-4 py-4 text-center">W</th>
                        <th className="px-4 py-4 text-center">L</th>
                        <th className="px-4 py-4 text-center">T/NR</th>
                        <th className="px-4 py-4 text-center">NRR</th>
                        <th className="px-4 py-4 text-center font-bold text-white">Pts</th>
                        <th className="px-4 py-4 rounded-r-lg text-center">Form</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.standings.map((team, idx) => (
                        <tr 
                          key={team.team} 
                          className={`border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/30 transition-colors ${
                            idx < 4 ? 'bg-emerald-500/5' : ''
                          }`}
                        >
                          <td className="px-4 py-4 text-center font-mono text-zinc-400">{team.position}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={team.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(team.team)}&background=27272a&color=fff&rounded=true&bold=true`} 
                                alt={team.team} 
                                className="w-6 h-6 object-contain rounded-full bg-zinc-800 shrink-0"
                                onError={(e) => {
                                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(team.team)}&background=27272a&color=fff&rounded=true&bold=true`;
                                }}
                              />
                              <span className="font-display font-semibold text-zinc-200">{team.team}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-mono text-zinc-400">{team.played}</td>
                          <td className="px-4 py-4 text-center font-mono text-zinc-400">{team.won}</td>
                          <td className="px-4 py-4 text-center font-mono text-zinc-400">{team.lost}</td>
                          <td className="px-4 py-4 text-center font-mono text-zinc-400">{team.tied}</td>
                          <td className={`px-4 py-4 text-center font-mono ${team.nrr.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {team.nrr}
                          </td>
                          <td className="px-4 py-4 text-center font-mono font-bold text-amber-400 text-lg">{team.points}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-1">
                              {team.form.map((result, i) => (
                                <span 
                                  key={i} 
                                  className={`w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold ${
                                    result === 'W' ? 'bg-emerald-500/20 text-emerald-400' : 
                                    result === 'L' ? 'bg-rose-500/20 text-rose-400' : 
                                    'bg-zinc-700 text-zinc-300'
                                  }`}
                                >
                                  {result}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
