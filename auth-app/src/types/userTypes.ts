export interface ProviderAccount {
  provider: string;
  providerId: string;
  email?: string | null;  
}

export interface IUser {
  name?: string | null;
  email?: string;
  avatarUrl?: string | null;
  refreshToken?: string;
  profileData?: Record<string, any>;
  providers: ProviderAccount[];
}
