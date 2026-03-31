import type { Request, Response } from 'express';
import * as recurringService from '../services/recurringService.js';
import type { CreateRecurringDTO } from '../models/recurringModel.js';
import { getErrorMessage, isValidNonEmptyString, sendBadRequest } from '../utils/controllerHelpers.js';

// Cria uma nova transação recorrente.
export const createRecurring = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as CreateRecurringDTO;

        // Validação básica (Fail-Fast)
        if (!body.profile_id || !body.account_id || !body.amount || !body.frequency || !body.start_date || !body.next_run_date || !body.type) {
            sendBadRequest(res, 'Missing required fields for recurring transaction.');
            return;
        }

        const recurring = await recurringService.createRecurring(body);
        res.status(201).json({ status: 'success', data: recurring });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Lista todas as recorrências de um perfil.
export const readRecurring = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profile_id } = req.query;

        if (!isValidNonEmptyString(profile_id)) {
            sendBadRequest(res, 'profile_id is required');
            return;
        }

        const recurringList = await recurringService.getRecurringByProfile(profile_id);
        res.status(200).json({ status: 'success', data: recurringList });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Atualiza parcialmente uma recorrência existente.
export const updateRecurring = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        const body = req.body as Partial<CreateRecurringDTO>;

        const updated = await recurringService.updateRecurring(id, body);
        res.status(200).json({ status: 'success', data: updated });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Remove uma recorrência de forma lógica (soft delete).
export const deleteRecurring = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        await recurringService.deleteRecurring(id);
        res.status(200).json({ status: 'success', message: 'Recurring transaction deleted successfully' });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};
