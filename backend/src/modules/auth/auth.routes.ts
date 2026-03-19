import { Router } from 'express';
import { register, login, refresh, logout, updateProfile, changePassword } from './auth.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);

export default router;
