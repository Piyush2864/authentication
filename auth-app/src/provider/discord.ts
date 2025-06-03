import { OAuthProviderConfig } from "../types/oauth.js";

export const getDiscordConfig = (): OAuthProviderConfig => ({
  name: "discord",
  authUrl: "https://discord.com/api/oauth2/authorize",
  tokenUrl: "https://discord.com/api/oauth2/token",
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  scope: "identify email",
  getRedirectUri: () => process.env.OAUTH_REDIRECT_URI + "/discord",
});

export const getDiscordUser = async (accessToken: string) => {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const user = await res.json();

  return {
    id: user.id,
    email: user.email,
    name: user.username,
    avatar_url: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
  };
};
