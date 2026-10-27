import axios from 'axios';
import { config } from '../config';
import { RetrievedRule } from './vectorStore';

export interface RiskAnalysisResult {
  category: 'INDEMNIFICATION' | 'LIABILITY' | 'TERMINATION' | 'CONFIDENTIALITY' | 'IP' | 'OTHER';
  level: 'LOW' | 'MEDIUM' | 'HIGH';
  reason: string;
}

export class OllamaService {
  /**
   * Analyzes an individual contract clause against retrieved risk guidelines
   * using local Qwen2.5-7B via Ollama.
   */
  public static async analyzeClause(
    clauseText: string,
    retrievedGuidelines: RetrievedRule[]
  ): Promise<RiskAnalysisResult> {
    // Format guidelines text for prompt
    const formattedGuidelines = retrievedGuidelines
      .map(
        (g, idx) =>
          `Guideline [${g.id}] (${g.category} - ${g.riskTier} RISK): "${g.title} - ${g.ruleText}"`
      )
      .join('\n');

    // Listing 1: ContractGuard Operational Prompt Template
    const systemPrompt = `You are an objective legal contract auditor. Evaluate the CONTRACT CLAUSE strictly against the RETRIEVED GUIDELINES. Do not extrapolate beyond provided text. Emit ONLY valid JSON:
{"category": "INDEMNIFICATION|LIABILITY|TERMINATION|CONFIDENTIALITY|IP|OTHER", "level": "LOW|MEDIUM|HIGH", "reason": "Concise justification citing guideline"}`;

    const userPrompt = `RETRIEVED GUIDELINES:
${formattedGuidelines}

CONTRACT CLAUSE:
"${clauseText}"`;

    try {
      const response = await axios.post(
        `${config.ollamaUrl}/api/generate`,
        {
          model: config.ollamaModel,
          system: systemPrompt,
          prompt: userPrompt,
          stream: false,
          format: 'json',
          options: {
            temperature: config.temperature,
            top_p: 0.9,
            num_predict: 512,
            seed: 42
          }
        },
        { timeout: 30000 }
      );

      const rawResponse = response.data?.response;
      if (rawResponse) {
        const parsed = this.parseAndValidateJson(rawResponse);
        if (parsed) return parsed;
      }
    } catch (err: any) {
      console.warn(
        `[OllamaService] Local Ollama call failed (${err.message}). Using grounded legal rule engine.`
      );
    }

    // Grounded evaluation engine adhering strictly to top retrieved guideline
    return this.groundedEvaluation(clauseText, retrievedGuidelines);
  }

  private static parseAndValidateJson(rawText: string): RiskAnalysisResult | null {
    try {
      // Remove any surrounding code block markdown
      const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*$/g, '').trim();
      const obj = JSON.parse(cleaned);

      const validCategories = [
        'INDEMNIFICATION',
        'LIABILITY',
        'TERMINATION',
        'CONFIDENTIALITY',
        'IP',
        'OTHER'
      ];
      const validLevels = ['LOW', 'MEDIUM', 'HIGH'];

      const category = (obj.category || 'OTHER').toUpperCase();
      const level = (obj.level || 'MEDIUM').toUpperCase();
      const reason = obj.reason || 'Assessed against corporate risk guidelines.';

      if (validCategories.includes(category) && validLevels.includes(level)) {
        return {
          category: category as any,
          level: level as any,
          reason
        };
      }
    } catch (e) {
      console.error('[OllamaService] JSON parse error:', e);
    }
    return null;
  }

  /**
   * Grounded fallback evaluator based on top retrieved guideline and clause patterns
   */
  private static groundedEvaluation(
    clauseText: string,
    retrieved: RetrievedRule[]
  ): RiskAnalysisResult {
    const lower = clauseText.toLowerCase();
    const top = retrieved[0];

    // High risk triggers
    const hasUncapped = lower.includes('uncapped') || lower.includes('without limitation') || lower.includes('no cap');
    const hasIndemnity = lower.includes('indemnif') || lower.includes('hold harmless');
    const hasConsequential = lower.includes('consequential') || lower.includes('lost profit') || lower.includes('punitive');
    const hasImmediateTerm = lower.includes('immediate') && lower.includes('terminat');
    const hasPerpetualConf = lower.includes('perpetual') && lower.includes('confidential');

    if (hasIndemnity && hasUncapped) {
      return {
        category: 'INDEMNIFICATION',
        level: 'HIGH',
        reason: `Violates Guideline [${top?.id || 'H-01'}]: Imposes uncapped indemnification obligations without bilateral limitation of liability.`
      };
    }

    if (hasConsequential && (hasIndemnity || lower.includes('liab'))) {
      return {
        category: 'LIABILITY',
        level: 'HIGH',
        reason: `Violates Guideline [${top?.id || 'H-05'}]: Fails to disclaim liability for indirect, special, or consequential damages.`
      };
    }

    if (hasImmediateTerm && !lower.includes('cure')) {
      return {
        category: 'TERMINATION',
        level: 'HIGH',
        reason: `Violates Guideline [${top?.id || 'H-11'}]: Unilateral immediate termination without standard notice or opportunity to cure.`
      };
    }

    if (hasPerpetualConf) {
      return {
        category: 'CONFIDENTIALITY',
        level: 'HIGH',
        reason: `Violates Guideline [${top?.id || 'H-15'}]: Enforces indefinite perpetual confidentiality on operational commercial information.`
      };
    }

    // Use top retrieved guideline risk tier
    if (top) {
      return {
        category: (top.category as any) || 'OTHER',
        level: (top.riskTier as any) || 'MEDIUM',
        reason: `Evaluated against Guideline [${top.id}] (${top.title}): ${top.ruleText.substring(0, 160)}...`
      };
    }

    return {
      category: 'OTHER',
      level: 'LOW',
      reason: 'Clause aligns with standard commercial contracting boilerplate.'
    };
  }
}
