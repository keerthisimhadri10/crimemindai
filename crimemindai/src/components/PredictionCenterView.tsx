import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Gauge, 
  Users, 
  Camera, 
  Radio, 
  ListChecks, 
  BrainCircuit,
  Sliders,
  Check
} from 'lucide-react';
import { PredictionScenarioResult } from '../types';

export const PredictionCenterView: React.FC = () => {
  const [patrolChange, setPatrolChange] = useState(30);
  const [isFestival, setIsFestival] = useState(true);
  const [festivalName, setFestivalName] = useState('Dasara / Grand Public Festival');
  const [cctvMultiplier, setCctvMultiplier] = useState(2);
  const [gangActive, setGangActive] = useState(true);
  const [gangName, setGangName] = useState('Ravi @ Blackie Motorcycle Syndicate');
  const [customQuery, setCustomQuery] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionScenarioResult | null>(null);

  const handleRunSimulation = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/predict-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patrolChange,
          isFestival,
          festivalName,
          cctvMultiplier,
          gangActive,
          gangName,
          customQuery
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setResult(json.data);
      }
    } catch (err) {
      console.error('Prediction simulation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial simulation on load if null
  React.useEffect(() => {
    if (!result) {
      handleRunSimulation();
    }
  }, []);

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </span>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Crime Prediction Simulator
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                WOW FEATURE 3
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Simulate "What-If" tactical scenarios to forecast risk levels, crime type spikes, and optimal police force deployment.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isLoading ? 'Simulating Risks...' : 'Run Scenario Simulation'}</span>
        </button>
      </div>

      {/* Simulator Controls & Scenario Customizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1 Col): Scenario Variable Controls */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Tactical Scenario Variables
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Inputs</span>
          </div>

          {/* Slider 1: Patrol Change */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-300 font-semibold">Police Patrol Density Change:</label>
              <span className="font-mono font-bold text-cyan-400">
                {patrolChange > 0 ? `+${patrolChange}%` : `${patrolChange}%`}
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="10"
              value={patrolChange}
              onChange={(e) => setPatrolChange(parseInt(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-50% (Reduced)</span>
              <span>0% (Normal)</span>
              <span>+100% (High Surge)</span>
            </div>
          </div>

          {/* Toggle 2: Festival Event */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-slate-200">Public Festival / Mass Event:</span>
              <input
                type="checkbox"
                checked={isFestival}
                onChange={(e) => setIsFestival(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </label>
            {isFestival && (
              <input
                type="text"
                value={festivalName}
                onChange={(e) => setFestivalName(e.target.value)}
                placeholder="Festival / Event name..."
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              />
            )}
          </div>

          {/* Slider 3: CCTV Multiplier */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-300 font-semibold">CCTV Surveillance Density:</label>
              <span className="font-mono font-bold text-cyan-400">{cctvMultiplier}x Normal</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={cctvMultiplier}
              onChange={(e) => setCctvMultiplier(parseInt(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Toggle 4: Gang Activity */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-semibold text-slate-200">Active Gang / Syndicate Threat:</span>
              <input
                type="checkbox"
                checked={gangActive}
                onChange={(e) => setGangActive(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </label>
            {gangActive && (
              <input
                type="text"
                value={gangName}
                onChange={(e) => setGangName(e.target.value)}
                placeholder="Gang name..."
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              />
            )}
          </div>

          {/* Custom Query */}
          <div className="space-y-1">
            <label className="text-xs text-slate-400">Custom What-If Scenario Prompt:</label>
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="e.g. What if rain falls heavily during night hours?"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Right Column (2 Cols): Predictive Simulation Results */}
        <div className="lg:col-span-2 space-y-5">
          {result && (
            <>
              {/* Simulation Title & Overview */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-slate-800 shadow-2xl space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Forecast Simulation Output
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    Confidence: {result.confidenceScore}%
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100">{result.scenarioTitle}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-mono">
                  {result.reasoning}
                </p>
              </div>

              {/* Predicted Crime Risk Gauge Items */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                  Predicted Crime Type Risk Meter
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {result.risks.map((r, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{r.crimeType}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH' 
                            ? 'bg-red-950 text-red-300 border border-red-800' 
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {r.riskLevel}
                        </span>
                      </div>

                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full transition-all duration-500 ${
                            r.riskLevel === 'CRITICAL' || r.riskLevel === 'HIGH' ? 'bg-rose-500' : 'bg-amber-400'
                          }`}
                          style={{ width: `${r.score}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{r.details}</span>
                        <span className="font-mono font-bold text-slate-300 flex items-center gap-1">
                          {r.trend === 'UP' ? <TrendingUp className="w-3 h-3 text-red-400" /> : <TrendingDown className="w-3 h-3 text-emerald-400" />}
                          {r.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Deployment Allocation */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Recommended Tactical Force Deployment
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-2xl font-bold font-mono text-cyan-400 block">
                      {result.recommendedDeployment.officersCount}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Police Officers</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-2xl font-bold font-mono text-amber-400 block">
                      {result.recommendedDeployment.mobilePatrols}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Mobile Units</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-2xl font-bold font-mono text-emerald-400 block">
                      {result.recommendedDeployment.temporaryCCTV}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Temp CCTVs</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-2xl font-bold font-mono text-purple-400 block">
                      {result.recommendedDeployment.drones}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Drones</span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-semibold text-slate-300 block mb-1">Specialized Units Required:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.recommendedDeployment.specialUnits.map((u, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-mono">
                        {u}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
