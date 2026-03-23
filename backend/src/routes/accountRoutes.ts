import { Router } from 'express';
import * as accountController from '../controllers/accountController.js';

const router = Router();

// Rota POST: Cria uma nova conta
// URL: POST /api/v1/accounts
router.post('/', accountController.createAccount);

export default router;
