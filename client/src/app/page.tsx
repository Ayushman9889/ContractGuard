'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TopTickerNav } from '../components/TopTickerNav';
import { ContractAnalyticsDashboard } from '../components/BentoAnalyticsGrid';
import { ClauseCardDark } from '../components/ClauseCardDark';
import { PlaybookView } from '../components/PlaybookView';
import { AuditView } from '../components/AuditView';
import { AnalysisResponse, RiskLevel } from '../types';
import {
  UploadCloud,
  FileText,
  Search,
  Download,
  Printer,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  FileCheck2,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'analyze' | 'playbook' | 'audit'>('analyze');
  const [serverOnline, setServerOnline] = useState<boolean>(false);

  // Upload & Analysis State
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const [isPasting, setIsPasting] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Result state
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  // Filters
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Check backend health
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const res = await axios.get('/api/health');
      if (res.data?.status === 'ONLINE') {
        setServerOnline(true);
      }
    } catch {
      setServerOnline(false);
    }
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setPastedText('');
      setIsPasting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setPastedText('');
      setIsPasting(false);
    }
  };

  // Sample contract loader
  const handleSelectSample = (sampleType: string) => {
    let sampleContent = '';
    let fileName = 'CUAD_NDA_Sample.txt';

    if (sampleType.includes('NDA')) {
      fileName = 'CUAD_NDA_Sample.txt';
      sampleContent = `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

SECTION 1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" refers to proprietary technical data, trade secrets, software code, customer lists, or financial data disclosed by either party.

SECTION 2. EXCLUSIONS FROM CONFIDENTIALITY
Confidential Information does not include information that is publicly known through no breach, was already in rightful possession, or is required by court order.

SECTION 3. OBLIGATIONS OF NON-DISCLOSURE
Recipient shall maintain all disclosed information strictly confidential in perpetuity without time limitation.

SECTION 4. INDEMNIFICATION AND LIABILITIES
Supplier shall indemnify and hold Customer harmless against any and all claims, damages, liabilities, and losses whatsoever without monetary limitation arising out of any breach of confidentiality.

SECTION 5. GOVERNING LAW AND JURISDICTION
This Agreement shall be governed by Delaware law with exclusive jurisdiction in Wilmington, Delaware.

SECTION 6. TERMINATION
Either party may terminate this Agreement upon thirty (30) days' advance written notice with pro-rata refund of unearned fees.`;
    } else if (sampleType.includes('MSA')) {
      fileName = 'Master_Services_Agreement_Sample.txt';
      sampleContent = `MASTER SERVICES AGREEMENT (MSA)

SECTION 1. SCOPE OF SERVICES
Provider will perform enterprise software integration and managed database services as specified in Statements of Work executed hereunder.

SECTION 2. FEES AND PAYMENT TERMS
Customer shall pay undisputed invoices within thirty (30) days from receipt of a valid itemized invoice.

SECTION 3. INTELLECTUAL PROPERTY RIGHTS
Each party retains exclusive ownership of its pre-existing intellectual property, proprietary tools, and standard software.

SECTION 4. LIMITATION OF LIABILITY
Neither party's aggregate liability under this Agreement shall be subject to any monetary cap or threshold. Provider shall remain liable for all lost business revenues and indirect damages.

SECTION 5. ATTORNEY FEE SHIFTING
If Customer prevails in any litigation or arbitration under this Agreement, Vendor shall pay Customer's full attorney fees and forensic costs.

SECTION 6. TERMINATION FOR CAUSE
Either party may terminate this Agreement upon written notice if the other party fails to cure a material breach within thirty (30) days.`;
    } else {
      fileName = 'Software_License_Agreement_Sample.txt';
      sampleContent = `ENTERPRISE SOFTWARE LICENSE AGREEMENT

SECTION 1. GRANT OF LICENSE
Licensor grants Licensee a non-exclusive, non-transferable license to access and use the CloudScale Enterprise Platform.

SECTION 2. BACKGROUND INTELLECTUAL PROPERTY
All intellectual property developed, utilized, or incorporated by Consultant shall become the sole property of Client.

SECTION 3. SERVICE LEVEL GUARANTEE AND CREDITS
Supplier guarantees 100% uptime of third-party cloud infrastructure and assumes unlimited liability for outages.

SECTION 4. AUDIT RIGHTS
Buyer may inspect and audit Supplier's entire corporate facilities, books, and code repositories at any hour without notice.

SECTION 5. TERMINATION UPON CONVENIENCE
Mutual termination for convenience permitted upon at least 30 days' advance written notice with pro-rata refund of unearned fees.`;
    }

    setFile(null);
    setPastedText(sampleContent);
    setIsPasting(true);
    executeAnalysis(null, sampleContent, fileName);
  };

  // Execute Analysis Pipeline
  const executeAnalysis = async (
    targetFile: File | null = file,
    targetText: string = pastedText,
    fileNameOverride?: string
  ) => {
    if (!targetFile && !targetText.trim()) {
      setError('Please select a contract file or paste contract text to audit.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);
      setAnalysisStatus('Parsing document content...');

      const formData = new FormData();
      if (targetFile) {
        formData.append('document', targetFile);
      } else {
        formData.append('text', targetText);
        formData.append('fileName', fileNameOverride || 'contract-draft.txt');
      }

      setAnalysisStatus('Segmenting clauses (regex boundary rules)...');

      const res = await axios.post('/api/documents/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setAnalysisStatus('Evaluating guidelines via local Qwen2.5-7B...');
      setAnalysisResult(res.data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStatus('');
    }
  };

  // Reset to run a new audit
  const handleResetAudit = () => {
    setAnalysisResult(null);
    setFile(null);
    setPastedText('');
    setIsPasting(false);
    setError(null);
  };

  // Export JSON
  const handleExportJson = () => {
    if (!analysisResult) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(analysisResult, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${analysisResult.fileName}-audit-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  // Filtered clauses
  const filteredClauses = analysisResult?.clauses.filter(clause => {
    const matchesRisk = selectedRiskFilter === 'ALL' || clause.riskLevel === selectedRiskFilter;
    const matchesCategory =
      selectedCategoryFilter === 'ALL' || clause.riskCategory === selectedCategoryFilter;
    const matchesSearch =
      searchQuery === '' ||
      clause.clauseText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clause.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (clause.sectionHeader && clause.sectionHeader.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesRisk && matchesCategory && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-[#0f1013] text-[#e1e4ea] flex flex-col font-mono selection:bg-[#3c5270] selection:text-white">
      {/* Top Ticker Navbar */}
      <TopTickerNav activeTab={activeTab} setActiveTab={setActiveTab} serverOnline={serverOnline} />

      {/* Main Workspace Canvas */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* TAB 1: CONTRACT REVIEW & ANALYTICS */}
        {activeTab === 'analyze' && (
          <div className="space-y-8">
            {/* ======================================================== */}
            {/* VIEW A: CENTERED DOCUMENT UPLOAD (INITIAL USP VIEW)       */}
            {/* ======================================================== */}
            {!analysisResult && (
              <div className="max-w-4xl mx-auto space-y-6 pt-4 pb-12">
                {/* Hero Headline */}
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center space-x-2 bg-white/[0.04] border border-white/[0.08] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#82a8d8]">
                    <Sparkles className="w-3.5 h-3.5 text-[#82a8d8]" />
                    <span>ON-PREMISE LEGAL CONTRACT RISK AUDITOR</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans leading-tight">
                    CONTRACT RISK SCREENING
                  </h1>
                  <p className="text-xs sm:text-sm text-white/50 max-w-2xl mx-auto leading-relaxed font-sans">
                    Upload transactional agreements (PDF, DOCX, TXT, OCR) to parse clauses, retrieve relevant risk guidelines from ChromaDB, and generate auditable JSON compliance reviews via local Qwen2.5-7B.
                  </p>
                </div>

                {/* Central Ingestion Card */}
                <div className="bg-[#18191e] rounded-3xl border border-white/[0.08] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#3c5270] flex items-center justify-center text-white">
                        <UploadCloud className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                          DOCUMENT INGESTION
                        </h3>
                        <p className="text-[10px] text-white/40">Select or drop agreement to audit</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsPasting(!isPasting)}
                      className="text-xs text-[#82a8d8] hover:text-white transition-colors underline underline-offset-4"
                    >
                      {isPasting ? 'Switch to File Uploader' : 'Or Paste Raw Text'}
                    </button>
                  </div>

                  {!isPasting ? (
                    <div
                      onDragOver={e => e.preventDefault()}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-white/10 hover:border-[#3c5270] rounded-2xl p-10 sm:p-14 text-center bg-[#121316] hover:bg-[#15171e] transition-all cursor-pointer group"
                      onClick={() => document.getElementById('contract-upload-input')?.click()}
                    >
                      <input
                        id="contract-upload-input"
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.doc,.txt,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col items-center">
                        <div className="p-4 bg-white/[0.03] group-hover:bg-[#3c5270]/20 text-[#82a8d8] rounded-2xl mb-4 border border-white/[0.06] transition-colors">
                          <UploadCloud className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-bold text-white tracking-wider uppercase font-sans">
                          {file ? file.name : 'DRAG AND DROP CONTRACT HERE, OR BROWSE'}
                        </p>
                        <p className="text-xs text-white/40 mt-1.5 font-sans">
                          Accepts PDF, DOCX, Plain Text, or Scanned Images (Up to 25MB)
                        </p>
                        {file && (
                          <span className="mt-3 text-xs font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1 rounded-full">
                            {(file.size / 1024).toFixed(1)} KB Ready for Analysis
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        rows={8}
                        value={pastedText}
                        onChange={e => setPastedText(e.target.value)}
                        placeholder="PASTE CONTRACT CLAUSES HERE FOR IMMEDIATE RAG RISK EVALUATION..."
                        className="w-full p-4 text-xs font-mono rounded-xl border border-white/[0.08] bg-[#121316] text-white focus:outline-none focus:ring-1 focus:ring-[#3c5270]"
                      />
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 p-3.5 bg-[#ff5252]/10 border border-[#ff5252]/30 rounded-xl text-xs text-[#ff6b6b] flex items-center space-x-2 font-mono">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Primary Run Audit Action */}
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-white/[0.06]">
                    <div className="flex items-center space-x-2 text-[11px] text-white/40">
                      <Zap className="w-3.5 h-3.5 text-[#ffc53d]" />
                      <span>ZERO DATA LEAKAGE: 100% LOCAL INFERENCE VIA OLLAMA</span>
                    </div>

                    <button
                      disabled={isAnalyzing || (!file && !pastedText.trim())}
                      onClick={() => executeAnalysis()}
                      className="px-8 py-3.5 rounded-xl bg-[#3c5270] hover:bg-[#4d678c] text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 flex items-center justify-center space-x-2 shadow-lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>{analysisStatus || 'AUDITING CONTRACT...'}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>EXECUTE CONTRACT RISK AUDIT</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Pre-Loaded CUAD Benchmark Samples */}
                <div className="bg-[#18191e]/60 rounded-2xl border border-white/[0.05] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase tracking-wider font-bold text-white/60">
                      OR TEST INSTANTLY WITH CUAD BENCHMARK CONTRACTS
                    </span>
                    <span className="text-[10px] text-white/30">From 500-clause evaluation corpus</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        title: 'CUAD Non-Disclosure Agreement',
                        type: 'NDA',
                        desc: 'Uncapped indemnity & perpetual confidentiality clauses.'
                      },
                      {
                        title: 'Master Services Agreement',
                        type: 'MSA',
                        desc: 'Unilateral attorney fee shifting & unlimited consequential loss.'
                      },
                      {
                        title: 'Cloud Software License',
                        type: 'SAAS',
                        desc: '100% uptime SLA & unrestricted corporate audit rights.'
                      }
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        disabled={isAnalyzing}
                        onClick={() => handleSelectSample(sample.type)}
                        className="p-3.5 rounded-xl bg-[#121316] hover:bg-[#3c5270] transition-colors border border-white/[0.05] text-left group disabled:opacity-50"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white group-hover:text-white font-sans">
                            {sample.type}
                          </span>
                          <span className="text-[9px] bg-white/10 text-white/70 px-1.5 py-0.2 rounded font-mono">
                            CUAD
                          </span>
                        </div>
                        <div className="text-[11px] font-semibold text-white/80 mb-1">{sample.title}</div>
                        <p className="text-[10px] text-white/40 group-hover:text-white/80 line-clamp-2 leading-relaxed font-sans">
                          {sample.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* VIEW B: POST-ANALYSIS REFINED CONTRACT ANALYTICS BOARD    */}
            {/* ======================================================== */}
            {analysisResult && (
              <div className="space-y-6">
                {/* Header Actions Strip */}
                <div className="bg-[#18191e] rounded-xl border border-white/[0.06] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-sm font-sans">{analysisResult.fileName}</span>
                        <span className="text-[10px] bg-white/10 text-white/70 px-2 py-0.2 rounded font-mono">
                          AUDITED
                        </span>
                      </div>
                      <div className="text-[10px] text-white/40 mt-0.5">
                        {analysisResult.totalClauses} Clauses Segmented • {(analysisResult.totalLatencyMs / 1000).toFixed(1)}s Total Latency
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleResetAudit}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-[#121316] hover:bg-white/[0.05] text-white text-xs font-bold uppercase transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#82a8d8]" />
                      <span>Audit Another Contract</span>
                    </button>
                    <button
                      onClick={handleExportJson}
                      className="p-2 rounded-lg border border-white/[0.08] bg-[#121316] hover:bg-white/[0.05] text-white/70 hover:text-white"
                      title="Export JSON"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handlePrint}
                      className="p-2 rounded-lg border border-white/[0.08] bg-[#121316] hover:bg-white/[0.05] text-white/70 hover:text-white"
                      title="Print Report"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Refined Legal Contract Analytics Dashboard */}
                <ContractAnalyticsDashboard
                  analysis={analysisResult}
                  onOpenPlaybook={() => setActiveTab('playbook')}
                />

                {/* Clause Review & Inspection Feed */}
                <div className="space-y-4 pt-2">
                  {/* Filter Toolbar */}
                  <div className="bg-[#18191e] rounded-xl border border-white/[0.06] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    {/* Risk Tier Filters */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => setSelectedRiskFilter('ALL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors uppercase ${
                          selectedRiskFilter === 'ALL'
                            ? 'bg-white text-black'
                            : 'bg-white/[0.05] text-white/70 hover:bg-white/10'
                        }`}
                      >
                        ALL ({analysisResult.totalClauses})
                      </button>
                      <button
                        onClick={() => setSelectedRiskFilter('HIGH')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors uppercase ${
                          selectedRiskFilter === 'HIGH'
                            ? 'bg-[#ff5252] text-white'
                            : 'bg-[#ff5252]/10 text-[#ff6b6b] border border-[#ff5252]/20 hover:bg-[#ff5252]/20'
                        }`}
                      >
                        HIGH ({analysisResult.highRiskCount})
                      </button>
                      <button
                        onClick={() => setSelectedRiskFilter('MEDIUM')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors uppercase ${
                          selectedRiskFilter === 'MEDIUM'
                            ? 'bg-[#faad14] text-black'
                            : 'bg-[#faad14]/10 text-[#ffc53d] border border-[#faad14]/20 hover:bg-[#faad14]/20'
                        }`}
                      >
                        MEDIUM ({analysisResult.medRiskCount})
                      </button>
                      <button
                        onClick={() => setSelectedRiskFilter('LOW')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors uppercase ${
                          selectedRiskFilter === 'LOW'
                            ? 'bg-[#52c41a] text-black'
                            : 'bg-[#52c41a]/10 text-[#73d13d] border border-[#52c41a]/20 hover:bg-[#52c41a]/20'
                        }`}
                      >
                        LOW ({analysisResult.lowRiskCount})
                      </button>
                    </div>

                    {/* Search & Category Filter */}
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-white/30" />
                        <input
                          type="text"
                          placeholder="SEARCH CLAUSE TEXT..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-white/[0.08] bg-[#121316] text-white focus:outline-none focus:ring-1 focus:ring-[#3c5270] w-40 sm:w-52 uppercase"
                        />
                      </div>

                      <select
                        value={selectedCategoryFilter}
                        onChange={e => setSelectedCategoryFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-white/[0.08] bg-[#121316] text-white focus:outline-none focus:ring-1 focus:ring-[#3c5270]"
                      >
                        <option value="ALL">ALL CATEGORIES</option>
                        <option value="INDEMNIFICATION">INDEMNIFICATION</option>
                        <option value="LIABILITY">LIABILITY</option>
                        <option value="TERMINATION">TERMINATION</option>
                        <option value="CONFIDENTIALITY">CONFIDENTIALITY</option>
                        <option value="IP">INTELLECTUAL PROP.</option>
                        <option value="OTHER">OTHER</option>
                      </select>
                    </div>
                  </div>

                  {/* Clause Cards Feed */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-white/40 px-1 uppercase tracking-wider">
                      <span>
                        SHOWING {filteredClauses.length} OF {analysisResult.totalClauses} SEGMENTED PROVISIONS
                      </span>
                      <span>FILE: {analysisResult.fileName}</span>
                    </div>

                    {filteredClauses.map((clause, idx) => (
                      <ClauseCardDark key={idx} clause={clause} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PLAYBOOK KNOWLEDGE BASE */}
        {activeTab === 'playbook' && <PlaybookView />}

        {/* TAB 3: AUDIT TRAIL */}
        {activeTab === 'audit' && <AuditView />}
      </main>
    </div>
  );
}
