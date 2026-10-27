'use client';

import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

interface SampleContractSelectorProps {
  onSelectSample: (fileName: string, sampleContent: string) => void;
  disabled: boolean;
}

const SAMPLES = [
  {
    title: 'CUAD Non-Disclosure Agreement',
    type: 'NDA',
    badge: 'CUAD Corpus',
    description: 'Contains uncapped indemnification, perpetual confidentiality, and standard termination.',
    fileName: 'CUAD_NDA_Sample.txt',
    content: `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

SECTION 1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" refers to any proprietary information, technical data, trade secrets, software code, customer lists, or financial data disclosed by either party.

SECTION 2. EXCLUSIONS FROM CONFIDENTIALITY
Confidential Information does not include information that is or becomes publicly known through no breach of this Agreement, was already in the rightful possession, or is required by court order.

SECTION 3. OBLIGATIONS OF NON-DISCLOSURE
Recipient shall maintain all disclosed information strictly confidential in perpetuity without time limitation.

SECTION 4. INDEMNIFICATION AND LIABILITIES
Supplier shall indemnify and hold Customer harmless against any and all claims, damages, liabilities, and losses whatsoever without monetary limitation arising out of any breach of confidentiality.

SECTION 5. GOVERNING LAW AND JURISDICTION
This Agreement shall be governed by Delaware law with exclusive jurisdiction in Wilmington, Delaware.

SECTION 6. TERMINATION
Either party may terminate this Agreement upon thirty (30) days' advance written notice with pro-rata refund of unearned fees.`
  },
  {
    title: 'Master Services Agreement (MSA)',
    type: 'MSA',
    badge: 'Enterprise',
    description: 'Contains uncapped liability for lost profits, unilateral fee shifting, and 30-day cure periods.',
    fileName: 'Master_Services_Agreement_Sample.txt',
    content: `MASTER SERVICES AGREEMENT (MSA)

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
Either party may terminate this Agreement upon written notice if the other party fails to cure a material breach within thirty (30) days.`
  },
  {
    title: 'Cloud Software License & SaaS',
    type: 'SaaS',
    badge: 'Commercial',
    description: 'Includes 100% uptime guarantees, unrestricted facility audit rights, and background IP forfeiture.',
    fileName: 'Software_License_Agreement_Sample.txt',
    content: `ENTERPRISE SOFTWARE LICENSE AGREEMENT

SECTION 1. GRANT OF LICENSE
Licensor grants Licensee a non-exclusive, non-transferable license to access and use the CloudScale Enterprise Platform.

SECTION 2. BACKGROUND INTELLECTUAL PROPERTY
All intellectual property developed, utilized, or incorporated by Consultant shall become the sole property of Client.

SECTION 3. SERVICE LEVEL GUARANTEE AND CREDITS
Supplier guarantees 100% uptime of third-party cloud infrastructure and assumes unlimited liability for outages.

SECTION 4. AUDIT RIGHTS
Buyer may inspect and audit Supplier's entire corporate facilities, books, and code repositories at any hour without notice.

SECTION 5. TERMINATION UPON CONVENIENCE
Mutual termination for convenience permitted upon at least 30 days' advance written notice with pro-rata refund of unearned fees.`
  }
];

export const SampleContractSelector: React.FC<SampleContractSelectorProps> = ({
  onSelectSample,
  disabled
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-bold text-slate-800">Quick Test Benchmark Contracts</h4>
        </div>
        <span className="text-xs text-slate-400">Pre-loaded from CUAD evaluation set</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SAMPLES.map((sample, idx) => (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => onSelectSample(sample.fileName, sample.content)}
            className="flex flex-col text-left p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition-all text-xs group disabled:opacity-50"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="font-bold text-slate-900 group-hover:text-blue-600 flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
                <span>{sample.type}</span>
              </span>
              <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-medium font-mono">
                {sample.badge}
              </span>
            </div>
            <p className="font-medium text-slate-700 mb-1">{sample.title}</p>
            <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{sample.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
