# ⚖️ Lumina Ledger: The Semantic Dispute Agent

**Lumina Ledger** is a hybrid, zero-cost Multi-Agent system engineered for the **Microsoft Agents League Hackathon 2026** under the **Reasoning Agents Track**. It bridges the gap between informal multi-channel communications (such as WhatsApp business chats, freelance threads, and email dumps) and legally defensible agreement frameworks, effectively eliminating post-agreement micro-fraud and contractual drift for freelancers and micro-vendors.

Built with a focus on absolute **Reliability & Safety** (20% Rubric weight) and **Reasoning & Multi-step Thinking** (20% Rubric weight), Lumina Ledger implements a local multi-agent architecture inspired by the **Microsoft Foundry Local Strategy** (`Foundry-Local-Lab`) combined with the lightning-fast inference of **Gemini API)**.

---

## 🚀 Key Features

- **Pristine Microsoft Fluent Identity (UX & Presentation - 15%):** A modern, minimalist light-themed dashboard engineered with Fluent system tokens (`#F3F4F6` and `#0078D4`), glassmorphic Mica-inspired layers, fluid motion animations, and controlled state metric badges.
- **Foundry Local Multi-Step Reasoning:** Executes a structured Chain-of-Thought (CoT) sequence to ingest chaotic raw chats, resolve shifting commitments, catch logical discrepancies, and map conflicts without heavy cloud dependency.
- **Zero-Hallucination Guardrails:** Factual verification protocols enforce hard safety bounds, ensuring every dispute log entry is tightly grounded in the initial proposition text.
- **Local In-Memory Audit Exports:** Instantly compiles reasoning traces and conflict matrix logs into a downloadable markdown report (`Lumina_Ledger_Audit_Report.md`) without any external server roundtrips.

---

## 🏗️ Architecture & Flow Matrix

 [Unstructured Raw Input] (WhatsApp/Email Text Heap)
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│   Agent 1: Ingestion & Token Synthesizer (Gemini API)  │ ──► Structuring & Entity Extraction
└────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│  Agent 2: Foundry Local Auditor Layer (Reasoning CoT)  │ ──► Step-by-Step Agreement Analysis
└────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────┐
│   Agent 3: Conflict Matrix Evaluator & Safety Filter   │ ──► Grounded Validation (No Cloud Required)
└────────────────────────────────────────────────────────┘
                        │
                        ▼
 [Fluent Light UI Dashboard] ──► [Client-Side Downloadable Report (.md)]

 ---

## 🛠️ Tech Stack & Ecosystem

- **Frontend Application:** React 19, TypeScript, Vite
- **Styling & Motion Layout:** Tailwind CSS v4, Framer Motion
- **Backend Orchestration Gateway:** Node.js, Express (Configured for secure client-to-API abstraction routing)
- **Core Cognitive AI Layer:** Google AI Studio SDK (`@google/genai` v2.4.0) via `gemini-1.5-flash-8b` model
- **Design Pattern Blueprint:** Microsoft Foundry Local Lab Strategy (`Foundry-Local-Lab`)

---

## ⚡ Getting Started (Local Deployment)

Ensure you have **Node.js** installed locally on your system.

### 1. Clone & Project Initialization

git clone 
[https://github.com/himanshujain1official/Lumina_Ledger.git] (https://github.com/himanshujain1official/Lumina_Ledger.git)
**cd Lumina_Ledger**

#### 2. Dependency Resolution:- 
Install all frontend and proxy-routing components specified inside the package parameters:

npm install

#### 3. Execution of Local Host Server:- 
Spin up the development architecture:

npm run dev

Open your browser and navigate to the mapped local address (typically http://localhost:3000) to experience the fully functional Fluent light app container.

**License**

This repository is distributed under the terms of the MIT License.
Developed as part of the Microsoft AI Skills Fest / Agents League Hackathon 2026.