import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/authMiddleware.js';
import prisma from '../../config/db.js';
import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const MODEL = "mistralai/Mistral-7B-Instruct-v0.2";

export const chatTutor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { videoId, question } = req.body;

    const videoTranscript = await prisma.videoTranscript.findFirst({
      where: { video_id: videoId }
    });

    const context = videoTranscript?.transcript || 'No transcript available for this video.';

    const prompt = `[INST] You are an expert AI tutor for the SmartLearn LMS. 
Based on the following video transcript context, answer the student's question accurately and helpfully.
Context: ${context.substring(0, 3000)}
Question: ${question} [/INST]`;

    const response = await hf.textGeneration({
      model: MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 500,
        temperature: 0.7,
      }
    });

    res.status(200).json({ response: response.generated_text.replace(prompt, '').trim() });
  } catch (error) {
    console.error('AI Tutor Error:', error);
    res.status(500).json({ message: 'AI Tutor service error', error: (error as any).message });
  }
};

export const generateNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;

    const transcript = await prisma.videoTranscript.findFirst({ where: { video_id: videoId } });
    if (!transcript) {
       res.status(404).json({ message: 'Transcript not found. Please sync transcript first.' });
       return;
    }

    const prompt = `[INST] You are an expert educator. Create comprehensive study notes based on the following transcript.
Provide a summary, a list of at least 5 key points, and 3 important technical terms with definitions.
Format the response strictly as JSON with keys: "summary", "key_points" (array), "important_terms" (array of strings like "Term: Definition").
Transcript: ${transcript.transcript.substring(0, 3000)} [/INST]`;

    const response = await hf.textGeneration({
      model: MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.5,
      }
    });

    let aiOutput = response.generated_text.replace(prompt, '').trim();
    // Rough cleanup if prompt isn't perfectly removed
    const jsonStart = aiOutput.indexOf('{');
    const jsonEnd = aiOutput.lastIndexOf('}') + 1;
    if (jsonStart !== -1 && jsonEnd !== -1) {
      aiOutput = aiOutput.substring(jsonStart, jsonEnd);
    }

    const parsedNotes = JSON.parse(aiOutput);

    const notes = await prisma.videoNote.upsert({
      where: { video_id: videoId },
      update: {
        summary: parsedNotes.summary,
        key_points: JSON.stringify(parsedNotes.key_points),
        important_terms: JSON.stringify(parsedNotes.important_terms),
      },
      create: {
        video_id: videoId,
        summary: parsedNotes.summary,
        key_points: JSON.stringify(parsedNotes.key_points),
        important_terms: JSON.stringify(parsedNotes.important_terms),
      }
    });

    res.status(200).json(notes);
  } catch (error) {
    console.error('Note Generation Error:', error);
    res.status(500).json({ message: 'Error generating notes', error: (error as any).message });
  }
};

export const generateQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    const transcript = await prisma.videoTranscript.findFirst({ where: { video_id: videoId } });
    
    const context = transcript?.transcript || "General knowledge about this topic.";

    const prompt = `[INST] Create a 5-question multiple choice quiz based on this content. 
Format strictly as a JSON array of objects with keys: "question", "options" (array of 4), "answer" (the correct option string).
Context: ${context.substring(0, 3000)} [/INST]`;

    const response = await hf.textGeneration({
      model: MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.5,
      }
    });

    let aiOutput = response.generated_text.replace(prompt, '').trim();
    const jsonStart = aiOutput.indexOf('[');
    const jsonEnd = aiOutput.lastIndexOf(']') + 1;
    if (jsonStart !== -1 && jsonEnd !== -1) {
      aiOutput = aiOutput.substring(jsonStart, jsonEnd);
    }

    const quiz = await prisma.videoQuiz.upsert({
      where: { video_id: videoId },
      update: { questions: aiOutput },
      create: {
        video_id: videoId,
        questions: aiOutput
      }
    });

    res.status(200).json(quiz);
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    res.status(500).json({ message: 'Error generating quiz', error: (error as any).message });
  }
};
