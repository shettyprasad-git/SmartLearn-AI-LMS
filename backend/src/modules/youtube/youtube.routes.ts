import { Router } from 'express';
import { searchYouTubeCourses, getSearchSuggestions, importYouTubeCourse } from './youtube.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = Router();

router.get('/search', searchYouTubeCourses);
router.get('/suggestions', getSearchSuggestions);
router.post('/import', authenticate, importYouTubeCourse);

export default router;
