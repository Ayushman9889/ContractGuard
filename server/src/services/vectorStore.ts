import { ChromaClient, Collection } from 'chromadb';
import { config } from '../config';
import { EmbeddingService } from './embeddings';
import playbookRules from '../data/playbookRules.json';

export interface RetrievedRule {
  id: string;
  category: string;
  riskTier: string;
  title: string;
  ruleText: string;
  example?: string;
  similarity: number;
}

export class VectorStoreService {
  private static client: ChromaClient | null = null;
  private static collection: Collection | null = null;
  private static isInitialized = false;

  // In-memory fallback index
  private static inMemoryIndex: Array<{
    rule: typeof playbookRules[0];
    embedding: number[];
  }> = [];

  /**
   * Initializes ChromaDB collection and in-memory index with the 142 playbook rules
   */
  public static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('[VectorStore] Pre-indexing 142 WorldCC playbook rules...');

    // 1. Build in-memory index
    this.inMemoryIndex = [];
    for (const rule of playbookRules) {
      const textToEmbed = `${rule.category} ${rule.riskTier} ${rule.title}: ${rule.ruleText}`;
      const embedding = await EmbeddingService.getEmbedding(textToEmbed);
      this.inMemoryIndex.push({ rule, embedding });
    }

    // 2. Try ChromaDB connection
    try {
      this.client = new ChromaClient({ path: config.chromaUrl });
      this.collection = await this.client.getOrCreateCollection({
        name: config.chromaCollectionName,
        metadata: { 'hnsw:space': 'cosine' }
      });

      // Check existing count in ChromaDB
      const count = await this.collection.count();
      if (count < playbookRules.length) {
        console.log(`[VectorStore] Syncing ${playbookRules.length} rules to ChromaDB collection...`);
        const ids = playbookRules.map(r => r.id);
        const embeddings = this.inMemoryIndex.map(item => item.embedding);
        const metadatas = playbookRules.map(r => ({
          category: r.category,
          riskTier: r.riskTier,
          title: r.title,
          ruleText: r.ruleText,
          example: r.example || ''
        }));
        const documents = playbookRules.map(r => `${r.title}: ${r.ruleText}`);

        await this.collection.upsert({
          ids,
          embeddings,
          metadatas,
          documents
        });
        console.log('[VectorStore] ChromaDB indexing complete.');
      } else {
        console.log(`[VectorStore] ChromaDB collection already populated with ${count} rules.`);
      }
    } catch (err: any) {
      console.warn(`[VectorStore] ChromaDB offline or unreachable (${err.message}). Using high-precision in-memory vector index.`);
    }

    this.isInitialized = true;
  }

  /**
   * Retrieves top-K legal risk guidelines using cosine similarity (sim(c, rj))
   */
  public static async queryTopK(clauseText: string, topK: number = config.topK): Promise<RetrievedRule[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const clauseEmbedding = await EmbeddingService.getEmbedding(clauseText);

    // Try ChromaDB query first if collection is active
    if (this.collection) {
      try {
        const results = await this.collection.query({
          queryEmbeddings: [clauseEmbedding],
          nResults: topK
        });

        if (results && results.ids && results.ids[0] && results.ids[0].length > 0) {
          const retrieved: RetrievedRule[] = [];
          const ids = results.ids[0];
          const metadatas = results.metadatas ? results.metadatas[0] : [];
          const distances = results.distances ? results.distances[0] : [];

          for (let i = 0; i < ids.length; i++) {
            const meta: any = metadatas[i] || {};
            // Chroma cosine distance d = 1 - cosine_similarity
            const distance = distances[i] ?? 0.5;
            const similarity = Math.max(0, Math.min(1, 1 - distance));

            retrieved.push({
              id: ids[i],
              category: meta.category || 'OTHER',
              riskTier: meta.riskTier || 'MEDIUM',
              title: meta.title || '',
              ruleText: meta.ruleText || '',
              example: meta.example || '',
              similarity: parseFloat(similarity.toFixed(4))
            });
          }
          return retrieved;
        }
      } catch (err: any) {
        console.warn(`[VectorStore] ChromaDB query failed (${err.message}), falling back to memory index.`);
      }
    }

    // High-precision in-memory cosine KNN search
    const scoredRules = this.inMemoryIndex.map(item => {
      const sim = EmbeddingService.cosineSimilarity(clauseEmbedding, item.embedding);
      return {
        id: item.rule.id,
        category: item.rule.category,
        riskTier: item.rule.riskTier,
        title: item.rule.title,
        ruleText: item.rule.ruleText,
        example: item.rule.example,
        similarity: parseFloat(sim.toFixed(4))
      };
    });

    // Sort descending by similarity
    scoredRules.sort((a, b) => b.similarity - a.similarity);

    return scoredRules.slice(0, topK);
  }
}
