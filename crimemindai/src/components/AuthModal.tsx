import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  X, 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  Lock, 
  Mail, 
  BadgeCheck, 
  MapPin, 
  Users, 
  Key, 
  ShieldAlert,
  CheckCircle2,
  Briefcase
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    user, 
    usersList, 
    login, 
    register, 
    switchUserAccount, 
    switchUserRole 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'switch'>('switch');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regBadge, setRegBadge] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Investigator');
  const [regDistrict, setRegDistrict] = useState('Mysuru Crime Division');
  const [regPassword, setRegPassword] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = login(loginEmail, loginPassword);
    if (!success) {
      setLoginError('Invalid email or profile not found in Karnataka SCRB registry.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;
    register({
      name: regName,
      email: regEmail,
      badgeNumber: regBadge || `SCRB-${Math.floor(100 + Math.random() * 800)}`,
      role: regRole,
      district: regDistrict,
    });
    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      closeAuthModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0d0d10] border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-100">
              SCRB Authentication & RBAC Portal
            </h2>
            <p className="text-xs text-slate-400">
              Karnataka State Police Crime Records Bureau Role & Clearance Gateway
            </p>
          </div>
        </div>

        {/* Top Mode Tabs */}
        <div className="flex rounded-xl bg-[#151518] p-1 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setMode('switch')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'switch' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Switch Profile</span>
          </button>

          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Officer Login</span>
          </button>

          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Account</span>
          </button>
        </div>

        {/* MODE 1: SWITCH PROFILE QUICK SELECT */}
        {mode === 'switch' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 font-mono uppercase tracking-widest font-bold">
              Active Session: <span className="text-cyan-400">{user.name} ({user.role})</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {usersList.map((u) => {
                const isActive = u.id === user.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => {
                      switchUserAccount(u.id);
                      closeAuthModal();
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                      isActive 
                        ? 'bg-indigo-950/40 border-indigo-500/50 text-slate-100 shadow-lg' 
                        : 'bg-[#151518] border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg font-bold flex items-center justify-center text-xs ${
                        u.role === 'Administrator' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        u.role === 'Investigator' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                        u.role === 'Police Officer' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {u.badgeNumber.slice(-3)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-100">{u.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                            {u.badgeNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{u.district} • {u.email}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        u.role === 'Administrator' ? 'bg-rose-900/50 text-rose-300 border border-rose-700/50' :
                        u.role === 'Investigator' ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50' :
                        u.role === 'Police Officer' ? 'bg-cyan-900/50 text-cyan-300 border border-cyan-700/50' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {u.role}
                      </span>
                      {isActive && (
                        <span className="block text-[9px] font-mono text-emerald-400 mt-1 font-bold">ACTIVE NOW</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Role Override Switcher for testing */}
            <div className="p-3.5 rounded-xl bg-[#151518] border border-slate-800/80 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                Quick Role Permission Switcher
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                {(['Administrator', 'Investigator', 'Police Officer', 'Viewer'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => switchUserRole(r)}
                    className={`py-1.5 px-2 rounded-lg font-mono text-[11px] transition-all cursor-pointer ${
                      user.role === r 
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: OFFICER LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">SCRB Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="investigator@scrb.gov.in"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#151518] border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1">Passcode / Secret PIN</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#151518] border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#151518] border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">Demo Registered Officer Accounts:</span>
              <div>• Admin: <span className="font-mono text-cyan-400">admin@scrb.gov.in</span></div>
              <div>• Investigator: <span className="font-mono text-cyan-400">investigator@scrb.gov.in</span></div>
              <div>• Police Officer: <span className="font-mono text-cyan-400">officer@scrb.gov.in</span></div>
              <div>• Viewer: <span className="font-mono text-cyan-400">viewer@scrb.gov.in</span></div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Sign In to SCRB Copilot
            </button>
          </form>
        )}

        {/* MODE 3: REGISTER NEW USER ACCOUNT */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {regSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Account registered successfully! Loading profile session...</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Full Officer Name</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Insp. K. Somashekar"
                  className="w-full px-3 py-2 rounded-lg bg-[#151518] border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Police Email</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="somashekar@scrb.gov.in"
                  className="w-full px-3 py-2 rounded-lg bg-[#151518] border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Badge ID / Service No.</label>
                <input
                  type="text"
                  value={regBadge}
                  onChange={(e) => setRegBadge(e.target.value)}
                  placeholder="SCRB-412"
                  className="w-full px-3 py-2 rounded-lg bg-[#151518] border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">District / Station</label>
                <input
                  type="text"
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  placeholder="Bengaluru East"
                  className="w-full px-3 py-2 rounded-lg bg-[#151518] border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Assigned Security Role</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-lg bg-[#151518] border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="Administrator">Administrator (Full System Control)</option>
                <option value="Investigator">Investigator (AI Copilot & Graph Analysis)</option>
                <option value="Police Officer">Police Officer (FIR Search & Field Directives)</option>
                <option value="Viewer">Viewer (Read-Only Public Dashboard)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              Create Account & Log In
            </button>
          </form>
        )}

        {/* Role Privileges Summary Footnote */}
        <div className="p-3.5 rounded-xl bg-[#151518] border border-slate-800 text-[11px] text-slate-400 space-y-1.5">
          <div className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-cyan-400" />
            Security Permissions for {user.role}:
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-mono text-slate-300">
            <li className={user.role === 'Administrator' || user.role === 'Investigator' ? 'text-emerald-400' : 'text-slate-600 line-through'}>
              ✓ Run AI Investigation Copilot
            </li>
            <li className={user.role !== 'Viewer' ? 'text-emerald-400' : 'text-slate-600 line-through'}>
              ✓ Export Report PDF Dossier
            </li>
            <li className={user.role === 'Administrator' || user.role === 'Investigator' ? 'text-emerald-400' : 'text-slate-600 line-through'}>
              ✓ Simulate Prediction Scenarios
            </li>
            <li className={user.role === 'Administrator' ? 'text-emerald-400' : 'text-slate-600 line-through'}>
              ✓ Manage Users & RBAC Rules
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};
