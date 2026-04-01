import { Router } from 'express';
import * as accountController from '../controllers/accountController.js';

const router = Router();

// Rota POST: Cria uma nova conta
// URL: POST /api/v1/accounts
router.post('/', accountController.createAccount);

// Rota GET: Lista todas as contas de um perfil
// URL: GET /api/v1/accounts?profile_id=XXX
router.get('/', accountController.readAccounts);

// Rota PATCH: Atualiza os detalhes de uma conta existente
// URL: PATCH /api/v1/accounts/:id
router.patch('/:id', accountController.updateAccount);

// Rota DELETE: Deleta uma conta (soft delete)
// URL: DELETE /api/v1/accounts/:id
router.delete('/:id', accountController.deleteAccount);

export default router;

import { Router } from 'express';
import {
    createBudget,
    readBudgets,
    updateBudget,
    deleteBudget
} from '../controllers/budgetController.js';

const router = Router();

// Rota POST: Cria um novo orçamento
// URL: POST /api/v1/budgets
router.post('/', createBudget);

// Rota GET: Lista todos os orçamentos de um perfil
// URL: GET /api/v1/budgets?profile_id=XXX
router.get('/', readBudgets);

// Rota PATCH: Atualiza os detalhes de um orçamento existente
// URL: PATCH /api/v1/budgets/:id
router.patch('/:id', updateBudget);

// Rota DELETE: Deleta um orçamento (soft delete)
// URL: DELETE /api/v1/budgets/:id
router.delete('/:id', deleteBudget);

export default router;

import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';

const router = Router();

// Rota POST: Cria uma nova categoria
// URL: POST /api/v1/categories
router.post('/', categoryController.createCategory);

// Rota GET: Lista todas as categorias de um perfil específico
// URL: GET /api/v1/categories?profile_id=XXX
router.get('/', categoryController.readCategories);

// Rota PATCH: Atualiza os detalhes de uma categoria existente
// URL: PATCH /api/v1/categories/:id
router.patch('/:id', categoryController.updateCategory);

// Rota DELETE: Deleta uma categoria (soft delete)
// URL: DELETE /api/v1/categories/:id
router.delete('/:id', categoryController.deleteCategory);

export default router;

import { Router } from 'express';
import { readMonthlySummary } from '../controllers/dashboardController.js';

const router = Router();

// Rota GET: Obtém o resumo mensal do dashboard
// URL: GET /api/v1/dashboard/summary
router.get('/summary', readMonthlySummary);

export default router;

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

import { Router } from 'express';
import {
	createInstallmentPlan,
	readInstallmentPlans,
	updateInstallmentPlan,
	deleteInstallmentPlan
} from '../controllers/installmentController.js';

const router = Router();

// Rota POST: Cria um novo plano de parcelamento
// URL: POST /api/v1/installments
router.post('/', createInstallmentPlan);

// Rota GET: Lista todos os planos de parcelamento
// URL: GET /api/v1/installments?profile_id=XXX
router.get('/', readInstallmentPlans);

// Rota PATCH: Atualiza os detalhes de um plano de parcelamento existente
// URL: PATCH /api/v1/installments/:id
router.patch('/:id', updateInstallmentPlan);

// Rota DELETE: Deleta um plano de parcelamento
// URL: DELETE /api/v1/installments/:id
router.delete('/:id', deleteInstallmentPlan);

export default router;

import { Router } from 'express';
import { createProfile, readProfiles, updateProfile, deleteProfile } from '../controllers/profileController.js';

const router = Router();

// Rota POST: Cria um novo perfil
// URL: POST /api/v1/profiles
router.post('/', createProfile);

// Rota GET: Lista todos os perfis de um usuário
// URL: GET /api/v1/profiles?user_id=XXX
router.get('/', readProfiles);

// Rota PATCH: Atualiza os detalhes de um perfil existente
// URL: PATCH /api/v1/profiles/:id
router.patch('/:id', updateProfile);

