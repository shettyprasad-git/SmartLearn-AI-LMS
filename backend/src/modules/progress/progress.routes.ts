import { Router } from 'express';
import { updateVideoProgress, getProgressBySubject, submitQuizResult, getMyAssignments } from './progress.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/videos/:videoId', updateVideoProgress);
router.post('/videos/:videoId/quiz', submitQuizResult);
router.get('/subjects/:subjectId', getProgressBySubject);
router.get('/me/assignments', getMyAssignments);

export default router;
