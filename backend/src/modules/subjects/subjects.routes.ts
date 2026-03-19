import { Router } from 'express';
import { getAllSubjects, getSubjectById, enrollSubject, getMyEnrollments } from './subjects.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/', getAllSubjects);
router.get('/enrollments/me', authenticate, getMyEnrollments);
router.get('/:subjectId', getSubjectById);
router.post('/:subjectId/enroll', authenticate, enrollSubject);

export default router;
