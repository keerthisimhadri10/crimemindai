import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  FileCheck2, 
  FolderSearch, 
  Flame, 
  Users, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  Clock, 
  BrainCircuit,
  ChevronRight,
  Radio,
  MapPin
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { getCrimeStats, MOCK_CRIME_RECORDS } from '../data/mockCrimeData';
import { TabType } from './Sidebar';

interface DashboardViewProps {
  onNavigate: (tab: TabType, query?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const stats = getCrimeStats();

  const monthlyTrendData = [
    { month: 'Feb', crimes: 112, solved: 78, burglaries: 34 },
    { month: 'Mar', crimes: 145, solved: 95, burglaries: 42 },
    { month: 'Apr', crimes: 128, solved: 88, burglaries: 30 },
    { month: 'May', crimes: 162, solved: 110, burglaries: 51 },
    { month: 'Jun', crimes: 198, solved: 124, burglaries: 68 },
    { month: 'Jul', crimes: 175, solved: 132, burglaries: 55 }
  ];

  const categoryDistribution = [
    { name: 'House Burglary', value: 38, color: '#f59e0b' },
    { name: 'Vehicle Theft', value: 26, color: '#3b82f6' },
    { name: 'Armed Robbery', value: 18, color: '#ef4444' },
    { name: 'Chain Snatching', value: 10, color: '#06b6d4' },
    { name: 'Cyber Fraud', value: 8, color: '#8b5cf6' }
  ];

  const topRecentCases = MOCK_CRIME_RECORDS.slice(0, 5);

  const keyHotspots = [
    { district: 'Mysuru (Gokulam & Vijayanagar)', risk: 'CRITICAL', cases: 28, pattern: 'Night back-door burglaries' },
    { district: 'Whitefield (ITPB Main Rd)', risk: 'HIGH', cases: 22, pattern: 'ATM & Vehicle snatching' },
    { district: 'Bengaluru East (Indiranagar)', risk: 'HIGH', cases: 19, pattern: 'Motorcycle syndicate' },
    { district: 'Mangaluru (Panambur Port Area)', risk: 'MEDIUM', cases: 14, pattern: 'Cargo logistics theft' }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-xl bg-[#0d0d10] border border-slate-800/80 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 uppercase font-bold tracking-widest flex items-center gap-1">
                <Radio className="w-3 h-3 text-cyan-400 animate-pulse" /> STATE CRIME RECORDS BUREAU ENGINE
              </span>
              <span className="text-[10px] font-mono text-slate-500">KARNATAKA SCRB v4.2</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold text-slate-100 tracking-tight uppercase">
              Statewide Crime Intelligence & Predictive Operations
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Monitoring 1,100+ police stations. AI pattern recognition detected <span className="text-cyan-400 font-semibold">3 active crime syndicates</span> across Mysuru, Whitefield, and Bengaluru East.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate('workspace', 'Investigate burglary patterns in Mysuru during last 30 days')}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Run AI Investigation</span>
            </button>
            <button
              onClick={() => onNavigate('network')}
              className="px-3.5 py-2 rounded-lg bg-[#151518] hover:bg-slate-800 text-slate-200 border border-slate-800 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Connect Dots</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
        {/* Card 1: Total Crimes */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 rounded-xl bg-[#0d0d10] border border-slate-800/80 hover:border-slate-700 transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest">Total Crimes</span>
            <div className="p-1 rounded bg-blue-950/80 text-blue-400 border border-blue-900/50">
              <FolderSearch className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-100 font-mono tracking-tight">{stats.total}</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+12.4% vs last month</span>
          </div>
        </motion.div>

        {/* Card 2: Open Cases */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-[#0d0d10] border border-amber-900/30 hover:border-amber-800/50 transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Open Cases</span>
            <div className="p-1 rounded bg-amber-950/80 text-amber-400 border border-amber-900/50">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-200 font-mono tracking-tight">{stats.openCases}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Active cases</div>
        </motion.div>

        {/* Card 3: Solved Cases */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-xl bg-[#0d0d10] border border-emerald-900/30 hover:border-emerald-800/50 transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Solved Cases</span>
            <div className="p-1 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-900/50">
              <FileCheck2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-200 font-mono tracking-tight">{stats.solved}</div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">{stats.solveRate}% Clearance</div>
        </motion.div>

        {/* Card 4: Hotspots */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-[#0d0d10] border border-rose-900/30 hover:border-rose-800/50 transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Hotspots</span>
            <div className="p-1 rounded bg-rose-950/80 text-rose-400 border border-rose-900/50">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-200 font-mono tracking-tight">{stats.hotspotsCount} Clusters</div>
          <div className="text-[10px] text-rose-300 font-mono mt-1">Mysuru, Whitefield...</div>
        </motion.div>

        {/* Card 5: Repeat Offenders */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-4 rounded-xl bg-[#0d0d10] border border-purple-900/30 hover:border-purple-800/50 transition-all shadow-lg group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Offenders</span>
            <div className="p-1 rounded bg-purple-950/80 text-purple-400 border border-purple-900/50">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-200 font-mono tracking-tight">{stats.repeatOffenders} Gangs</div>
          <div className="text-[10px] text-purple-300 font-mono mt-1">Multiple FIRs</div>
        </motion.div>

        {/* Card 6: Prediction Alerts */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-[#0d0d10] border border-cyan-900/40 hover:border-cyan-800/60 transition-all shadow-lg group cursor-pointer"
          onClick={() => onNavigate('prediction')}
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Prediction</span>
            <div className="p-1 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-900/50">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-cyan-200 font-mono tracking-tight">HIGH RISK</div>
          <div className="text-[10px] text-cyan-300 mt-1 flex items-center gap-1 font-mono font-medium">
            <span>Simulator Active</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </motion.div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width): Monthly Crime Trend */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#0d0d10] border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Statewide Monthly Crime & Clearance Velocity
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">FIR registration vs Solved rate over last 6 months</p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151518] border border-slate-800 text-slate-400 font-bold uppercase">
              SCRB Stream
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData}>
                <defs>
                  <linearGradient id="crimesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="solvedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d0d10', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="crimes" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#crimesGrad)" name="Total Reported" />
                <Area type="monotone" dataKey="solved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#solvedGrad)" name="Solved Cases" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column (1/3 width): Crime Type Distribution */}
        <div className="p-5 rounded-xl bg-[#0d0d10] border border-slate-800/80 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800/80 pb-3 mb-2">
              <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Crime Category Breakdown</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Distribution across active FIRs</p>
            </div>

            <div className="h-44 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0d0d10', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            {categoryDistribution.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}></span>
                  {c.name}
                </span>
                <span className="font-mono font-bold text-slate-200">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hotspot & Recent FIRs Double Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Hotspot Radar */}
        <div className="p-5 rounded-xl bg-[#0d0d10] border border-slate-800/80 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              Critical Police District Hotspots
            </h3>
            <button 
              onClick={() => onNavigate('map')}
              className="text-[11px] font-mono uppercase text-cyan-400 hover:underline font-bold flex items-center gap-1"
            >
              Interactive Map <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {keyHotspots.map((h, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#151518] border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-200">{h.district}</span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      h.risk === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {h.risk}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{h.pattern}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-200">{h.cases} FIRs</span>
                  <button
                    onClick={() => onNavigate('workspace', `Investigate cases in ${h.district}`)}
                    className="block text-[10px] font-mono uppercase text-cyan-400 hover:underline mt-0.5 font-bold"
                  >
                    Investigate →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Investigations Feed */}
        <div className="p-5 rounded-xl bg-[#0d0d10] border border-slate-800/80 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Recent High-Priority FIR Registrations
            </h3>
            <button 
              onClick={() => onNavigate('workspace')}
              className="text-[11px] font-mono uppercase text-cyan-400 hover:underline font-bold flex items-center gap-1"
            >
              Copilot Console <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {topRecentCases.map((c) => (
              <div 
                key={c.id} 
                onClick={() => onNavigate('workspace', `Analyze FIR ${c.id}`)}
                className="p-3 rounded-lg bg-[#151518] border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-cyan-400 group-hover:underline">{c.id}</span>
                    <span className="text-xs font-medium text-slate-200">{c.crimeType}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{c.district} • {c.area} • Officer: {c.officer}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                    c.status === 'Under Investigation' ? 'bg-amber-950 text-amber-300 border border-amber-800/60' : 'bg-emerald-950 text-emerald-300'
                  }`}>
                    {c.status}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{c.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
