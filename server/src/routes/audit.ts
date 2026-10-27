import { Router, Request, Response } from 'express';
import { prisma } from '../services/prisma';

const router = Router();

/**
 * GET /api/audit/logs
 * Retrieve system audit history
 */
router.get('/logs', async (_req: Request, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100,
      include: {
        contract: {
          select: { fileName: true }
        }
      }
    });
    return res.json(logs);
  } catch (err: any) {
    return res.json([]);
  }
});

/**
 * GET /api/audit/stats
 * Aggregated statistics across all analyzed contracts
 */
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const totalContracts = await prisma.contract.count();
    const clauses = await prisma.clause.groupBy({
      by: ['riskLevel'],
      _count: true
    });

    const categoryDistribution = await prisma.clause.groupBy({
      by: ['riskCategory'],
      _count: true
    });

    return res.json({
      totalContracts,
      riskDistribution: clauses,
      categoryDistribution
    });
  } catch (err: any) {
    return res.json({
      totalContracts: 0,
      riskDistribution: [],
      categoryDistribution: []
    });
  }
});

export default router;
