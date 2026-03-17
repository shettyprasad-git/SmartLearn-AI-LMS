import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/authMiddleware.js';
import prisma from '../../config/db.js';

export const chatTutor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { videoId, question } = req.body;

    // 1. Fetch video transcript for context
    const videoTranscript = await prisma.videoTranscript.findFirst({
      where: { video_id: videoId }
    });

    const context = videoTranscript?.transcript || 'No transcript available for this video.';

    // 2. Call AI Service (Mocked for now)
    // In production, you would call OpenAI/Gemini here with the context and question
    const aiResponse = `Hello! Based on the video content, here is the answer to your question: "${question}". [MOCKED AI RESPONSE: The video explains that ${context.substring(0, 100)}...]`;

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Tutor service error' });
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

    // Mocked Note Generation
    const notes = await prisma.videoNote.upsert({
      where: { id: videoId }, // Using videoId as ID for simplicity or composite unique
      update: {
        summary: 'This video covers the basics of the topic...',
        key_points: JSON.stringify(['Point 1', 'Point 2', 'Point 3']),
        important_terms: JSON.stringify(['Term A', 'Term B']),
      },
      create: {
        id: videoId,
        video_id: videoId,
        summary: 'This video covers the basics of the topic...',
        key_points: JSON.stringify(['Point 1', 'Point 2', 'Point 3']),
        important_terms: JSON.stringify(['Term A', 'Term B']),
      }
    });

    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating notes' });
  }
};

export const generateQuiz = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;

    // Mocked Quiz Generation
    const questions = [
      { question: 'What is X?', options: ['A', 'B', 'C', 'D'], answer: 'A' },
      { question: 'How does Y work?', options: ['1', '2', '3', '4'], answer: '2' },
      { question: 'Why use Z?', options: ['Yes', 'No', 'Maybe', 'Always'], answer: 'Always' },
      { question: 'When to do W?', options: ['Now', 'Later', 'Never', 'Sometimes'], answer: 'Now' },
      { question: 'Where is V?', options: ['Here', 'There', 'Everywhere', 'Nowhere'], answer: 'Here' },
    ];

    const quiz = await prisma.videoQuiz.upsert({
      where: { id: videoId },
      update: { questions: JSON.stringify(questions) },
      create: {
        id: videoId,
        video_id: videoId,
        questions: JSON.stringify(questions)
      }
    });

    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating quiz' });
  }
};
