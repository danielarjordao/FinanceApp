import type { Request, Response } from 'express';
import * as dashboardService from '../services/dashboardService.js';
import { getErrorMessage, sendBadRequest } from '../utils/controllerHelpers.js';
import { validateMonthlySummaryParams } from '../utils/validators/dashboardValidator.js';

// Lê o resumo mensal de receitas, despesas e saldo para um perfil.
export const readMonthlySummary = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profile_id, month, year } = req.query;

        // Validação dos parâmetros obrigatórios.
        const validation = validateMonthlySummaryParams(profile_id, month, year);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        const summary = await dashboardService.readMonthlySummary(
            profile_id as string,
            Number(month),
            Number(year)
        );

        res.status(200).json({ status: 'success', data: summary });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};
