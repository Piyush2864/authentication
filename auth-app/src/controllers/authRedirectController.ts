import { Request, Response } from "express";
import { getGoogleConfig } from "../provider/google.js";
import { getGitHubConfig } from "../provider/github.js";
import { getDiscordConfig } from "../provider/discord.js";

const configMap = {
  google: getGoogleConfig,
  github: getGitHubConfig,
  discord: getDiscordConfig,
};

export const handleOAuthRedirect = (req: Request, res: Response) => {
  const { provider } = req.params;

  const getConfig = configMap[provider as keyof typeof configMap];
  if (!getConfig) res.status(400).json({ error: "Unsupported provider" });

  const config = getConfig();
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.getRedirectUri(),
    response_type: "code",
    scope: config.scope,
    ...config.extraAuthParams,
  });

  return res.redirect(`${config.authUrl}?${params.toString()}`);
};
