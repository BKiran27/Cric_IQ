'use client';

import { motion } from 'motion/react';
import { 
  Trophy, 
  Orbit, 
  UserSearch, 
  BrainCircuit, 
  Swords, 
  Radio,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const modules = [
  {
    title: 'Live Scorecards',
    description: 'Real-time match updates, detailed scorecards, and AI-driven game state analysis.',
    icon: Radio,
    href: '/live-matches',
    color: 'text-rose-400',
    bg: 'bg-rose-400/10',
    border: 'border-rose-400/20'
  },
  {
    title: 'Global Points Tables',
    description: 'Current standings for any league worldwide (WTC, IPL, PSL, BBL, etc.)',
    icon: Trophy,
    href: '/points-tables',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20'
  },
  {
    title: 'Player Intel',
    description: 'Career cards, form guides, matchups, and fantasy value ratings for any player globally.',
    icon: UserSearch,
    href: '/player-intel',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20'
  },
  {
    title: 'Match Predictor',
    description: '12-factor intelligence report and predictions for any upcoming fixture.',
    icon: Orbit,
    href: '/match-oracle',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20'
  },
  {
    title: 'Fantasy Engine',
    description: 'Optimal fantasy XI, captain/VC reasoning, and differential picks.',
    icon: BrainCircuit,
    href: '/dream-xi',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20'
  },
  {
    title: 'Team Battle',
    description: '15-dimension team comparisons including batting, bowling, and squad depth.',
    icon: Swords,
    href: '/team-battle',
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/20'
  }
];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            GLOBAL CRICKET FEED ACTIVE
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tight mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Cric IQ</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            The ultimate global cricket intelligence platform. Track live scorecards, analyze game states, and view points tables for any league in the world.
          </p>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod, index) => (
          <motion.div
            key={mod.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={mod.href}>
              <div className={`h-full p-6 rounded-2xl bg-zinc-900 border ${mod.border} hover:bg-zinc-800/80 transition-all duration-300 group relative overflow-hidden`}>
                <div className={`w-12 h-12 rounded-xl ${mod.bg} flex items-center justify-center mb-6`}>
                  <mod.icon className={`w-6 h-6 ${mod.color}`} />
                </div>
                <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-white transition-colors">
                  {mod.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {mod.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-300 group-hover:text-white transition-colors mt-auto">
                  Launch Module
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                
                {/* Decorative gradient background */}
                <div className={`absolute -bottom-24 -right-24 w-48 h-48 ${mod.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
