import { Router } from 'express';
import { getStatus, getStats } from './AppController';

const router = Router();

router.get('/status', getStatus);
router.get('/stats', getStats);

export default router;
