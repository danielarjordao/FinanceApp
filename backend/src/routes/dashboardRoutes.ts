import { Router } from 'express';
import { handleGetMonthlySummary } from '../controllers/dashboardController.js';

const router = Router();
router.get('/summary', handleGetMonthlySummary);

export default router;
