import { Router } from 'express';
import { getMyAnalytics } from './analytics.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/me', authenticate, getMyAnalytics);

export default router;
