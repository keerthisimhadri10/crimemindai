import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Map, 
  Network, 
  Sparkles, 
  BarChart3, 
  FileText, 
  Settings,
  ShieldCheck,
  ChevronRight,
  Lock
} from 'lucide-react';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

export type TabType = 
  | 'dashboard' 
  | 'workspace' 
  | 'map' 
  | 'network' 
  | 'prediction' 
  | 'analytics' 
  | 'reports' 
  | 'settings';

interface SidebarProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, userRole }) => {
  const { user, permissions, openAuthModal } = useAuth();

  const menuItems: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: string; wow?: boolean; restricted?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workspace', label: 'AI Investigation', icon: BrainCircuit, badge: 'COPILOT', wow: true, restricted: !permissions.canRunAI },
    { id: 'map', label: 'Crime Map', icon: Map },
    { id: 'network', label: 'Network Discovery', icon: Network, badge: 'CONNECT', wow: true, restricted: !permissions.canViewGraphNetwork },
    { id: 'prediction', label: 'Prediction Center', icon: Sparkles, badge: 'SIMULATOR', wow: true, restricted: !permissions.canRunPredictions },
    { id: 'analytics', label: 'Analytics Intel', icon: BarChart3 },
    { id: 'reports', label: 'Dossier Reports', icon: FileText },
    { id: 'settings', label: 'Settings & Roles', icon: Settings, restricted: !permissions.canManageUsers && user.role !== 'Administrator' }
  ];

  return (
    <aside className="w-16 lg:w-60 border-r border-slate-800/60 bg-[#09090b] flex flex-col justify-between shrink-0 select-none z-30">
      {/* Sidebar Top Brand Header */}
      <div>
        <div className="p-4 border-b border-slate-800/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <h1 className="font-bold tracking-tight text-white uppercase text-xs">CRIMEMIND AI</h1>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">STATE POLICE COPILOT</p>
          </div>
        </div>

        {/* Menu List */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 hidden lg:block font-bold">
            SCRB INTELLIGENCE
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all group relative cursor-pointer ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-400/10 border-r-2 border-cyan-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1 rounded-md transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="hidden lg:inline">{item.label}</span>
                </div>

                {/* Lock or Feature Badges */}
                {item.restricted ? (
                  <span className="hidden lg:flex items-center gap-1 text-[9px] font-mono text-amber-400/80 px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/40">
                    <Lock className="w-2.5 h-2.5" />
                    <span>RESTRICTED</span>
                  </span>
                ) : item.badge ? (
                  <span className={`hidden lg:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    item.wow
                      ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer / Officer Status Card */}
      <div className="p-3 border-t border-slate-800/60">
        <div 
          onClick={openAuthModal}
          className="p-2.5 rounded-xl bg-[#0d0d10] border border-slate-800/60 hover:border-indigo-500/50 transition-all cursor-pointer hidden lg:block group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center font-bold text-cyan-300 text-xs shrink-0">
              {user.badgeNumber ? user.badgeNumber.slice(-3) : user.name[0]}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-cyan-400 transition-colors">{user.name}</h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter truncate font-mono">{user.role}</p>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>SCRB Auth</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Verified
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
