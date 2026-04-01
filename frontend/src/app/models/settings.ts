export interface UserSettings {
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  receive_notifications: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SettingsResponse {
  status: string;
  data: UserSettings;
}
