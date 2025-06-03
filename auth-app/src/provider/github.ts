import { OAuthProviderConfig } from "../types/oauth.js";

export const getGitHubConfig = (): OAuthProviderConfig => ({
  name: "github",
  authUrl: "https://github.com/login/oauth/authorize",
  tokenUrl: "https://github.com/login/oauth/access_token",
  clientId: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  scope: "read:user user:email",
  getRedirectUri: () => process.env.OAUTH_REDIRECT_URI + "/github",
  extraAuthParams: {
    allow_signup: "true",
  },
});

export const getGitHubUser = async (accessToken: string) => {
  const res = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const profile = await res.json();

  const emailRes = await fetch("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const emails = await emailRes.json();
  const primaryEmail = emails.find((e: any) => e.primary && e.verified)?.email;

  return {
    id: profile.id,
    email: primaryEmail,
    name: profile.name || profile.login,
    avatar_url: profile.avatar_url,
  };
};
