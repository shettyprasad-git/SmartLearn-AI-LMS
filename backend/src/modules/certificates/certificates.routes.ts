import { Router } from 'express';
import { getCertificate, verifyCertificate } from './certificates.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/:subjectId', authenticate, getCertificate);
router.get('/verify/:certificateCode', verifyCertificate);

export default router;
