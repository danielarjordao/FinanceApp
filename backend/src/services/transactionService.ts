import { supabase } from '../config/supabase.js';

// --- INTERFACES ---
export interface CreateTransactionDTO {
    account_id: string;
    category_id?: string | null;
    transfer_account_id?: string | null;
    type: string;
    amount: number;
    date: string;
    description?: string;
    status?: string;
}

export interface TransactionResponse {
    id: string;
    account_id: string;
    transfer_account_id: string | null;
    category_id: string | null;
    type: string;
    amount: number;
    date: string;
    effective_date: string;
    description: string | null;
    status: string;
    created_at: string;
    updated_at: string;
}

// --- FUNÇÕES AUXILIARES (SINGLE RESPONSIBILITY) ---

// Valida as regras de negócio antes de interagir com a base de dados.
const validateTransactionLogic = (data: CreateTransactionDTO, type: string): void => {
    if (type === 'TRANSFER') {
        if (!data.transfer_account_id || data.account_id === data.transfer_account_id) {
            throw new Error('Transfers require a destination account different from the origin.');
        }
        if (data.category_id) {
            throw new Error('Transfers should not have an associated category.');
        }
    } else if (type === 'EXPENSE' || type === 'INCOME') {
        if (data.transfer_account_id) {
            throw new Error('Income and Expenses cannot have a destination account.');
        }
        if (!data.category_id) {
            throw new Error('Income and Expenses require a category.');
        }
    } else {
         throw new Error('Invalid transaction type. Allowed types: INCOME, EXPENSE, TRANSFER.');
    }
};

// Atualiza o saldo de uma conta de forma matemática.
const updateAccountBalance = async (accountId: string, amount: number, operation: 'CREDIT' | 'DEBIT'): Promise<void> => {
    // Busca o saldo atual
    const { data: account, error: accError } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', accountId)
        .single();

    if (accError) throw new Error(`Failed to fetch account balance: ${accError.message}`);

    let newBalance = Number(account.balance);

    // Calcula o novo saldo (Soma se for CREDIT, subtrai se for DEBIT)
    if (operation === 'CREDIT') {
        newBalance += amount;
    } else {
        newBalance -= amount;
    }

    // Grava o novo valor na base de dados
    const { error: updateError } = await supabase
        .from('accounts')
        .update({ balance: newBalance })
        .eq('id', accountId);

    if (updateError)
        throw new Error(`Failed to update account balance: ${updateError.message}`);
};

// Orquestra a criação de uma transação, chamando as funções auxiliares
export const createTransaction = async (data: CreateTransactionDTO): Promise<TransactionResponse> => {
    // Normaliza os dados de entrada
    const type = data.type?.toUpperCase() || '';
    const amount = Math.abs(Number(data.amount));
    const date = data.date;
    const effective_date = data.date;

    // Valida as regras de negócio
    validateTransactionLogic(data, type);

    // Insere a transação na base de dados
    const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert([{
            account_id: data.account_id,
            transfer_account_id: data.transfer_account_id || null,
            category_id: data.category_id || null,
            type: type,
            amount: amount,
            date: date,
            effective_date: effective_date,
            description: data.description || null,
            status: data.status || 'COMPLETED'
        }])
        .select()
        .single();

    // Verifica se houve erro na inserção da transação
    if (txError)
        throw new Error(`Database error during transaction creation: ${txError.message}`);

    // Atualiza o saldo da conta de origem
    // Se for INCOME entra dinheiro (CREDIT). Se for EXPENSE ou TRANSFER, sai dinheiro (DEBIT).
    const originOperation = type === 'INCOME' ? 'CREDIT' : 'DEBIT';
    // Atualiza a conta de origem com a operação correta (CREDIT para INCOME, DEBIT para EXPENSE e TRANSFER)
    await updateAccountBalance(data.account_id, amount, originOperation);

    // Atualiza a conta de destino se for uma transferência (TRANSFER)
    if (type === 'TRANSFER' && data.transfer_account_id) {
        // Na conta de destino, a transferência faz sempre o dinheiro ENTRAR (CREDIT)
        await updateAccountBalance(data.transfer_account_id, amount, 'CREDIT');
    }

    return transaction as TransactionResponse;
};
