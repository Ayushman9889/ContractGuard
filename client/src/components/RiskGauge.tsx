'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, AlertOctagon, Clock, Layers } from 'lucide-react';

interface RiskGaugeProps {
  score: number; // 0 to 100
  highCount: number;
  medCount: number;
  lowCount: number;
  totalClauses: number;
  latencyMs: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  highCount,
  medCount,
  lowCount,
  totalClauses,
  latencyMs
}) => {
  // Determine color and status verdict
  let statusText = 'Low Risk';
  let badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
  let ringColor = 'text-emerald-500';

  if (score >= 60 || highCount >= 2) {
    statusText = 'Critical Risk Detected';
    badgeColor = 'text-red-700 bg-red-50 border-red-300';
    ringColor = 'text-red-500';
  } else if (score >= 35 || medCount >= 2) {
    statusText = 'Moderate Risk';
    badgeColor = 'text-amber-700 bg-amber-50 border-amber-300';
    ringColor = 'text-amber-500';
  }

  // Circular gauge circumference
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Overall Gauge */}
        <div className="flex items-center space-x-6">
          <div className="relative flex items-center justify-center">
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className={`${ringColor} transition-all duration-1000 ease-out`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold text-slate-800">{score}</span>
              <span className="text-xs text-slate-400 block -mt-1">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeColor}`}>
                {statusText}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Institutional Risk Index</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-0.5">
              Audited against 142 WorldCC corporate playbook standards via ChromaDB Top-3 RAG retrieval.
            </p>
          </div>
        </div>

        {/* Right: Breakdown Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
          <div className="bg-red-50/70 border border-red-200/80 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-1 text-red-600 mb-1">
              <AlertOctagon className="w-4 h-4" />
              <span className="text-xs font-semibold">High Risk</span>
            </div>
            <div className="text-2xl font-black text-red-700">{highCount}</div>
            <div className="text-[11px] text-red-600/80 font-medium">Violations</div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-1 text-amber-600 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-semibold">Medium Risk</span>
            </div>
            <div className="text-2xl font-black text-amber-700">{medCount}</div>
            <div className="text-[11px] text-amber-600/80 font-medium">Asymmetric</div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-1 text-emerald-600 mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-semibold">Low Risk</span>
            </div>
            <div className="text-2xl font-black text-emerald-700">{lowCount}</div>
            <div className="text-[11px] text-emerald-600/80 font-medium">Standard</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center space-x-1 text-slate-600 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-semibold">Clauses</span>
            </div>
            <div className="text-2xl font-black text-slate-800">{totalClauses}</div>
            <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-500 font-medium mt-0.5">
              <Clock className="w-3 h-3" />
              <span>{(latencyMs / 1000).toFixed(1)}s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