// Rota DELETE: Deleta um perfil (soft delete)
// URL: DELETE /api/v1/profiles/:id
router.delete('/:id', deleteProfile);

export default router;

import { Router } from 'express';
import {
    createRecurring,
    readRecurring,
    updateRecurring,
    deleteRecurring
} from '../controllers/recurringController.js';

const router = Router();

// Rota POST: Cria uma nova transação recorrente
// URL: POST /api/v1/recurring
router.post('/', createRecurring);

// Rota GET: Lista todas as transações recorrentes de um perfil
// URL: GET /api/v1/recurring?profile_id=XXX
router.get('/', readRecurring);

// Rota PATCH: Atualiza os detalhes de uma transação recorrente existente
// URL: PATCH /api/v1/recurring/:id
router.patch('/:id', updateRecurring);

// Rota DELETE: Deleta uma transação recorrente
// URL: DELETE /api/v1/recurring/:id
router.delete('/:id', deleteRecurring);

export default router;

import { Router } from 'express';
import * as tagController from '../controllers/tagController.js';

const router = Router();

// Rota POST: Cria uma nova tag
// URL: POST /api/v1/tags
router.post('/', tagController.createTag);

// Rota GET: Lista todas as tags de um perfil
// URL: GET /api/v1/tags?profile_id=XXX
router.get('/', tagController.readTags);

// Rota PATCH: Atualiza os detalhes de uma tag existente
// URL: PATCH /api/v1/tags/:id
router.patch('/:id', tagController.updateTag);

// Rota DELETE: Deleta uma tag (soft delete)
// URL: DELETE /api/v1/tags/:id
router.delete('/:id', tagController.deleteTag);

export default router;

import { Router } from 'express';
import * as transactionController from '../controllers/transactionController.js';

const router = Router();

// Rota POST: Cria uma nova transação
// URL: POST /api/v1/transactions
router.post('/', transactionController.createTransaction);

// Rota GET: Lista todas as transações de um perfil
// URL: GET /api/v1/transactions?profile_id=XXX
router.get('/', transactionController.readTransactions);

// Rota GET: Obtém os detalhes de uma transação específica
// URL: GET /api/v1/transactions/:id
router.get('/:id', transactionController.readTransactionById);

// Rota PATCH: Atualiza os detalhes de uma transação existente
// URL: PATCH /api/v1/transactions/:id
router.patch('/:id', transactionController.updateTransaction);

// Rota DELETE: Deleta uma transação
// URL: DELETE /api/v1/transactions/:id
router.delete('/:id', transactionController.deleteTransaction);

export default router;

import { Router } from 'express';
import * as transactionController from '../controllers/transactionController.js';

const router = Router();

// Rota POST: Cria uma nova transação
// URL: POST /api/v1/transactions
router.post('/', transactionController.createTransaction);

// Rota GET: Lista todas as transações de um perfil
// URL: GET /api/v1/transactions?profile_id=XXX
router.get('/', transactionController.readTransactions);

// Rota GET: Obtém os detalhes de uma transação específica
// URL: GET /api/v1/transactions/:id
router.get('/:id', transactionController.readTransactionById);

// Rota PATCH: Atualiza os detalhes de uma transação existente
// URL: PATCH /api/v1/transactions/:id
router.patch('/:id', transactionController.updateTransaction);

// Rota DELETE: Deleta uma transação
// URL: DELETE /api/v1/transactions/:id
router.delete('/:id', transactionController.deleteTransaction);

export default router;

import { Router } from 'express';
import { createUserSettings, readUserSettings, updateUserSettings } from '../controllers/userSettingsController.js';

const router = Router();

// Rota POST: Cria novas configurações de usuário
// URL: POST /api/v1/user-settings
router.post('/', createUserSettings);

// Rota GET: Lê as configurações de usuário
// URL: GET /api/v1/user-settings?user_id=XXX
router.get('/', readUserSettings);

// Rota PATCH: Atualiza as configurações de usuário
// URL: PATCH /api/v1/user-settings/:user_id
router.patch('/:user_id', updateUserSettings);

export default router;
