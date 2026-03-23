import type { Request, Response } from 'express';
import * as categoryService from '../services/categoryService.js';
import type { CategoryInput } from '../services/categoryService.js';

// Controlador de Categorias.
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as CategoryInput;

        // Validação de Defesa dos campos obrigatórios.
        if (!body.name || !body.profile_id || !body.type) {
            res.status(400).json({
                status: 'error',
                message: 'Missing required fields: name, profile_id, type.'
            });
            return;
        }

        // Chamada ao serviço com nome corrigido
        const newCategory = await categoryService.createCategory(body);

        // Resposta de Sucesso
        res.status(201).json({
            status: 'success',
            data: newCategory
        });

    } catch (error: unknown) {
        let message = 'An unknown error occurred';

        if (error instanceof Error) {
            message = error.message;
        } else if (error && typeof error === 'object' && 'message' in error) {
            message = String(error.message);
        }

        console.error('[CategoryController Error]:', message);
        res.status(400).json({ status: 'error', message });
    }
};
