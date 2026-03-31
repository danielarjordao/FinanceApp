import type { Request, Response } from 'express';
import * as installmentService from '../services/installmentService.js';
import * as accountService from '../services/accountService.js';
import type { CreateInstallmentDTO } from '../models/installmentModel.js';
import { getErrorMessage, sendBadRequest } from '../utils/controllerHelpers.js';
import { validateProfileIdQuery, validateInstallmentPlanId } from '../utils/validators/installmentValidator.js';

// Cria um plano de parcelamento e atualiza o saldo da conta na primeira parcela.
export const createInstallmentPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body as CreateInstallmentDTO;

        // Cria o plano e as N transações
        const plan = await installmentService.createInstallmentPlan(data);

        // Calcula o valor da primeira parcela (a que entra como COMPLETED)
        const firstInstallmentAmount = Number((data.total_amount / data.installments).toFixed(2));

        // Desconta APENAS a primeira parcela do saldo da conta
        // Assumindo que o parcelamento é sempre uma despesa (DEBIT)
        await accountService.updateAccountBalance(
            data.account_id,
            firstInstallmentAmount,
            'DEBIT'
        );

        res.status(201).json({
            status: 'success',
            message: `Installment plan created with ${data.installments} transactions.`,
            data: plan
        });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Lista planos de parcelamento de um perfil.
export const readInstallmentPlans = async (req: Request, res: Response): Promise<void> => {
    try {
        const profileId = req.query.profile_id;

        // Validação do parâmetro obrigatório profile_id.
        const validation = validateProfileIdQuery(profileId);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        const plans = await installmentService.readInstallmentPlans(profileId as string);
        res.status(200).json({ status: 'success', data: plans });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Atualiza dados do plano de parcelamento (atualmente descrição).
export const updateInstallmentPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        const { description } = req.body;

        // Validação do parâmetro obrigatório id.
        const validation = validateInstallmentPlanId(id);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        const updatedPlan = await installmentService.updateInstallmentPlan(id, description);
        res.status(200).json({ status: 'success', data: updatedPlan });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Cancela um plano de parcelamento e suas parcelas pendentes.
export const deleteInstallmentPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };

        // Validação do parâmetro obrigatório id.
        const validation = validateInstallmentPlanId(id);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        await installmentService.deleteInstallmentPlan(id);
        res.status(200).json({ status: 'success', message: 'Installment plan cancelled successfully' });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};
