import type { Request, Response } from 'express';
import * as profileService from '../services/profileService.js';
import type { CreateProfileDTO } from '../models/profileModel.js';
import { getErrorMessage, sendBadRequest } from '../utils/controllerHelpers.js';
import { validateCreateProfile, validateUserIdQuery, validateProfileId } from '../utils/validators/profileValidator.js';

// Cria um novo perfil para o utilizador informado.
export const createProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const body = req.body as CreateProfileDTO;

        // Validação dos campos obrigatórios: user_id, name.
        const validation = validateCreateProfile(body);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        const profile = await profileService.createProfile(body);
        res.status(201).json({ status: 'success', data: profile });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Lista todos os perfis pertencentes a um utilizador.
export const readProfiles = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id } = req.query;

        // Validação do parâmetro obrigatório user_id.
        const validation = validateUserIdQuery(user_id);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        const profiles = await profileService.readProfiles(user_id as string);
        res.status(200).json({ status: 'success', data: profiles });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Atualiza parcialmente um perfil existente.
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        const body = req.body as Partial<CreateProfileDTO>;

        // Validação do parâmetro obrigatório id.
        const validation = validateProfileId(id);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        const updated = await profileService.updateProfile(id, body);
        res.status(200).json({ status: 'success', data: updated });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};

// Remove um perfil de forma lógica (soft delete).
export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };

        // Validação do parâmetro obrigatório id.
        const validation = validateProfileId(id);
        if (!validation.isValid) {
            sendBadRequest(res, validation.message!);
            return;
        }

        await profileService.deleteProfile(id);
        res.status(200).json({ status: 'success', message: 'Profile deleted successfully (soft delete)' });
    } catch (error: unknown) {
        const message = getErrorMessage(error, 'Unknown error');
        sendBadRequest(res, message);
    }
};
