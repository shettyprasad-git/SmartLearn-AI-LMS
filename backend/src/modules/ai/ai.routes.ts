import { Router } from 'express';
import { chatTutor, generateNotes, generateQuiz } from './ai.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/chat', chatTutor);
router.post('/videos/:videoId/generate-notes', generateNotes);
router.post('/videos/:videoId/generate-quiz', generateQuiz);

export default router;
