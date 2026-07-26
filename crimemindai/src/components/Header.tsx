import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Mic, 
  MicOff, 
  Bell, 
  FileDown, 
  UserCheck, 
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Radio,
  User,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import { UserRole, CrimeRecord } from '../types';
import { MOCK_CRIME_RECORDS } from '../data/mockCrimeData';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onSearchSubmit: (query: string) => void;
  onExportPDF: () => void;
  onVoiceQuerySubmit: (transcript: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onSearchSubmit,
  onExportPDF,
  onVoiceQuerySubmit
}) => {
  const { user, openAuthModal } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<CrimeRecord[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Speech Recognition hook
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    let recognition: any = null;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (isListening) {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const text = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscript(text);
        setSearchQuery(text);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          onVoiceQuerySubmit(transcript);
        }
      };

      recognition.start();
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
    } else {
      setTranscript('');
      setIsListening(true);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 1) {
      const q = val.toLowerCase();
      const filtered = MOCK_CRIME_RECORDS.filter(r =>
        r.id.toLowerCase().includes(q) ||
        r.crimeType.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        r.suspect.toLowerCase().includes(q) ||
        r.vehicle.toLowerCase().includes(q)
      ).slice(0, 5);
      setSearchResults(filtered);
      setShowSearchDropdown(true);
    } else {
      setShowSearchDropdown(false);
    }
  };

  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearchSubmit(searchQuery);
      setShowSearchDropdown(false);
    }
  };

  const notifications = [
    { id: 1, title: 'Critical Pattern Alert', message: '3 Burglaries reported in Mysuru Gokulam area matching Black Pulsar syndicate.', time: '10m ago', urgent: true },
    { id: 2, title: 'Prediction Risk Elevation', message: 'Vehicle theft risk predicted HIGH (+42%) for tomorrow during Festival gathering.', time: '25m ago', urgent: true },
    { id: 3, title: 'Network Connection Unlocked', message: 'Case FIR-2026-102 linked to Case FIR-2026-148 via suspect phone number.', time: '1h ago', urgent: false }
  ];

  return (
    <header className="h-16 border-b border-slate-800/60 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Alert status pill */}
      <div className="hidden md:flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-red-500 uppercase tracking-widest shrink-0">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        <span>LIVE INTEL FEED: 3 HIGH-RISK SYNDICATES DETECTED</span>
      </div>

      {/* Center Search & Voice Bar */}
      <div className="flex-1 max-w-xl relative">
        <form onSubmit={handleSearchFormSubmit} className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={isListening ? "Listening... Speak your investigation query..." : "Search FIRs, suspects, locations, vehicle numbers (e.g. Mysuru burglary)..."}
            className={`w-full pl-10 pr-20 py-2 text-xs rounded-lg bg-[#151518] border transition-all text-slate-100 placeholder-slate-500 focus:outline-none ${
              isListening ? 'border-cyan-500 ring-1 ring-cyan-500 bg-[#151518]' : 'border-slate-800 focus:border-slate-700 focus:ring-1 focus:ring-cyan-500'
            }`}
          />
          
          <div className="absolute right-2 flex items-center gap-1">
            <button
              type="button"
              onClick={toggleListening}
              title="Voice Dictation"
              className={`p-1 rounded-md text-xs transition-all flex items-center gap-1 ${
                isListening 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>
          </div>
        </form>

        {/* Live Search Instant Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-11 bg-[#0d0d10] border border-slate-800 rounded-xl shadow-2xl p-2 z-50">
            <div className="text-[10px] font-mono text-slate-500 px-2 py-1 uppercase tracking-widest font-bold">
              MATCHING RECORDS ({searchResults.length})
            </div>
            {searchResults.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  onSearchSubmit(r.id);
                  setShowSearchDropdown(false);
                }}
                className="w-full text-left p-2 rounded-lg hover:bg-slate-800/60 transition-all flex items-center justify-between text-xs group"
              >
                <div>
                  <span className="font-mono font-semibold text-cyan-400 group-hover:underline mr-2">{r.id}</span>
                  <span className="text-slate-200 font-medium">{r.crimeType}</span>
                  <p className="text-[11px] text-slate-400">{r.district} • {r.area} • Suspect: {r.suspect}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                  r.severity === 'Critical' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-slate-800 text-slate-300'
                }`}>
                  {r.severity}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* PDF Export Button */}
        <button
          onClick={onExportPDF}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow-md shadow-indigo-600/20"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>EXPORT DOSSIER</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-[#151518] border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 bg-[#0d0d10] border border-slate-800 rounded-xl shadow-2xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  Live Intelligence Alerts
                </span>
                <span className="text-[10px] text-slate-500 font-mono">REALTIME</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-2.5 rounded-lg text-xs border ${
                    n.urgent ? 'bg-red-950/40 border-red-900/50 text-red-200' : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}>
                    <div className="flex items-center justify-between font-semibold mb-1 text-slate-100">
                      <span className="flex items-center gap-1">
                        {n.urgent && <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />}
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] opacity-90 leading-tight">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Auth Portal Trigger */}
        <button
          onClick={openAuthModal}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#151518] border border-slate-800 hover:border-indigo-500/50 text-xs transition-all cursor-pointer group"
          title="Open SCRB Auth & RBAC Portal"
        >
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white text-[10px] shadow-sm">
            {user.badgeNumber ? user.badgeNumber.slice(-3) : user.name[0]}
          </div>
          <div className="text-left hidden lg:block">
            <span className="block text-[9px] font-mono uppercase text-slate-500 tracking-wider group-hover:text-cyan-400 transition-colors">
              {user.badgeNumber} • {user.role}
            </span>
            <span className="font-semibold text-slate-200 text-xs truncate block max-w-[110px]">
              {user.name}
            </span>
          </div>
          <LogIn className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        </button>

        {/* User Role Quick Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#151518] border border-slate-800 hover:border-slate-700 text-xs transition-all cursor-pointer"
          >
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{currentRole}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 top-11 w-48 bg-[#0d0d10] border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50">
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-slate-500 border-b border-slate-800 mb-1">
                SELECT ACTIVE ROLE
              </div>
              {(['Administrator', 'Investigator', 'Police Officer', 'Viewer'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onRoleChange(role);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                    currentRole === role ? 'bg-cyan-950/80 text-cyan-300 font-semibold border border-cyan-800/50' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{role}</span>
                  {currentRole === role && <UserCheck className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
