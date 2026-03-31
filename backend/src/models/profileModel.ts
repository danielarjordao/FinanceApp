export interface CreateProfileDTO {
    user_id: string;
    name: string;
}

export interface ProfileResponse {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
