import { supabase } from '../config/supabase.js';
import * as tagService from './tagService.js';
import { updateAccountBalance } from './accountService.js';

export interface CreateTransactionDTO {
    account_id: string;
    category_id?: string | null;
    transfer_account_id?: string | null;
    type: string;
    amount: number;
    date: string;
    description?: string;
    status?: string;
    tags?: string[];
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

export interface TransactionFilters {
    month?: number;
    year?: number;
    type?: string;
    categoryId?: string;
    search?: string;
    tagId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface TransactionWithDetails extends TransactionResponse {
    categories: { name: string; icon: string; color?: string; } | null; // <- ADICIONADO: color aqui
    origin_account: { name: string; } | null;
    destination_account: { name: string; } | null;
}

// FUNÇÕES AUXILIARES

const validateTransactionLogic = (data: Partial<CreateTransactionDTO>, type: string): void => {
    if (type === 'TRANSFER') {
        if (!data.transfer_account_id || data.account_id === data.transfer_account_id) {
            throw new Error('Transfers require a valid destination account different from the origin account.');
        }
        if (data.category_id) {
            throw new Error('Transfers should not have a category.');
        }
    } else if (type === 'EXPENSE' || type === 'INCOME') {
        if (data.transfer_account_id) {
            throw new Error('Incomes and Expenses should not have a transfer account.');
        }
        if (!data.category_id) {
            throw new Error('Incomes and Expenses require a category.');
        }
    } else {
        throw new Error('Invalid transaction type. Must be INCOME, EXPENSE, or TRANSFER.');
    }
};

const revertTransactionBalance = async (transaction: TransactionResponse): Promise<void> => {
    const amount = Number(transaction.amount);

    if (transaction.type === 'EXPENSE') {
        await updateAccountBalance(transaction.account_id, amount, 'CREDIT');
    } else if (transaction.type === 'INCOME') {
        await updateAccountBalance(transaction.account_id, amount, 'DEBIT');
    } else if (transaction.type === 'TRANSFER') {
        await updateAccountBalance(transaction.account_id, amount, 'CREDIT');
        if (transaction.transfer_account_id) {
            await updateAccountBalance(transaction.transfer_account_id, amount, 'DEBIT');
        }
    }
};

const applyTransactionBalance = async (transaction: TransactionResponse): Promise<void> => {
    const amount = Number(transaction.amount);

    if (transaction.type === 'EXPENSE') {
        await updateAccountBalance(transaction.account_id, amount, 'DEBIT');
    } else if (transaction.type === 'INCOME') {
        await updateAccountBalance(transaction.account_id, amount, 'CREDIT');
    } else if (transaction.type === 'TRANSFER') {
        await updateAccountBalance(transaction.account_id, amount, 'DEBIT');
        if (transaction.transfer_account_id) {
            await updateAccountBalance(transaction.transfer_account_id, amount, 'CREDIT');
        }
    }
};

// SERVIÇOS PRINCIPAIS (CRUD)

export const createTransaction = async (data: CreateTransactionDTO): Promise<TransactionResponse> => {
    const type = data.type?.toUpperCase() || '';
    const amount = Math.abs(Number(data.amount));

    validateTransactionLogic(data, type);

    const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert([{
            account_id: data.account_id,
            transfer_account_id: data.transfer_account_id || null,
            category_id: data.category_id || null,
            type: type,
            amount: amount,
            date: data.date,
            effective_date: data.date,
            description: data.description || null,
            status: data.status || 'COMPLETED'
        }])
        .select()
        .single();

    if (txError) throw new Error(`Failed to create transaction: ${txError.message}`);

    if (data.tags && Array.isArray(data.tags) && data.tags.length > 0) {
        await tagService.linkTagsToTransaction(transaction.id, data.tags);
    }

    await applyTransactionBalance(transaction as TransactionResponse);

    return transaction as TransactionResponse;
};

export const readTransactions = async (profile_id: string, filters?: TransactionFilters): Promise<{ data: TransactionWithDetails[]; totalCount: number }> => {

    const { data: accounts, error: accError } = await supabase
        .from('accounts')
        .select('id')
        .eq('profile_id', profile_id);

    if (accError) throw new Error(`Failed to fetch accounts for profile: ${accError.message}`);

    const accountIds = accounts?.map(acc => acc.id) || [];

    if (accountIds.length === 0) return { data: [], totalCount: 0 };

    // <- AJUSTADO: Removido 'color' das tags
    const tagQuery = filters?.tagId
        ? 'transaction_tags!inner( tags(id, name) )'
        : 'transaction_tags( tags(id, name) )';

    let query = supabase
        .from('transactions')
        .select(`
            *,
            categories (name, icon, color),
            origin_account:account_id (name),
            destination_account:transfer_account_id (name),
            ${tagQuery}
        `, { count: 'exact' })
        .in('account_id', accountIds)
        .is('deleted_at', null);

    if (filters?.type) query = query.eq('type', filters.type);
    if (filters?.categoryId) query = query.eq('category_id', filters.categoryId);
    if (filters?.search) query = query.ilike('description', `%${filters.search}%`);

    if (filters?.tagId) {
        query = query.eq('transaction_tags.tag_id', filters.tagId);
    }

    if (filters?.month && filters?.year) {
        const monthIndex = filters.month - 1;
        const startDate = new Date(filters.year, monthIndex, 1).toISOString();
        const endDate = new Date(filters.year, monthIndex + 1, 0, 23, 59, 59).toISOString();
        query = query.gte('date', startDate).lte('date', endDate);
    }

    const sortBy = filters?.sortBy || 'date';
    const sortOrder = filters?.sortOrder || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error: txError, count } = await query;
    if (txError) throw new Error(`Failed to fetch transactions: ${txError.message}`);

    return {
        data: data as TransactionWithDetails[],
        totalCount: count || 0
    };
};

export const updateTransaction = async (id: string, newData: Partial<CreateTransactionDTO>): Promise<TransactionResponse> => {

    const { data: oldTx, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

    if (fetchError || !oldTx) throw new Error('Transaction not found.');

    const mergedData = { ...oldTx, ...newData };
    validateTransactionLogic(mergedData, mergedData.type);

    await revertTransactionBalance(oldTx as TransactionResponse);

    const { data: updatedTx, error: updateError } = await supabase
        .from('transactions')
        .update(newData)
        .eq('id', id)
        .select()
        .single();

    if (updateError) throw new Error(`Failed to update transaction: ${updateError.message}`);

    await applyTransactionBalance(updatedTx as TransactionResponse);

    // TODO: Adicionar lógica para atualizar Tags caso venham no 'newData'

    return updatedTx as TransactionResponse;
};

export const deleteTransaction = async (id: string): Promise<void> => {

    const { data: transaction, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .is('deleted_at', null)
        .single();

    if (fetchError || !transaction) throw new Error('Transaction not found or already deleted.');

    await revertTransactionBalance(transaction as TransactionResponse);

    const { error: deleteError } = await supabase
        .from('transactions')
        .update({
            deleted_at: new Date().toISOString(),
            status: 'CANCELLED'
        })
        .eq('id', id);

    if (deleteError) throw new Error(`Failed to delete transaction: ${deleteError.message}`);
};
