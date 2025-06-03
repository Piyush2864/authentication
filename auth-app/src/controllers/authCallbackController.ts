import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { getGoogleConfig, getGoogleUser } from "../provider/google.js";
import { getGitHubConfig, getGitHubUser } from "../provider/github.js";
import { getDiscordConfig, getDiscordUser } from "../provider/discord.js";
import { UserService } from "../services/userService.js";

const userService = new UserService();

const configMap = {
  google: getGoogleConfig,
  github: getGitHubConfig,
  discord: getDiscordConfig,
};

const fetchUserMap = {
  google: getGoogleUser,
  github: getGitHubUser,
  discord: getDiscordUser,
};

export const handleOAuthCallback = async (req: Request, res: Response): Promise<void> => {
  const { provider } = req.params;
  const code = req.query.code as string;

  const getConfig = configMap[provider as keyof typeof configMap];
  const getUser = fetchUserMap[provider as keyof typeof fetchUserMap];

  if (!getConfig || !getUser || !code) {
     res.status(400).json({ error: "Invalid provider or code" });
  }

  try {
    const config = getConfig();
    const token = await exchangeCodeForToken(config, code);
    const userProfile = await getUser(token.access_token);

    const providerId = userProfile.id;
    const email = userProfile.email ?? null;
    const name = userProfile.name ?? null;
    const avatarUrl = userProfile.avatar_url ?? null;

    const user = await userService.upsertUser({
      provider,
      providerId,
      email,
      name,
      avatarUrl,
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await userService.saveRefreshToken(user.id, refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}&refreshToken=${refreshToken}`
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
     res.status(500).json({ error: "OAuth login failed" });
  }
};

const exchangeCodeForToken = async (config: any, code: string) => {
  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    redirect_uri: config.getRedirectUri(),
    grant_type: "authorization_code",
    ...config.extraTokenParams,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (config.name === "github") headers.Accept = "application/json";

  const res = await fetch(config.tokenUrl, {
    method: "POST",
    headers,
    body: params,
  });

  return await res.json();
};
