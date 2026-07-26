import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  UserCheck, 
  Key, 
  Database, 
  Cpu, 
  CheckCircle2, 
  Lock,
  History,
  UserPlus,
  Trash2,
  Users,
  Shield,
  Briefcase
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { useAuth } from '../context/AuthContext';

interface SettingsViewProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = () => {
  const { 
    user, 
    usersList, 
    permissions, 
    switchUserRole, 
    updateUserRoleByAdmin, 
    deleteUserByAdmin, 
    openAuthModal 
  } = useAuth();

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('Police Officer');
  const [newUserDistrict, setNewUserDistrict] = useState('Bengaluru Division');
  const [showAddForm, setShowAddForm] = useState(false);

  const rolesList: { role: UserRole; desc: string; permissions: string[] }[] = [
    {
      role: 'Administrator',
      desc: 'Full administrative control across statewide SCRB records, AI models, and user roles.',
      permissions: ['Run AI Copilot', 'Graph Network', 'Predictions', 'Export Dossier PDF', 'Manage Users & RBAC']
    },
    {
      role: 'Investigator',
      desc: 'Senior detective access to run AI investigations, view relationship graphs, and generate dossiers.',
      permissions: ['Run AI Copilot', 'Graph Network', 'Predictions', 'Export Dossier PDF']
    },
    {
      role: 'Police Officer',
      desc: 'Field officer view to access FIR search, crime maps, and field observations.',
      permissions: ['Search FIR Database', 'View Interactive Crime Map', 'Edit Field Directives', 'Export Dossier PDF']
    },
    {
      role: 'Viewer',
      desc: 'Read-only access for analysts and external public station observers.',
      permissions: ['View Crime Map', 'View Dashboard Analytics']
    }
  ];

  const auditLogs = [
    { time: '10 mins ago', officer: user.name, action: 'Role Access Verified', details: `Session initialized as ${user.role} (${user.badgeNumber})` },
    { time: '25 mins ago', officer: 'Inspector R. Naik', action: 'Ran AI Investigation', details: 'Queried burglary patterns in Mysuru Gokulam' },
    { time: '1 hour ago', officer: 'ACP Divya Murthy', action: 'Graph Network Discovery', details: 'Generated relationship topology for Whitefield Gang' },
    { time: '2 hours ago', officer: 'Director S. Kumar', action: 'RBAC Permission Update', details: 'Promoted M. Gowda to Police Officer role' }
  ];

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-[#0d0d10] border border-slate-800 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider">
              RBAC Role Management & System Infrastructure
            </h2>
            <p className="text-xs text-slate-400">
              Configure Role-Based Access Control, manage user credentials, and monitor security audit history.
            </p>
          </div>
        </div>

        <button
          onClick={openAuthModal}
          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          <span>Switch Officer Profile</span>
        </button>
      </div>

      {/* Role Selection Matrix */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          Role Permission Matrix & Quick Tester
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rolesList.map((item) => {
            const isSelected = user.role === item.role;

            return (
              <div
                key={item.role}
                onClick={() => switchUserRole(item.role)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-950/50'
                    : 'bg-[#0d0d10] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.role[0]}
                    </div>
                    <h4 className="text-base font-bold text-slate-100">{item.role}</h4>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Active Role
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-snug">{item.desc}</p>

                <div className="space-y-1 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Granted Capabilities:</span>
                  <div className="flex flex-wrap gap-1">
                    {item.permissions.map((p, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#151518] text-slate-300 border border-slate-800">
                        ✓ {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Management Section (Admin privileges or Overview) */}
      <div className="p-5 rounded-2xl bg-[#0d0d10] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Registered Officer Credentials & Access Control
          </h3>

          {user.role === 'Administrator' && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Cancel' : 'Register New Officer'}</span>
            </button>
          )}
        </div>

        {/* User Accounts List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 font-mono text-[10px] uppercase text-slate-400 bg-[#151518]">
                <th className="p-3">Officer & Badge</th>
                <th className="p-3">District</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-[#151518] transition-colors">
                  <td className="p-3 font-semibold text-slate-200">
                    <div>{u.name}</div>
                    <div className="text-[10px] font-mono text-cyan-400">{u.badgeNumber} • {u.email}</div>
                  </td>
                  <td className="p-3 text-slate-300">{u.district}</td>
                  <td className="p-3">
                    {user.role === 'Administrator' ? (
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRoleByAdmin(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 rounded-lg bg-[#151518] border border-slate-700 text-xs text-cyan-300 font-mono font-bold focus:outline-none"
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Investigator">Investigator</option>
                        <option value="Police Officer">Police Officer</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    ) : (
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        u.role === 'Administrator' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        u.role === 'Investigator' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                        u.role === 'Police Officer' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {u.role}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {user.role === 'Administrator' && u.id !== user.id ? (
                      <button
                        onClick={() => deleteUserByAdmin(u.id)}
                        className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-all cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">Verified</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Infrastructure Status */}
      <div className="p-5 rounded-2xl bg-[#0d0d10] border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          Server & Model Architecture Status
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#151518] border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[10px] font-mono">PRIMARY AI MODEL</span>
              <span className="text-slate-200 font-bold">Google Gemini 3.6 Flash</span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">Active</span>
          </div>

          <div className="p-3 rounded-xl bg-[#151518] border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[10px] font-mono">DATABASE ENGINE</span>
              <span className="text-slate-200 font-bold">Karnataka SCRB (500 FIRs)</span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">Synchronized</span>
          </div>

          <div className="p-3 rounded-xl bg-[#151518] border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[10px] font-mono">VOICE DICTATION</span>
              <span className="text-slate-200 font-bold">Web Speech Recognition</span>
            </div>
            <span className="text-emerald-400 font-mono font-bold">Ready</span>
          </div>
        </div>
      </div>

      {/* Security Audit History */}
      <div className="p-5 rounded-2xl bg-[#0d0d10] border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
          <History className="w-4 h-4 text-cyan-400" />
          Security Audit Trail & Activity Logs
        </h3>

        <div className="space-y-2 text-xs">
          {auditLogs.map((log, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#151518] border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200">{log.action}</span>
                <span className="text-slate-400 block text-[11px]">{log.details} • By {log.officer}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
