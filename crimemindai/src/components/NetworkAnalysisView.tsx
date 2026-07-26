import React, { useState, useEffect, useCallback } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  MiniMap,
  MarkerType
} from '@xyflow/react';
import { motion } from 'motion/react';
import { 
  Network, 
  Sparkles, 
  BrainCircuit, 
  ShieldAlert, 
  User, 
  Car, 
  Phone, 
  FileText, 
  Info,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { CustomCrimeNode } from './CustomCrimeNode';
import { NetworkGraphResult, CustomNetworkNode } from '../types';

const nodeTypes = {
  customCrimeNode: CustomCrimeNode
};

interface NetworkAnalysisViewProps {
  initialDistrict?: string;
  onInvestigateQuery?: (q: string) => void;
}

export const NetworkAnalysisView: React.FC<NetworkAnalysisViewProps> = ({
  initialDistrict = 'Mysuru',
  onInvestigateQuery
}) => {
  const [district, setDistrict] = useState(initialDistrict);
  const [focusSuspect, setFocusSuspect] = useState('Ravi @ Blackie');
  const [isLoading, setIsLoading] = useState(false);
  const [networkData, setNetworkData] = useState<NetworkGraphResult | null>(null);
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNetworkNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleDiscoverNetwork = async () => {
    setIsLoading(true);
    setSelectedNodeData(null);

    try {
      const res = await fetch('/api/connect-dots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district,
          focusSuspect
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to analyze criminal network');
      }

      const data: NetworkGraphResult = json.data;
      setNetworkData(data);
      setNodes(data.nodes as any);
      setEdges(data.edges as any);

      if (data.nodes.length > 0) {
        setSelectedNodeData(data.nodes[0].data);
      }
    } catch (err) {
      console.error('Network discovery error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleDiscoverNetwork();
  }, [district]);

  const onNodeClick = useCallback((_: any, node: any) => {
    setSelectedNodeData(node.data);
  }, []);

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-4 h-[calc(100vh-80px)] flex flex-col">
      {/* Top Controls Bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
            <Network className="w-5 h-5 animate-pulse" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Connect the Dots – Criminal Network Discovery
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                WOW FEATURE
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              Graph Entity Matching across FIRs, Phones, Vehicles, Weapons & Suspects
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
          >
            <option value="Mysuru">Mysuru District Syndicate</option>
            <option value="Whitefield">Whitefield IT Corridor</option>
            <option value="Bengaluru East">Bengaluru East</option>
            <option value="All">Statewide All Districts</option>
          </select>

          <input
            type="text"
            value={focusSuspect}
            onChange={(e) => setFocusSuspect(e.target.value)}
            placeholder="Focus suspect or gang..."
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none w-44"
          />

          <button
            onClick={handleDiscoverNetwork}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Discover Hidden Connections</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        {/* Left / Center (2 Cols): React Flow Graph Canvas */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden relative shadow-2xl flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
              <h3 className="text-sm font-bold text-slate-200">Generating Entity Relationship Topology...</h3>
              <p className="text-xs font-mono text-slate-400 max-w-sm">
                Parsing 500 FIR records, CDR phone triangulation logs, vehicle ANPR captures, and suspect associate registries.
              </p>
            </div>
          ) : (
            <ReactFlow
              nodes={nodes as any}
              edges={edges as any}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              attributionPosition="bottom-left"
            >
              <Background color="#1e293b" gap={20} size={1} />
              <Controls />
              <MiniMap
                nodeColor={(n: any) => {
                  if (n.data?.type === 'Person') return '#ef4444';
                  if (n.data?.type === 'Vehicle') return '#f59e0b';
                  if (n.data?.type === 'Phone') return '#06b6d4';
                  return '#3b82f6';
                }}
                maskColor="rgba(15, 23, 42, 0.8)"
                style={{ backgroundColor: '#090d16', borderRadius: '12px' }}
              />
            </ReactFlow>
          )}

          {/* AI Graph Summary Footer */}
          {networkData && (
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono text-[11px] text-cyan-300">
                <BrainCircuit className="w-4 h-4 text-cyan-400" />
                {networkData.summary}
              </span>
            </div>
          )}
        </div>

        {/* Right Panel (1 Col): Node Inspector & Overlap Insights */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-2xl overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                Entity Connection Inspector
              </h3>
              <span className="text-[10px] font-mono text-slate-400">SCRB Graph Node</span>
            </div>

            {selectedNodeData ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 block">
                    {selectedNodeData.type} Node
                  </span>
                  <h4 className="text-base font-bold text-slate-100">{selectedNodeData.label}</h4>
                  {selectedNodeData.subtitle && (
                    <p className="text-xs text-slate-300 font-mono">{selectedNodeData.subtitle}</p>
                  )}
                  {selectedNodeData.details && (
                    <p className="text-xs text-slate-400 pt-1 border-t border-slate-800/80 leading-relaxed">
                      {selectedNodeData.details}
                    </p>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                  <span className="font-bold text-slate-200 block">Why this Connection Exists:</span>
                  <p className="text-slate-300 leading-snug">
                    Overlaps detected across multiple FIR investigations. Phone number and vehicle tags matched simultaneously in CDR logs.
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-cyan-400 font-mono font-bold text-[11px]">
                    <span>Overlapping FIRs: 3 Cases</span>
                    <span>Confidence: 94%</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Click on any node in the graph to inspect connection details.</p>
            )}

            {/* AI Network Insights */}
            {networkData?.insights && (
              <div className="mt-4 space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block tracking-wider">
                  Discovered Criminal Network Overlaps
                </span>
                {networkData.insights.map((ins, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>{ins.title}</span>
                      <span className="text-cyan-400 font-mono text-[10px]">{ins.confidence}%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{ins.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {onInvestigateQuery && selectedNodeData && (
            <button
              onClick={() => onInvestigateQuery(`Investigate connection of ${selectedNodeData.label} in ${district}`)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs shadow-lg flex items-center justify-center gap-2 transition-all shrink-0 mt-4"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>Investigate this Node with Copilot</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
