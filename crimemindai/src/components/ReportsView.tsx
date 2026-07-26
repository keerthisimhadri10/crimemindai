import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  FileText, 
  FileDown, 
  ShieldCheck, 
  CheckCircle2, 
  PenTool, 
  BrainCircuit,
  Sparkles,
  Shield,
  Award,
  Lock,
  Eye,
  Printer,
  Check,
  User,
  Car,
  Phone,
  Grid,
  BadgeCheck,
  Fingerprint
} from 'lucide-react';
import { MOCK_CRIME_RECORDS } from '../data/mockCrimeData';
import { useAuth } from '../context/AuthContext';

export const ReportsView: React.FC = () => {
  const { user, permissions } = useAuth();
  const [selectedCaseId, setSelectedCaseId] = useState('FIR-2026-101');
  const [officerNotes, setOfficerNotes] = useState(
    'Special patrol team deployed in Gokulam and VV Mohalla sectors following repeated night burglaries. ANPR camera feeds synchronized with state vehicle registry. Suspect vehicle KA-09-MA-8812 tracked moving toward Mysuru Ring Road.'
  );
  const [isExporting, setIsExporting] = useState(false);
  const [pdfTheme, setPdfTheme] = useState<'paper' | 'dark'>('paper'); // Default to 'paper' for official print look

  const reportRef = useRef<HTMLDivElement>(null);

  const activeCase = MOCK_CRIME_RECORDS.find(r => r.id === selectedCaseId) || MOCK_CRIME_RECORDS[0];

  // Comprehensive AI investigation report
  const mockAIReport = {
    summary: {
      title: `Crime Pattern & Syndicate Dossier: ${activeCase.crimeType}`,
      overview: `Detailed intelligence dossier for FIR ${activeCase.id} in ${activeCase.district} (${activeCase.area}). Algorithmic pattern recognition indicates a coordinated operational modus operandi involving suspect ${activeCase.suspect} and getaway vehicle ${activeCase.vehicle}.`,
      patternsDetected: [
        'Off-peak operational window (01:00 AM - 04:00 AM)',
        `Serial target selection across ${activeCase.district} residential clusters`,
        'Use of unregistered getaway vehicle and encrypted SIM cards',
        'Direct linkage to 3 repeat burglary FIRs in Karnataka state database'
      ]
    },
    keyFindings: [
      `Primary Suspect identified as ${activeCase.suspect} with ${activeCase.previousFIRCount} prior FIR history records.`,
      `Vehicle tag ${activeCase.vehicle} flagged on state ANPR camera grid at 02:15 AM near ${activeCase.area}.`,
      `CDR analysis confirms phone number ${activeCase.phoneNumber} was active near crime scene tower during occurrence.`,
      `Tool marks match heavy-duty crowbar tool signature from previous unsolved break-ins.`
    ],
    evidenceUsed: [
      { firId: activeCase.id, description: `Primary FIR Report & On-site Forensic Notes (${activeCase.area})`, relevance: 'Critical Direct (98%)' },
      { firId: 'FIR-2026-102', description: 'ANPR License Plate Camera Snapshot Feed', relevance: 'High Corroborating (89%)' },
      { firId: 'FIR-2026-104', description: 'Call Detail Record (CDR) Cell Tower Triangulation', relevance: 'High Corroborating (85%)' }
    ],
    reasoning: `AI pattern analysis cross-referenced ${activeCase.suspect}'s historic MO with 1,100+ state police records. Temporal distribution, target property types, and getaway routes display a 94.2% similarity coefficient with the 'Black Pulsar Burglar Gang' operating across Mysuru and Bengaluru East.`,
    confidenceScore: 94,
    recommendations: [
      `Issue Immediate Intercept Alert to all mobile patrol units in ${activeCase.district}.`,
      `Impound getaway vehicle ${activeCase.vehicle} under Section 102 CrPC upon sighting.`,
      `Place suspect ${activeCase.suspect} under 24/7 digital tower monitoring.`,
      `Coordinate with local Crime Branch team for immediate charge sheet preparation.`
    ]
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 3, // High resolution for crisp print output
        backgroundColor: pdfTheme === 'paper' ? '#ffffff' : '#09090b',
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          // Scrub modern CSS color functions that html2canvas cannot parse
          const styleEls = clonedDoc.querySelectorAll('style');
          styleEls.forEach((style) => {
            if (style.textContent) {
              style.textContent = style.textContent
                .replace(/oklch\([^)]+\)/gi, '#1e293b')
                .replace(/oklab\([^)]+\)/gi, '#1e293b')
                .replace(/light-dark\([^)]+\)/gi, '#1e293b')
                .replace(/color-mix\([^)]+\)/gi, '#1e293b');
            }
          });

          const allElements = clonedDoc.querySelectorAll('*');
          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.style && htmlEl.style.cssText) {
              if (/oklch|oklab|light-dark|color-mix/i.test(htmlEl.style.cssText)) {
                htmlEl.style.cssText = htmlEl.style.cssText
                  .replace(/oklch\([^)]+\)/gi, '#1e293b')
                  .replace(/oklab\([^)]+\)/gi, '#1e293b')
                  .replace(/light-dark\([^)]+\)/gi, '#1e293b')
                  .replace(/color-mix\([^)]+\)/gi, '#1e293b');
              }
            }
          });
        }
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;
      const marginX = 8;
      const marginY = 8;
      const contentWidth = pdfWidth - marginX * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      const pageContentHeight = pdfHeight - marginY * 2;

      let heightLeft = contentHeight;
      let position = marginY;
      let pageNum = 1;

      pdf.addImage(imgData, 'PNG', marginX, position, contentWidth, contentHeight);
      heightLeft -= pageContentHeight;

      while (heightLeft > 2) {
        pdf.addPage();
        pageNum++;
        position = marginY - (pageNum - 1) * pageContentHeight;
        pdf.addImage(imgData, 'PNG', marginX, position, contentWidth, contentHeight);
        heightLeft -= pageContentHeight;
      }

      // Add page footers
      const totalPages = pageNum;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        pdf.text(
          `Page ${i} of ${totalPages} • State Crime Records Bureau (SCRB) • Ref: ${activeCase.id}`,
          pdfWidth / 2,
          pdfHeight - 4,
          { align: 'center' }
        );
      }

      pdf.save(`SCRB_Official_Dossier_${activeCase.id}.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const isPaper = pdfTheme === 'paper';

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
      {/* Control Action Header */}
      <div className="p-5 rounded-2xl bg-[#0d0d10] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              SCRB Official Dossier Studio
              <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                GRID TEMPLATE READY
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              High-precision CSS Grid template engineered for crisp, certified PDF exporting and court submissions.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Theme Switcher */}
          <div className="flex items-center bg-[#151518] p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setPdfTheme('paper')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isPaper ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Official Paper Layout</span>
            </button>
            <button
              onClick={() => setPdfTheme('dark')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                !isPaper ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Dark Console Layout</span>
            </button>
          </div>

          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#151518] border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
          >
            {MOCK_CRIME_RECORDS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} - {r.crimeType} ({r.district})
              </option>
            ))}
          </select>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : 'Export High-Res PDF'}</span>
          </button>
        </div>
      </div>

      {/* Printable Custom-Styled Grid Layout Dossier Document */}
      <div
        ref={reportRef}
        className={`p-8 md:p-10 rounded-2xl border space-y-6 shadow-2xl font-sans relative transition-colors ${
          isPaper 
            ? 'bg-white text-slate-900 border-slate-300' 
            : 'bg-[#09090b] text-slate-100 border-slate-800'
        }`}
        style={isPaper ? { backgroundColor: '#ffffff', color: '#0f172a' } : undefined}
      >
        {/* Top Header Grid: Government Crest, Official Title, Classification Badge, Barcode */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 pb-6 border-b-2 ${
          isPaper ? 'border-slate-900' : 'border-slate-800'
        }`}>
          {/* Header Left: Emblem & Institution Title (Spans 8 cols) */}
          <div className="md:col-span-8 flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold shadow-md shrink-0 ${
              isPaper 
                ? 'bg-slate-900 text-white border-2 border-amber-500' 
                : 'bg-gradient-to-br from-indigo-600 to-cyan-600 text-white'
            }`}>
              <ShieldCheck className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded tracking-wide ${
                  isPaper ? 'bg-slate-900 text-amber-300' : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                }`}>
                  GOVERNMENT OF KARNATAKA
                </span>
                <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded uppercase">
                  CONFIDENTIAL • LAW ENFORCEMENT ONLY
                </span>
              </div>

              <h1 className={`text-xl md:text-2xl font-black tracking-tight uppercase ${
                isPaper ? 'text-slate-900' : 'text-white'
              }`}>
                STATE CRIME RECORDS BUREAU (SCRB)
              </h1>

              <p className={`text-xs font-mono font-bold uppercase tracking-widest ${
                isPaper ? 'text-indigo-900' : 'text-cyan-400'
              }`}>
                INTELLIGENT CRIME INVESTIGATION DIVISION • OFFICIAL POLICE DOSSIER
              </p>
            </div>
          </div>

          {/* Header Right: Official Barcode / Quick Verification Box (Spans 4 cols) */}
          <div className="md:col-span-4 flex flex-col justify-between items-end text-right space-y-2">
            <div className={`p-3 rounded-xl border w-full text-right font-mono text-[10px] space-y-1 ${
              isPaper ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#151518] border-slate-800 text-slate-300'
            }`}>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">DOSSIER REF:</span>
                <span className={`font-black text-xs ${isPaper ? 'text-indigo-900' : 'text-cyan-400'}`}>
                  SCRB-{activeCase.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">DATE ISSUED:</span>
                <span className="font-bold">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">CLEARANCE LEVEL:</span>
                <span className="text-red-600 font-bold uppercase">CLASS-1 RESTRICTED</span>
              </div>
            </div>

            {/* Simulated OCR Barcode Block */}
            <div className="flex items-center gap-1 font-mono text-[9px] text-slate-400">
              <Fingerprint className="w-3.5 h-3.5 text-indigo-600" />
              <span>SCRB-OCR-GRID-2026-X89112</span>
            </div>
          </div>
        </div>

        {/* Primary Case Metadata CSS Grid (4 Columns) */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-slate-500">
            <Grid className="w-3.5 h-3.5 text-indigo-600" />
            <span>CASE RECORD SPECIFICATIONS GRID</span>
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl border text-xs ${
            isPaper ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#151518] border-slate-800 text-slate-200'
          }`}>
            <div className="p-2 border-r border-slate-200/60 last:border-none">
              <span className={`block text-[10px] font-mono font-bold uppercase ${isPaper ? 'text-slate-500' : 'text-slate-400'}`}>
                FIR NUMBER
              </span>
              <span className={`font-mono font-extrabold text-sm ${isPaper ? 'text-indigo-950' : 'text-cyan-400'}`}>
                {activeCase.id}
              </span>
            </div>

            <div className="p-2 border-r border-slate-200/60 last:border-none">
              <span className={`block text-[10px] font-mono font-bold uppercase ${isPaper ? 'text-slate-500' : 'text-slate-400'}`}>
                OFFENCE IPC / BNS
              </span>
              <span className="font-bold text-slate-900">{activeCase.crimeType}</span>
            </div>

            <div className="p-2 border-r border-slate-200/60 last:border-none">
              <span className={`block text-[10px] font-mono font-bold uppercase ${isPaper ? 'text-slate-500' : 'text-slate-400'}`}>
                JURISDICTION
              </span>
              <span className="font-bold text-slate-900">{activeCase.district} ({activeCase.area})</span>
            </div>

            <div className="p-2">
              <span className={`block text-[10px] font-mono font-bold uppercase ${isPaper ? 'text-slate-500' : 'text-slate-400'}`}>
                INVESTIGATING OFFICER
              </span>
              <span className="font-bold text-slate-900">{activeCase.officer}</span>
            </div>
          </div>
        </div>

        {/* Suspect & Technical Intelligence Grid (3 Columns) */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl border text-xs ${
          isPaper ? 'bg-amber-50/70 border-amber-300 text-amber-950' : 'bg-slate-900/80 border-slate-800 text-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-900 shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase text-slate-500">PRIMARY SUSPECT</span>
              <strong className="text-sm font-extrabold text-slate-900">{activeCase.suspect}</strong>
              <span className="block text-[10px] text-red-700 font-bold">{activeCase.previousFIRCount} Prior FIR Records</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-900 shrink-0">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase text-slate-500">REGISTERED VEHICLE</span>
              <strong className="text-sm font-mono font-extrabold text-slate-900">{activeCase.vehicle}</strong>
              <span className="block text-[10px] text-slate-600 font-semibold">ANPR Camera Synced</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[10px] font-mono font-bold uppercase text-slate-500">TELECOM CDR TRACK</span>
              <strong className="text-sm font-mono font-extrabold text-slate-900">{activeCase.phoneNumber}</strong>
              <span className="block text-[10px] text-emerald-800 font-bold">Cell Tower Triangulated</span>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Intelligence & Pattern Analysis CSS Grid */}
        <div className="space-y-3">
          <div className={`flex items-center justify-between border-b pb-1.5 ${isPaper ? 'border-slate-300' : 'border-slate-800'}`}>
            <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
              isPaper ? 'text-indigo-950' : 'text-cyan-400'
            }`}>
              <BrainCircuit className="w-4.5 h-4.5 text-indigo-600" />
              1. Executive Intelligence & Pattern Recognition Analysis
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-500">SECTION 01</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Overview Box (Spans 8 cols) */}
            <div className={`md:col-span-8 p-4 rounded-xl border space-y-2 ${
              isPaper ? 'bg-white border-slate-300' : 'bg-[#151518] border-slate-800'
            }`}>
              <h4 className={`text-sm font-bold ${isPaper ? 'text-slate-900' : 'text-slate-100'}`}>
                {mockAIReport.summary.title}
              </h4>
              <p className={`text-xs leading-relaxed ${isPaper ? 'text-slate-700' : 'text-slate-300'}`}>
                {mockAIReport.summary.overview}
              </p>

              <div className="pt-2">
                <span className={`text-[10px] font-mono uppercase font-bold block mb-1.5 ${isPaper ? 'text-slate-600' : 'text-slate-400'}`}>
                  Automated Modus Operandi Indicators Identified:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {mockAIReport.summary.patternsDetected.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className={`w-3.5 h-3.5 shrink-0 ${isPaper ? 'text-emerald-700 font-bold' : 'text-amber-400'}`} />
                      <span className={`font-medium ${isPaper ? 'text-slate-800' : 'text-slate-300'}`}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Confidence Gauge Card (Spans 4 cols) */}
            <div className={`md:col-span-4 p-4 rounded-xl border flex flex-col justify-between items-center text-center ${
              isPaper ? 'bg-slate-50 border-slate-300 shadow-sm' : 'bg-[#151518] border-slate-800'
            }`}>
              <span className={`text-[10px] font-mono uppercase font-bold ${isPaper ? 'text-slate-600' : 'text-slate-400'}`}>
                CONFIDENCE SCORE
              </span>
              
              <div className="my-2 space-y-1">
                <div className={`text-4xl font-black font-mono tracking-tight ${isPaper ? 'text-indigo-950' : 'text-cyan-400'}`}>
                  {mockAIReport.confidenceScore}%
                </div>
                <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden mx-auto">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${mockAIReport.confidenceScore}%` }}></div>
                </div>
              </div>

              <span className={`text-[9px] font-mono px-3 py-1 rounded-full uppercase font-extrabold border ${
                isPaper ? 'bg-indigo-100 text-indigo-950 border-indigo-300' : 'bg-cyan-950 text-cyan-300 border-cyan-800'
              }`}>
                HIGH ANALYTICAL CERTAINTY
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Key Investigation Findings */}
        <div className="space-y-3">
          <div className={`flex items-center justify-between border-b pb-1.5 ${isPaper ? 'border-slate-300' : 'border-slate-800'}`}>
            <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
              isPaper ? 'text-indigo-950' : 'text-cyan-400'
            }`}>
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
              2. Key Investigation Findings & Forensics
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-500">SECTION 02</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {mockAIReport.keyFindings.map((kf, i) => (
              <div key={i} className={`p-3 rounded-lg border flex items-start gap-3 ${
                isPaper ? 'bg-white border-slate-300 text-slate-800' : 'bg-[#151518] border-slate-800 text-slate-200'
              }`}>
                <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${
                  isPaper ? 'bg-slate-900 text-white' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                }`}>
                  0{i + 1}
                </span>
                <span className="leading-relaxed font-semibold">{kf}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Evidentiary Material & Relevance Matrix (Custom Grid Table) */}
        <div className="space-y-3">
          <div className={`flex items-center justify-between border-b pb-1.5 ${isPaper ? 'border-slate-300' : 'border-slate-800'}`}>
            <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
              isPaper ? 'text-indigo-950' : 'text-cyan-400'
            }`}>
              <Shield className="w-4.5 h-4.5 text-indigo-600" />
              3. Evidentiary Material & Relevance Matrix
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-500">SECTION 03</span>
          </div>

          <div className={`overflow-hidden rounded-xl border ${isPaper ? 'border-slate-300' : 'border-slate-800'}`}>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`text-[10px] font-mono uppercase font-bold border-b ${
                  isPaper ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-[#151518] text-slate-400 border-slate-800'
                }`}>
                  <th className="p-3">FIR / EVIDENCE ID</th>
                  <th className="p-3">SOURCE & EVIDENCE DESCRIPTION</th>
                  <th className="p-3 text-right">EVIDENTIARY WEIGHT</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isPaper ? 'divide-slate-200 text-slate-800' : 'divide-slate-800 text-slate-300'}`}>
                {mockAIReport.evidenceUsed.map((ev, i) => (
                  <tr key={i} className={isPaper ? 'bg-white hover:bg-slate-50' : 'hover:bg-[#151518]'}>
                    <td className={`p-3 font-mono font-extrabold ${isPaper ? 'text-indigo-950' : 'text-cyan-400'}`}>{ev.firId}</td>
                    <td className="p-3 font-semibold">{ev.description}</td>
                    <td className={`p-3 text-right font-mono font-extrabold ${isPaper ? 'text-emerald-700' : 'text-emerald-400'}`}>{ev.relevance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Explainable Logic Chain */}
        <div className="space-y-3">
          <div className={`flex items-center justify-between border-b pb-1.5 ${isPaper ? 'border-slate-300' : 'border-slate-800'}`}>
            <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
              isPaper ? 'text-indigo-950' : 'text-cyan-400'
            }`}>
              <Award className="w-4.5 h-4.5 text-purple-600" />
              4. Algorithmic Logic & Predictive Reasoning
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-500">SECTION 04</span>
          </div>

          <div className={`p-4 rounded-xl border ${
            isPaper ? 'bg-slate-50 border-slate-300' : 'bg-[#151518] border-slate-800'
          }`}>
            <span className={`text-[10px] font-mono uppercase font-bold block mb-1 ${isPaper ? 'text-slate-600' : 'text-slate-400'}`}>
              Explainable Pattern Logic Chain:
            </span>
            <p className={`text-xs leading-relaxed font-medium ${isPaper ? 'text-slate-800' : 'text-slate-300'}`}>
              {mockAIReport.reasoning}
            </p>
          </div>
        </div>

        {/* Section 5: Actionable Police Directives Grid */}
        <div className="space-y-3">
          <div className={`flex items-center justify-between border-b pb-1.5 ${isPaper ? 'border-slate-300' : 'border-slate-800'}`}>
            <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
              isPaper ? 'text-indigo-950' : 'text-cyan-400'
            }`}>
              <Sparkles className="w-4.5 h-4.5 text-amber-600" />
              5. Actionable Police Directives & Intercept Orders
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-500">SECTION 05</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
            {mockAIReport.recommendations.map((rec, i) => (
              <div key={i} className={`p-3 rounded-lg border flex items-center gap-3 ${
                isPaper ? 'bg-white border-slate-300 text-slate-800' : 'bg-[#151518] border-slate-800 text-slate-200'
              }`}>
                <BadgeCheck className={`w-4 h-4 shrink-0 ${isPaper ? 'text-indigo-900' : 'text-cyan-400'}`} />
                <span className="font-semibold">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Officer Field Directives */}
        <div className="space-y-3">
          <div className={`flex items-center justify-between border-b pb-1.5 ${isPaper ? 'border-slate-300' : 'border-slate-800'}`}>
            <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
              isPaper ? 'text-indigo-950' : 'text-cyan-400'
            }`}>
              <PenTool className="w-4.5 h-4.5 text-indigo-600" />
              6. Investigating Officer Directives & Handwritten Field Notes
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-500">SECTION 06</span>
          </div>

          {permissions.canEditOfficerNotes ? (
            <textarea
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              rows={3}
              className={`w-full p-4 rounded-xl border text-xs focus:outline-none focus:border-indigo-600 leading-relaxed font-sans ${
                isPaper ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#151518] border-slate-800 text-slate-200'
              }`}
              placeholder="Add handwritten or dictated officer field notes before exporting PDF..."
            ></textarea>
          ) : (
            <div className={`p-4 rounded-xl border text-xs italic flex items-center gap-2 ${
              isPaper ? 'bg-slate-50 border-slate-300 text-slate-700' : 'bg-[#151518] border-slate-800 text-slate-300'
            }`}>
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Officer Notes are in read-only mode for role '{user.role}'. Switch role to Investigator or Officer to edit.</span>
            </div>
          )}
        </div>

        {/* Official Sign-off & Seal Grid Footer */}
        <div className={`pt-6 border-t-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-end text-xs ${
          isPaper ? 'border-slate-900' : 'border-slate-800'
        }`}>
          <div className="space-y-1">
            <span className={`block text-[10px] font-mono font-bold uppercase ${isPaper ? 'text-slate-500' : 'text-slate-400'}`}>
              OFFICER SIGN-OFF & CERTIFICATION
            </span>
            <span className={`font-black text-sm block ${isPaper ? 'text-slate-900' : 'text-slate-100'}`}>{user.name}</span>
            <span className={`text-[10px] block font-mono ${isPaper ? 'text-slate-700' : 'text-slate-400'}`}>
              Badge Number: {user.badgeNumber} • Role: {user.role}
            </span>
            <span className={`text-[10px] block font-bold ${isPaper ? 'text-slate-600' : 'text-slate-500'}`}>{user.district}</span>
          </div>

          <div className="text-right space-y-1">
            <div className={`w-48 h-12 border-b-2 border-dashed ml-auto flex items-end justify-center text-[10px] font-mono italic font-bold pb-1 ${
              isPaper ? 'border-slate-400 text-indigo-950' : 'border-slate-600 text-cyan-400'
            }`}>
              [DIGITALLY SIGNED & OFFICIALLY SEALED]
            </div>
            <span className="text-[9px] font-mono block text-slate-500">
              SCRB CHECKSUM: 0x8F9A-412C-99B1-SEC2026
            </span>
            <span className="text-[9px] text-emerald-700 font-mono font-bold block">
              OFFICIAL VERIFIED LAW ENFORCEMENT RECORD
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

