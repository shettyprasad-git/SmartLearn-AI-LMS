import { Router } from 'express';
import { getMyNotifications, markAsRead, markAllAsRead } from './notification.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/me', getMyNotifications);
router.patch('/:notificationId/read', markAsRead);
router.patch('/read-all', markAllAsRead);

export default router;
