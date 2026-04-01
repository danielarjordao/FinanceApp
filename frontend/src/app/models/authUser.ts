export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthOperationResult {
  success: boolean;
  error?: string;
}

export interface ProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  password?: string;
}
