import type { CreateTagDTO } from '../../models/tagModel.js';
import type { ValidationResult } from '../../models/validationModel.js';
import { isValidNonEmptyString } from '../controllerHelpers.js';

// Valida os campos obrigatórios para criação de tag.
export const validateCreateTag = (body: unknown): ValidationResult => {
    const dto = body as CreateTagDTO;

    if (!dto.name || !dto.profile_id) {
        return {
            isValid: false,
            message: 'Missing required fields: name, profile_id.'
        };
    }

    return { isValid: true };
};

// Valida o parâmetro de query profile_id para listagem de tags.
export const validateProfileIdQuery = (profileId: unknown): ValidationResult => {
    if (!isValidNonEmptyString(profileId)) {
        return {
            isValid: false,
            message: 'The profile_id parameter is required in the URL.'
        };
    }

    return { isValid: true };
};

// Valida o parâmetro de rota id para operações unitárias (update, delete).
export const validateTagId = (id: unknown): ValidationResult => {
    if (!isValidNonEmptyString(id)) {
        return {
            isValid: false,
            message: 'The tag ID is required.'
        };
    }

    return { isValid: true };
};
