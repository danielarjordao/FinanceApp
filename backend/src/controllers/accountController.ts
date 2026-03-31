import type { Request, Response } from 'express';
import * as accountService from '../services/accountService.js';
import type { CreateAccountDTO } from '../models/accountModel.js';
import { getErrorMessage, isValidNonEmptyString, sendBadRequest } from '../utils/controllerHelpers.js';

// Cria uma nova conta após validar os campos obrigatórios do payload.
export const createAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as CreateAccountDTO;

        // Regra de entrada: profile_id e name são obrigatórios para criar a conta.
        if (!body.profile_id || !body.name) {
            sendBadRequest(res, 'Missing required fields: profile_id, name.');
            return;
        }

        // Delega a regra de negócio/persistência ao serviço.
        const newAccount = await accountService.createAccount(body);

        // Mantém o contrato de sucesso: status 201 com a conta criada.
        res.status(201).json({
            status: 'success',
            data: newAccount
        });

    } catch (error: unknown) {
        const message = getErrorMessage(error, 'An unknown error occurred');

        console.error('[AccountController Error]:', message);
        sendBadRequest(res, message);
    }
};

// Lista todas as contas de um perfil a partir do parâmetro de query profile_id.
export const readAccounts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { profile_id } = req.query;

        // Garante que profile_id veio corretamente na query string.
        if (!isValidNonEmptyString(profile_id)) {
            sendBadRequest(res, 'Invalid profile ID.');
            return;
        }

        const accounts = await accountService.readAccounts(profile_id);
        res.status(200).json({ status: 'success', data: accounts });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Error');
        sendBadRequest(res, message);
    }
};

// Atualiza parcialmente uma conta existente com base no id enviado na rota.
export const updateAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const body = req.body as Partial<CreateAccountDTO>;

        // Impede atualização sem identificador válido.
        if (!isValidNonEmptyString(id)) {
            sendBadRequest(res, 'Invalid account ID.');
            return;
        }

        const updatedAccount = await accountService.updateAccount(id, body);
        res.status(200).json({ status: 'success', data: updatedAccount });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Error');
        sendBadRequest(res, message);
    }
};

// Remove uma conta de forma lógica (soft delete), preservando histórico no banco.
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Valida o identificador antes de delegar a operação ao serviço.
        if (!isValidNonEmptyString(id)) {
            sendBadRequest(res, 'Invalid account ID.');
            return;
        }

        await accountService.deleteAccount(id);
        res.status(200).json({ status: 'success', message: 'Account removed.' });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Error');
        sendBadRequest(res, message);
    }
};
