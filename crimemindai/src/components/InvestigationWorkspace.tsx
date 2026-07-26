import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  Send, 
  Mic, 
  MicOff, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Gauge, 
  ListChecks, 
  Share2, 
  Sparkles, 
  ArrowRight,
  Radio,
  Clock,
  Layers,
  ChevronRight,
  FileDown,
  Lock
} from 'lucide-react';
import { InvestigationResult, CrimeRecord } from '../types';
import { useAuth } from '../context/AuthContext';

interface InvestigationWorkspaceProps {
  initialQuery?: string;
  onInspectCase?: (record: CrimeRecord) => void;
  onConnectNetwork?: (district: string) => void;
  onExportPDF?: () => void;
}

export const InvestigationWorkspace: React.FC<InvestigationWorkspaceProps> = ({
  initialQuery = '',
  onInspectCase,
  onConnectNetwork,
  onExportPDF
}) => {
  const { user, permissions, openAuthModal } = useAuth();
  const [query, setQuery] = useState(initialQuery);
  const [districtFilter, setDistrictFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const loadingMessages = [
    'Analyzing crime records across State SCRB database...',
    'Cross-checking historical FIRs and MO patterns...',
    'Searching criminal relationships and vehicle tags...',
    'Evaluating forensic evidence and location CDR triangulation...',
    'Synthesizing hypotheses probability & confidence scores...'
  ];

  // Suggested Quick Prompts
  const samplePrompts = [
    'Investigate burglary cases in Mysuru during the last 30 days.',
    'Analyze robberies involving motorcycles and crowbars.',
    'Why has crime increased in Bengaluru East?',
    'Find repeat offenders operating near Whitefield.'
  ];

  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
      handleRunInvestigation(initialQuery);
    }
  }, [initialQuery]);

  // Loading animation message rotation
  useEffect(() => {
    let interval: any = null;
    if (isLoading) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleRunInvestigation = async (queryToRun?: string) => {
    const activeQuery = queryToRun || query;
    if (!activeQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: activeQuery,
          districtFilter: districtFilter === 'All' ? undefined : districtFilter
        })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to complete investigation analysis.');
      }

      setResult(json.data);
    } catch (err: any) {
      console.error('Investigation error:', err);
      setError(err.message || 'Error executing AI Investigation Mode.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript;
      setQuery(spoken);
      setIsListening(false);
      handleRunInvestigation(spoken);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </span>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              AI Investigation Workspace
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase font-bold">
              Senior Copilot Mode
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Natural language crime pattern discovery, evidence reasoning, and predictive hypotheses generator.
          </p>
        </div>

        {/* District Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-mono">Scope District:</label>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Districts (1100+ Stations)</option>
            <option value="Mysuru">Mysuru SCRB Division</option>
            <option value="Bengaluru East">Bengaluru East</option>
            <option value="Bengaluru West">Bengaluru West</option>
            <option value="Whitefield">Whitefield IT Corridor</option>
            <option value="Mangaluru">Mangaluru Port Zone</option>
          </select>
        </div>
      </div>

      {/* Input Prompt Console & Dictation */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-2xl space-y-3">
        {!permissions.canRunAI && (
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Role Clearance Notice: Current role '{user.role}' has read-only access. Switch role to run new AI Copilot investigations.</span>
            </div>
            <button
              onClick={openAuthModal}
              className="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-700 text-amber-100 font-mono text-[10px] font-bold uppercase cursor-pointer"
            >
              Elevate Role
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!permissions.canRunAI) {
              openAuthModal();
              return;
            }
            handleRunInvestigation();
          }}
          className="relative flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask CrimeMind AI (e.g. Investigate burglary patterns in Mysuru or find repeat offenders near Whitefield)..."
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50"
            />
            <button
              type="button"
              onClick={handleMicToggle}
              title="Speech-to-Text Voice Query"
              className={`absolute right-3 top-2.5 p-1.5 rounded-lg text-xs transition-all ${
                isListening ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Investigate</span>
          </button>
        </form>

        {/* Quick Sample Query Chips */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[11px] font-mono text-slate-500 uppercase flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Directives:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(p);
                handleRunInvestigation(p);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-slate-300 hover:text-cyan-300 text-[11px] transition-all"
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Step Animated Loading Experience */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-center space-y-4 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/10 to-cyan-500/5 animate-pulse pointer-events-none"></div>
            
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
              <BrainCircuit className="w-6 h-6 animate-spin-slow" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-100">Senior Detective AI Reasoning Engine</h3>
              <p className="text-xs font-mono text-cyan-400 mt-1 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                {loadingMessages[loadingStepIndex]}
              </p>
            </div>

            <div className="w-full max-w-md mx-auto bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300 ease-out"
                style={{ width: `${((loadingStepIndex + 1) / loadingMessages.length) * 100}%` }}
              ></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-900/60 text-red-300 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <span className="font-bold block">Investigation Error</span>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Main Investigation Results Grid */}
      {result && !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Center Panel (2 Columns): Investigation Cards */}
          <div className="lg:col-span-2 space-y-5">
            {/* Card 1: Executive Summary */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    <FileText className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-bold text-slate-100">{result.summary.title}</h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                  SCRB DOSSIER #0941
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {result.summary.overview}
              </p>

              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider block">
                  Detected Criminal Patterns
                </span>
                <div className="space-y-1">
                  {result.summary.patternsDetected.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Card 2: Possible Hypotheses & Confidence Meter */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
            >
              <div className="border-b border-slate-800 pb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Evaluated Hypotheses & Probability
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Probabilistic Model</span>
              </div>

              <div className="space-y-3">
                {result.hypotheses.map((h, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{h.hypothesis}</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">{h.confidence}% Confidence</span>
                    </div>

                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-cyan-400 h-full transition-all duration-500"
                        style={{ width: `${h.confidence}%` }}
                      ></div>
                    </div>

                    <ul className="space-y-1 text-[11px] text-slate-400 pt-1">
                      {h.supportingPoints.map((pt, j) => (
                        <li key={j} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 3: Key Findings & Evidence Used */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4"
            >
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Key Findings & Forensic FIR Cross-References
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.evidenceUsed.map((ev, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-cyan-400">{ev.firId}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                        Evidence FIR
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-semibold">{ev.description}</p>
                    <p className="text-[11px] text-slate-400 italic leading-snug">{ev.relevance}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Card 4: Reasoning & Explainable AI */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl space-y-2"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-cyan-400" />
                  Explainable AI Logic & Chain of Deduction
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {result.reasoning}
              </p>
            </motion.div>
          </div>

          {/* Right Panel (1 Column): Confidence, Recommendations & Directives */}
          <div className="space-y-5">
            {/* Overall Confidence Gauge Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl text-center space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Overall AI Copilot Confidence
              </span>

              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-cyan-400 transition-all duration-1000 ease-out"
                    strokeDasharray={`${result.confidenceScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold font-mono text-slate-100">{result.confidenceScore}%</span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Evidence Match</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Backed by {result.evidenceUsed.length} verified FIR cross-matches.
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
                <ListChecks className="w-4 h-4 text-emerald-400" />
                Recommended Police Directives
              </h3>

              <div className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0 flex items-center justify-center font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span className="mt-0.5">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Crime Cases Trigger List */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">
                Linked Case Records ({result.matchedCases.length})
              </h3>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {result.matchedCases.map((record) => (
                  <div
                    key={record.id}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between text-xs group"
                  >
                    <div>
                      <span className="font-mono font-bold text-cyan-400 group-hover:underline mr-2">{record.id}</span>
                      <span className="text-slate-200 font-semibold">{record.crimeType}</span>
                      <p className="text-[11px] text-slate-400">{record.district} • {record.area}</p>
                    </div>
                    {onInspectCase && (
                      <button
                        onClick={() => onInspectCase(record)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono shrink-0"
                      >
                        Inspect
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {onConnectNetwork && (
                <button
                  onClick={() => onConnectNetwork(result.matchedCases[0]?.district || 'Mysuru')}
                  className="w-full py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 text-xs font-semibold flex items-center justify-center gap-2 transition-all mt-2"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Discover Network for these Cases</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
