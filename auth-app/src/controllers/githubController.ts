import axios from "axios";
import { Request, Response } from "express";
import User from "../models/userModel";
import { generateAccessTOken, generateRefreshToken } from "../utils/jwt";

export const gitAuthRedirect = (req: Request, res: Response) => {
  const redirectURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`;
  res.redirect(redirectURL);
};

export const gitAuthCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenRes.data.access_token;

    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const primaryEmail = emailRes.data.find((e: any) => e.primary)?.email;

    const user = await User.findOneAndUpdate(
      { provider: "github", providerId: userRes.data.id },
      {
        provider: "github",
        providerId: userRes.data.id,
        name: userRes.data.name,
        email: primaryEmail,
        avatar: userRes.data.avatar_url,
      },
      { upsert: true, new: true }
    );

    const access = generateAccessTOken(user.id);
    const refresh = generateRefreshToken(user.id);
    user.refreshToken = refresh;
    await user.save();

    res.cookie("accessToken", access, { httpOnly: true });
    res.cookie("refreshToken", refresh, { httpOnly: true });

    res.json({
      message: "Logged in with github",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Github authentication failed",
    });
  }
};
