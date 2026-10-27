'use client';

import React from 'react';

interface TopTickerNavProps {
  activeTab: 'analyze' | 'playbook' | 'audit';
  setActiveTab: (tab: 'analyze' | 'playbook' | 'audit') => void;
  serverOnline: boolean;
}

export const TopTickerNav: React.FC<TopTickerNavProps> = ({ activeTab, setActiveTab, serverOnline }) => {
  return (
    <header className="border-b border-white/[0.06] bg-[#121316] text-[#e1e4ea] px-4 lg:px-8 py-3 select-none">
      <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-4 text-xs font-mono">
        {/* Left: 9-dot grid + Brand */}
        <div className="flex items-center space-x-4">
          <div 
            onClick={() => setActiveTab('analyze')} 
            className="cursor-pointer p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors"
            title="ContractGuard Hub"
          >
            {/* 3x3 Grid Dots */}
            <div className="grid grid-cols-3 gap-1 w-4 h-4">
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
              <span className="w-1 h-1 bg-white rounded-full"></span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="font-extrabold tracking-wider text-white text-sm">CONTRACTGUARD</span>
            <span className="text-[10px] bg-[#3c5270] text-white px-1.5 py-0.5 rounded font-mono font-semibold">
              v2.5
            </span>
          </div>

          {/* Navigation Mode Switcher */}
          <div className="hidden md:flex items-center space-x-1 pl-4 border-l border-white/[0.08]">
            <button
              onClick={() => setActiveTab('analyze')}
              className={`px-3 py-1 rounded text-xs tracking-wider uppercase transition-colors ${
                activeTab === 'analyze'
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Analytics Dashboard
            </button>
            <button
              onClick={() => setActiveTab('playbook')}
              className={`px-3 py-1 rounded text-xs tracking-wider uppercase transition-colors ${
                activeTab === 'playbook'
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Playbook (142)
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded text-xs tracking-wider uppercase transition-colors ${
                activeTab === 'audit'
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Audit Trail
            </button>
          </div>
        </div>

        {/* Center: Live Research & Operational Metrics Ticker */}
        <div className="hidden xl:flex items-center space-x-6 text-[11px] text-white/70">
          <div>
            <div className="text-white/40 text-[9px] uppercase tracking-wider">CUAD ACCURACY</div>
            <div className="text-white font-bold">81.6% <span className="text-emerald-400 text-[10px]">+23.2%</span></div>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div>
            <div className="text-white/40 text-[9px] uppercase tracking-wider">HIGH-R RECALL</div>
            <div className="text-white font-bold">83.1% <span className="text-emerald-400 text-[10px]">+30.8%</span></div>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div>
            <div className="text-white/40 text-[9px] uppercase tracking-wider">HALLUCINATION</div>
            <div className="text-white font-bold">7.8% <span className="text-emerald-400 text-[10px]">-23.4%</span></div>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div>
            <div className="text-white/40 text-[9px] uppercase tracking-wider">FAITHFULNESS</div>
            <div className="text-white font-bold">88.0%</div>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div>
            <div className="text-white/40 text-[9px] uppercase tracking-wider">LATENCY</div>
            <div className="text-white font-bold">445 MS</div>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div>
            <div className="text-white/40 text-[9px] uppercase tracking-wider">AI BACKEND</div>
            <div className="text-white font-bold">QWEN2.5-7B</div>
          </div>
        </div>

        {/* Right: Auditor Profile Badge */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white/[0.04] border border-white/[0.08] px-3 py-1.5 rounded-full">
            <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-slate-600 to-slate-400 flex items-center justify-center text-[10px] font-bold text-white">
              Q
            </div>
            <span className="text-white font-semibold tracking-wider text-xs">LEGAL AUDITOR</span>
            <span className="text-white/40 text-[10px]">#4015</span>
          </div>
        </div>
      </div>
    </header>
  );
};
