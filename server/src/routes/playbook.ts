import { Router, Request, Response } from 'express';
import playbookRules from '../data/playbookRules.json';

const router = Router();

/**
 * GET /api/playbook
 * List all 142 WorldCC corporate risk playbook rules with optional filters
 */
router.get('/', (req: Request, res: Response) => {
  const { category, riskTier, search } = req.query;

  let filtered = [...playbookRules];

  if (category && typeof category === 'string') {
    filtered = filtered.filter(r => r.category.toUpperCase() === category.toUpperCase());
  }

  if (riskTier && typeof riskTier === 'string') {
    filtered = filtered.filter(r => r.riskTier.toUpperCase() === riskTier.toUpperCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      r =>
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.ruleText.toLowerCase().includes(q)
    );
  }

  return res.json({
    total: filtered.length,
    rules: filtered
  });
});

/**
 * GET /api/playbook/:id
 * Retrieve a single rule by ID (e.g. H-01, M-08, L-14)
 */
router.get('/:id', (req: Request, res: Response) => {
  const rule = playbookRules.find(r => r.id.toUpperCase() === req.params.id.toUpperCase());
  if (!rule) {
    return res.status(404).json({ error: 'Rule not found' });
  }
  return res.json(rule);
});

export default router;
