'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Trophy, 
  Orbit, 
  UserSearch, 
  BrainCircuit, 
  Swords, 
  Activity,
  Radio
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Activity },
  { name: 'Live Scorecards', href: '/live-matches', icon: Radio },
  { name: 'Points Tables', href: '/points-tables', icon: Trophy },
  { name: 'Player Intel', href: '/player-intel', icon: UserSearch },
  { name: 'Match Predictor', href: '/match-oracle', icon: Orbit },
  { name: 'Fantasy Engine', href: '/dream-xi', icon: BrainCircuit },
  { name: 'Team Battle', href: '/team-battle', icon: Swords },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800/50 h-screen flex flex-col sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
          <Activity className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-white tracking-tight">Cric <span className="text-emerald-400">IQ</span></h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Global Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 transition-colors",
                isActive ? "text-emerald-400" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800/50">
        <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
          <p className="text-xs text-zinc-400 font-mono mb-2">SYSTEM STATUS</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-zinc-300">Global Feed Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
