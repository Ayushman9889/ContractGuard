export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type RiskCategory = 'INDEMNIFICATION' | 'LIABILITY' | 'TERMINATION' | 'CONFIDENTIALITY' | 'IP' | 'OTHER';

export interface RetrievedRule {
  id: string;
  category: string;
  riskTier: RiskLevel;
  title: string;
  ruleText: string;
  example?: string;
  similarity: number;
}

export interface AnalyzedClause {
  id?: string;
  clauseNumber: number;
  sectionHeader?: string | null;
  clauseText: string;
  riskCategory: RiskCategory;
  riskLevel: RiskLevel;
  reason: string;
  retrievedRules: RetrievedRule[];
  latencyMs?: number;
}

export interface AnalysisResponse {
  contractId: string;
  fileName: string;
  totalClauses: number;
  overallRiskScore: number;
  highRiskCount: number;
  medRiskCount: number;
  lowRiskCount: number;
  totalLatencyMs: number;
  clauses: AnalyzedClause[];
}

export interface PlaybookRule {
  id: string;
  category: RiskCategory;
  riskTier: RiskLevel;
  title: string;
  ruleText: string;
  example?: string;
}
