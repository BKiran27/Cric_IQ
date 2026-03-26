'use client';

import { motion } from 'motion/react';
import { Trophy, TrendingUp, Activity, Target } from 'lucide-react';

const pointsTable = [
  { team: 'CSK', p: 14, w: 10, l: 4, nrr: '+0.850', pts: 20 },
  { team: 'MI', p: 14, w: 9, l: 5, nrr: '+0.620', pts: 18 },
  { team: 'RCB', p: 14, w: 8, l: 6, nrr: '+0.410', pts: 16 },
  { team: 'RR', p: 14, w: 8, l: 6, nrr: '+0.250', pts: 16 },
  { team: 'GT', p: 14, w: 7, l: 7, nrr: '-0.100', pts: 14 },
  { team: 'KKR', p: 14, w: 7, l: 7, nrr: '-0.250', pts: 14 },
  { team: 'LSG', p: 14, w: 6, l: 8, nrr: '-0.400', pts: 12 },
  { team: 'DC', p: 14, w: 5, l: 9, nrr: '-0.650', pts: 10 },
  { team: 'PBKS', p: 14, w: 5, l: 9, nrr: '-0.800', pts: 10 },
  { team: 'SRH', p: 14, w: 5, l: 9, nrr: '-0.950', pts: 10 },
];

export default function SeasonHub() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight">Season Hub</h1>
          </div>
          <p className="text-zinc-400 text-lg">Live points table, cap races, and title odds.</p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Points Table */}
        <motion.div 
          className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Live Points Table
            </h2>
            <span className="text-xs font-mono text-zinc-500 uppercase">Updated 2m ago</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/50 text-xs uppercase tracking-wider text-zinc-500 font-mono">
                  <th className="p-4 font-medium">Pos</th>
                  <th className="p-4 font-medium">Team</th>
                  <th className="p-4 font-medium">P</th>
                  <th className="p-4 font-medium">W</th>
                  <th className="p-4 font-medium">L</th>
                  <th className="p-4 font-medium">NRR</th>
                  <th className="p-4 font-medium text-right">Pts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {pointsTable.map((row, i) => (
                  <tr key={row.team} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 text-zinc-400 font-mono text-sm">{i + 1}</td>
                    <td className="p-4 font-semibold text-zinc-200">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(row.team)}&background=27272a&color=fff&rounded=true&bold=true`} 
                          alt={row.team} 
                          className="w-6 h-6 object-contain rounded-full bg-zinc-800 shrink-0"
                        />
                        <span>{row.team}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-400 font-mono">{row.p}</td>
                    <td className="p-4 text-emerald-400 font-mono">{row.w}</td>
                    <td className="p-4 text-rose-400 font-mono">{row.l}</td>
                    <td className={`p-4 font-mono ${row.nrr.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.nrr}
                    </td>
                    <td className="p-4 text-right font-bold text-white font-mono">{row.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Side Panels */}
        <div className="space-y-6">
          <motion.div 
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" />
              Orange Cap Race
            </h3>
            <div className="space-y-4">
              {[
                { name: 'V. Kohli', team: 'RCB', runs: 645 },
                { name: 'S. Gill', team: 'GT', runs: 590 },
                { name: 'R. Gaikwad', team: 'CSK', runs: 540 }
              ].map((player, i) => (
                <div key={player.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 font-mono text-sm">{i + 1}</span>
                    <div>
                      <p className="font-medium text-zinc-200">{player.name}</p>
                      <p className="text-xs text-zinc-500">{player.team}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-orange-400">{player.runs}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Purple Cap Race
            </h3>
            <div className="space-y-4">
              {[
                { name: 'J. Bumrah', team: 'MI', wickets: 24 },
                { name: 'R. Khan', team: 'GT', wickets: 21 },
                { name: 'M. Pathirana', team: 'CSK', wickets: 19 }
              ].map((player, i) => (
                <div key={player.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-zinc-500 font-mono text-sm">{i + 1}</span>
                    <div>
                      <p className="font-medium text-zinc-200">{player.name}</p>
                      <p className="text-xs text-zinc-500">{player.team}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-purple-400">{player.wickets}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Title Odds
            </h3>
            <div className="space-y-3">
              {[
                { team: 'CSK', odds: '2.10', prob: '45%' },
                { team: 'MI', odds: '3.50', prob: '28%' },
                { team: 'RCB', odds: '5.00', prob: '15%' }
              ].map((team) => (
                <div key={team.team} className="flex items-center justify-between p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50">
                  <span className="font-semibold text-zinc-200">{team.team}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-zinc-500">{team.prob}</span>
                    <span className="font-mono font-bold text-emerald-400">{team.odds}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
