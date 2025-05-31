import { Request, Response } from "express";
import User from "../models/userModel";
import {
  generateAccessTOken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

export const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.cookies.refreshToken;
  const userId = verifyRefreshToken(token);

  if (!userId) {
    res.status(401).json({
      error: "Invalid refresh token",
    });
    return;
  }

  const user = await User.findById(userId);
  if (!user || user.refreshToken !== token) {
    res.status(403).json({
      error: "Token mismatch",
    });
    return;
  }

  const newAccessToken = generateAccessTOken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);
  user.refreshToken = newRefreshToken;
  await user.save();

  res.cookie("accessToken", newAccessToken, { httpOnly: true });
  res.cookie("refreshToken", newRefreshToken, { httpOnly: true });

  res.json({
    message: "Token refreshed",
  });
};
