import { Router } from 'express';
import { updateVideoProgress, getProgressBySubject } from './progress.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/videos/:videoId', updateVideoProgress);
router.get('/subjects/:subjectId', getProgressBySubject);

export default router;
