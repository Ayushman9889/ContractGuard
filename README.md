# ContractGuard: Retrieval-Augmented Generation for Legal Contract Risk Detection

An on-premise, privacy-preserving legal contract screening platform based on the research paper:  
**"Retrieval-Augmented Generation for Legal Contract Risk Detection: An Empirical Evaluation of Accuracy and Reliability in ContractGuard"**  
*(Authors: Ayushman, Chandramani Yadav, Arvind Kumar)*

---

## 🏛️ System Architecture

ContractGuard implements the exact 4-layer architecture described in Figure 1 of the paper:

```
[User]
   │
   ▼
[Client Layer] ────────► Next.js Frontend (React, TypeScript, Tailwind CSS)
   │                      • Document Upload (PDF, DOCX, TXT, OCR Images)
   │                      • Real-time Clause Breakdown & Progress
   │                      • Colored Risk Report (🔴 High, 🟡 Medium, 🟢 Low)
   │                      • Interactive Clause Inspector with Top-3 RAG Context
   │                      • 142 WorldCC Playbook Rules Knowledge Base Browser
   │
   ▼
[Backend Engine] ──────► Express.js API (TypeScript, Node.js)
   │                      • Multi-format Document Parser (pdf-parse, mammoth, tesseract.js)
   │                      • Regex Clause Segmentation (94.6% boundary accuracy)
   │                      • 384-dimensional Dense Embedding Engine (BGE model)
   │                      • Top-3 Cosine Similarity Retriever (sim(c, r_j))
   │
   ▼
[Storage Layer] ───────► PostgreSQL & ChromaDB
   │                      • PostgreSQL: Relational transactional state, clause mappings, audit logs
   │                      • ChromaDB: Vector database indexing 142 WorldCC risk playbook rules
   │
   ▼
[AI Layer] ────────────► Local Ollama (Qwen2.5-7B-Instruct)
                          • Deterministic decoding (temperature = 0.1, seed = 42)
                          • Constrained JSON schema enforcement
                          • On-premise execution (zero cloud data leakage)
```

---

## 📊 Benchmark Highlights (from CUAD Evaluation Corpus)

| Metric | Vanilla LLM (Zero-Context) | Full Playbook Stuffing | **ContractGuard (RAG, K=3)** |
| :--- | :---: | :---: | :---: |
| **Overall Accuracy** | 58.4% | 72.8% | **81.6%** ($p < 0.001$) |
| **High-Risk Recall** | 52.3% | 72.3% | **83.1%** |
| **Explanation Faithfulness** | 38.0% | 74.0% | **88.0%** |
| **Legal Hallucination Rate** | 31.2% | 16.4% | **7.8%** |
| **Evaluation Latency** | 312 ms | 1,420 ms | **445 ms** |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18 or v20+
- **Docker**: For running PostgreSQL and ChromaDB
- **Ollama**: For running local Qwen2.5-7B (`ollama pull qwen2.5:7b`)

### 2. Start PostgreSQL & ChromaDB (Docker)
In the project root directory, run:
```bash
docker-compose up -d
```
This launches:
- **PostgreSQL** at `localhost:5432` (`contractguard` db)
- **ChromaDB** at `http://localhost:8000`

### 3. Setup Ollama (Local AI Layer)
Download and run `Qwen2.5-7B-Instruct`:
```bash
ollama pull qwen2.5:7b
ollama run qwen2.5:7b
```
*(ContractGuard also contains a built-in grounded legal rules engine fallback if Ollama is starting up or in test mode).*

### 4. Run the Backend Server
```bash
cd server
npm run dev
```
The Express backend starts at **`http://localhost:5000`**.  
On boot, it automatically pre-indexes the **142 WorldCC corporate risk playbook rules** into the vector store.

### 5. Run the Next.js Frontend
In a new terminal:
```bash
cd client
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## ⚡ One-Click Startup (Windows)

You can launch the complete ecosystem with a single command:
```powershell
.\start-all.ps1
```
or double-click `start-all.bat`.

---

## 📁 Repository Structure

```
ContractGuard_Project/
├── docker-compose.yml             # PostgreSQL & ChromaDB services
├── start-all.bat                  # One-click Windows batch launcher
├── start-all.ps1                  # One-click PowerShell launcher
│
├── server/                        # Backend Engine (Express + TypeScript)
│   ├── prisma/
│   │   └── schema.prisma          # PostgreSQL relational schema
│   ├── src/
│   │   ├── config.ts              # System configuration
│   │   ├── index.ts               # Express application entrypoint
│   │   ├── services/
│   │   │   ├── parser.ts          # Multi-format parser (PDF, DOCX, OCR images)
│   │   │   ├── segmenter.ts       # Regex clause boundary segmentation
│   │   │   ├── embeddings.ts      # 384-dimensional dense embeddings
│   │   │   ├── vectorStore.ts     # ChromaDB & cosine similarity retriever
│   │   │   ├── ollama.ts          # Qwen2.5-7B prompt synthesis & JSON validation
│   │   │   └── prisma.ts          # Prisma client instance
│   │   ├── data/
│   │   │   └── playbookRules.json # 142 WorldCC Risk Rules (Low, Med, High)
│   │   ├── routes/
│   │   │   ├── documents.ts       # POST /api/documents/analyze
│   │   │   ├── playbook.ts        # GET /api/playbook
│   │   │   └── audit.ts           # GET /api/audit/logs
│   │   └── scripts/
│   │       ├── generatePlaybook.js # Generates the 142 rules
│   │       └── seedPlaybook.ts    # Seeds rules into PostgreSQL
│   └── package.json
│
├── client/                        # Client Layer (Next.js 14 + Tailwind CSS)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # App layout
│   │   │   ├── page.tsx           # Main ContractGuard dashboard
│   │   │   └── globals.css        # Styles & risk color utilities
│   │   ├── components/
│   │   │   ├── Navbar.tsx         # Header navigation & system health pill
│   │   │   ├── RiskGauge.tsx      # Circular risk score & count badges
│   │   │   ├── ClauseCard.tsx     # Colored clause card & RAG context drawer
│   │   │   ├── SampleContractSelector.tsx # CUAD sample contracts
│   │   │   ├── PlaybookView.tsx   # 142 WorldCC rules browser & filters
│   │   │   └── AuditView.tsx      # PostgreSQL audit log & research benchmarks
│   │   └── types/
│   │       └── index.ts           # TypeScript interfaces
│   └── package.json
│
└── samples/                       # Test Contract Agreements
    ├── CUAD_NDA_Sample.txt
    ├── Master_Services_Agreement_Sample.txt
    └── Software_License_Agreement_Sample.txt
```

---

## 📜 Legal Risk Taxonomy & Listing 1 Prompt Template

Each input clause $c$ and top-$K$ retrieved rules $G_K(c)$ are synthesized into:

```text
SYSTEM: You are an objective legal contract auditor. Evaluate the CONTRACT CLAUSE
strictly against the RETRIEVED GUIDELINES. Do not extrapolate beyond provided
text. Emit ONLY valid JSON:
{"category": "INDEMNIFICATION|LIABILITY|TERMINATION|CONFIDENTIALITY|IP|OTHER", "level": "LOW|MEDIUM|HIGH", "reason": "Concise justification citing guideline"}

RETRIEVED GUIDELINES: {guidelines_text}
CONTRACT CLAUSE: {clause_text}
```

---

## 🛡️ License & Ethical Notice
ContractGuard is designed as an assistive legal risk screening co-pilot for legal counsel. Autonomous contract execution is prohibited to prevent unauthorized practice of law (UPL). All inference runs strictly on-premise without external data transmission.
