import { supabase } from '../config/supabase.js';

// Interface para os dados que entram (Data Transfer Object)
export interface CategoryInput {
    name: string;
    icon?: string;
    profile_id: string;
    type: 'INCOME' | 'EXPENSE';
}

// Interface para o que a base de dados devolve
export interface CategoryResponse extends CategoryInput {
    id: string;
    created_at: string;
    updated_at: string;
}

// Cria um novo registo de categoria.
export const createCategory = async (categoryData: CategoryInput): Promise<CategoryResponse> => {
    const { name, icon, profile_id, type } = categoryData;

    const { data, error } = await supabase
        .from('categories')
        .insert([{
            name,
             // Garante consistência com o SQL
            type: type?.toUpperCase() || 'EXPENSE',
            icon: icon || 'tag',
            profile_id
        }])
        .select()
        // .single() garante que recebe um objeto e não um array [0]
        .single();

    if (error) {
        throw new Error(`Database error: ${error.message}`);
    }

    return data as CategoryResponse;
};
