import type { CreateProfileDTO } from '../../models/profileModel.js';
import type { ValidationResult } from '../../models/validationModel.js';
import { isValidNonEmptyString } from '../controllerHelpers.js';

// Valida os campos obrigatórios para criação de perfil.
export const validateCreateProfile = (body: unknown): ValidationResult => {
    const dto = body as CreateProfileDTO;

    if (!dto.user_id || !dto.name) {
        return {
            isValid: false,
            message: 'Missing required fields: user_id, name.'
        };
    }

    return { isValid: true };
};

// Valida o parâmetro de query user_id para listagem de perfis.
export const validateUserIdQuery = (userId: unknown): ValidationResult => {
    if (!isValidNonEmptyString(userId)) {
        return {
            isValid: false,
            message: 'The user_id parameter is required in the URL.'
        };
    }

    return { isValid: true };
};

// Valida o parâmetro de rota id para operações unitárias (update, delete).
export const validateProfileId = (id: unknown): ValidationResult => {
    if (!isValidNonEmptyString(id)) {
        return {
            isValid: false,
            message: 'The profile ID is required.'
        };
    }

    return { isValid: true };
};
