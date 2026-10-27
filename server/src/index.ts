import express from 'express';
import cors from 'cors';
import { config } from './config';
import documentsRouter from './routes/documents';
import playbookRouter from './routes/playbook';
import auditRouter from './routes/audit';
import { VectorStoreService } from './services/vectorStore';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/documents', documentsRouter);
app.use('/api/playbook', playbookRouter);
app.use('/api/audit', auditRouter);

// System Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'ContractGuard Backend Engine',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    config: {
      ollamaModel: config.ollamaModel,
      topK: config.topK,
      temperature: config.temperature
    }
  });
});

// Start Server & Initialize Vector Store
async function bootstrap() {
  try {
    console.log('[ContractGuard] Initializing Knowledge Base & Vector Index...');
    await VectorStoreService.initialize();

    app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(` ContractGuard Backend Engine running on port ${config.port}`);
      console.log(` Environment: ${config.nodeEnv}`);
      console.log(` RAG Retrieval Depth: Top-K = ${config.topK}`);
      console.log(` Target Ollama Model: ${config.ollamaModel}`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('[ContractGuard] Bootstrap failed:', error);
    process.exit(1);
  }
}

bootstrap();
