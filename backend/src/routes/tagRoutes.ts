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
