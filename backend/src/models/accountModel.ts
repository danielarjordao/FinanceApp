export interface CreateAccountDTO {
    profile_id: string;
    name: string;
    type?: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'CASH';
    initial_balance?: number;
    balance?: number;
    is_main_featured?: boolean;
}

export interface AccountResponse extends CreateAccountDTO {
    id: string;
    created_at: string;
    updated_at: string;
}
