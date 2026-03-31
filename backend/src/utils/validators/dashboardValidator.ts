import type { ValidationResult } from '../../models/validationModel.js';
import { isValidNonEmptyString } from '../controllerHelpers.js';

// Valida os parâmetros obrigatórios para leitura do resumo mensal.
export const validateMonthlySummaryParams = (profileId: unknown, month: unknown, year: unknown): ValidationResult => {
    if (!isValidNonEmptyString(profileId) || !month || !year) {
        return {
            isValid: false,
            message: 'Missing parameters: profile_id, month, and year are required in the URL.'
        };
    }

    return { isValid: true };
};
