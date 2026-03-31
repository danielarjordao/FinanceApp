import { supabase } from '../config/supabase.js';
import type { CreateGoalDTO, GoalResponse } from '../models/goalModel.js';

// Cria uma nova meta para um perfil específico.
export const createGoal = async (data: CreateGoalDTO): Promise<GoalResponse> => {
    const { data: goal, error } = await supabase
        .from('goals')
        .insert([data])
        .select()
        .single();

    if (error) throw new Error(`Error creating goal: ${error.message}`);
    return goal;
};

// Lista todas as metas de um perfil, ordenadas por prazo.
export const readGoalsByProfile = async (profileId: string): Promise<GoalResponse[]> => {
    const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('profile_id', profileId)
        .is('deleted_at', null)
        .order('deadline', { ascending: true });

    if (error) throw new Error(`Error fetching goals: ${error.message}`);
    return data;
};

// Atualiza uma meta existente, permitindo alterações parciais.
export const updateGoal = async (id: string, updates: Partial<CreateGoalDTO>): Promise<GoalResponse> => {
    const { data, error } = await supabase
        .from('goals')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new Error(`Error updating goal: ${error.message}`);
    return data;
};

// Remove uma meta de forma lógica (soft delete).
export const deleteGoal = async (id: string): Promise<{ success: boolean }> => {
    const { error } = await supabase
        .from('goals')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

    if (error) throw new Error(`Error deleting goal: ${error.message}`);
    return { success: true };
};
