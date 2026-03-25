import { Router } from 'express';
import { createUserSettings, readUserSettings, updateUserSettings } from '../controllers/userSettingsController.js';

const router = Router();

router.post('/', createUserSettings);
router.get('/', readUserSettings);
router.patch('/:user_id', updateUserSettings);

export default router;
