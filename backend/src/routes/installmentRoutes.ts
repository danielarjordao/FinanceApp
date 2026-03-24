import { Router } from 'express';
import { handleCreateInstallmentPlan } from '../controllers/installmentController.js';
import { handleGetInstallmentPlans } from '../controllers/installmentController.js';
import { handleUpdateInstallmentPlan } from '../controllers/installmentController.js';
import { handleDeleteInstallmentPlan } from '../controllers/installmentController.js';

const router = Router();

router.post('/', handleCreateInstallmentPlan);
router.get('/', handleGetInstallmentPlans);
router.patch('/:id', handleUpdateInstallmentPlan);
router.delete('/:id', handleDeleteInstallmentPlan);

export default router;
