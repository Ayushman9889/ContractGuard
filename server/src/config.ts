import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgrespassword@localhost:5432/contractguard?schema=public',
  chromaUrl: process.env.CHROMA_URL || 'http://localhost:8000',
  chromaCollectionName: 'contractguard_playbook',
  ollamaUrl: process.env.OLLAMA_URL || 'http://localhost:11434',
  ollamaModel: process.env.OLLAMA_MODEL || 'qwen2.5:7b',
  topK: parseInt(process.env.TOP_K || '3', 10),
  temperature: parseFloat(process.env.TEMPERATURE || '0.1'),
  nodeEnv: process.env.NODE_ENV || 'development'
};
