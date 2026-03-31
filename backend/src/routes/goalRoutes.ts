import { Router } from 'express';
import {
    createGoal,
    readGoals,
    updateGoal,
    deleteGoal
} from '../controllers/goalController.js';

const router = Router();

// Rota POST: Cria uma nova meta
// URL: POST /api/v1/goals
router.post('/', createGoal);

// Rota GET: Lista todas as metas de um perfil
// URL: GET /api/v1/goals?profile_id=XXX
router.get('/', readGoals);

// Rota PATCH: Atualiza os detalhes de uma meta existente
// URL: PATCH /api/v1/goals/:id
router.patch('/:id', updateGoal);

// Rota DELETE: Deleta uma meta (soft delete)
// URL: DELETE /api/v1/goals/:id
router.delete('/:id', deleteGoal);

export default router;
