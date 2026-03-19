import type { Request, Response } from 'express';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

export const generateRoadmap = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic } = req.body;

    if (!topic) {
      res.status(400).json({ message: "Topic is required" });
      return;
    }

    const prompt = `[INST] You are an expert learning architect. Create a comprehensive, step-by-step learning roadmap for the topic: "${topic}".
Format the response strictly as a JSON object with a "nodes" array and a "connections" array.
Each node should have: "id", "title", "description", "level" (Beginner, Intermediate, Advanced).
Connections should have: "from" (id), "to" (id).
The roadmap should be structured like roadmap.sh, progressing from fundamentals to expert level.
Keep it concise but detailed enough for a complete mastery journey. [/INST]`;

    const response = await hf.textGeneration({
      model: MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 1500,
        temperature: 0.7,
      }
    });

    let aiOutput = response.generated_text.replace(prompt, '').trim();
    const jsonStart = aiOutput.indexOf('{');
    const jsonEnd = aiOutput.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd !== -1) {
      aiOutput = aiOutput.substring(jsonStart, jsonEnd);
    }

    try {
      const roadmap = JSON.parse(aiOutput);
      res.status(200).json(roadmap);
    } catch (parseError) {
      console.error('JSON Parse Error:', aiOutput);
      res.status(500).json({ message: "Failed to parse roadmap JSON", raw: aiOutput });
    }
  } catch (error: any) {
    console.error('Roadmap Generation Error:', error);
    res.status(500).json({ message: "Error generating roadmap", error: error.message });
  }
};
