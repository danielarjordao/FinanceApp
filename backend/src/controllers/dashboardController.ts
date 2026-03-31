import type { Request, Response } from 'express';
import * as dashboardService from '../services/dashboardService.js';
import { getErrorMessage, isValidNonEmptyString, sendBadRequest } from '../utils/controllerHelpers.js';

// Lê o resumo mensal de receitas, despesas e saldo para um perfil.
export const readMonthlySummary = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profile_id, month, year } = req.query;

        // Garante presença dos três parâmetros obrigatórios na query string.
        if (!isValidNonEmptyString(profile_id) || !month || !year) {
            sendBadRequest(res, 'Missing parameters: profile_id, month, and year are required.');
            return;
        }

        const summary = await dashboardService.readMonthlySummary(
            profile_id,
            Number(month),
            Number(year)
        );

        res.status(200).json({ status: 'success', data: summary });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};
