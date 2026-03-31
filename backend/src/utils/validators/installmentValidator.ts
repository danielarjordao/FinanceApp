import type { ValidationResult } from '../../models/validationModel.js';
import { isValidNonEmptyString } from '../controllerHelpers.js';

// Valida o parâmetro de query profile_id para listagem de planos de parcelamento.
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
export const validateInstallmentPlanId = (id: unknown): ValidationResult => {
    if (!isValidNonEmptyString(id)) {
        return {
            isValid: false,
            message: 'The installment plan ID is required.'
        };
    }

    return { isValid: true };
};
