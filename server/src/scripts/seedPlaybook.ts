import { prisma } from '../services/prisma';
import playbookRules from '../data/playbookRules.json';

async function seed() {
  console.log(`[Seed] Populating PostgreSQL with ${playbookRules.length} WorldCC playbook rules...`);

  for (const rule of playbookRules) {
    await prisma.playbookRule.upsert({
      where: { id: rule.id },
      update: {
        category: rule.category,
        riskTier: rule.riskTier,
        title: rule.title,
        ruleText: rule.ruleText,
        example: rule.example
      },
      create: {
        id: rule.id,
        category: rule.category,
        riskTier: rule.riskTier,
        title: rule.title,
        ruleText: rule.ruleText,
        example: rule.example
      }
    });
  }

  console.log('[Seed] Database seeding completed successfully.');
}

seed()
  .catch((e) => {
    console.error('[Seed] Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
