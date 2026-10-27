'use client';

import React, { useState } from 'react';
import { AnalyzedClause } from '../types';
import { ChevronDown, ChevronUp, Database, Sparkles, Scale, Info } from 'lucide-react';

interface ClauseCardProps {
  clause: AnalyzedClause;
}

export const ClauseCard: React.FC<ClauseCardProps> = ({ clause }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Border & badge styles based on risk level
  const borderStyles = {
    HIGH: 'border-l-4 border-l-red-500 border-red-200 bg-red-50/20',
    MEDIUM: 'border-l-4 border-l-amber-500 border-amber-200 bg-amber-50/20',
    LOW: 'border-l-4 border-l-emerald-500 border-emerald-200 bg-emerald-50/20'
  }[clause.riskLevel] || 'border-slate-200';

  const badgeStyles = {
    HIGH: 'bg-red-100 text-red-800 border-red-200',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-200',
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  }[clause.riskLevel] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <div className={`rounded-xl border shadow-sm transition-all duration-200 bg-white ${borderStyles}`}>
      <div className="p-5">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-mono">
              #{clause.clauseNumber}
            </span>
            {clause.sectionHeader && (
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                {clause.sectionHeader}
              </span>
            )}
            <span className="text-xs font-medium text-slate-500">
              {clause.riskCategory}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border tracking-wide uppercase ${badgeStyles}`}>
              {clause.riskLevel} Risk
            </span>
            {clause.latencyMs && (
              <span className="text-[11px] text-slate-400 font-mono">
                {clause.latencyMs}ms
              </span>
            )}
          </div>
        </div>

        {/* Clause text */}
        <div className="p-3.5 bg-slate-50/90 rounded-lg border border-slate-200/80 mb-3 text-slate-800 text-sm leading-relaxed font-serif">
          "{clause.clauseText}"
        </div>

        {/* AI Grounded Justification */}
        <div className="flex items-start space-x-2 text-xs bg-slate-100/70 p-3 rounded-lg border border-slate-200 text-slate-700">
          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold text-slate-900">Auditor Assessment: </span>
            <span>{clause.reason}</span>
          </div>
        </div>

        {/* Toggle RAG Inspection Drawer */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>
              {isExpanded ? 'Hide' : 'Inspect'} Retrieved Guidelines (K={clause.retrievedRules?.length || 3})
            </span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <span className="text-[11px] text-slate-400">
            ChromaDB Dense Retrieval
          </span>
        </div>

        {/* Expanded Top-K RAG Context */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center space-x-1">
                <Scale className="w-3.5 h-3.5 text-slate-400" />
                <span>Top-K Relevant Playbook Rules Injected into Qwen2.5-7B Prompt</span>
              </span>
              <span>Cosine Similarity (sim(c, r))</span>
            </div>

            {clause.retrievedRules && clause.retrievedRules.length > 0 ? (
              clause.retrievedRules.map((rule, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 text-xs shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                        [{rule.id}]
                      </span>
                      <span className="font-bold text-slate-800">{rule.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        rule.riskTier === 'HIGH' ? 'bg-red-100 text-red-700' :
                        rule.riskTier === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {rule.riskTier}
                      </span>
                    </div>
                    <span className="font-mono text-blue-600 font-semibold text-[11px]">
                      {(rule.similarity * 100).toFixed(1)}% match
                    </span>
                  </div>
                  <p className="text-slate-600 leading-normal mb-1">{rule.ruleText}</p>
                  {rule.example && (
                    <div className="flex items-start space-x-1.5 text-slate-500 text-[11px] bg-slate-50 p-2 rounded border border-slate-100">
                      <Info className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 mt-0.5" />
                      <span><strong>Prototype:</strong> "{rule.example}"</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No retrieved rules available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
