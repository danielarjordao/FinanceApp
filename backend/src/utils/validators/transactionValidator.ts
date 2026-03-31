import type { CreateTransactionDTO } from '../../models/transactionModel.js';
import type { ValidationResult } from '../../models/validationModel.js';
import { isValidNonEmptyString } from '../controllerHelpers.js';

// Valida os campos obrigatórios para criação de transação.
export const validateCreateTransaction = (body: unknown): ValidationResult => {
    const dto = body as CreateTransactionDTO;

    if (!dto.account_id || !dto.type || !dto.amount || !dto.date) {
        return {
            isValid: false,
            message: 'Missing required fields: account_id, type, amount, date.'
        };
    }

    return { isValid: true };
};

// Valida o parâmetro de query profile_id para listagem de transações.
export const validateProfileIdQuery = (profileId: unknown): ValidationResult => {
    if (!isValidNonEmptyString(profileId)) {
        return {
            isValid: false,
            message: 'The profile_id parameter is required in the URL.'
        };
    }

    return { isValid: true };
};

// Valida o parâmetro de rota id para operações unitárias (read by id, update, delete).
export const validateTransactionId = (id: unknown): ValidationResult => {
    if (!isValidNonEmptyString(id)) {
        return {
            isValid: false,
            message: 'The transaction ID is required.'
        };
    }

    return { isValid: true };
};
