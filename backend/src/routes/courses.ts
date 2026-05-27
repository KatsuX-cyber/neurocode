import { Router } from 'express';
import { getCourses, getLesson, saveProgress, validateLessonCode } from '../controllers/courseController';

const router = Router();

router.get('/', getCourses);
router.get('/lesson/:id', getLesson);
router.post('/lesson/:id/validate', validateLessonCode);
router.post('/progress', saveProgress);

export default router;
