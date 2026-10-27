'use client';

import React from 'react';
import { ArrowUpRight, ShieldAlert, CheckCircle2, AlertTriangle, Layers, Clock, Database, Sparkles } from 'lucide-react';
import { AnalysisResponse } from '../types';

interface ContractAnalyticsDashboardProps {
  analysis: AnalysisResponse;
  onOpenPlaybook: () => void;
}

export const ContractAnalyticsDashboard: React.FC<ContractAnalyticsDashboardProps> = ({
  analysis,
  onOpenPlaybook
}) => {
  const riskScore = analysis.overallRiskScore;
  const highCount = analysis.highRiskCount;
  const medCount = analysis.medRiskCount;
  const lowCount = analysis.lowRiskCount;
  const totalClauses = analysis.totalClauses;
  const avgLatency = Math.round(analysis.totalLatencyMs / Math.max(1, totalClauses));

  // Count risk by category from actual clauses
  const categoryCounts: Record<string, number> = {
    INDEMNIFICATION: 0,
    LIABILITY: 0,
    TERMINATION: 0,
    CONFIDENTIALITY: 0,
    IP: 0,
    OTHER: 0
  };

  analysis.clauses.forEach(c => {
    const cat = c.riskCategory || 'OTHER';
    if (categoryCounts[cat] !== undefined) {
      categoryCounts[cat]++;
    } else {
      categoryCounts.OTHER++;
    }
  });

  // Calculate highest category for bar chart scaling
  const maxCategoryCount = Math.max(1, ...Object.values(categoryCounts));

  // Determine risk level status
  let statusVerdict = 'LOW RISK';
  let statusColor = 'text-emerald-400';
  if (riskScore >= 60 || highCount >= 2) {
    statusVerdict = 'CRITICAL RISK';
    statusColor = 'text-[#ff5252]';
  } else if (riskScore >= 35 || medCount >= 2) {
    statusVerdict = 'MODERATE RISK';
    statusColor = 'text-[#ffc53d]';
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3.5 text-white font-mono select-none">
      {/* ======================================================== */}
      {/* 1. OVERALL INSTITUTIONAL RISK SCORE (Steel Blue Accent Card) */}
      {/* ======================================================== */}
      <div className="lg:col-span-3 bg-[#3c5270] rounded-2xl p-5 flex flex-col justify-between h-[150px] shadow-sm relative overflow-hidden border border-white/10">
        <div className="flex items-center justify-between text-xs text-white/80 tracking-wider uppercase font-semibold">
          <span>RISK INDEX</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-black/20 ${statusColor}`}>
            {statusVerdict}
          </span>
        </div>
        <div className="flex items-baseline justify-between mt-auto">
          <span className="text-5xl font-black tracking-tight text-white font-sans">
            {riskScore.toFixed(0)}
          </span>
          <span className="text-xs text-white/70 tracking-wider">/ 100 MAX</span>
        </div>
        <div className="text-[10px] text-white/60 font-sans tracking-wide">
          Calculated institutional risk exposure
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. HIGH RISK VIOLATIONS (Critical Red Card)              */}
      {/* ======================================================== */}
      <div className="lg:col-span-3 bg-[#18191e] rounded-2xl p-5 flex flex-col justify-between h-[150px] shadow-sm border border-white/[0.06]">
        <div className="flex items-center justify-between text-xs text-white/60 tracking-wider uppercase font-semibold">
          <div className="flex items-center space-x-1.5 text-[#ff5252]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>HIGH RISK VIOLATIONS</span>
          </div>
          <span>:</span>
        </div>
        <div className="flex items-baseline justify-between mt-auto">
          <span className="text-5xl font-black tracking-tight text-[#ff5252] font-sans">
            {highCount}
          </span>
          <span className="text-xs text-white/40 tracking-wider">
            {((highCount / Math.max(1, totalClauses)) * 100).toFixed(0)}% OF TOTAL
          </span>
        </div>
        <div className="text-[10px] text-white/40 font-sans">
          Violates non-negotiable playbook thresholds
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MODERATE & LOW CLAUSES (Distribution Summary)         */}
      {/* ======================================================== */}
      <div className="lg:col-span-3 bg-[#18191e] rounded-2xl p-5 flex flex-col justify-between h-[150px] shadow-sm border border-white/[0.06]">
        <div className="flex items-center justify-between text-xs text-white/60 tracking-wider uppercase font-semibold">
          <span>MEDIUM & LOW RISK</span>
          <span>:</span>
        </div>
        <div className="flex items-baseline justify-between mt-auto">
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-black text-[#ffc53d] font-sans">{medCount}</span>
            <span className="text-xs text-white/40 uppercase">Med</span>
            <span className="text-3xl font-black text-[#52c41a] font-sans">{lowCount}</span>
            <span className="text-xs text-white/40 uppercase">Low</span>
          </div>
          <span className="text-xs text-white/40 tracking-wider">{totalClauses} TOTAL</span>
        </div>
        <div className="text-[10px] text-white/40 font-sans">
          Asymmetric redlines & standard covenants
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. TOTAL AUDITED CLAUSES & SPEED                         */}
      {/* ======================================================== */}
      <div className="lg:col-span-3 bg-[#18191e] rounded-2xl p-5 flex flex-col justify-between h-[150px] shadow-sm border border-white/[0.06]">
        <div className="flex items-center justify-between text-xs text-white/60 tracking-wider uppercase font-semibold">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-white/40" />
            <span>INFERENCE LATENCY</span>
          </div>
          <span>:</span>
        </div>
        <div className="flex items-baseline justify-between mt-auto">
          <span className="text-5xl font-black tracking-tight text-white font-sans">
            {avgLatency}
          </span>
          <span className="text-xs text-white/40 tracking-wider">MS / CLAUSE</span>
        </div>
        <div className="text-[10px] text-white/40 font-sans">
          Total analysis time: {(analysis.totalLatencyMs / 1000).toFixed(1)}s (Qwen2.5-7B)
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. CLAUSE RISK DISTRIBUTION BY CATEGORY (Bar Chart Card) */}
      {/* ======================================================== */}
      <div className="lg:col-span-8 bg-[#18191e] rounded-2xl p-6 shadow-sm border border-white/[0.06] flex flex-col justify-between min-h-[220px]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/60 tracking-wider uppercase font-semibold">
            CLAUSE RISK DISTRIBUTION BY CATEGORY
          </span>
          <span className="text-[10px] text-white/40">
            {totalClauses} PROVISIONS AUDITED
          </span>
        </div>

        {/* Real Dynamic Category Bar Chart */}
        <div className="grid grid-cols-6 gap-3 items-end h-32 pt-4 px-2">
          {[
            { key: 'INDEMNIFICATION', label: 'INDEMNITY', count: categoryCounts.INDEMNIFICATION },
            { key: 'LIABILITY', label: 'LIABILITY', count: categoryCounts.LIABILITY },
            { key: 'TERMINATION', label: 'TERMINATION', count: categoryCounts.TERMINATION },
            { key: 'CONFIDENTIALITY', label: 'CONFID.', count: categoryCounts.CONFIDENTIALITY },
            { key: 'IP', label: 'IP RIGHTS', count: categoryCounts.IP },
            { key: 'OTHER', label: 'OTHER', count: categoryCounts.OTHER },
          ].map((item, idx) => {
            const heightPercent = Math.max(12, Math.round((item.count / maxCategoryCount) * 100));
            const isDominant = item.count === maxCategoryCount && item.count > 0;

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end">
                <span className="text-[11px] font-bold text-white mb-1.5 font-sans">
                  {item.count}
                </span>
                <div
                  className={`w-full max-w-[48px] rounded-t-sm transition-all duration-500 ${
                    isDominant ? 'bg-[#3c5270]' : 'bg-[#2a2c35] hover:bg-[#343742]'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                ></div>
                <span className="text-[9px] text-white/40 uppercase tracking-wider mt-2 font-mono truncate max-w-full text-center">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. WORLDCC RISK PLAYBOOK BANNER (Stone Khaki Card)       */}
      {/* ======================================================== */}
      <div
        onClick={onOpenPlaybook}
        className="lg:col-span-4 bg-[#b5b29c] hover:bg-[#c2bfa7] transition-all rounded-2xl p-6 shadow-sm flex flex-col justify-between cursor-pointer text-[#18191e] select-none group min-h-[220px]"
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#18191e]/10 px-2 py-0.5 rounded">
              KNOWLEDGE BASE
            </span>
            <h4 className="text-2xl font-black uppercase tracking-tight font-sans mt-2 leading-tight">
              WORLDCC RISK PLAYBOOK
            </h4>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#18191e]/15 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-4 h-4 text-[#18191e]" />
          </div>
        </div>

        <div className="pt-4 border-t border-[#18191e]/10">
          <p className="text-xs text-[#18191e]/80 font-sans leading-relaxed">
            All clauses evaluated against 142 institutional guidelines indexed in ChromaDB vector space.
          </p>
          <div className="flex items-center justify-between text-[11px] font-bold tracking-wider mt-3">
            <span>EXPLORE 142 RULES</span>
            <span>TOP-K = 3 RAG</span>
          </div>
        </div>
      </div>
    </div>
  );
};
