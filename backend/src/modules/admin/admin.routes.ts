import { Router } from 'express';
import { importPlaylist } from './admin.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

// Protect admin routes
router.use(authenticate);

router.post('/import-playlist', importPlaylist);

export default router;
