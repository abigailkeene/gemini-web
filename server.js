import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // serve index.html, app.js, etc.

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Simple health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Prompt endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }
    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Generation failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
