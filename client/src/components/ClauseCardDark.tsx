'use client';

import React, { useState } from 'react';
import { AnalyzedClause } from '../types';
import { ChevronDown, ChevronUp, Database, Sparkles, Scale, Info } from 'lucide-react';

interface ClauseCardDarkProps {
  clause: AnalyzedClause;
}

export const ClauseCardDark: React.FC<ClauseCardDarkProps> = ({ clause }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Border & badge styles based on risk level
  const borderStyles = {
    HIGH: 'border-l-4 border-l-[#ff5252] bg-[#1c1d23]',
    MEDIUM: 'border-l-4 border-l-[#faad14] bg-[#1c1d23]',
    LOW: 'border-l-4 border-l-[#52c41a] bg-[#1c1d23]'
  }[clause.riskLevel] || 'border-l-4 border-l-slate-600 bg-[#1c1d23]';

  const badgeStyles = {
    HIGH: 'bg-[#ff5252]/15 text-[#ff6b6b] border border-[#ff5252]/30',
    MEDIUM: 'bg-[#faad14]/15 text-[#ffc53d] border border-[#faad14]/30',
    LOW: 'bg-[#52c41a]/15 text-[#73d13d] border border-[#52c41a]/30'
  }[clause.riskLevel] || 'bg-white/10 text-white/70 border border-white/10';

  return (
    <div className={`rounded-xl border border-white/[0.06] shadow-sm transition-all duration-200 ${borderStyles}`}>
      <div className="p-5 font-mono">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-white/[0.06] text-white/80 text-xs font-bold">
              #{clause.clauseNumber}
            </span>
            {clause.sectionHeader && (
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50 bg-white/[0.04] px-2.5 py-0.5 rounded border border-white/[0.04]">
                {clause.sectionHeader}
              </span>
            )}
            <span className="text-xs font-medium text-white/40">
              {clause.riskCategory}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${badgeStyles}`}>
              {clause.riskLevel} Risk
            </span>
            {clause.latencyMs && (
              <span className="text-[10px] text-white/30">
                {clause.latencyMs}ms
              </span>
            )}
          </div>
        </div>

        {/* Clause text */}
        <div className="p-3.5 bg-[#121316] rounded-lg border border-white/[0.04] mb-3 text-white/90 text-xs sm:text-sm leading-relaxed font-sans">
          "{clause.clauseText}"
        </div>

        {/* AI Grounded Justification */}
        <div className="flex items-start space-x-2.5 text-xs bg-[#24262d]/80 p-3 rounded-lg border border-white/[0.05] text-white/80 font-sans">
          <Sparkles className="w-4 h-4 text-[#82a8d8] flex-shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <span className="font-bold text-white font-mono text-[11px] uppercase tracking-wider block mb-0.5">
              Auditor Assessment:
            </span>
            <span>{clause.reason}</span>
          </div>
        </div>

        {/* Toggle RAG Inspection Drawer */}
        <div className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1.5 text-xs font-medium text-[#82a8d8] hover:text-white transition-colors"
          >
            <Database className="w-3.5 h-3.5" />
            <span>
              {isExpanded ? 'Hide' : 'Inspect'} Retrieved Guidelines (K={clause.retrievedRules?.length || 3})
            </span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <span className="text-[10px] text-white/30 tracking-wider">
            CHROMADB TOP-3 DENSE RETRIEVAL
          </span>
        </div>

        {/* Expanded Top-K RAG Context */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between text-[11px] text-white/40 uppercase tracking-wider font-semibold">
              <span className="flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5 text-white/40" />
                <span>Playbook Guidelines Injected into Qwen2.5-7B</span>
              </span>
              <span>Cosine Similarity</span>
            </div>

            {clause.retrievedRules && clause.retrievedRules.length > 0 ? (
              clause.retrievedRules.map((rule, idx) => (
                <div key={idx} className="p-3 bg-[#121316] rounded-lg border border-white/[0.04] text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold bg-white/10 text-white px-1.5 py-0.5 rounded text-[10px]">
                        [{rule.id}]
                      </span>
                      <span className="font-bold text-white/90">{rule.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase ${
                        rule.riskTier === 'HIGH' ? 'bg-[#ff5252]/20 text-[#ff6b6b]' :
                        rule.riskTier === 'MEDIUM' ? 'bg-[#faad14]/20 text-[#ffc53d]' :
                        'bg-[#52c41a]/20 text-[#73d13d]'
                      }`}>
                        {rule.riskTier}
                      </span>
                    </div>
                    <span className="text-[#82a8d8] font-bold text-[11px]">
                      {(rule.similarity * 100).toFixed(1)}% match
                    </span>
                  </div>
                  <p className="text-white/60 text-xs font-sans leading-relaxed">{rule.ruleText}</p>
                  {rule.example && (
                    <div className="flex items-start space-x-1.5 text-white/40 text-[11px] bg-white/[0.02] p-2 rounded border border-white/[0.03] font-sans">
                      <Info className="w-3.5 h-3.5 flex-shrink-0 text-white/30 mt-0.5" />
                      <span><strong>Prototype:</strong> "{rule.example}"</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-white/30 italic">No retrieved rules available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
