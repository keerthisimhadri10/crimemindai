import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldAlert, 
  PieChart as PieIcon, 
  Map, 
  Users,
  Target
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const districtComparison = [
    { district: 'Mysuru', burglaries: 68, robberies: 22, thefts: 45 },
    { district: 'Bengaluru East', burglaries: 42, robberies: 38, thefts: 72 },
    { district: 'Bengaluru West', burglaries: 35, robberies: 20, thefts: 58 },
    { district: 'Whitefield', burglaries: 50, robberies: 30, thefts: 64 },
    { district: 'Mangaluru', burglaries: 28, robberies: 18, thefts: 32 },
    { district: 'Hubballi', burglaries: 32, robberies: 15, thefts: 28 }
  ];

  const weaponUsageData = [
    { weapon: 'Iron Crowbar / Lever', count: 184, fill: '#3b82f6' },
    { weapon: 'Country Pistol / Firearm', count: 62, fill: '#ef4444' },
    { weapon: 'Machete / Sharp Blade', count: 98, fill: '#f59e0b' },
    { weapon: 'Digital Malware / Phishing', count: 45, fill: '#8b5cf6' },
    { weapon: 'Unarmed / Physical Force', count: 111, fill: '#10b981' }
  ];

  const repeatOffenderStats = [
    { name: 'Ravi @ Blackie Syndicate', cases: 14, district: 'Mysuru & Whitefield', status: 'CRITICAL THREAT' },
    { name: 'Suresh Reddy Gang', cases: 11, district: 'Bengaluru East', status: 'HIGH THREAT' },
    { name: 'Imran Khan @ Bullet', cases: 8, district: 'Bengaluru West', status: 'MEDIUM THREAT' },
    { name: 'Vicky @ Phantom Cyber', cases: 7, district: 'Whitefield & Mysuru', status: 'MEDIUM THREAT' }
  ];

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">SCRB Predictive Analytics & Intelligence</h2>
            <p className="text-xs text-slate-400">Deep comparative metrics, weapon usage vectors, and repeat offender syndicate profiles.</p>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-bold">
          Updated Realtime
        </span>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: District Breakdown Bar Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Map className="w-4 h-4 text-cyan-400" />
              District Crime Breakdown Comparison
            </h3>
            <span className="text-[10px] font-mono text-slate-400">FIR Volume</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtComparison}>
                <XAxis dataKey="district" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Bar dataKey="burglaries" fill="#f59e0b" name="Burglaries" radius={[4, 4, 0, 0]} />
                <Bar dataKey="robberies" fill="#ef4444" name="Robberies" radius={[4, 4, 0, 0]} />
                <Bar dataKey="thefts" fill="#3b82f6" name="Vehicle Theft" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Weapon Usage Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Weapon & Modus Operandi Tool Matrix
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Forensic Logs</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weaponUsageData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis dataKey="weapon" type="category" stroke="#64748b" fontSize={10} width={130} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[0, 6, 6, 0]} name="Incidents Reported" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Repeat Offender Syndicate Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            Top Recognized Criminal Syndicates & Gang Profiles
          </h3>
          <span className="text-[10px] font-mono text-slate-400">SCRB Watchlist</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {repeatOffenderStats.map((gang, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  gang.status.includes('CRITICAL') ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {gang.status}
                </span>
                <span className="font-mono text-xs font-bold text-cyan-400">{gang.cases} FIRs</span>
              </div>

              <h4 className="text-sm font-bold text-slate-100">{gang.name}</h4>
              <p className="text-xs text-slate-400 font-mono">Active in: {gang.district}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
