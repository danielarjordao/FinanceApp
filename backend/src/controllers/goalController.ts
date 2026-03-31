import type { Request, Response } from 'express';
import * as goalService from '../services/goalService.js';
import type { CreateGoalDTO } from '../models/goalModel.js';
import { getErrorMessage, sendBadRequest } from '../utils/controllerHelpers.js';
import { validateProfileIdQuery, validateGoalId } from '../utils/validators/goalValidator.js';

// Cria uma nova meta para o perfil informado no payload.
export const createGoal = async (req: Request, res: Response): Promise<void> => {
    try {
        const goal = await goalService.createGoal(req.body as CreateGoalDTO);
        res.status(201).json({ status: 'success', data: goal });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Lista metas de um perfil específico via parâmetro de query.
export const readGoals = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profile_id } = req.query;

        // Validação do parâmetro obrigatório profile_id.
        const validation = validateProfileIdQuery(profile_id);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        const goals = await goalService.readGoalsByProfile(profile_id as string);
        res.status(200).json({ status: 'success', data: goals });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Atualiza parcialmente uma meta existente com base no id da rota.
export const updateGoal = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };

        // Validação do parâmetro obrigatório id.
        const validation = validateGoalId(id);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        const updated = await goalService.updateGoal(id, req.body as Partial<CreateGoalDTO>);
        res.status(200).json({ status: 'success', data: updated });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Remove uma meta de forma lógica (soft delete).
export const deleteGoal = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };

        // Validação do parâmetro obrigatório id.
        const validation = validateGoalId(id);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        await goalService.deleteGoal(id);
        res.status(200).json({ status: 'success', message: 'Goal deleted successfully' });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};
