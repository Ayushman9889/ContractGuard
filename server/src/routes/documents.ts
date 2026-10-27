import { Router, Request, Response } from 'express';
import multer from 'multer';
import { DocumentParser } from '../services/parser';
import { ClauseSegmenter } from '../services/segmenter';
import { VectorStoreService } from '../services/vectorStore';
import { OllamaService } from '../services/ollama';
import { prisma } from '../services/prisma';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB max
});

/**
 * POST /api/documents/analyze
 * Full ContractGuard RAG Analysis Pipeline (Fig. 1 in Paper)
 */
router.post('/analyze', upload.single('document'), async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    let rawText = '';
    let fileName = 'pasted-contract.txt';
    let fileType = 'text/plain';
    let fileSize = 0;

    if (req.file) {
      fileName = req.file.originalname;
      fileType = req.file.mimetype;
      fileSize = req.file.size;
      const parsed = await DocumentParser.parse(req.file.buffer, fileName, fileType);
      rawText = parsed.text;
    } else if (req.body.text) {
      rawText = req.body.text;
      fileName = req.body.fileName || 'contract-draft.txt';
      fileType = 'text/plain';
      fileSize = Buffer.byteLength(rawText, 'utf-8');
    } else {
      return res.status(400).json({ error: 'No document file or text provided' });
    }

    if (!rawText.trim()) {
      return res.status(400).json({ error: 'Extracted document text is empty' });
    }

    // Phase 1: Ingestion & Clause Segmentation
    const segmentedClauses = ClauseSegmenter.segment(rawText);
    if (segmentedClauses.length === 0) {
      return res.status(400).json({ error: 'Could not segment text into legal clauses' });
    }

    // Phase 2: Save Contract Metadata & Initial State to PostgreSQL
    let contract: any = null;
    try {
      contract = await prisma.contract.create({
        data: {
          fileName,
          fileType,
          fileSize,
          rawText,
          status: 'PROCESSING'
        }
      });
    } catch (dbErr: any) {
      console.warn(`[DB] PostgreSQL insert failed (${dbErr.message}), proceeding with in-memory contract state.`);
      contract = {
        id: `mock-${Date.now()}`,
        fileName,
        fileType,
        fileSize,
        rawText,
        status: 'PROCESSING'
      };
    }

    // Phase 3 & 4: RAG Retrieval & Constrained LLM Inference Loop
    const analyzedClauses: any[] = [];
    let highCount = 0;
    let medCount = 0;
    let lowCount = 0;

    for (const sc of segmentedClauses) {
      const clauseStart = Date.now();

      // Top-K vector retrieval from ChromaDB (K=3)
      const retrievedRules = await VectorStoreService.queryTopK(sc.clauseText, 3);

      // Local LLM generation via Ollama (Qwen2.5-7B)
      const riskResult = await OllamaService.analyzeClause(sc.clauseText, retrievedRules);
      const clauseLatency = Date.now() - clauseStart;

      if (riskResult.level === 'HIGH') highCount++;
      else if (riskResult.level === 'MEDIUM') medCount++;
      else lowCount++;

      const clauseRecord = {
        clauseNumber: sc.clauseNumber,
        sectionHeader: sc.sectionHeader || null,
        clauseText: sc.clauseText,
        riskCategory: riskResult.category,
        riskLevel: riskResult.level,
        reason: riskResult.reason,
        retrievedContext: JSON.stringify(retrievedRules),
        latencyMs: clauseLatency
      };

      // Persist clause to PostgreSQL if DB active
      if (contract && !contract.id.startsWith('mock-')) {
        try {
          const savedClause = await prisma.clause.create({
            data: {
              contractId: contract.id,
              ...clauseRecord
            }
          });
          analyzedClauses.push({
            ...savedClause,
            retrievedRules
          });
        } catch {
          analyzedClauses.push({
            id: `cl-${sc.clauseNumber}`,
            ...clauseRecord,
            retrievedRules
          });
        }
      } else {
        analyzedClauses.push({
          id: `cl-${sc.clauseNumber}`,
          ...clauseRecord,
          retrievedRules
        });
      }
    }

    // Calculate Overall Risk Score (0 - 100)
    // Weighted formula: High=3, Medium=1.5, Low=0.5
    const totalClauses = segmentedClauses.length;
    const weightedScore = (highCount * 3 + medCount * 1.5 + lowCount * 0.5) / (totalClauses * 3);
    const overallRiskScore = Math.min(100, Math.round(weightedScore * 100));
    const totalLatencyMs = Date.now() - startTime;

    // Update contract record
    if (contract && !contract.id.startsWith('mock-')) {
      try {
        await prisma.contract.update({
          where: { id: contract.id },
          data: {
            overallRiskScore,
            highRiskCount: highCount,
            medRiskCount: medCount,
            lowRiskCount: lowCount,
            status: 'COMPLETED',
            totalLatencyMs
          }
        });

        // Audit log
        await prisma.auditLog.create({
          data: {
            contractId: contract.id,
            action: 'COMPLETE',
            details: `Analyzed ${totalClauses} clauses: ${highCount} High, ${medCount} Medium, ${lowCount} Low.`,
            durationMs: totalLatencyMs
          }
        });
      } catch (e) {
        console.warn('[DB] Failed to update contract summary in DB:', e);
      }
    }

    return res.json({
      contractId: contract.id,
      fileName,
      totalClauses,
      overallRiskScore,
      highRiskCount: highCount,
      medRiskCount: medCount,
      lowRiskCount: lowCount,
      totalLatencyMs,
      clauses: analyzedClauses
    });
  } catch (error: any) {
    console.error('[DocumentAnalyze] Pipeline error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error during analysis' });
  }
});

/**
 * GET /api/documents
 * List all analyzed contracts
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const contracts = await prisma.contract.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileSize: true,
        overallRiskScore: true,
        highRiskCount: true,
        medRiskCount: true,
        lowRiskCount: true,
        status: true,
        totalLatencyMs: true,
        createdAt: true
      }
    });
    return res.json(contracts);
  } catch (err: any) {
    return res.status(200).json([]);
  }
});

/**
 * GET /api/documents/:id
 * Retrieve specific analyzed contract with all clauses
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: req.params.id },
      include: {
        clauses: {
          orderBy: { clauseNumber: 'asc' }
        }
      }
    });

    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    const formattedClauses = contract.clauses.map(c => ({
      ...c,
      retrievedRules: c.retrievedContext ? JSON.parse(c.retrievedContext) : []
    }));

    return res.json({
      ...contract,
      clauses: formattedClauses
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /api/documents/:id
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.contract.delete({
      where: { id: req.params.id }
    });
    return res.json({ message: 'Contract deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
