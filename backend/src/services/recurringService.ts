import { supabase } from '../config/supabase.js';
import type { CreateRecurringDTO, RecurringResponse } from '../models/recurringModel.js';

// Cria uma nova transação recorrente.
export const createRecurring = async (data: CreateRecurringDTO): Promise<RecurringResponse> => {
    const { data: recurring, error } = await supabase
        .from('recurring_transactions')
        .insert([data])
        .select()
        .single();

    if (error) throw new Error(`Error creating recurring transaction: ${error.message}`);
    return recurring as RecurringResponse;
};

// Lista as transações recorrentes de um perfil.
export const getRecurringByProfile = async (profileId: string): Promise<RecurringResponse[]> => {
    const { data, error } = await supabase
        .from('recurring_transactions')
        .select('*')
        .eq('profile_id', profileId)
        .is('deleted_at', null)
        .order('next_run_date', { ascending: true });

    if (error) throw new Error(`Error fetching recurring transactions: ${error.message}`);
    return data as RecurringResponse[];
};

// Atualiza os dados de uma transação recorrente.
export const updateRecurring = async (id: string, updates: Partial<CreateRecurringDTO>): Promise<RecurringResponse> => {
    const { data, error } = await supabase
        .from('recurring_transactions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`Error updating recurring transaction: ${error.message}`);
    return data as RecurringResponse;
};

// Remove uma transação recorrente de forma lógica (soft delete).
export const deleteRecurring = async (id: string): Promise<{ success: boolean }> => {
    const { error } = await supabase
        .from('recurring_transactions')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw new Error(`Error deleting recurring transaction: ${error.message}`);
    return { success: true };
};
