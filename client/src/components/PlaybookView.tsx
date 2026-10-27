'use client';

import React, { useState, useEffect } from 'react';
import { PlaybookRule } from '../types';
import { Search, BookOpen } from 'lucide-react';
import axios from 'axios';

export const PlaybookView: React.FC = () => {
  const [rules, setRules] = useState<PlaybookRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/playbook');
      if (res.data && res.data.rules) {
        setRules(res.data.rules);
      }
    } catch (e) {
      console.error('Failed to fetch playbook rules:', e);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', 'INDEMNIFICATION', 'LIABILITY', 'TERMINATION', 'CONFIDENTIALITY', 'IP', 'OTHER'];
  const tiers = ['ALL', 'HIGH', 'MEDIUM', 'LOW'];

  const filteredRules = rules.filter(rule => {
    const matchesSearch =
      search === '' ||
      rule.id.toLowerCase().includes(search.toLowerCase()) ||
      rule.title.toLowerCase().includes(search.toLowerCase()) ||
      rule.ruleText.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || rule.category === selectedCategory;
    const matchesTier = selectedTier === 'ALL' || rule.riskTier === selectedTier;

    return matchesSearch && matchesCategory && matchesTier;
  });

  return (
    <div className="space-y-6 font-mono text-white">
      {/* Header Card */}
      <div className="bg-[#18191e] rounded-2xl border border-white/[0.06] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#82a8d8] mb-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider font-bold">
                Institutional Knowledge Base
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white font-sans">
              WORLDCC RISK PLAYBOOK RULES (142 RULES)
            </h2>
            <p className="text-xs text-white/50 mt-1 max-w-2xl font-sans leading-relaxed">
              Pre-indexed in ChromaDB vector space ($d=384$) for real-time dense retrieval-augmented risk screening.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="bg-[#ff5252]/15 text-[#ff6b6b] border border-[#ff5252]/30 px-3 py-1.5 rounded-lg font-bold">
              45 HIGH
            </span>
            <span className="bg-[#faad14]/15 text-[#ffc53d] border border-[#faad14]/30 px-3 py-1.5 rounded-lg font-bold">
              50 MEDIUM
            </span>
            <span className="bg-[#52c41a]/15 text-[#73d13d] border border-[#52c41a]/30 px-3 py-1.5 rounded-lg font-bold">
              47 LOW
            </span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-white/40" />
            <input
              type="text"
              placeholder="Search by Rule ID (e.g. H-01) or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-white/[0.08] bg-[#121316] text-white focus:outline-none focus:ring-1 focus:ring-[#3c5270]"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-white/[0.08] bg-[#121316] text-white focus:outline-none focus:ring-1 focus:ring-[#3c5270]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  CATEGORY: {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-white/[0.08] bg-[#121316] text-white focus:outline-none focus:ring-1 focus:ring-[#3c5270]"
            >
              {tiers.map(tier => (
                <option key={tier} value={tier}>
                  RISK TIER: {tier}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Rules Grid */}
      {loading ? (
        <div className="text-center py-12 text-white/40">Loading playbook rules from ChromaDB...</div>
      ) : filteredRules.length === 0 ? (
        <div className="text-center py-12 text-white/40">No matching guidelines found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredRules.map(rule => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border border-white/[0.06] bg-[#18191e] ${
                rule.riskTier === 'HIGH'
                  ? 'border-l-4 border-l-[#ff5252]'
                  : rule.riskTier === 'MEDIUM'
                  ? 'border-l-4 border-l-[#faad14]'
                  : 'border-l-4 border-l-[#52c41a]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs bg-white/10 text-white px-2 py-0.5 rounded">
                    [{rule.id}]
                  </span>
                  <span className="text-xs text-white/40 uppercase">{rule.category}</span>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    rule.riskTier === 'HIGH'
                      ? 'bg-[#ff5252]/20 text-[#ff6b6b]'
                      : rule.riskTier === 'MEDIUM'
                      ? 'bg-[#faad14]/20 text-[#ffc53d]'
                      : 'bg-[#52c41a]/20 text-[#73d13d]'
                  }`}
                >
                  {rule.riskTier} RISK
                </span>
              </div>
              <h4 className="font-bold text-white text-sm mb-1.5 font-sans">{rule.title}</h4>
              <p className="text-xs text-white/60 leading-relaxed mb-3 font-sans">{rule.ruleText}</p>
              {rule.example && (
                <div className="bg-[#121316] rounded p-2.5 text-[11px] text-white/50 border border-white/[0.04] font-sans">
                  <span className="font-semibold text-white/80">Prototype Example: </span>
                  <span className="italic">"{rule.example}"</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
