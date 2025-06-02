import { Request, Response } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await userService.invalidateRefreshToken(refreshToken);
    }

    res.clearCookie("accessToken", { httpOnly: true, expires: new Date(0) });
    res.clearCookie("refreshToken", { httpOnly: true, expires: new Date(0) });

    res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: "Logout failed",
    });
  }
};
