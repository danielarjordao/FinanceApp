import type { Request, Response } from 'express';
import * as tagService from '../services/tagService.js';
import type { CreateTagDTO } from '../models/tagModel.js';
import { getErrorMessage, sendBadRequest } from '../utils/controllerHelpers.js';
import { validateCreateTag, validateProfileIdQuery, validateTagId } from '../utils/validators/tagValidator.js';

// Cria uma nova Tag validando os campos obrigatórios.
export const createTag = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as CreateTagDTO;

        // Validação dos campos obrigatórios.
        const validation = validateCreateTag(body);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        const newTag = await tagService.createTag(body);

        res.status(201).json({
            status: 'success',
            data: newTag
        });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Error creating tag');
        console.error('[TagController Create Error]:', message);
        sendBadRequest(res, message);
    }
};

// Lista as tags de um perfil (via query params).
export const readTags = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profile_id } = req.query;

        // Validação do parâmetro obrigatório profile_id.
        const validation = validateProfileIdQuery(profile_id);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        const tags = await tagService.readTags(profile_id as string);
        res.status(200).json({
            status: 'success',
            results: tags.length,
            data: tags
        });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Error fetching tags');
        sendBadRequest(res, message);
    }
};

// Atualiza uma tag existente (PATCH/PUT).
export const updateTag = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        const body = req.body as Partial<CreateTagDTO>;

        // Validação do parâmetro obrigatório id.
        const validation = validateTagId(id);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        const updated = await tagService.updateTag(id, body);
        res.status(200).json({ status: 'success', data: updated });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Error updating tag');
        sendBadRequest(res, message);
    }
};

// Remove uma tag (Soft Delete).
export const deleteTag = async (req: Request, res: Response): Promise<void> => {
    try {
        // Força o 'id' a ser tratado como string
        const id = req.params.id as string;

        // Validação do parâmetro obrigatório id.
        const validation = validateTagId(id);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        await tagService.deleteTag(id);
        res.status(200).json({ status: 'success', message: 'Tag removed successfully.' });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Error deleting tag');
        sendBadRequest(res, message);
    }
};
