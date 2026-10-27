'use client';

import React from 'react';
import { ShieldCheck, BookOpen, History, Cpu } from 'lucide-react';

interface NavbarProps {
  activeTab: 'analyze' | 'playbook' | 'audit';
  setActiveTab: (tab: 'analyze' | 'playbook' | 'audit') => void;
  serverOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, serverOnline }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('analyze')}>
            <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-white">ContractGuard</span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded">
                  Legal RAG
                </span>
              </div>
              <p className="text-xs text-slate-400">On-Premise Legal Contract Risk Screening</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('analyze')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'analyze'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Contract Review</span>
            </button>

            <button
              onClick={() => setActiveTab('playbook')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'playbook'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Playbook Rules (142)</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'audit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Audit Trail</span>
            </button>
          </nav>

          {/* System Status Pill */}
          <div className="hidden md:flex items-center space-x-3 text-xs bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-300 font-mono">Backend {serverOnline ? 'Ready' : 'Connecting'}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>Qwen2.5-7B</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
