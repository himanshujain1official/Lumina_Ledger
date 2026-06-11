import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route
  app.post('/api/analyze', async (req, res) => {
    try {
      const { text, customApiKey } = req.body;
      
      const apiKey = customApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
         return res.status(500).json({ error: "Gemini API Key is missing. Please provide it in Settings or configure it in AI Studio secrets." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are Lumina Ledger, an expert semantic dispute agent mimicking the Microsoft Foundry Local Knowledge Retrieval framework.
      
Analyze the following raw input text (which may be chat data, emails, or project summaries):
"""
${text}
"""

Perform a logical multi-step audit analysis and output the result in exactly three distinct sections as elegant Markdown:

### 1. Structured Breakdown
Extract the Scope, Milestones, Deadlines, and Fees from the raw input. Use bullet points.

### 2. Audit Analysis
Detail your multi-step reasoning. Identify any conflicting dates, hidden loopholes, shifting commitments, or vague terminology found in the text.

### 3. Conflict Summary Matrix
Provide a clear summary of all identified conflicts with transparent reasoning steps, using a structural layout (a list or short summaries). Keep it highly professional and objective.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to analyze text." });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
