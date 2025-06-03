import { OAuthProviderConfig } from "../types/oauth.js";

export const getGoogleConfig = (): OAuthProviderConfig => ({
  name: "google",
  authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  scope: "openid profile email",
  getRedirectUri: () => process.env.OAUTH_REDIRECT_URI + "/google",
});

export async function getGoogleUser(accessToken: string): Promise<any> {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch Google user: ${response.status} ${response.statusText}`);
  }
  return response.json();
}