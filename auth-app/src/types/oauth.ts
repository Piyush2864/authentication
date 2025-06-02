export interface OAuthProviderConfig {
  name: string;
  authUrl: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  tokenUrl: string;
  getRedirectUri: () => string;
  extraAuthParams?: Record<string, string>;
  extraTokenParams?: Record<string, string>;
}
