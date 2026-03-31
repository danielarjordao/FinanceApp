import type { Request, Response } from 'express';
import * as userSettingsService from '../services/userSettingsService.js';
import type { CreateUserSettingsDTO } from '../models/userSettingsModel.js';
import { getErrorMessage, isValidNonEmptyString, sendBadRequest } from '../utils/controllerHelpers.js';

// Cria as configurações iniciais do utilizador.
export const createUserSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as CreateUserSettingsDTO;

        if (!body.user_id) {
            sendBadRequest(res, 'Missing required field: user_id.');
            return;
        }

        const settings = await userSettingsService.createUserSettings(body);
        res.status(201).json({ status: 'success', data: settings });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Lê as configurações de um utilizador específico.
export const readUserSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id } = req.query;

        if (!isValidNonEmptyString(user_id)) {
            sendBadRequest(res, 'user_id is required in query parameters.');
            return;
        }

        const settings = await userSettingsService.readUserSettings(user_id);
        res.status(200).json({ status: 'success', data: settings });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Atualiza as configurações de um utilizador pelo user_id na rota.
export const updateUserSettings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id } = req.params as { user_id: string }; // Atualizamos usando o user_id na URL
        const body = req.body as Partial<CreateUserSettingsDTO>;

        const updated = await userSettingsService.updateUserSettings(user_id, body);
        res.status(200).json({ status: 'success', data: updated });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Nota: Sem deleteUserSettings, conforme a regra de negócio.
