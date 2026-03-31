import type { Request, Response } from 'express';
import * as categoryService from '../services/categoryService.js';
import type { CreateCategoryDTO } from '../models/categoryModel.js';
import { getErrorMessage, isValidNonEmptyString, sendBadRequest } from '../utils/controllerHelpers.js';

// Cria uma categoria após validar os campos obrigatórios do payload.
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as CreateCategoryDTO;

        // Validação de Defesa dos campos obrigatórios.
        if (!body.name || !body.profile_id || !body.type) {
            sendBadRequest(res, 'Missing required fields: name, profile_id, type.');
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
        const message = getErrorMessage(error, 'An unknown error occurred');

        console.error('[CategoryController Error]:', message);
        sendBadRequest(res, message);
    }
};

// Lista as categorias pertencentes a um perfil específico.
export const readCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profile_id } = req.query;

        if (!isValidNonEmptyString(profile_id)) {
            sendBadRequest(res, 'Invalid profile ID.');
            return;
        }

        const categories = await categoryService.readCategories(profile_id);
        res.status(200).json({ status: 'success', data: categories });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Error');
        sendBadRequest(res, message);
    }
};

// Atualiza os dados de uma categoria já existente.
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const body = req.body as Partial<CreateCategoryDTO>;

        // Validação de Defesa do ID
        if (!isValidNonEmptyString(id)) {
            sendBadRequest(res, 'Invalid category ID.');
            return;
        }

        const updatedCategory = await categoryService.updateCategory(id, body);
        res.status(200).json({ status: 'success', data: updatedCategory });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'An unknown error occurred');

        console.error('[CategoryController Error]:', message);
        sendBadRequest(res, message);
    }
};

// Remove uma categoria de forma lógica (soft delete).
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Validação de Defesa do ID
        if (!isValidNonEmptyString(id)) {
            sendBadRequest(res, 'Invalid category ID.');
            return;
        }

        await categoryService.deleteCategory(id);
        res.status(200).json({ status: 'success', message: 'Category removed.' });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Error');
        sendBadRequest(res, message);
    }
};
