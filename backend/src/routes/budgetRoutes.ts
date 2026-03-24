import { Router } from 'express';
import {
    handleCreateBudget,
    handleGetBudgets,
    handleUpdateBudget,
    handleDeleteBudget
} from '../controllers/budgetController.js';

const router = Router();

router.post('/', handleCreateBudget);
router.get('/', handleGetBudgets);
router.patch('/:id', handleUpdateBudget);
router.delete('/:id', handleDeleteBudget);

export default router;
