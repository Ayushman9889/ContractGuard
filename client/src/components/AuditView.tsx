'use client';

import React, { useState, useEffect } from 'react';
import { History, Award } from 'lucide-react';
import axios from 'axios';

export const AuditView: React.FC = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/documents');
      setContracts(res.data || []);
    } catch (e) {
      console.error('Failed to load contract history:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-mono text-white">
      {/* Research Paper Benchmark Card */}
      <div className="bg-[#18191e] border border-white/[0.06] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-[#82a8d8] mb-2">
          <Award className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">
            CUAD Evaluation Benchmark (500-Clause Corpus)
          </span>
        </div>
        <h2 className="text-xl font-bold uppercase tracking-tight text-white font-sans">
          ContractGuard RAG vs Baseline Results
        </h2>
        <p className="text-xs text-white/50 mt-1 max-w-3xl leading-relaxed font-sans">
          Empirical comparison across the four experimental conditions benchmarked in the research paper. Dense RAG (ChromaDB + Qwen2.5-7B) achieves 81.6% accuracy and 83.1% High-risk recall while curbing hallucinations to 7.8%.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6">
          <div className="bg-[#121316] rounded-xl p-4 border border-white/[0.04]">
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Accuracy</div>
            <div className="text-3xl font-extrabold text-white font-sans mt-0.5">81.6%</div>
            <div className="text-[10px] text-emerald-400 mt-1 font-mono">+23.2% vs Vanilla</div>
          </div>

          <div className="bg-[#121316] rounded-xl p-4 border border-white/[0.04]">
            <div className="text-[10px] text-white/40 uppercase tracking-wider">High-Risk Recall</div>
            <div className="text-3xl font-extrabold text-[#ff5252] font-sans mt-0.5">83.1%</div>
            <div className="text-[10px] text-emerald-400 mt-1 font-mono">+30.8% vs Vanilla</div>
          </div>

          <div className="bg-[#121316] rounded-xl p-4 border border-white/[0.04]">
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Hallucination</div>
            <div className="text-3xl font-extrabold text-[#faad14] font-sans mt-0.5">7.8%</div>
            <div className="text-[10px] text-emerald-400 mt-1 font-mono">-23.4% vs Vanilla</div>
          </div>

          <div className="bg-[#121316] rounded-xl p-4 border border-white/[0.04]">
            <div className="text-[10px] text-white/40 uppercase tracking-wider">Faithfulness</div>
            <div className="text-3xl font-extrabold text-[#3c5270] font-sans mt-0.5">88.0%</div>
            <div className="text-[10px] text-white/40 mt-1 font-mono">Grounding rate</div>
          </div>
        </div>
      </div>

      {/* Relational Audit Trail (PostgreSQL) */}
      <div className="bg-[#18191e] rounded-2xl border border-white/[0.06] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-white/70" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              PostgreSQL Longitudinal Audit Log
            </h3>
          </div>
          <span className="text-xs text-white/40">
            {contracts.length} AUDITED AGREEMENTS
          </span>
        </div>

        {loading ? (
          <div className="text-center py-8 text-white/40">Loading audit history...</div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-8 text-white/30 text-xs">
            No contracts analyzed yet. Upload or run a sample contract from the Analytics Dashboard.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {contracts.map((c: any) => (
              <div key={c.id} className="py-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-white font-sans">{c.fileName}</div>
                  <div className="text-[10px] text-white/40 flex items-center space-x-2 mt-0.5">
                    <span>{new Date(c.createdAt).toLocaleString()}</span>
                    <span>•</span>
                    <span>{(c.fileSize / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span>{c.totalLatencyMs}ms total latency</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ff5252]/15 text-[#ff6b6b] border border-[#ff5252]/30">
                    {c.highRiskCount} HIGH
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#faad14]/15 text-[#ffc53d] border border-[#faad14]/30">
                    {c.medRiskCount} MED
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#52c41a]/15 text-[#73d13d] border border-[#52c41a]/30">
                    {c.lowRiskCount} LOW
                  </span>
                  <div className="w-12 text-right font-extrabold text-white text-sm font-sans">
                    {c.overallRiskScore}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
