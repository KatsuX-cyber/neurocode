import { Router } from 'express';
import {
  getLearnerModel,
  updateLearnerModel,
  recordTeachingEvent,
  getConceptMastery,
  updateConceptMastery,
} from '../controllers/learnerController';

const router = Router();

// NAIS — Learner Model endpoints
router.get('/:userId', getLearnerModel);
router.put('/:userId', updateLearnerModel);
router.post('/:userId/event', recordTeachingEvent);
router.get('/:userId/concepts', getConceptMastery);
router.put('/:userId/concepts/:conceptKey', updateConceptMastery);

export default router;
