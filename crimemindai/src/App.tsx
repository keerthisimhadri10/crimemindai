import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { InvestigationWorkspace } from './components/InvestigationWorkspace';
import { CrimeMapView } from './components/CrimeMapView';
import { NetworkAnalysisView } from './components/NetworkAnalysisView';
import { PredictionCenterView } from './components/PredictionCenterView';
import { AnalyticsView } from './components/AnalyticsView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { UserRole, CrimeRecord } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';

function MainAppContent() {
  const { user, permissions } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [workspaceQuery, setWorkspaceQuery] = useState('');
  const [networkDistrict, setNetworkDistrict] = useState('Mysuru');

  const handleNavigate = (tab: TabType, query?: string) => {
    setActiveTab(tab);
    if (query) {
      setWorkspaceQuery(query);
    }
  };

  const handleInspectCase = (record: CrimeRecord) => {
    setWorkspaceQuery(`Investigate case ${record.id} involving suspect ${record.suspect} in ${record.district}`);
    setActiveTab('workspace');
  };

  const handleConnectNetwork = (district: string) => {
    setNetworkDistrict(district);
    setActiveTab('network');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <Header
        currentRole={user.role}
        onRoleChange={() => {}}
        onSearchSubmit={(q) => handleNavigate('workspace', q)}
        onExportPDF={() => setActiveTab('reports')}
        onVoiceQuerySubmit={(q) => handleNavigate('workspace', q)}
      />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          userRole={user.role}
        />

        {/* Workspace Central Views */}
        <main className="flex-1 overflow-y-auto bg-slate-950/60">
          {activeTab === 'dashboard' && (
            <DashboardView onNavigate={handleNavigate} />
          )}

          {activeTab === 'workspace' && (
            <InvestigationWorkspace
              initialQuery={workspaceQuery}
              onInspectCase={handleInspectCase}
              onConnectNetwork={handleConnectNetwork}
              onExportPDF={() => setActiveTab('reports')}
            />
          )}

          {activeTab === 'map' && (
            <CrimeMapView
              onInvestigateCase={(q) => handleNavigate('workspace', q)}
            />
          )}

          {activeTab === 'network' && (
            <NetworkAnalysisView
              initialDistrict={networkDistrict}
              onInvestigateQuery={(q) => handleNavigate('workspace', q)}
            />
          )}

          {activeTab === 'prediction' && (
            <PredictionCenterView />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView />
          )}

          {activeTab === 'reports' && (
            <ReportsView />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currentRole={user.role}
              onRoleChange={() => {}}
            />
          )}
        </main>
      </div>

      {/* Auth & RBAC Portal Dialog */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
